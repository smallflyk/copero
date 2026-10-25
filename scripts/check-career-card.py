"""Inspect real downloaded PNGs, localized canvas text and unchanged JSON records."""
import json,os,re,struct
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/')
root=Path(__file__).resolve().parent.parent
source=Path(os.environ.get('COPERO_CAREER_REPORT','/tmp/copero-national-audit-before/report.json'))
careers=json.loads(source.read_text())['careers'];messages=json.loads((root/'lib/i18n/messages.json').read_text())
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-card-browser'));artifacts.mkdir(parents=True,exist_ok=True)
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE');errors=[]
def tr(key,locale,**values):
 value=key if locale=='en' else messages[key][locale]
 for key,item in values.items():value=value.replace('{'+key+'}',str(item))
 return value
cases=[(locale,next(c['final'] for c in careers if c['country']=='Brazil'),locale) for locale in ['es','en','it','pt','zh','de']]
legacy=json.loads((root/'tests/fixtures/progression-v13-save.json').read_text())['state'];legacy['status']='retired';cases.append(('de',legacy,'legacy'))
# A real completed international career with a long, valid player name.
long=json.loads(json.dumps(next(c['final'] for c in careers if c['country']=='South Korea')));long['player']['name']='Maximilian Alexander Schmidt';cases.append(('de',long,'long-name'))
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,**({'executable_path':exe} if exe else {}))
 for locale,state,label in cases:
  c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce',accept_downloads=True)
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  c.add_init_script('localStorage.setItem("copero.career.v1",'+json.dumps(json.dumps(state))+')')
  c.add_init_script('''window.__cardText=[];const original=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(value,x,y,...rest){const m=this.measureText(value);window.__cardText.push({value:String(value),x,y,width:m.width,left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent,font:this.font});return original.call(this,value,x,y,...rest)}''')
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.goto(base+'/'+locale+'/career');page.wait_for_load_state('networkidle');expect(page.locator('.download-card')).to_be_visible()
  with page.expect_download() as download:page.locator('.download-card').click()
  path=artifacts/f'{label}.png';download.value.save_as(str(path));data=path.read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',data[16:24])==(1080,1350)
  commands=page.evaluate('window.__cardText');assert len(commands)>20
  page.set_viewport_size({'width':1440,'height':900})
  with page.expect_download() as desktop:page.locator('.download-card').click()
  desktop_path=artifacts/f'{label}-desktop.png';desktop.value.save_as(str(desktop_path));assert desktop_path.read_bytes()==data,(label,'viewport-dependent PNG')
  for command in commands:
   assert command['left']>=58 and command['right']<=1022 and command['top']>=40 and command['bottom']<=1300,(label,'clipped',command)
   assert '…' not in command['value'],(label,'truncated',command)
  # No two rendered text boxes may overlap, including CJK and German labels.
  for i,a in enumerate(commands):
   for bb in commands[i+1:]:
    intersection_width=min(a['right'],bb['right'])-max(a['left'],bb['left']);intersection_height=min(a['bottom'],bb['bottom'])-max(a['top'],bb['top'])
    assert intersection_width<=1 or intersection_height<=1,(label,'overlap',a,bb)
  for key in ['Club career totals','YOUR LEGACY']:
   assert any(d['value']==tr(key,locale) for d in commands),(label,key)
  recorded=[s for s in state['history'] if s.get('competitions')]
  if recorded:
   assert any(d['value']==tr('National team',locale) for d in commands)
   sum_stats=lambda group,key:sum(s['competitions'][group][key] for s in recorded)
   for x,y,value in [(86,630,sum(s['trophies'] for s in state['history'])),(86,866,sum_stats('cup','medal')),(574,866,sum_stats('national','medal')),(574,922,sum_stats('national','appearances')),(794,922,sum_stats('national','goals'))]:
    assert next(d['value'] for d in commands if d['x']==x and d['y']==y)==str(value)
   for kind in ['regional','global']:
    key='Regional titles: {count}' if kind=='regional' else 'Global titles: {count}'
    assert any(d['value']==tr(key,locale,count=sum(s['competitions']['national']['medal'] for s in recorded if s['competitions']['national']['kind']==kind)) for d in commands)
  else:assert not any(d['x']==574 and d['y']==866 for d in commands)
  with page.expect_download() as download:page.locator('.download-record').click()
  path=artifacts/f'{label}.json';download.value.save_as(str(path));exported=json.loads(path.read_text());assert exported['career']==state
  assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==state
  (artifacts/f'{label}-text.json').write_text(json.dumps(commands,ensure_ascii=False,indent=2))
  print('PASS',label,'identical mobile/desktop 1080x1350 PNG, localized text fits without overlap, reconciled honours, unchanged JSON/save',flush=True);c.close()
 assert not errors,errors
 b.close();print('PASS: six languages, historical coverage and long-name stress case; no console errors',flush=True)
