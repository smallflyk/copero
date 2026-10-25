"""Desktop regression for the compact decision workspace and persistent action dock."""
import os,json,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parent.parent
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-season-desktop'));artifacts.mkdir(parents=True,exist_ok=True)
fixture=(root/'tests/fixtures/mobile-season.json').read_text();messages=json.loads((root/'lib/i18n/messages.json').read_text());exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE');errors=[]
def text(key,locale):return key if locale=='en' else messages[key][locale]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,**({'executable_path':exe} if exe else {}))
 for locale in ['es','en','it','pt','zh','de']:
  c=b.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce')
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  c.add_init_script('if(!localStorage.getItem("copero.career.v1"))localStorage.setItem("copero.career.v1",'+json.dumps(fixture)+')')
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.goto(base+'/'+locale+'/career');page.wait_for_load_state('networkidle')
  def dock():
   expect(page.locator('.next-season')).to_have_count(1);expect(page.locator('.next-season')).to_be_in_viewport(ratio=1)
   assert page.locator('.season-actions').evaluate('e=>getComputedStyle(e).position')=='fixed'
   assert page.locator('.next-season').evaluate('e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  for width,height in [(1024,768),(1280,600),(1440,900)]:
   page.set_viewport_size({'width':width,'height':height})
   for y in [0,600,100000]:page.evaluate('(y)=>scrollTo({top:y,behavior:"instant"})',y);dock()
  expect(page.locator('.next-season')).to_be_disabled()
  help=page.locator('.coaching-help');expect(help.locator('summary')).to_have_text(text('How coaching works',locale));assert help.get_attribute('open') is None;help.locator('summary').focus();page.keyboard.press('Enter');expect(help.locator('p').first).to_be_visible();help.locator('summary').click()
  overview=page.locator('.season-narrative');expect(overview.locator('summary')).to_have_text(text('Season summary',locale));assert overview.get_attribute('open') is None;overview.locator('summary').click();assert overview.locator('p').inner_text();overview.locator('summary').click()
  page.locator('.decision-card').nth(2).click()
  transfer=page.locator('select').filter(has=page.locator('option[value=bigger]'));transfer.select_option('bigger')
  page.locator('select').filter(has=page.locator('option[value=full]')).select_option('full')
  page.locator('.season-actions-review').click();expect(page.locator('#story-decision')).to_be_in_viewport()
  page.locator('.story-option:not(:disabled)').first.click();expect(page.locator('#story-effects')).to_be_visible();expect(page.locator('.next-season')).to_be_enabled();dock()
  page.evaluate('()=>{const b=document.querySelector(".next-season");b.click();b.click()}')
  page.wait_for_function('JSON.parse(localStorage.getItem("copero.career.v1")).history.length===6');expect(page.locator('.latest-season')).to_be_focused()
  saved=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))');latest=saved['history'][-1];assert latest['decision']['training']=='recovery' and latest['decision']['transfer']=='bigger' and latest['decision']['recovery']=='full'
  page.locator('.latest-season .season-competitions>summary').click();expect(page.locator('.latest-season .season-competitions h3').first).to_be_visible();dock()
  if locale in ['es','zh']:page.evaluate('scrollTo({top:0,behavior:"instant"})');page.screenshot(path=str(artifacts/f'season-{locale}.png'))
  page.reload();page.wait_for_load_state('networkidle');assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==saved;dock()
  history=page.locator('.season-history');assert history.get_attribute('open') is None;history.locator('summary').focus();page.keyboard.press('Enter');expect(history.locator('tbody tr')).to_have_count(6);expect(history.locator('.table-scroll')).to_be_visible();history.locator('summary').click()
  page.locator('.footer-bottom').scroll_into_view_if_needed();footer=page.locator('.footer-bottom').bounding_box();bar=page.locator('.season-actions').bounding_box();assert footer['y']+footer['height']<=bar['y']+2
  page.on('dialog',lambda d:d.accept());page.get_by_role('button',name=text('Retire and see my legacy',locale),exact=True).click();expect(page.locator('.result-card')).to_be_visible();expect(page.locator('.season-actions')).to_have_count(0);page.wait_for_function('getComputedStyle(document.body).paddingBottom==="0px" && !document.documentElement.style.getPropertyValue("--season-dock-height")')
  print('PASS',locale,'desktop dock at all scroll positions, disclosures, actual choices, duplicate guard, recap focus, reload and retirement cleanup',flush=True);c.close()
 assert not errors,errors
 print('PASS: six languages × three desktop sizes, real season progression and no console errors',flush=True);b.close()
