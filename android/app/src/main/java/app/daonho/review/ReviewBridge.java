package app.daonho.review;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.Cursor;
import android.media.MediaPlayer;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.os.Handler;
import android.os.Looper;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONObject;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.X509TrustManager;
import javax.net.ssl.TrustManager;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.security.KeyStore;
import java.security.MessageDigest;
import java.security.cert.X509Certificate;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;

@CapacitorPlugin(name="ReviewBridge")
public class ReviewBridge extends Plugin {
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private final Object dbLock=new Object();
    private MediaPlayer player;
    private static final String KEY="dao-nho-review-pair";

    private SQLiteDatabase db(){
        SQLiteDatabase db=getContext().openOrCreateDatabase("review.sqlite3",Context.MODE_PRIVATE,null);
        db.execSQL("CREATE TABLE IF NOT EXISTS state(id INTEGER PRIMARY KEY, value TEXT NOT NULL)");
        return db;
    }
    @PluginMethod public void load(PluginCall call){
        synchronized(dbLock){try(SQLiteDatabase db=db();Cursor c=db.rawQuery("SELECT value FROM state WHERE id=1",null)){
            JSObject out=new JSObject();out.put("state",c.moveToFirst()?new JSONObject(c.getString(0)):JSONObject.NULL);call.resolve(out);
        }catch(Exception e){call.reject("Không đọc được dữ liệu offline",e);}}
    }
    @PluginMethod public void save(PluginCall call){
        synchronized(dbLock){try(SQLiteDatabase db=db()){
            JSObject state=call.getObject("state");if(state==null)throw new Exception("Missing state");
            db.execSQL("INSERT OR REPLACE INTO state VALUES(1,?)",new Object[]{state.toString()});call.resolve();
        }catch(Exception e){call.reject("Không lưu được dữ liệu offline",e);}}
    }

    private SecretKey key() throws Exception {
        KeyStore store=KeyStore.getInstance("AndroidKeyStore");store.load(null);
        if(!store.containsAlias(KEY)){
            KeyGenerator generator=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");
            generator.init(new KeyGenParameterSpec.Builder(KEY,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build());
            return generator.generateKey();
        }
        return ((KeyStore.SecretKeyEntry)store.getEntry(KEY,null)).getSecretKey();
    }
    private void storePair(JSONObject pair) throws Exception {
        Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key());
        String data=Base64.encodeToString(cipher.getIV(),Base64.NO_WRAP)+":"+Base64.encodeToString(cipher.doFinal(pair.toString().getBytes(StandardCharsets.UTF_8)),Base64.NO_WRAP);
        if(!getContext().getSharedPreferences("pair",Context.MODE_PRIVATE).edit().putString("value",data).commit())throw new IOException("Cannot save pairing");
    }
    private JSONObject pair() throws Exception {
        String data=getContext().getSharedPreferences("pair",Context.MODE_PRIVATE).getString("value",null);
        if(data==null)return null;
        String[] parts=data.split(":");Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE,key(),new GCMParameterSpec(128,Base64.decode(parts[0],Base64.NO_WRAP)));
        return new JSONObject(new String(cipher.doFinal(Base64.decode(parts[1],Base64.NO_WRAP)),StandardCharsets.UTF_8));
    }
    @PluginMethod public void getPair(PluginCall call){try{call.resolve(new JSObject().put("pair",pair()));}catch(Exception e){call.reject("Cần ghép cặp lại",e);}}
    @PluginMethod public void setPair(PluginCall call){try{storePair(call.getObject("pair"));call.resolve();}catch(Exception e){call.reject("Không lưu được kết nối",e);}}

    private String hash(byte[] data) throws Exception {
        byte[] digest=MessageDigest.getInstance("SHA-256").digest(data);StringBuilder text=new StringBuilder();
        for(byte b:digest)text.append(String.format("%02x",b));return text.toString();
    }
    private HttpsURLConnection connection(JSONObject pair,String path,String method) throws Exception {
        if(pair==null)throw new IOException("Chưa kết nối máy tính");
        if(!path.matches("/v1/(pair(/status)?|cards|events|audio/[a-f0-9]{64})"))throw new IOException("Unsupported endpoint");
        URI base=new URI(pair.getString("address"));
        if(!"https".equals(base.getScheme())||base.getUserInfo()!=null||base.getHost()==null)throw new IOException("Cần địa chỉ HTTPS nội bộ");
        InetAddress ip=InetAddress.getByName(base.getHost());
        if(!(ip.isSiteLocalAddress()||ip.isLinkLocalAddress()||ip.isLoopbackAddress()))throw new IOException("Chỉ đồng bộ trong mạng nội bộ");
        String pin=pair.getString("fingerprint");if(!pin.matches("[a-f0-9]{64}"))throw new IOException("Invalid certificate fingerprint");
        SSLContext tls=SSLContext.getInstance("TLS");
        tls.init(null,new TrustManager[]{new X509TrustManager(){
            public X509Certificate[] getAcceptedIssuers(){return new X509Certificate[0];}
            public void checkClientTrusted(X509Certificate[] chain,String auth){throw new UnsupportedOperationException();}
            public void checkServerTrusted(X509Certificate[] chain,String auth) throws java.security.cert.CertificateException {
                try{chain[0].checkValidity();if(!MessageDigest.isEqual(hash(chain[0].getEncoded()).getBytes(StandardCharsets.US_ASCII),pin.getBytes(StandardCharsets.US_ASCII)))throw new Exception("Certificate mismatch");}
                catch(Exception e){throw new java.security.cert.CertificateException("Chứng chỉ PC không khớp QR đã ghép cặp",e);}
            }
        }},null);
        HttpsURLConnection c=(HttpsURLConnection)new URL(base.getScheme()+"://"+base.getRawAuthority()+path).openConnection();
        c.setSSLSocketFactory(tls.getSocketFactory());
        // Host may change on a private LAN. Trust is bound to the exact QR-pinned
        // certificate above, never a global trust-all SSL policy.
        c.setHostnameVerifier((host,session)->host.equals(base.getHost()));
        c.setInstanceFollowRedirects(false);c.setConnectTimeout(5000);c.setReadTimeout(120000);c.setRequestMethod(method);
        if(pair.has("token"))c.setRequestProperty("Authorization","Bearer "+pair.getString("token"));
        return c;
    }
    private byte[] response(HttpsURLConnection c) throws Exception {
        int status=c.getResponseCode();InputStream stream=status<400?c.getInputStream():c.getErrorStream();
        ByteArrayOutputStream buffer=new ByteArrayOutputStream();
        if(stream!=null){byte[] chunk=new byte[8192];int n;while((n=stream.read(chunk))!=-1){buffer.write(chunk,0,n);if(buffer.size()>16000000)throw new IOException("Response too large");}stream.close();}
        byte[] bytes=buffer.toByteArray();
        if(status<200||status>=300){String error=new String(bytes,StandardCharsets.UTF_8);try{error=new JSONObject(error).optString("detail",error);}catch(Exception ignored){}throw new IOException(error.isEmpty()?"HTTP "+status:error);}
        return bytes;
    }
    @PluginMethod public void request(PluginCall call){worker.execute(()->{
        HttpsURLConnection c=null;
        try{
            JSONObject config=call.getObject("pair");if(config==null)config=pair();
            String method=call.getString("method","GET");c=connection(config,call.getString("path"),method);
            if(!method.equals("GET")){c.setDoOutput(true);c.setRequestProperty("Content-Type","application/json");try(OutputStream out=c.getOutputStream()){out.write(call.getObject("body",new JSObject()).toString().getBytes(StandardCharsets.UTF_8));}}
            call.resolve(new JSObject().put("data",new JSONObject(new String(response(c),StandardCharsets.UTF_8))));
        }catch(Exception e){call.reject(e.getMessage(),e);}finally{if(c!=null)c.disconnect();}
    });}

    private File audioFile(String key) throws Exception {
        if(key==null||!key.matches("[a-f0-9]{64}"))throw new IOException("Invalid audio key");
        File folder=new File(getContext().getFilesDir(),"audio");folder.mkdirs();return new File(folder,key+".wav");
    }
    @PluginMethod public void audioStatus(PluginCall call){try{
        JSArray keys=call.getArray("keys",new JSArray()),found=new JSArray();
        for(int i=0;i<keys.length();i++)if(audioFile(keys.getString(i)).isFile())found.put(keys.getString(i));
        call.resolve(new JSObject().put("keys",found));
    }catch(Exception e){call.reject(e.getMessage(),e);}}
    @PluginMethod public void downloadAudio(PluginCall call){worker.execute(()->{
        HttpsURLConnection c=null;File temp=null;
        try{
            String key=call.getString("key");File file=audioFile(key);
            if(!file.exists()){
                c=connection(pair(),"/v1/audio/"+key,"GET");byte[] bytes=response(c);
                if(bytes.length<44||!new String(bytes,0,4,StandardCharsets.US_ASCII).equals("RIFF")||!hash(bytes).equals(c.getHeaderField("X-Audio-SHA256")))throw new IOException("Audio thiếu hoặc sai checksum");
                temp=new File(file.getParentFile(),key+".part");Files.write(temp.toPath(),bytes);
                Files.move(temp.toPath(),file.toPath(),StandardCopyOption.REPLACE_EXISTING);
            }
            call.resolve();
        }catch(Exception e){if(temp!=null)temp.delete();call.reject(e.getMessage(),e);}finally{if(c!=null)c.disconnect();}
    });}
    @PluginMethod public void pruneAudio(PluginCall call){try{
        JSArray keys=call.getArray("keys",new JSArray());java.util.HashSet<String> keep=new java.util.HashSet<>();
        for(int i=0;i<keys.length();i++)keep.add(keys.getString(i)+".wav");
        File folder=new File(getContext().getFilesDir(),"audio");File[] files=folder.listFiles();
        if(files!=null)for(File f:files)if(!keep.contains(f.getName()))f.delete();call.resolve();
    }catch(Exception e){call.reject(e.getMessage(),e);}}
    private void stop(){if(player!=null){player.release();player=null;}}
    @PluginMethod public void stopAudio(PluginCall call){stop();call.resolve();}
    @PluginMethod public void play(PluginCall call){try{
        stop();File file=audioFile(call.getString("key"));if(!file.exists())throw new IOException("Audio chưa tải. Đồng bộ với PC để nghe offline.");
        MediaPlayer current=new MediaPlayer();player=current;current.setDataSource(file.getAbsolutePath());current.setOnCompletionListener(mp->{mp.release();if(player==mp)player=null;});
        current.setOnErrorListener((mp,what,extra)->{mp.release();if(player==mp)player=null;return true;});current.prepare();current.start();call.resolve();
    }catch(Exception e){stop();call.reject(e.getMessage(),e);}}
    @PluginMethod public void wifi(PluginCall call){
        ConnectivityManager cm=(ConnectivityManager)getContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkCapabilities n=cm.getNetworkCapabilities(cm.getActiveNetwork());call.resolve(new JSObject().put("wifi",n!=null&&n.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)));
    }
    @PluginMethod public void discover(PluginCall call){
        NsdManager nsd=(NsdManager)getContext().getSystemService(Context.NSD_SERVICE);
        Handler handler=new Handler(Looper.getMainLooper());AtomicBoolean finished=new AtomicBoolean();
        NsdManager.DiscoveryListener listener=new NsdManager.DiscoveryListener(){
            void finish(JSObject result){if(!finished.compareAndSet(false,true))return;try{nsd.stopServiceDiscovery(this);}catch(Exception ignored){}call.resolve(result);}
            public void onDiscoveryStarted(String type){}
            public void onDiscoveryStopped(String type){}
            public void onServiceLost(NsdServiceInfo service){}
            public void onStartDiscoveryFailed(String type,int error){finish(new JSObject());}
            public void onStopDiscoveryFailed(String type,int error){}
            public void onServiceFound(NsdServiceInfo service){
                if(!service.getServiceName().contains(call.getString("pcId","__none__")))return;
                nsd.resolveService(service,new NsdManager.ResolveListener(){
                    public void onResolveFailed(NsdServiceInfo info,int error){}
                    public void onServiceResolved(NsdServiceInfo info){
                        if(info.getHost()!=null&&info.getHost() instanceof java.net.Inet4Address)finish(new JSObject().put("address","https://"+info.getHost().getHostAddress()+":"+info.getPort()));
                    }
                });
            }
        };
        try{nsd.discoverServices("_daonho._tcp.",NsdManager.PROTOCOL_DNS_SD,listener);handler.postDelayed(()->{if(finished.compareAndSet(false,true)){try{nsd.stopServiceDiscovery(listener);}catch(Exception ignored){}call.resolve(new JSObject());}},4500);}
        catch(Exception e){call.resolve(new JSObject());}
    }
    @Override protected void handleOnPause(){stop();}
    @Override protected void handleOnDestroy(){stop();worker.shutdownNow();}
}
