"""Six-language regression for contextual choices, attribution, legacy saves and retirement."""
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
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  c.add_init_script('if(!localStorage.getItem("copero.career.v1"))localStorage.setItem("copero.career.v1",'+json.dumps(fixture)+')')
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.goto(base+'/'+locale+'/career');page.wait_for_load_state('networkidle')
  for n in range(6,10):
   expect(page.locator('.next-season')).to_be_disabled()
   story=page.locator('#story-decision')
   title=story.locator('h3').inner_text()
   if locale!='en':assert title in [m[locale] for m in messages.values()],title
   for button in story.locator('.story-option:not(:disabled)').all():
    text=button.inner_text()
    if locale!='en':assert text in [m[locale] for m in messages.values()],text
   assert story.locator('.story-trigger').inner_text()
   for reason in story.locator('.story-option:disabled small').all_text_contents():assert locale=='en' or reason==messages['No usable benefit with your current limits. Choose another option.'][locale]
   state=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')
   if state['player']['injuryStatus']!='healthy':
    key='Recovering from a '+state['player']['injuryStatus']+' injury'
    expect(page.locator('legend[translate=no]')).to_have_text(key if locale=='en' else messages[key][locale])
   # A club change must require a fresh story decision.
   if n==6:
    story.locator('.story-option:not(:disabled)').first.click()
    transfer=page.locator('select').filter(has=page.locator('option[value=stay]'))
    if transfer.locator('option[value=bigger]').count():
     transfer.select_option('bigger');expect(page.locator('.next-season')).to_be_disabled()
     expect(story.locator('[aria-pressed=true]')).to_have_count(0)
   # Each choice is operable by keyboard, announces its selection and shows its costs.
   choice=story.locator('.story-option:not(:disabled)').nth((n-6)%story.locator('.story-option:not(:disabled)').count());choice.focus();page.keyboard.press('Enter');expect(choice).to_have_attribute('aria-pressed','true')
   expect(page.locator('#story-effects .effect-list li').first).to_be_visible()
   page.locator('.offer-breakdown summary').click()
   quality='Training quality' if locale=='en' else messages['Training quality'][locale]
   expect(page.locator('.offer-detail dt').filter(has_text=quality)).to_have_count(1)
   expect(page.locator('.offer-detail')).to_contain_text('100')
   page.locator('.next-season').click();page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=n)
   review=page.locator('.latest-season .season-feedback')
   review.locator('summary').first.click();expect(review.locator('.review-changes')).to_be_visible();expect(review.locator('summary').first.locator('small')).to_have_css('white-space','normal')
   save=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')
   latest=save['history'][-1];trace=latest['review']['changes']
   assert len(trace)==10
   assert latest['decision']['storyEvent']==latest['review']['story']['eventId']
   assert latest['decision']['storyEvent'] not in [h.get('review',{}).get('story',{}).get('eventId') for h in save['history'][-5:-1]]
   for metric in ['fitness','morale','coachTrust','ovr']:
    assert sum(step['after'][metric]-step['before'][metric] for step in trace)==latest['review']['after'][metric]-latest['review']['before'][metric]
   full=review.locator('.full-attribution');assert full.get_attribute('open') is None
   assert review.locator('.key-changes li').count()<=3
   compact_height=review.bounding_box()['height'];full.locator('summary').click()
   expect(full.locator('.change-breakdown')).to_be_visible()
   assert compact_height<review.bounding_box()['height']*.8
   expect(review.locator('.change-breakdown ol>li')).to_have_count(10)
   assert latest['decision']['rules']=='1.4' and 'goal' in latest['review']
   if locale!='en':
    assert all(label in [m[locale] for m in messages.values()] for label in review.locator('.change-breakdown li>strong').all_text_contents())
   selected=latest['review']['story']['label']
   expect(review).to_contain_text(selected if locale=='en' else messages[selected][locale])
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),locale
   page.reload();page.wait_for_load_state('networkidle')
   assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==save
  # Retire through the actual UI and check complete translated result sentences.
  page.locator('.career-report>summary').click();page.on('dialog',lambda d:d.accept())
  label='Retire and see my legacy' if locale=='en' else messages['Retire and see my legacy'][locale]
  page.get_by_role('button',name=label,exact=True).click();expect(page.locator('.result-card')).to_be_visible()
  result=page.locator('.result-intro').inner_text()
  retirement='Retired at {age}' if locale=='en' else messages['Retired at {age}'][locale]
  assert retirement.replace('{age}','25') in result
  page.locator('.retirement-timeline>summary').click();ending=page.locator('.career-timeline>ol>li').last.inner_text()
  assert '25' in ending
  if locale!='en':assert 'Retired as a' not in ending and 'Retired at' not in result
  with page.expect_download() as dl:page.locator('.result-page .button').first.click()
  assert dl.value.suggested_filename.endswith('.png')
  page.reload();page.wait_for_load_state('networkidle');expect(page.locator('.result-card')).to_be_visible()
  print('PASS',locale,'contextual cooldown, transfer invalidation, 10-step attribution, translated effects/results, PNG, reload',flush=True)
  c.close()
 assert not errors,errors
 b.close()
