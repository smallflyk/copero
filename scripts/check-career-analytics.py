"""Real Google tag protocol + actual gameplay, with fail-closed outbound isolation."""
import os,json,time,re,hashlib
from pathlib import Path
from urllib.parse import urlsplit,parse_qs
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parent.parent
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/');site=urlsplit(base).netloc
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-analytics-browser'));artifacts.mkdir(parents=True,exist_ok=True)
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE','/Users/smallflyk/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell')
messages=json.loads((root/'lib/i18n/messages.json').read_text());errors=[]
def tr(key,locale):return key if locale=='en' else messages[key][locale]
def decoded(requests):
 result=[]
 for request in requests:
  u=urlsplit(request['url'])
  if 'google-analytics.com' not in (u.hostname or '') or not u.path.endswith('/collect'):continue
  common={k:v[-1] for k,v in parse_qs(u.query).items()}
  for line in (request.get('body') or '').splitlines() or ['']:
   row={**common,**{k:v[-1] for k,v in parse_qs(line).items()}}
   if row.get('en'):result.append(row)
 return result
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path=exe)
 for locale in ['es','en','it','pt','zh','de']:
  c=b.new_context(**p.devices['iPhone 13'],service_workers='block',accept_downloads=True);requests=[];tags=[]
  def route(r):
   u=urlsplit(r.request.url)
   if u.netloc==site and r.request.method in ['GET','HEAD']:return r.continue_()
   if u.hostname=='www.googletagmanager.com' and u.path in ['/gtag/js','/gtag/destination'] and r.request.resource_type=='script':return r.continue_()
   requests.append({'url':r.request.url,'body':r.request.post_data,'method':r.request.method,'type':r.request.resource_type,'forwarded':False});r.fulfill(status=204,body='')
  c.route('**/*',route)
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  def response(r):
   if r.url.startswith('https://www.googletagmanager.com/gtag/js'):
    try:tags.append({'url':r.url,'status':r.status,'sha256':hashlib.sha256(r.body()).hexdigest()})
    except Exception:pass
  page.on('response',response)
  def names():return [e['en'] for e in decoded(requests)]
  def wire(event,count):
   limit=time.monotonic()+20
   while names().count(event)<count and time.monotonic()<limit:page.wait_for_timeout(200)
   assert names().count(event)==count,(locale,event,count,names())
  def save():return page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')
  home='/' if locale=='es' else '/'+locale
  page.goto(base+home,referer='https://www.google.com/');expect(page.locator('.player-workbench')).to_be_visible();wire('page_view',1)
  initial=decoded(requests)[0];assert initial['tid']=='G-4JYX8WF2SZ' and initial['dr']=='https://www.google.com/' and initial['uamb']=='1'
  page.locator('.creation-footer button').click();expect(page.locator('.error-message')).to_be_visible();assert 'career_start' not in names() and 'season_complete' not in names()
  def create():
   page.wait_for_function('()=>{const f=document.querySelector(".workbench-form");return f&&Object.keys(f).some(k=>k.startsWith("__reactProps$")&&typeof f[k].onSubmit==="function")}')
   page.locator('.identity-fields input').first.fill('PRIVATE_PLAYER_CANARY');page.locator('.creation-footer button').click();expect(page.locator('.academy-step')).to_be_visible();page.locator('.academy-step button[type=submit]').click();expect(page.locator('.career-page')).to_be_visible()
  create();wire('career_start',1);first=save();assert first['history']==[];assert 'career_restart' not in names()
  page.reload();expect(page.locator('.career-page')).to_be_visible();assert save()==first
  def season(number):
   page.locator('.story-option:not(:disabled)').first.click();page.evaluate('()=>{const b=document.querySelector(".next-season");b.click();b.click()}');page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=number)
  season(1);wire('season_complete',1);before=save();page.reload();expect(page.locator('.career-page')).to_be_visible();assert save()==before
  if locale=='en':
   for n in range(2,23):season(n)
   expect(page.locator('.result-page')).to_be_visible();wire('season_complete',22);wire('career_complete',1)
  else:
   page.locator('.career-report>summary').click();page.once('dialog',lambda d:d.dismiss());page.get_by_role('button',name=tr('Retire and see my legacy',locale),exact=True).click();assert save()['status']=='playing'
   page.once('dialog',lambda d:d.accept());page.get_by_role('button',name=tr('Retire and see my legacy',locale),exact=True).click();expect(page.locator('.result-page')).to_be_visible();wire('career_complete',1)
  retired=save();wire('career_complete',1)
  for button,extension in [('.download-card','png'),('.download-record','json')]:
   with page.expect_download() as download:page.locator(button).click()
   download.value.save_as(str(artifacts/f'{locale}.{extension}'))
  wire('career_export',2);assert json.loads((artifacts/f'{locale}.json').read_text())['career']==retired
  page.reload();expect(page.locator('.result-page')).to_be_visible();assert save()==retired
  page.once('dialog',lambda d:d.dismiss());page.locator('.restart-career').click();assert save()==retired
  page.once('dialog',lambda d:d.accept());page.locator('.restart-career').click();expect(page.locator('.player-workbench')).to_be_visible();assert save() is None
  create();wire('career_start',2);wire('career_restart',1);assert save()['id']==first['id'];assert 'career_continue' not in names()
  season(1);wire('career_continue',1);wire('season_complete',23 if locale=='en' else 2)
  events=decoded(requests);business=[e for e in events if e.get('ep.measurement_version')=='career-v1']
  assert len([e for e in business if e['en']=='career_start'])==2 and len([e for e in business if e['en']=='career_complete'])==1
  for e in business:
   assert e['ep.site_language']==locale and e['ep.game_mode']=='career'
   assert not any(key in e for key in ['ep.player_name','ep.seed','ep.career_id','ep.run_id'])
  raw=json.dumps(requests);assert 'PRIVATE_PLAYER_CANARY' not in raw and first['seed'] not in raw and first['id'] not in raw
  assert tags and all(t['status']==200 for t in tags)
  assert all(not r['forwarded'] for r in requests)
  (artifacts/f'{locale}-wire.json').write_text(json.dumps({'isolation':'mobile UA/touch; service workers blocked; interceptors installed before navigation; only same-origin GET/HEAD and official Google tag scripts forwarded; all collectors fulfilled locally, never delivered to production','tags':tags,'requests':requests,'business_events':business},indent=2))
  print('PASS',locale,'real tag, Google referrer, validated start/season/retirement/replay/continued play, same-ID replay, reload dedup, PNG/JSON, no canary leak, zero collector forwarding',flush=True);c.close()
 assert not errors,errors
 b.close();print('PASS: six languages; real client protocol only, NOT GA4 backend ingestion or growth evidence',flush=True)
