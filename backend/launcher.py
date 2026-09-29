import argparse
import logging
from logging.handlers import RotatingFileHandler
import os
import signal
import threading
import time
import urllib.request
import webbrowser
import uvicorn
from .content import ROOT

class LocalServer(uvicorn.Server):
    def handle_exit(self, sig, frame):
        logging.getLogger('uvicorn.error').warning(
            'Received %s; console/process interrupt, sender unknown.', signal.Signals(sig).name)
        super().handle_exit(sig, frame)

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
    from . import app, db
    server = LocalServer(uvicorn.Config(app.app, host='127.0.0.1', port=args.port, log_level='info'))
    db.DATA.mkdir(parents=True, exist_ok=True)
    handler = RotatingFileHandler(db.DATA/'launcher.log', maxBytes=1_000_000, backupCount=2, encoding='utf-8')
    handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(message)s'))
    logger = logging.getLogger('uvicorn.error')
    logger.addHandler(handler)
    logger.info('Launcher PID=%s parent=%s port=%s', os.getpid(), os.getppid(), args.port)
    def shutdown_from_app():
        logger.info('Shutdown requested through /api/shutdown.')
        server.should_exit = True
    app.shutdown_callback = shutdown_from_app
    def open_when_ready():
        for _ in range(100):
            if server.started:
                webbrowser.open(url)
                return
            time.sleep(.1)
    if not args.no_browser:
        threading.Thread(target=open_when_ready, daemon=True).start()
    try:
        server.run()
    except KeyboardInterrupt:
        logger.info('Console interrupt completed; launcher exiting.')
        raise
    except Exception:
        logger.exception('Launcher failed.')
        raise
    finally:
        logger.removeHandler(handler)
        handler.close()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        # Uvicorn re-raises SIGINT after its graceful shutdown has finished.
        # This is an intentional stop, not a startup failure.
        print('\nĐã dừng dịch vụ local.')
