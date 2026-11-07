"""Stream Gradle output while preserving its exit status and a local build log."""
import subprocess
import sys
from pathlib import Path

root=Path(__file__).resolve().parents[1]
log=root/'data/android-build/gradle.log'
log.parent.mkdir(parents=True,exist_ok=True)
process=subprocess.Popen([str(root/'android/gradlew.bat'),'--no-daemon','--max-workers=2',
    '-Dorg.gradle.vfs.watch=false','assembleRelease'],cwd=root/'android',
    stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
with log.open('w',encoding='utf-8') as handle:
    for raw in process.stdout:
        line=raw.decode('utf-8',errors='replace');handle.write(line);handle.flush()
        print(line,end='',flush=True)
sys.exit(process.wait())
