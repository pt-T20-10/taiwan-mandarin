"""Exercise the installed Uvicorn SIGINT path in an isolated child process."""
import os
from pathlib import Path
import subprocess
import sys


def test_launcher_sigint_exits_without_traceback(tmp_path):
    code = '''
import runpy, signal, sys, threading, time
import uvicorn
from backend.ai import ai
async def no_voices():
    ai.voices=[]
ai.discover_voices=no_voices
Original=uvicorn.Server
class InterruptedServer(Original):
    def run(self, *args, **kwargs):
        def interrupt_when_started():
            while not self.started:
                time.sleep(.05)
            signal.raise_signal(signal.SIGINT)
        threading.Thread(target=interrupt_when_started, daemon=True).start()
        return super().run(*args, **kwargs)
uvicorn.Server=InterruptedServer
sys.argv=['backend.launcher','--no-browser','--port','0']
runpy.run_module('backend.launcher',run_name='__main__')
'''
    env = {**os.environ, 'MANDARIN_DATA_DIR': str(tmp_path), 'PYTHONIOENCODING': 'utf-8'}
    result = subprocess.run([sys.executable, '-c', code], cwd=Path(__file__).resolve().parents[1],
                            env=env, capture_output=True, text=True, encoding='utf-8', timeout=30)
    output = result.stdout + result.stderr
    assert result.returncode == 0, output
    assert 'Application startup complete' in output
    assert 'Application shutdown complete' in output
    assert 'Đã dừng dịch vụ local.' in output
    assert 'Traceback' not in output
    log = (tmp_path/'launcher.log').read_text(encoding='utf-8')
    assert 'Received SIGINT' in log
    assert 'sender unknown' in log
    assert 'Application shutdown complete' in log
