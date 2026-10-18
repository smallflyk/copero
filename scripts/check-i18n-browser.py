import os
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:4175').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-i18n'));artifacts.mkdir(parents=True,exist_ok=True)
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
locales=['es','en','it','pt','zh','de'];tags={'es':'es','en':'en','it':'it','pt':'pt','zh':'zh-Hans','de':'de'}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-proxy-server'] if os.environ.get('COPERO_BROWSER_DIRECT')=='1' else [],**({'executable_path':exe} if exe else {}))
 c=b.new_context(viewport={'width':1440,'height':1000},accept_downloads=True);page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
 def visit(path):
  response=page.goto(base+path);assert response.status==200,(path,response.status);page.wait_for_load_state('networkidle')
 def save():return page.evaluate("JSON.parse(localStorage.getItem('copero.career.v1'))")
 # The preferred Spanish homepage stays at the root; /es is a production alias.
 visit('/');assert page.url.rstrip('/')==base;expect(page.locator('html')).to_have_attribute('lang','es')
 for locale in locales:
  visit('/' if locale=='es' else '/'+locale)
  expect(page.locator('html')).to_have_attribute('lang',tags[locale]);expect(page.locator('h1')).to_have_count(1)
  assert page.locator('link[rel=alternate][hreflang]').count()==7
  assert 'FREE BROWSER GAME' not in page.inner_text('main')
  assert 'Your name. Your country.' not in page.inner_text('main')
  for width in [375,390,768,1024,1440]:
   page.set_viewport_size({'width':width,'height':1000})
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),('overflow',locale,width)
   boxes=page.locator('.tactical-pitch button').evaluate_all('(els)=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})')
   assert all(r['w']>=44 and r['h']>=44 for r in boxes)
   for i,a in enumerate(boxes):
    for other in boxes[i+1:]:assert min(a['x']+a['w'],other['x']+other['w'])<=max(a['x'],other['x']) or min(a['y']+a['h'],other['y']+other['h'])<=max(a['y'],other['y']),('overlap',locale,width)
   if width==390:assert page.locator('.nationality-panel').bounding_box()['y']>page.locator('.identity-panel').bounding_box()['y']+page.locator('.identity-panel').bounding_box()['height']
  page.locator('.language-switcher summary').click();expect(page.locator('.language-switcher nav a')).to_have_count(6)
  expect(page.locator(f'.language-switcher a[hreflang="{tags[locale]}"]')).to_have_attribute('aria-current','true')
  page.locator('.language-switcher summary').click();page.screenshot(path=str(artifacts/f'home-{locale}.png'))
  for route in ['/how-it-works','/guides','/guides/copero-transfers','/privacy-policy','/terms','/about']:
   visit('/'+locale+route);assert page.locator('h1').count()==1
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(locale,route)
   assert all(link.get_attribute('href').startswith('/'+locale) or link.get_attribute('href').startswith('mailto:') or (locale=='es' and link.get_attribute('href').startswith('/#')) for link in page.locator('.article a').all())
 # Spanish creation and localized search, shared English-format save across all languages.
 visit('/es');page.locator('.workbench-form button[type=submit]').click();expect(page.locator('.workbench-form [role=alert]')).to_contain_text('2 a 28');page.locator('.identity-fields input').first.fill('Prueba Copero');page.locator('input[type=search]').fill('España')
 expect(page.locator('.country-list button')).to_have_count(1);page.locator('.country-list button').click()
 expect(page.locator('.kit-caption')).to_contain_text('España');page.locator('.workbench-form button[type=submit]').click()
 expect(page.locator('.academy-step h3')).to_be_focused();page.locator('.workbench-form button[type=submit]').click();page.wait_for_url('**/es/career')
 page.locator('.next-season').click();page.wait_for_function("JSON.parse(localStorage.getItem('copero.career.v1')).history.length===1")
 state=save();assert state['player']['nationality']=='Spain';assert state['player']['name']=='Prueba Copero'
 for locale in ['de','zh','pt','it','en','es']:
  page.locator('.language-switcher summary').click();page.locator(f'.language-switcher a[hreflang="{tags[locale]}"]').click();page.wait_for_url('**/'+locale+'/career');page.wait_for_load_state('networkidle')
  expect(page.locator('h1')).to_have_text('Prueba Copero');assert save()==state
  if locale!='en':assert 'Balanced training supported' not in page.locator('.latest-season').inner_text()
 page.screenshot(path=str(artifacts/'career-es.png'))
 page.locator('.game-sidebar .button').click();expect(page.locator('.result-card')).to_be_visible()
 for locale in locales:
  visit('/'+locale+'/career');expect(page.locator('.result-card')).to_be_visible()
  with page.expect_download() as download:page.locator('.result-page .button').first.click()
  target=artifacts/f'result-{locale}.png';download.value.save_as(str(target));assert target.read_bytes().startswith(b'\x89PNG')
 # Static translated content is available to crawlers and users without JavaScript.
 nojs=b.new_context(java_script_enabled=False);static=nojs.new_page()
 for locale in locales:
  static.goto(base+('/' if locale=='es' else '/'+locale));expect(static.locator('html')).to_have_attribute('lang',tags[locale]);expect(static.locator('.faq-list details')).to_have_count(8)
  static.goto(base+'/'+locale+'/privacy-policy');assert len(static.locator('article').inner_text())>200
 assert not errors,errors
 print('PASS: 6 languages, 30 responsive homepage combinations, localized articles, six-link selector, default Spanish, localized search, same save across language switches, translated narratives, all result PNGs, no-JS HTML and no runtime errors')
 b.close()
