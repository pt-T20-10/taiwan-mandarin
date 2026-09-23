import argparse
import threading
import time
import urllib.request
import webbrowser
import uvicorn
from .content import ROOT

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--no-browser', action='store_true')
    parser.add_argument('--port', type=int, default=8765)
    args = parser.parse_args()
    url = f'http://127.0.0.1:{args.port}'
    try:
        with urllib.request.urlopen(url + '/api/health', timeout=2) as response:
            import json
            if json.load(response).get('app') == 'taiwan-mandarin':
                if not args.no_browser:
                    webbrowser.open(url)
                print('Ứng dụng đã chạy:', url)
                return
    except Exception:
        pass
    if not (ROOT / 'dist/index.html').exists():
        raise SystemExit('Chưa build giao diện. Chạy npm.cmd run build trong thư mục dự án.')
    from . import app
    server = uvicorn.Server(uvicorn.Config(app.app, host='127.0.0.1', port=args.port, log_level='info'))
    app.shutdown_callback = lambda: setattr(server, 'should_exit', True)
    def open_when_ready():
        for _ in range(100):
            if server.started:
                webbrowser.open(url)
                return
            time.sleep(.1)
    if not args.no_browser:
        threading.Thread(target=open_when_ready, daemon=True).start()
    server.run()

if __name__ == '__main__':
    main()
