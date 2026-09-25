"""Explicit local package upgrade, with API backup and state comparison.

Requires a running app. Does not restore, reset, download or edit SQLite directly.
Backups/reports contain local data and stay in ignored data/backups/.
"""
import argparse
from datetime import datetime
import hashlib
import json
from pathlib import Path
import sys
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from backend.content import bundled,canonical,validate_package

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--apply',action='store_true',help='Back up and install the newer bundled package')
    args=parser.parse_args()
    base='http://127.0.0.1:8765'
    def get(path):
        with urllib.request.urlopen(base+'/api/'+path,timeout=20) as response:return json.load(response)
    package=bundled();validate_package(package)
    current=get('content');target=package['content']['version']
    print(f'Installed v{current["version"]}; bundled v{target}')
    if not args.apply:return
    if current['version']>=target:raise SystemExit('No newer package; no writes performed.')
    before=get('state');backup=get('backup')
    assert before==get('state'),'Learning state changed during backup; retry after saving current work.'
    for installed in backup['packages']:validate_package(json.loads(installed['payload']))
    stamp=datetime.now().strftime('%Y%m%d-%H%M%S')
    folder=ROOT/'data/backups';folder.mkdir(parents=True,exist_ok=True)
    path=folder/f'before-v{target}-{stamp}.json'
    raw=canonical(backup)
    with path.open('xb') as handle:handle.write(raw)
    assert json.loads(path.read_bytes())==backup
    request=urllib.request.Request(base+'/api/packages',data=canonical(package),headers={'Content-Type':'application/json','X-Mandarin-Client':'local-ui'},method='POST')
    with urllib.request.urlopen(request,timeout=30) as response:result=json.load(response)
    after=get('state');installed=get('content')
    preserved=before==after
    report={'date':stamp,'backup':path.name,'backup_sha256':hashlib.sha256(raw).hexdigest(),
            'previous_version':current['version'],'version':result['version'],
            'package_sha256':package['manifest']['sha256'],'state_preserved':preserved,
            'state_before_sha256':hashlib.sha256(canonical(before)).hexdigest(),
            'state_after_sha256':hashlib.sha256(canonical(after)).hexdigest(),
            'objects':sum(len(c) for c in before['objects'].values()),'events':len(before['events'])}
    report_path=folder/f'upgrade-v{target}-{stamp}.json'
    report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    assert installed==package['content'] and result['version']==target,'Installed content differs from bundled package'
    assert preserved,'State changed; backup retained. No automatic restore performed.'
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
