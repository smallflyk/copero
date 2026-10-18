"""Six-language UI check for choice effects, quote details and saved season feedback."""
import json,os,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/')
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
messages=json.loads((Path(__file__).resolve().parent.parent/'lib/i18n/messages.json').read_text())
fixture=(Path(__file__).resolve().parent.parent/'tests/fixtures/mobile-season.json').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-proxy-server','--disable-quic','--disable-http2'] if os.environ.get('COPERO_BROWSER_DIRECT')=='1' else [],**({'executable_path':exe} if exe else {}))
 errors=[]
 for locale in ['es','en','it','pt','zh','de']:
  c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce')
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io)/'),lambda r:r.fulfill(status=200,body=''))
  c.add_init_script('if(!localStorage.getItem("copero.career.v1"))localStorage.setItem("copero.career.v1",'+json.dumps(fixture)+')')
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.goto(base+'/'+locale+'/career');page.wait_for_load_state('networkidle')
  for n in range(6,10):
   expect(page.locator('.next-season')).to_be_disabled()
   story=page.locator('#story-decision')
   title=story.locator('h3').inner_text()
   if locale!='en':assert title in [m[locale] for m in messages.values()],title
   for button in story.locator('.story-option').all():
    text=button.inner_text()
    if locale!='en':assert text in [m[locale] for m in messages.values()],text
   # Each choice is operable by keyboard, announces its selection and shows its costs.
   choice=story.locator('.story-option').nth((n-6)%3);choice.focus();page.keyboard.press('Enter');expect(choice).to_have_attribute('aria-pressed','true')
   expect(page.locator('#story-effects .effect-list li').first).to_be_visible()
   page.locator('.offer-breakdown summary').click()
   quality='Training quality' if locale=='en' else messages['Training quality'][locale]
   expect(page.locator('.offer-detail dt').filter(has_text=quality)).to_have_count(1)
   expect(page.locator('.offer-detail')).to_contain_text('100')
   page.locator('.next-season').click();page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=n)
   review=page.locator('.latest-season .season-feedback')
   review.locator('summary').click();expect(review.locator('.review-changes')).to_be_visible()
   save=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')
   selected=save['history'][-1]['review']['story']['label']
   expect(review).to_contain_text(selected if locale=='en' else messages[selected][locale])
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),locale
   page.reload();page.wait_for_load_state('networkidle')
   assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==save
  print('PASS',locale,'four story events, keyboard choices, translated quotes/effects/reviews, reload',flush=True)
  c.close()
 assert not errors,errors
 b.close()
