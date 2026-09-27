// Optional visual audit sheet. Output stays in ignored data/, never in assets.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const chars=process.argv[2]||'吃址宿寄局廁廚悠戶捷授浴灣研碼究窗素臺舍袋踏辣常';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1400,height:1000}});
 await page.setContent('<meta charset="utf-8"><style>body{font-family:"Microsoft JhengHei";display:grid;grid-template-columns:repeat(6,1fr);gap:12px;background:#eee}article{background:white;padding:8px;text-align:center}svg{width:170px;height:170px}h2{margin:0}p{font-size:13px}</style>'+Array.from(chars).map(c=>{
  const d=JSON.parse(fs.readFileSync(path.join(root,'public/learning/characters',c.codePointAt(0)+'.json'),'utf8'));
  return '<article><h2>'+c+' · '+d.strokes.length+'</h2><svg viewBox="0 0 1024 1024">'+d.strokes.map(s=>'<path fill="#245f50" transform="matrix('+s.matrix.join(' ')+')" d="'+s.outline+'"/>').join('')+'</svg><p>'+d.radical+' · '+d.decomposition+'</p></article>';
 }).join(''));
 await page.screenshot({path:path.join(root,'data/character-supplement-review.png'),fullPage:true});
} finally {await browser.close();}
