"""Fetch official references for manual order comparison, never used by the app.

Reference HTML stays in ignored data/source-review, not distributed assets.
Curl uses the Windows trust store; certificate verification remains enabled.
"""
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

def main():
    destination = Path('data/source-review')
    destination.mkdir(parents=True, exist_ok=True)
    for char in '一二三十人大小日月口上下':
        path = destination / f'{ord(char)}.html'
        url = f'https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID={ord(char)}'
        if not path.exists():
            subprocess.run(['curl.exe','--fail','--silent','--show-error','--location','--max-time','30','--output',str(path),url],check=True)
        source = path.read_text(encoding='utf-8')
        match = re.search(r'xml\['+str(ord(char))+r'\]=(\"(?:\\.|[^\"\\])*\")',source)
        if not match:
            raise ValueError(f'No stroke data: {char}')
        root = ET.fromstring(json.loads(match[1]))
        print(char, url, [[(float(p.attrib['x']),float(p.attrib['y'])) for p in stroke.find('Track')] for stroke in root.findall('Stroke')])

if __name__ == '__main__':
    main()
