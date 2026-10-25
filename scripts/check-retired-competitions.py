"""Reopen actual UI-exported careers in isolated contexts and inspect every retired season."""
import json,os,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parent.parent
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/')
source=Path(os.environ.get('COPERO_CAREER_REPORT','/tmp/copero-national-careers/report.json'))
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-retired-competitions'));artifacts.mkdir(parents=True,exist_ok=True)
report=json.loads(source.read_text());messages=json.loads((root/'lib/i18n/messages.json').read_text());exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE');errors=[];count=0
assert len(report['careers'])==16

def text(key,locale):return key if locale=='en' else messages[key][locale]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,**({'executable_path':exe} if exe else {}))
 for index,run in enumerate(report['careers']):
  locale=['es','en','it','pt','zh','de'][index%6];state=run['final'];country=run['country']
  c=b.new_context(viewport={'width':320 if index%2 else 1440,'height':844 if index%2 else 1000},reduced_motion='reduce',accept_downloads=True)
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  c.add_init_script('if(!localStorage.getItem("copero.career.v1"))localStorage.setItem("copero.career.v1",'+json.dumps(json.dumps(state))+')')
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.goto(base+'/'+locale+'/career');page.wait_for_load_state('networkidle');page.locator('.retirement-timeline>summary').click();panels=page.locator('.career-timeline .season-competitions');expect(panels).to_have_count(22)
  for i,panel in enumerate(panels.all()):
   assert panel.get_attribute('open') is None;summary=panel.locator('summary');summary.focus();page.keyboard.press('Enter');expect(panel).to_have_attribute('open','')
   season=state['history'][i];comp=season['competitions'];n=comp['national'];own=[m for m in comp['cup']['fixtures'] if season['clubId'] in [m['home'],m['away']]]+[m for m in n['fixtures'] if country in [m['home'],m['away']]]
   expect(panel).to_contain_text(text(country,locale));expect(panel.locator('.competition-fixtures li')).to_have_count(len(own))
   contribution='Player contribution: {goals} goals · {assists} assists · {clean} clean sheets'
   expected=[text(contribution,locale).replace('{goals}',str(m['goals'])).replace('{assists}',str(m['assists'])).replace('{clean}',str(m['cleanSheets'])) for m in own if m['played']]
   assert panel.locator('.match-contribution').all_text_contents()==expected
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(country,locale,i)
   if i==3 and index in [0,5,10]:panel.scroll_into_view_if_needed();page.screenshot(path=str(artifacts/f'retired-{country}-{locale}.png'))
   summary.focus();page.keyboard.press('Enter');assert panel.get_attribute('open') is None;count+=1
  assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==state
  with page.expect_download() as dl:page.locator('.download-record').click()
  dl.value.save_as(str(artifacts/f'{country}.json'));record=json.loads((artifacts/f'{country}.json').read_text());assert record['career']==state
  assert record['records']['competitions']['national']['appearances']==sum(s['competitions']['national']['appearances'] for s in state['history'])
  print('PASS',country,locale,'22 retired season details, match contribution, keyboard, narrow/desktop layout, unchanged save/export',flush=True);c.close()
 assert not errors,errors
 b.close();print('PASS',count,'retired season panels across 16 actual careers and six languages; no console errors',flush=True)
