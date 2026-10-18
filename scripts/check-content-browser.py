import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:4175').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-seo-content'));artifacts.mkdir(parents=True,exist_ok=True)
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-proxy-server'] if os.environ.get('COPERO_BROWSER_DIRECT')=='1' else [],**({'executable_path':exe} if exe else {}))
 c=b.new_context(viewport={'width':1440,'height':1000});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for locale in ['es','en','it','pt','zh','de']:
  route='/' if locale=='es' else '/'+locale
  response=page.goto(base+route);assert response.status==200
  page.wait_for_load_state('networkidle')
  expect(page.locator('.copero-overview')).to_be_visible()
  link=page.locator('.topic-links a[href$="/copero-training-strategy"]');expect(link).to_have_count(1)
  schemas=[json.loads(text) for text in page.locator('script[type="application/ld+json"]').all_text_contents()]
  graph=next(s['@graph'] for s in schemas if '@graph' in s)
  website=next(item for item in graph if item['@type']=='WebSite');assert website['url']=='https://copero.pro'
  assert website['@id']=='https://copero.pro/#website'
  assert not any(s.get('@type')=='FAQPage' for s in schemas)
  link.click();page.wait_for_load_state('networkidle')
  expect(page.locator('.strategy-comparison tbody tr')).to_have_count(9)
  expect(page.locator('.strategy-comparison')).to_contain_text('copero-strategy-v1')
  assert page.locator('.breadcrumbs a').count()==2
  for width in [375,768,1440]:
   page.set_viewport_size({'width':width,'height':1000})
   page.evaluate('document.fonts.ready')
   page.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(locale,width)
  page.locator('a[href="#comparison"]').click();expect(page.locator('#comparison')).to_be_in_viewport()
  page.screenshot(path=str(artifacts/f'comparison-{locale}.png'))
  assert page.locator('meta[property="og:type"]').get_attribute('content')=='article'
 assert not errors,errors
 # Crawlers receive the added copy and all nine rows without running JavaScript.
 nojs=b.new_context(java_script_enabled=False);static=nojs.new_page();static.goto(base+'/')
 expect(static.locator('#about-copero')).to_be_visible()
 static.goto(base+'/es/guides/copero-training-strategy');expect(static.locator('.strategy-comparison tbody tr')).to_have_count(9)
 print('PASS: root Spanish content, six linked strategy editions, nine server-rendered rows each, stable domain identity, visible breadcrumbs, article metadata, comparison anchors, responsive layouts, no-JS content and no runtime errors')
 b.close()
