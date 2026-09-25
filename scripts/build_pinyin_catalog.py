from setup_learning_assets import OUT,dump
import json
def main():
    audio=json.loads((OUT/'pinyin/audio.json').read_text(encoding='utf-8'))
    excluded={'d','z','m','diang','luun','muo','shong','nia','lo','nou','nue'}
    initials='b p m f d t n l g k h j q x zh ch sh r z c s'.split()
    zero={'yi':'i','ya':'ia','ye':'ie','yao':'iao','you':'iou','yan':'ian','yin':'in','yang':'iang','ying':'ing','yong':'iong','wu':'u','wa':'ua','wo':'uo','wai':'uai','wei':'uei','wan':'uan','wen':'uen','wang':'uang','weng':'ueng','yu':'ü','yue':'üe','yuan':'üan','yun':'ün'}
    rows=[]
    for key in sorted({k[:-1] for k in audio}|{'eng'}):
        if key in excluded:continue
        base=key.replace('uu','ü')
        if base in zero:initial='';final=zero[base]
        else:
            initial=next((i for i in sorted(initials,key=len,reverse=True) if base.startswith(i)),'');final=base[len(initial):]
            if initial in ('j','q','x') and final.startswith('u'):final='ü'+final[1:]
            final={'iu':'iou','ui':'uei','un':'uen'}.get(final,final)
        if initial in ('z','c','s','zh','ch','sh','r') and final=='i':final='-i'
        rows.append({'base':base,'initial':initial,'final':final,'audio_key':key,'tones':{str(t):audio.get(key+str(t)) for t in range(1,5)}})
    dump(OUT/'pinyin/catalog.json',rows)
    print('Teaching syllables:',len(rows),'full-tone recordings:',sum(bool(a) for r in rows for a in r['tones'].values()))
if __name__=='__main__':main()
