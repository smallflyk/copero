"""Verify the first-screen workbench and create real careers in all six languages."""
import json,os,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parent.parent
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-compact-hero'));artifacts.mkdir(parents=True,exist_ok=True)
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE');messages=json.loads((root/'lib/i18n/messages.json').read_text());results=[];errors=[]
def tr(key,locale):return key if locale=='en' else messages[key][locale]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,**({'executable_path':exe} if exe else {}))
 for locale in ['es','en','it','pt','zh','de']:
  c=b.new_context(viewport={'width':1440,'height':900},has_touch=True,reduced_motion='reduce')
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  for width,height in [(1440,900),(1366,768),(1280,720),(1366,650),(1280,600),(1024,768),(960,720),(959,720),(768,1024),(390,844),(375,667),(320,568)]:
   page.set_viewport_size({'width':width,'height':height});page.goto(base+('/' if locale=='es' else '/'+locale));page.wait_for_load_state('networkidle');page.evaluate('document.fonts.ready')
   box=page.locator('.player-workbench').bounding_box();assert box['y']>=0 and box['y']+box['height']<=height,(locale,width,height,box)
   inset=page.locator('.hero-game').evaluate('e=>parseFloat(getComputedStyle(e).paddingBottom)');assert abs(height-box['y']-box['height']-inset)<=1,(locale,width,height,'unused space below game')
   footer=page.locator('.creation-footer').bounding_box();pad=page.locator('.player-workbench').evaluate('e=>parseFloat(getComputedStyle(e).paddingBottom)');assert abs(box['y']+box['height']-footer['y']-footer['height']-pad-1)<=1,(locale,width,height,'unused space below action')
   expect(page.locator('.creation-footer button')).to_be_in_viewport(ratio=1)
   assert page.locator('.hero-game').evaluate('e=>e.nextElementSibling.getBoundingClientRect().top>=innerHeight'),(locale,width,height,'editorial content enters first screen')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(locale,width,height,'page overflow')
   if width<960:
    menu=page.locator('.mobile-nav summary');r=menu.bounding_box();assert r['y']>=0 and 44<=r['height']<=56;menu.click();expect(page.locator('.mobile-nav nav a').first).to_be_visible();assert page.locator('.mobile-nav nav').bounding_box()['x']>=0;menu.click()
    switcher=page.locator('.creation-section-switcher');expect(switcher).to_be_visible();expect(switcher.locator('button')).to_have_count(3)
    switcher.locator('button').nth(2).click();expect(switcher.locator('button').nth(2)).to_have_attribute('aria-pressed','true')
    assert page.locator('.position-panel').evaluate('e=>{const p=e.parentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return Math.abs(r.left-p.left)<2}')
   else:
    expect(page.locator('.creation-section-switcher')).not_to_be_visible()
    for control in page.locator('.identity-fields input,.segmented button,.tactical-pitch button,.country-note').all():
     expect(control).to_be_in_viewport(ratio=1);r=control.bounding_box();pane=page.locator('.creation-panels').bounding_box();assert r['y']+r['height']<=pane['y']+pane['height']+1,(locale,width,height,'control exceeds setup body')
   buttons=page.locator('.tactical-pitch button').evaluate_all('(els)=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})')
   assert all(r['w']>=44 and r['h']>=44 for r in buttons),(locale,width,buttons)
   for i,a in enumerate(buttons):
    for other in buttons[i+1:]:assert min(a['x']+a['w'],other['x']+other['w'])<=max(a['x'],other['x']) or min(a['y']+a['h'],other['y']+other['h'])<=max(a['y'],other['y']),(locale,width,'overlapping pitch controls')
   results.append({'locale':locale,'width':width,'height':height,'workbenchHeight':round(box['height']),'bottom':round(box['y']+box['height'])})
   if locale=='es' and width in [1366,390,320]:page.screenshot(path=str(artifacts/f'hero-{width}.png'))
  page.set_viewport_size({'width':1280,'height':600});page.locator('.identity-fields input').first.fill('Preview');page.locator('.creation-footer button').click();expect(page.locator('.academy-step h3')).to_be_focused();box=page.locator('.player-workbench').bounding_box();assert box['y']+box['height']<=600
  for option in page.locator('.academy-option').all():expect(option).to_be_in_viewport(ratio=1)
  page.locator('.academy-step .button.secondary').click();page.locator('.identity-fields input').first.fill('');page.set_viewport_size({'width':320,'height':568});page.locator('.creation-section-switcher button').nth(2).click()
  # Invalid submission from the position section must reveal and focus the name field.
  page.locator('.creation-footer button').click();expect(page.locator('.workbench-form [role=alert]')).to_be_visible();expect(page.locator('.identity-fields input').first).to_be_focused();expect(page.locator('.creation-section-switcher button').first).to_have_attribute('aria-pressed','true')
  page.set_viewport_size({'width':390,'height':844});page.locator('.identity-fields input').first.fill('Compact '+locale);page.locator('.identity-fields input').nth(1).fill('21');page.locator('.segmented button').first.click()
  page.locator('.creation-section-switcher button').nth(1).focus();page.keyboard.press('Enter');
  for country_button in page.locator('.country-list button').all():country_button.click();expect(country_button).to_have_attribute('aria-pressed','true');expect(page.locator('.creation-footer button')).to_be_in_viewport(ratio=1)
  page.locator('input[type=search]').fill(tr('Japan',locale));expect(page.locator('.country-list button')).to_have_count(1);page.locator('.country-list button').click()
  page.locator('.creation-section-switcher button').nth(2).click()
  # Every pitch control can be tapped without another target intercepting the click.
  for control in page.locator('.tactical-pitch button').all():
   control.scroll_into_view_if_needed();r=control.bounding_box();page.touchscreen.tap(r['x']+r['width']/2,r['y']+r['height']/2);expect(control).to_have_attribute('aria-pressed','true')
  page.locator('.tactical-pitch button').nth(4).click()
  page.set_viewport_size({'width':1280,'height':720});page.set_viewport_size({'width':390,'height':844});expect(page.locator('.creation-section-switcher button').first).to_have_attribute('aria-pressed','true');expect(page.locator('.identity-fields input').first).to_have_value('Compact '+locale)
  page.locator('.attribute-editor summary').click();expect(page.locator('.creation-footer button')).to_be_in_viewport(ratio=1);box=page.locator('.player-workbench').bounding_box();assert box['y']+box['height']<=844
  for _ in range(4):page.locator('.attribute-allocations>div').nth(2).locator('button').last.click()
  for _ in range(2):page.locator('.attribute-allocations>div').nth(5).locator('button').last.click()
  page.locator('.attribute-editor input').fill('compact-'+locale);page.locator('.creation-footer button').click();expect(page.locator('.academy-step h3')).to_be_focused()
  assert page.evaluate('scrollY')==0
  box=page.locator('.player-workbench').bounding_box();assert box['y']+box['height']<=844
  page.locator('.academy-step .button.secondary').click();expect(page.locator('.creation-section-switcher button').first).to_have_attribute('aria-pressed','true');expect(page.locator('.identity-fields input').first).to_have_value('Compact '+locale)
  page.locator('.creation-footer button').click();page.locator('.academy-option').nth(1).click();page.locator('.academy-step button[type=submit]').click();page.wait_for_url('**/'+locale+'/career')
  state=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))');assert state['player']['name']=='Compact '+locale and state['player']['nationality']=='Japan' and state['player']['position']=='CM' and state['player']['preferredFoot']=='Left' and state['player']['jerseyNumber']==21 and state['seed']=='compact-'+locale and state['player']['clubId']=='riverside'
  page.locator('.story-option:not(:disabled)').first.click();page.locator('.next-season').click();page.wait_for_function('JSON.parse(localStorage.getItem("copero.career.v1")).history.length===1');page.reload();page.wait_for_load_state('networkidle');assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1")).history.length')==1
  saved=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))');page.goto(base+('/' if locale=='es' else '/'+locale));page.wait_for_load_state('networkidle');expect(page.locator('.resume-link')).to_be_visible();box=page.locator('.player-workbench').bounding_box();assert box['y']+box['height']<=844;page.locator('.resume-link').click();page.wait_for_url('**/'+locale+'/career');page.wait_for_load_state('networkidle');assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==saved
  print('PASS',locale,'12 first-screen sizes, section switching, all pitch taps, focus, preserved edits, academy, real career and season reload',flush=True);c.close()
 assert not errors,errors
 (artifacts/'layout-results.json').write_text(json.dumps(results,indent=2));print('PASS: 72 locale/viewport combinations, six complete creation flows, no overflow/overlap or console errors',flush=True);b.close()
