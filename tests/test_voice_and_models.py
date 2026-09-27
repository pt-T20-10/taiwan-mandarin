import asyncio
import base64
import json
from pathlib import Path
from unittest.mock import AsyncMock
import pytest
from backend.ai import LocalAI
from backend import db


@pytest.mark.parametrize('model',['Qwen3-1.7B-Q4_K_M.gguf','Qwen3-1.7B-Q8_0.gguf','Qwen3-4B-Q4_K_M.gguf'])
@pytest.mark.parametrize('runtime',['cpu','cuda'])
def test_saved_configuration_migration(tmp_path,model,runtime):
    path=tmp_path/'active.json';old={'model':model,'runtime':runtime,'asr_model':'ggml-small.bin'}
    path.write_text(json.dumps(old))
    adapter=LocalAI(path)
    assert adapter.config=={**old,'model':'Qwen3-4B-Q4_K_M.gguf'}
    assert '1.7B' not in str(adapter.status()['available_models'])
    assert adapter.status()['neural_voices']==[]
    if '1.7B' in model:
        assert json.loads((tmp_path/'active.before-v6.json').read_text())==old
        assert json.loads(path.read_text())==adapter.config
    else:assert not (tmp_path/'active.before-v6.json').exists()


@pytest.mark.parametrize('saved',[None,'broken','[]','{}','{"model":"unknown","runtime":"cuda"}'])
def test_missing_or_invalid_config_defaults_to_4b_cpu_with_notice(tmp_path,saved):
    path=tmp_path/'active.json'
    if saved is not None:path.write_text(saved)
    adapter=LocalAI(path)
    assert adapter.config['model']=='Qwen3-4B-Q4_K_M.gguf'
    assert adapter.config['runtime']=='cpu' and adapter.error


def test_retired_voice_backup_migration_is_narrow_and_idempotent(tmp_path,monkeypatch):
    monkeypatch.setattr(db,'DATA',tmp_path);db.init()
    with db.connect() as connection:
        db.put_object(connection,'settings','speech',0,{'voice':'neural:kokoro-zf001','pace':'slow'})
        db.put_object(connection,'settings','voice-observations',0,{'notes':'Giữ nhận xét nghe cũ'})
        db.put_object(connection,'sessions','tw.greetings.lesson.1',0,{'index':2,'phase':'exercise','draft':'你好','answers':[]})
    before=db.get_state();db.migrate_retired_voice();after=db.get_state()
    speech=after['objects']['settings']['speech']
    assert speech['data']['voice']=='auto' and speech['data']['pace']=='slow'
    assert speech['data']['migration_notice'] and speech['version']==2
    backups=list((tmp_path/'backups').glob('before-retired-voice-*.json'));assert len(backups)==1
    backed=json.loads(backups[0].read_text(encoding='utf-8'))
    assert next(json.loads(o['payload']) for o in backed['objects'] if o['id']=='speech')['voice']=='neural:kokoro-zf001'
    after['objects']['settings']['speech']=before['objects']['settings']['speech'];assert after==before
    db.migrate_retired_voice();assert len(list((tmp_path/'backups').glob('*.json')))==1


def test_native_cache_and_retired_voice_rejection(monkeypatch,tmp_path):
    adapter=LocalAI(tmp_path/'missing');adapter.voices=['TEST zh-TW','TEST second zh-TW']
    native=AsyncMock(return_value=b'wave');monkeypatch.setattr(adapter,'synthesize_windows',native)
    async def run():
        for voice,rate in [('TEST zh-TW',0),('TEST zh-TW',0),('TEST zh-TW',-2),('TEST second zh-TW',0)]:
            assert await adapter.synthesize('謝謝你，我們明天見！',voice,rate)==b'wave'
        assert native.await_count==3
        with pytest.raises(ValueError):await adapter.synthesize('你好','neural:kokoro-zf001')
        assert native.await_count==3
        for n in range(60):await adapter.synthesize(str(n))
        assert len(adapter.tts_cache)==48
    asyncio.run(run())


def test_native_cancel_kills_child_and_preserves_unicode(monkeypatch,tmp_path):
    class Process:
        returncode=None;killed=False;input=None
        async def communicate(self,payload):
            self.input=json.loads(base64.b64decode(payload));await asyncio.Event().wait()
        def kill(self):self.killed=True
        async def wait(self):self.returncode=-1
    proc=Process();create=AsyncMock(return_value=proc)
    monkeypatch.setattr(asyncio,'create_subprocess_exec',create)
    adapter=LocalAI(tmp_path/'missing');adapter.voices=['TEST zh-TW']
    async def run():
        task=asyncio.create_task(adapter.synthesize('不客氣，我們明天見！'))
        while proc.input is None:await asyncio.sleep(0)
        task.cancel()
        with pytest.raises(asyncio.CancelledError):await task
        assert proc.killed and proc.returncode==-1
        assert proc.input['text']=='不客氣，我們明天見！'
        assert not Path(proc.input['path']).parent.exists()
        assert not adapter.tts_cache
    asyncio.run(run())


def test_tts_disconnect_cancels_task(monkeypatch):
    from backend.app import tts,TTSRequest,ai
    from fastapi import HTTPException
    cancelled=[]
    async def synthesize(*args):
        try:await asyncio.Event().wait()
        finally:cancelled.append(True)
    class Request:
        async def receive(self):
            await asyncio.sleep(.01);return {'type':'http.disconnect'}
    monkeypatch.setattr(ai,'synthesize',synthesize)
    async def run():
        with pytest.raises(HTTPException) as error:await tts(TTSRequest(text='你好'),Request())
        assert error.value.status_code==499 and cancelled==[True]
    asyncio.run(run())
