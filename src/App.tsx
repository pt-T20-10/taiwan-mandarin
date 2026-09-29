import {useEffect,useState} from 'react';
import './learning.css';
import {AppContext} from './context';
import type {AppState,Content,Layers,LearningEvent,Mutation} from './core/types';
import {contentStore,storage,configureSpeech} from './adapters/local';
import {Learn} from './components/Learn';
import {Review} from './components/Review';
import {Notebook} from './components/Notebook';
import {Chat} from './components/Chat';
import {Placement} from './components/Placement';
import {Stats} from './components/Stats';
import {Settings} from './components/Settings';
import {Skills} from './components/Skills';
import {Pronunciation} from './components/Pronunciation';
import {GrammarView} from './components/GrammarView';
import {speech} from './adapters/local';
const navigation=[['learn','⌂','Học'],['review','↻','Ôn tập'],['skills','✎','Luyện kỹ năng'],['pronunciation','♪','Phát âm'],['grammar','文','Ngữ pháp'],['chat','☏','Hội thoại'],['notebook','▤','Sổ tay'],['placement','◇','Kiểm tra đầu vào'],['stats','▥','Thống kê'],['settings','⚙','Cài đặt']];
export default function App(){const [state,setState]=useState<AppState|null>(null),[content,setContent]=useState<Content|null>(null),[page,setPage]=useState(location.hash.slice(1)||'learn'),[notice,setNotice]=useState(''),[error,setError]=useState('');
 async function refresh(){const [s,c]=await Promise.all([storage.load(),contentStore.load()]);setState(s);setContent(c);}
 useEffect(()=>{refresh().catch(e=>setError(e.message));const change=()=>setPage(location.hash.slice(1)||'learn');window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change);},[]);
 async function put(m:Mutation){await storage.put(m);await refresh();}
 async function event(e:LearningEvent,m?:Mutation){await storage.event(e,m);await refresh();}
 useEffect(()=>{configureSpeech(state?.objects.settings.speech?.data);},[state?.objects.settings.speech]);
 useEffect(()=>{speech.stop();},[page]);
 function navigate(key:string){location.hash=key;setPage(key);window.scrollTo(0,0);}
 if(error)return <div className="startup"><h1>Chưa kết nối được ứng dụng</h1><p>{error}</p><p>Mở Start.cmd trong thư mục taiwan-mandarin, rồi tải lại trang này.</p><button onClick={()=>location.reload()}>Thử lại</button></div>;
 if(!state||!content)return <div className="startup">Đang mở Đảo nhỏ…</div>;
 const section=page.split('/')[0];
 const layers:Layers=state.objects.settings.display?.data||{hanzi:'show',pinyin:'tap',vi:'show'};
 const due=Object.values(state.objects.cards).filter(c=>!c.deleted&&!c.data.suspended&&new Date(c.data.schedule.due).getTime()<=Date.now()).length;
 return <AppContext.Provider value={{state,content,layers,refresh,put,event,notify:setNotice}}><div className="app-shell"><aside className="sidebar"><button className="brand" onClick={()=>navigate('learn')}><span className="brand-icon">島</span><span>đảo nhỏ<small>HOA NGỮ ĐÀI LOAN</small></span></button><div className="sidebar-label">KHÔNG GIAN HỌC</div><nav>{navigation.map(([key,icon,label])=><button aria-label={label} key={key} className={section===key?'active':''} onClick={()=>navigate(key)}><span className="nav-icon">{icon}</span>{label}{key==='review'&&due>0&&<span className="nav-count">{due}</span>}</button>)}</nav><div className="sidebar-bottom"><div className="offline-dot"/> Dữ liệu lưu trên máy<small>Không quảng cáo. Không giới hạn lượt học.</small><span className="version">Windows · bản đang phát triển</span></div></aside><div className="main-shell"><header className="topbar"><span>你的每一小步，都算數。<small>Mỗi bước nhỏ đều có ý nghĩa.</small></span><button className="profile" onClick={()=>navigate('settings')}>安</button></header><main>{({learn:<Learn route={page}/>,review:<Review/>,skills:<Skills route={page}/>,pronunciation:<Pronunciation/>,grammar:<GrammarView route={page}/>,chat:<Chat/>,notebook:<Notebook/>,placement:<Placement/>,stats:<Stats/>,settings:<Settings/>} as Record<string,React.ReactNode>)[section]||<Learn route={page}/>}</main><footer>Đảo nhỏ · Học Hoa ngữ theo nhịp của bạn</footer></div></div>{notice&&<div className="toast" role="status"><span>{notice}</span><button aria-label="Đóng thông báo" onClick={()=>setNotice('')}>×</button></div>}</AppContext.Provider>;
}
