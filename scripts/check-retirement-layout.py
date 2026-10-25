"""Retirement layout, honour accounting, downloads and restart in isolated saves."""
import json,os,re,struct
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/')
source=Path(os.environ.get('COPERO_CAREER_REPORT','/tmp/copero-national-audit-before/report.json'))
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-retirement-layout'));artifacts.mkdir(parents=True,exist_ok=True)
careers=json.loads(source.read_text())['careers'];state=next(c['final'] for c in careers if c['country']=='Brazil')
errors=[];exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,**({'executable_path':exe} if exe else {}))
 for locale in ['es','en','it','pt','zh','de']:
  c=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce',accept_downloads=True)
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  c.add_init_script('if(!sessionStorage.getItem("retirement-test-seeded")){sessionStorage.setItem("retirement-test-seeded","1");localStorage.setItem("copero.career.v1",'+json.dumps(json.dumps(state))+')}')
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.goto(base+'/'+locale+'/career');page.wait_for_load_state('networkidle');expect(page.locator('.result-card')).to_be_visible()
  national=lambda key:sum(s['competitions']['national'][key] for s in state['history'])
  cup=lambda key:sum(s['competitions']['cup'][key] for s in state['history'])
  for metric,value in {'cup-medals':cup('medal'),'cup-appearances':cup('appearances'),'cup-goals':cup('goals'),'cup-assists':cup('assists'),'cup-clean-sheets':cup('cleanSheets'),'national-caps':national('appearances'),'national-goals':national('goals'),'national-assists':national('assists'),'national-clean-sheets':national('cleanSheets'),'national-titles':national('medal')}.items():
   expect(page.locator('[data-metric='+metric+'] dd')).to_have_text(str(value))
  for kind in ['regional','global']:
   count=sum(s['competitions']['national']['medal'] for s in state['history'] if s['competitions']['national']['kind']==kind)
   assert str(count) in page.locator('[data-title-kind='+kind+']').inner_text()
  stats=[int(v) for v in page.locator('.result-stats strong').all_text_contents()]
  assert stats[:4]==[sum(s[k] for s in state['history']) for k in ['appearances','goals','assists','trophies']]
  assert stats[5]==sum(s['cleanSheets'] for s in state['history'])
  for width,height in [(320,568),(375,667),(390,844),(760,1024),(1024,768),(1440,900),(844,390)]:
   page.set_viewport_size({'width':width,'height':height});page.evaluate('scrollTo({top:0,behavior:"instant"})')
   for scroll in [0,500,1000]:
    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',scroll)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(locale,width)
    for button in page.locator('.result-actions button').all():
     box=button.bounding_box();assert box['height']>=44 and box['width']>=44
     assert button.evaluate('e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}'),(locale,width,scroll)
   if locale in ['es','de'] and width in [390,1440]:
    page.evaluate('scrollTo({top:0,behavior:"instant"})');page.screenshot(path=str(artifacts/f'{locale}-{width}.png'),full_page=True)
  page.set_viewport_size({'width':390,'height':844})
  for selector in ['.score-explainer','.development-curve','.retirement-record','.achievement-history','.retirement-timeline']:
   detail=page.locator(selector);assert detail.get_attribute('open') is None
   detail.locator(':scope>summary').focus();page.keyboard.press('Enter');expect(detail).to_have_attribute('open','')
  expect(page.locator('.score-row')).to_have_count(5);expect(page.locator('.career-timeline>ol>li')).to_have_count(23);expect(page.locator('.career-chart')).to_be_visible()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  with page.expect_download() as download:page.locator('.download-card').click()
  path=artifacts/f'{locale}.png';download.value.save_as(str(path));data=path.read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n' and struct.unpack('>II',data[16:24])==(1080,1350)
  with page.expect_download() as download:page.locator('.download-record').click()
  path=artifacts/f'{locale}.json';download.value.save_as(str(path));record=json.loads(path.read_text());assert record['format']=='copero-career-record-v1' and record['career']==state
  assert record['records']['competitions']['national']['titles']==national('medal')
  assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==state
  page.once('dialog',lambda dialog:dialog.dismiss());page.locator('.restart-career').click();expect(page.locator('.result-card')).to_be_visible();assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==state
  page.once('dialog',lambda dialog:dialog.accept());page.locator('.restart-career').click();expect(page.locator('.result-page')).to_have_count(0);expect(page.locator('#create-player')).to_be_visible();assert page.evaluate('localStorage.getItem("copero.career.v1")') is None
  print('PASS',locale,'7 sizes; honours reconcile; keyboard disclosures; PNG/JSON; cancel/confirm restart',flush=True);c.close()
 # Old saves must keep an honest absence of cup/international records.
 for fixture in ['legacy-story-save.json','progression-v13-save.json']:
  legacy=json.loads((Path(__file__).resolve().parent.parent/'tests/fixtures'/fixture).read_text());legacy=legacy.get('state',legacy);legacy['status']='retired'
  c=b.new_context(viewport={'width':320,'height':568});c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  c.add_init_script('localStorage.setItem("copero.career.v1",'+json.dumps(json.dumps(legacy))+')');page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base+'/en/career');expect(page.locator('.result-card')).to_be_visible();expect(page.locator('.competition-record')).to_contain_text('No competition records were simulated in these historical seasons.');expect(page.locator('.competition-groups')).to_have_count(0)
  page.locator('.retirement-timeline>summary').click();expect(page.locator('.career-timeline>ol>li')).to_have_count(len(legacy['history'])+1);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  print('PASS',fixture,'historical records remain available without invented competition totals',flush=True);c.close()
 assert not errors,errors
 b.close();print('PASS: retirement layouts across six languages, no console errors',flush=True)
