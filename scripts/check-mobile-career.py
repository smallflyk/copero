"""Responsive game regression using a valid saved-season fixture in isolated contexts."""
import json,os,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','http://localhost:3000').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-mobile-career'));artifacts.mkdir(parents=True,exist_ok=True)
fixture=(Path(__file__).resolve().parent.parent/'tests/fixtures/mobile-season.json').read_text()
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE');measurements=[];errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-proxy-server','--disable-quic','--disable-http2'] if os.environ.get('COPERO_BROWSER_DIRECT')=='1' else [],**({'executable_path':exe} if exe else {}))
 c=b.new_context(reduced_motion='reduce',viewport={'width':390,'height':844},has_touch=True,is_mobile=True,accept_downloads=True)
 c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda route:route.fulfill(status=200,body=''))
 c.add_init_script('if(!localStorage.getItem("copero.career.v1"))localStorage.setItem("copero.career.v1",'+json.dumps(fixture)+')')
 page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 def settle():
  page.wait_for_load_state('networkidle');page.evaluate('document.fonts.ready');page.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
 def saved():return page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')
 def fixed():
  assert page.locator('.next-season').count()==1
  assert page.locator('.season-actions').evaluate('e=>getComputedStyle(e).position')=='fixed'
  rect=page.locator('.season-actions').bounding_box();button=page.locator('.next-season').bounding_box()
  assert abs(rect['y']+rect['height']-page.viewport_size['height'])<2,(page.url,page.viewport_size,rect,page.evaluate('({w:innerWidth,h:innerHeight,visual:visualViewport.height,scale:visualViewport.scale})'))
  assert button['height']>=52 and button['y']>=0
  assert page.locator('.next-season').evaluate('e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 for locale in ['es','en','it','pt','zh','de']:
  page.goto(base+'/'+locale+'/career');settle();assert saved()==json.loads(fixture)
  for width,height in [(320,568),(375,667),(390,844),(430,932),(760,1024)]:
   page.set_viewport_size({'width':width,'height':height});settle();fixed()
   assert page.locator('.career-report').get_attribute('open') is None
   assert page.locator('.season-history').get_attribute('open') is None
   for y in [0,600,100000]:
    page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y);fixed()
   page.locator('.site-footer .footer-bottom').scroll_into_view_if_needed()
   footer=page.locator('.footer-bottom').bounding_box();bar=page.locator('.season-actions').bounding_box()
   assert footer['y']+footer['height']<=bar['y']+2,('footer obscured',locale,width)
   measurements.append({'locale':locale,'width':width,'height':height,'careerHeight':round(page.locator('.career-page').bounding_box()['height'])})
  page.set_viewport_size({'width':390,'height':844});settle()
  page.locator('.season-actions-review').click();page.wait_for_function('document.querySelector("#story-decision").getBoundingClientRect().top>=0 && document.querySelector("#story-decision").getBoundingClientRect().top<100')
  help=page.locator('.coaching-help');assert help.get_attribute('open') is None;help.locator('summary').focus();page.keyboard.press('Enter');expect(help.locator('p').first).to_be_visible();help.locator('summary').click()
  page.locator('.decision-card').first.click();expect(page.locator('.decision-card').first).to_have_attribute('aria-pressed','true')
  assert page.locator('.mobile-training-help').inner_text()
  expect(page.locator('.next-season')).to_be_disabled()
  page.locator('.story-option:not(:disabled)').first.focus();page.keyboard.press('Enter')
  expect(page.locator('.story-option:not(:disabled)').first).to_have_attribute('aria-pressed','true')
  expect(page.locator('.next-season')).to_be_enabled()
  expect(page.locator('.season-actions-review strong')).to_have_text(page.locator('.decision-card').first.locator('span').text_content())
  # Keyboard-operable disclosures; content and retirement remain available.
  page.locator('.career-report>summary').focus();page.keyboard.press('Enter');expect(page.locator('.attribute-report')).to_be_visible()
  page.locator('.season-history>summary').focus();page.keyboard.press('Enter');expect(page.locator('.season-history tbody tr')).to_have_count(5);expect(page.locator('.season-history .table-scroll')).to_be_visible()
  page.locator('.season-history>summary').click();page.locator('.career-report>summary').click()
  page.evaluate('scrollTo({top:0,behavior:"instant"})');page.screenshot(path=str(artifacts/f'mobile-{locale}.png'))
 # Notch padding is checked with a synthetic 34px safe area; this is not a physical iPhone test.
 before=page.locator('.season-actions').bounding_box()['height']
 page.evaluate('document.documentElement.style.setProperty("--season-safe-area","34px")');settle();fixed()
 assert round(page.locator('.season-actions').bounding_box()['height']-before)==34
 page.evaluate('document.documentElement.style.removeProperty("--season-safe-area")')
 # Landscape and desktop keep a single viewport dock; desktop reports stay expanded.
 page.set_viewport_size({'width':844,'height':390});settle();fixed()
 assert page.locator('.career-report').get_attribute('open') is None
 for width,height in [(761,1000),(1024,900),(1440,1000)]:
  page.set_viewport_size({'width':width,'height':height});settle()
  fixed()
  for y in [0,600,100000]:page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y);fixed()
  assert page.locator('.career-report').get_attribute('open') is not None
  assert page.locator('.season-history').get_attribute('open') is None
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 # Actual choices and repeated seasons through retirement from a saved game.
 page.set_viewport_size({'width':390,'height':844});page.goto(base+'/en/career');settle()
 page.locator('.season-actions-review').click()
 page.locator('.decision-card').first.click()
 page.locator('select').filter(has=page.locator('option[value=bigger]')).select_option('bigger')
 recovery=page.locator('select').filter(has=page.locator('option[value=early]'));recovery.select_option('early')
 page.locator('.decision-card').first.focus();page.evaluate('scrollTo({top:0,behavior:"instant"})');recovery.focus()
 page.wait_for_function('document.querySelector("select:has(option[value=early])").getBoundingClientRect().bottom<=document.querySelector(".season-actions").getBoundingClientRect().top')
 assert recovery.bounding_box()['y']+recovery.bounding_box()['height']<=page.locator('.season-actions').bounding_box()['y'], 'focused recovery select must not be covered by dock'
 page.locator('.story-option:not(:disabled)').first.click()
 page.evaluate('()=>{const b=document.querySelector(".next-season");b.click();b.click()}')
 expect(page.locator('.next-season')).to_be_disabled()
 page.wait_for_function('JSON.parse(localStorage.getItem("copero.career.v1")).history.length===6');settle()
 state=saved();assert state['history'][-1]['decision']['training']=='intensive'
 assert state['history'][-1]['decision']['transfer']=='bigger' and state['history'][-1]['decision']['recovery']=='early'
 assert state['player']['clubId']!='coastal'
 assert page.locator('.latest-season').evaluate('e=>e===document.activeElement')
 assert page.locator('.latest-season').bounding_box()['y']>=0
 fixed();page.reload();settle();assert saved()==state
 for n in range(7,23):
  page.locator('.story-option:not(:disabled)').nth(n%page.locator('.story-option:not(:disabled)').count()).click()
  page.locator('.next-season').click();page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=n)
  if n<22:fixed()
 expect(page.locator('.result-card')).to_be_visible();settle()
 assert saved()['player']['age']==38 and saved()['status']=='retired'
 assert page.locator('.season-actions').count()==0
 assert page.evaluate('scrollY')==0
 assert page.locator('.result-intro').bounding_box()['y']<page.viewport_size['height']
 assert page.locator('body').evaluate('e=>parseFloat(getComputedStyle(e).paddingBottom)')==0
 page.screenshot(path=str(artifacts/'mobile-retirement.png'))
 with page.expect_download() as download:page.locator('.result-page .button').first.click()
 download.value.save_as(str(artifacts/'mobile-result.png'))
 assert not errors,errors
 (artifacts/'measurements.json').write_text(json.dumps(measurements,indent=2))
 print('PASS: six languages × five portrait sizes, touch landscape, desktop, safe area, fixed single action, accessible disclosures, unobscured footer, real transfer/rehab, duplicate clicks, summary focus, refresh, 17 seasons to retirement and PNG; no console errors')
 b.close()
