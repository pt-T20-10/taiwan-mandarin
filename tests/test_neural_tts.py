import asyncio
from pathlib import Path
from unittest.mock import AsyncMock
import pytest
from backend import neural_tts
from backend.ai import LocalAI


def test_selected_neural_never_falls_back_and_cache_uses_voice_and_rate(monkeypatch):
    adapter = LocalAI()
    native = AsyncMock(return_value=b'native')
    neural = AsyncMock(return_value=b'neural')
    monkeypatch.setattr(adapter, 'synthesize_windows', native)
    monkeypatch.setattr(neural_tts, 'synthesize', neural)
    monkeypatch.setattr(neural_tts, 'available', lambda: True)
    async def run():
        for voice, rate in [('neural:kokoro-zf001', 0), ('neural:kokoro-zf001', 0),
                            ('neural:kokoro-zf001', -2), ('neural:kokoro-zf002', 0)]:
            assert await adapter.synthesize('學習中文。', voice, rate) == b'neural'
        assert neural.await_count == 3
        native.assert_not_called()
        with pytest.raises(ValueError):
            await adapter.synthesize('你好', 'neural:missing')
        monkeypatch.setattr(neural_tts, 'available', lambda: False)
        with pytest.raises(RuntimeError):
            await adapter.synthesize('學習中文。', 'neural:kokoro-zf001')
    asyncio.run(run())


def test_neural_cancel_kills_child_and_preserves_full_unicode_text(monkeypatch):
    class Process:
        returncode = None
        killed = False
        async def communicate(self):
            await asyncio.Event().wait()
        def kill(self):
            self.killed = True
        async def wait(self):
            self.returncode = -1
    proc = Process()
    create = AsyncMock(return_value=proc)
    monkeypatch.setattr(neural_tts, 'available', lambda: True)
    monkeypatch.setattr(asyncio, 'create_subprocess_exec', create)
    async def run():
        task = asyncio.create_task(neural_tts.synthesize('不客氣，我們明天見！', 'neural:kokoro-zm009', -2))
        while not create.called:
            await asyncio.sleep(0)
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        assert proc.killed and proc.returncode == -1
        args = create.call_args.args
        assert args[-2:] == ('--', '不客氣，我們明天見！')
        assert '--sid=58' in args and '--speed=0.85' in args
        output = next(arg.split('=', 1)[1] for arg in args if arg.startswith('--output-filename='))
        assert not Path(output).parent.exists()
    asyncio.run(run())


def test_tts_disconnect_cancels_task(monkeypatch):
    from backend.app import tts, TTSRequest, ai
    cancelled = []
    async def synthesize(*args):
        try:
            await asyncio.Event().wait()
        finally:
            cancelled.append(True)
    class Request:
        async def receive(self):
            await asyncio.sleep(.01)
            return {'type': 'http.disconnect'}
    monkeypatch.setattr(ai, 'synthesize', synthesize)
    async def run():
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as error:
            await tts(TTSRequest(text='你好'), Request())
        assert error.value.status_code == 499
        assert cancelled == [True]
    asyncio.run(run())
