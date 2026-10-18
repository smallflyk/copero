import os,re,struct,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','http://localhost:3000/en').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR',tempfile.gettempdir()))
artifacts.mkdir(parents=True,exist_ok=True)
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-proxy-server'] if os.environ.get('COPERO_BROWSER_DIRECT')=='1' else [],**({'executable_path':exe} if exe else {}))
 c=b.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
 page=c.new_page();page.set_default_timeout(10000);errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('dialog',lambda d:d.accept())
 def visit(path):
  r=page.goto(base+path);assert r.status==200,(path,r.status);page.wait_for_load_state('networkidle')
 def save():return page.evaluate("JSON.parse(localStorage.getItem('copero.career.v1'))")
 visit('/')
 expect(page.get_by_role('heading',name='Copero Football Career Simulator',exact=True)).to_be_visible()
 assert page.locator('#create-player').bounding_box()['y'] < 150
 assert page.locator('.identity-panel').bounding_box()['y'] < 400
 assert page.locator('#create-player').count()==1
 # Pitch controls must stay large enough and must not overlap at any responsive width.
 for width in [375,390,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':1000})
  boxes=page.locator('.tactical-pitch button').evaluate_all('(items)=>items.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})')
  assert all(r['w']>=44 and r['h']>=44 for r in boxes),width
  for i,a in enumerate(boxes):
   for other in boxes[i+1:]:
    assert min(a['x']+a['w'],other['x']+other['w'])<=max(a['x'],other['x']) or min(a['y']+a['h'],other['y']+other['h'])<=max(a['y'],other['y']),('overlapping positions',width)
 page.set_viewport_size({'width':1440,'height':1000})
 page.screenshot(path=str(artifacts/'copero-home-hero-desktop.png'))
 page.set_viewport_size({'width':390,'height':844})
 assert page.locator('.identity-panel').bounding_box()['y'] < 450
 assert page.locator('.identity-panel').bounding_box()['width'] > 280
 assert page.locator('.nationality-panel').bounding_box()['y'] > page.locator('.identity-panel').bounding_box()['y'] + page.locator('.identity-panel').bounding_box()['height']
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.screenshot(path=str(artifacts/'copero-home-hero-mobile.png'))
 page.set_viewport_size({'width':1440,'height':1000})
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.get_by_label('Player name',exact=True).fill('Browser Keeper')
 expect(page.locator('.player-shirt')).to_have_attribute('aria-label','England shirt: Browser Keeper, number 10')
 page.get_by_label('Search nationalities').fill('no-country-like-this')
 expect(page.get_by_role('status')).to_contain_text('No countries match')
 page.get_by_label('Search nationalities').fill('Jap')
 page.get_by_role('button',name='Japan',exact=True).click()
 expect(page.get_by_role('button',name='Japan',exact=True)).to_have_attribute('aria-pressed','true')
 page.get_by_label('Search nationalities').fill('')
 page.get_by_role('button',name='GK',exact=True).click()
 page.get_by_label('Shirt number',exact=True).fill('1')
 expect(page.locator('.player-shirt')).to_have_attribute('aria-label','Japan shirt: Browser Keeper, number 1')
 expect(page.locator('.selected-position strong')).to_have_text('Goalkeeper')
 page.locator('.player-workbench').screenshot(path=str(artifacts/'copero-creator-desktop.png'))
 page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.locator('.player-workbench').screenshot(path=str(artifacts/'copero-creator-mobile.png'))
 page.set_viewport_size({'width':1440,'height':1000})
 page.locator('.attribute-editor summary').click()
 for _ in range(4):page.get_by_role('button',name='Increase defending',exact=True).click()
 for _ in range(2):page.get_by_role('button',name='Increase physical',exact=True).click()
 expect(page.get_by_role('button',name='Increase pace',exact=True)).to_be_disabled()
 page.get_by_label('Career seed',exact=True).fill('browser-goalkeeper')
 page.get_by_role('button',name='Find my first club',exact=False).click()
 expect(page.locator('.academy-option')).to_have_count(3)
 page.get_by_role('button',name=re.compile('Harbor Athletic')).click()
 page.get_by_role('button',name='Sign my first contract',exact=False).click()
 page.wait_for_url('**/career');page.wait_for_load_state('networkidle')
 expect(page.get_by_role('heading',name='Browser Keeper',exact=True)).to_be_visible()
 assert save()['player']['age']==16 and save()['player']['clubId']=='harbor'
 # Two immediate click events must resolve only one season.
 page.evaluate("() => {const b=document.querySelector('.next-season');b.click();b.click()}")
 page.wait_for_function("JSON.parse(localStorage.getItem('copero.career.v1')).history.length===1")
 page.wait_for_timeout(350)
 assert len(save()['history'])==1
 first=save();page.reload();page.wait_for_load_state('networkidle')
 expect(page.get_by_role('heading',name='Browser Keeper',exact=True)).to_be_visible()
 assert save()==first
 page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.screenshot(path=str(artifacts/'copero-career-mobile.png'),full_page=True)
 for year in range(2,23):
  page.locator('.next-season').click()
  page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=year)
 expect(page.locator('.result-card')).to_be_visible()
 state=save();assert state['status']=='retired' and state['player']['age']==38
 assert sum(s['goals'] for s in state['history'])==0
 assert sum(s['cleanSheets'] for s in state['history'])>0
 expect(page.locator('.career-timeline>ol>li')).to_have_count(23)
 with page.expect_download() as download_info:page.get_by_role('button',name='Download result card',exact=False).click()
 download=download_info.value;destination=str(artifacts/'copero-result-card.png');download.save_as(destination)
 data=Path(destination).read_bytes();assert data[:8]==b'\x89PNG\r\n\x1a\n';assert struct.unpack('>II',data[16:24])==(1080,1350)
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.set_viewport_size({'width':1440,'height':1000});page.screenshot(path=str(artifacts/'copero-result-desktop.png'))
 # Replacement asks before losing a real saved career.
 page.get_by_role('button',name='Play again',exact=False).click();page.wait_for_url('**/en#create-player');assert page.evaluate("localStorage.getItem('copero.career.v1')")==None
 # A corrupted persisted save gives an actionable empty state.
 page.evaluate("localStorage.setItem('copero.career.v1','broken json')")
 visit('/career');expect(page.locator('.empty-career')).to_be_visible();expect(page.locator('.empty-career [role=alert]')).to_be_visible()
 for route in ['/how-it-works','/guides','/guides/copero-positions','/guides/copero-decisions','/guides/copero-transfers','/guides/copero-legacy-score','/about','/privacy-policy','/terms']:
  visit(route);assert page.locator('h1').count()==1;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),route
 # Homepage SEO and explanations are available without executing JavaScript.
 nojs=b.new_context(java_script_enabled=False,viewport={'width':390,'height':844});static=nojs.new_page();static.goto(base+'/')
 expect(static.locator('h1')).to_contain_text('Copero Football Career Simulator');expect(static.locator('.faq-list details')).to_have_count(8)
 assert not errors,errors
 print('PASS: player setup/bonus limits/academies, goalkeeper career to 38, duplicate-click guard, refresh recovery, download dimensions, replacement confirmation, corrupt saves, mobile layouts, content routes, no-JS SEO, and no browser runtime errors')
 b.close()
