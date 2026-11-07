"""Feed SDK license responses as bytes; PowerShell 5 pipelines can add a BOM."""
import os
import subprocess
import sys
from pathlib import Path

java, sdk = map(Path, sys.argv[1:3])
result = subprocess.run([str(java/'bin/java.exe'), '-classpath',
    str(sdk/'cmdline-tools/latest/lib/sdkmanager-classpath.jar'),
    'com.android.sdklib.tool.sdkmanager.SdkManagerCli', '--sdk_root='+str(sdk),
    'platform-tools', 'platforms;android-36', 'build-tools;36.0.0'],
    input=b'y\n'*40, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
    env={**os.environ,'JAVA_HOME':str(java)})
log= sdk.parent/'sdk-install.log'
log.write_bytes(result.stdout)
print(result.stdout.decode('utf-8',errors='replace')[-2200:])
print('SDK log:',log)
sys.exit(result.returncode)
