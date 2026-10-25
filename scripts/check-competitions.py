"""Isolated rules 1.4 browser acceptance: real controls, call-ups, records and downloads."""
import json,os,re,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parent.parent
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-competitions-browser'));artifacts.mkdir(parents=True,exist_ok=True)
messages=json.loads((root/'lib/i18n/messages.json').read_text())
# Build a valid, deterministic high-ability QA career with three real simulated seasons.
# Context-local storage is isolated from every existing player.
fixture=json.loads(subprocess.check_output(['node','--input-type=module','-e',"""
import {sourceModule} from './scripts/source-module.mjs';
const {createCareer,nextSeason,competitionDecision}=sourceModule('lib/game/engine.ts');
const {seasonStory}=sourceModule('lib/game/stories.ts');
const {decodeSave}=sourceModule('lib/game/storage.ts');
function play(s){let d={...competitionDecision(s),training:'recovery',cupPlan:'rotate'},e=seasonStory(s,d.transfer,d);return nextSeason(s,{...d,storyEvent:e.id,story:e.choices.find(c=>!c.unavailableReason).id})}
for(let i=0;i<1000;i++){
 let s=createCareer({name:'Competition QA',nationality:'Nigeria',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{pace:0,shooting:0,passing:0,dribbling:0,defending:0,physical:0},seed:'cup-browser-'+i,clubId:'harbor'});
 s.player.attributes=Object.fromEntries(Object.keys(s.player.attributes).map(k=>[k,78]));s.player.potential=99;
 for(let j=0;j<3;j++)s=play(s);
 let next=play(s).history.at(-1).competitions.national;
 if(next.status==='called'&&next.appearances>0){decodeSave(JSON.stringify(s));console.log(JSON.stringify(s));break}
}
"""],cwd=root,text=True))
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE');errors=[];results=[]
def tr(key,locale):return key if locale=='en' else messages[key][locale]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,**({'executable_path':exe} if exe else {}))
 for locale in ['es','en','it','pt','zh','de']:
  for plan in ['accept','rest']:
   c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce',accept_downloads=True)
   c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
   c.add_init_script('if(!localStorage.getItem("copero.career.v1"))localStorage.setItem("copero.career.v1",'+json.dumps(json.dumps(fixture))+')')
   page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
   page.goto(base+'/'+locale+'/career');page.wait_for_load_state('networkidle')
   expect(page.locator('.competition-plans legend')).to_have_text(tr('Cup & national team plans',locale))
   page.locator('.competition-plans select').nth(0).select_option('rotate')
   page.locator('.competition-plans select').nth(1).select_option(plan)
   page.locator('.decision-card').nth(2).click()
   page.locator('.story-option:not(:disabled)').first.click();page.locator('.next-season').click()
   page.wait_for_function('JSON.parse(localStorage.getItem("copero.career.v1")).history.length===4')
   saved=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))');latest=saved['history'][-1];comp=latest['competitions'];n=comp['national']
   assert latest['decision']['rules']=='1.4' and len(latest['review']['changes'])==10
   assert comp['league']['appearances']+comp['cup']['appearances']==latest['appearances']
   assert n['country']=='Nigeria' and n['kind']=='global'
   if plan=='accept':assert n['status']=='called' and len(n['fixtures'])==31 and n['appearances']>0 and n['fatigue']==n['appearances']*2
   else:assert n['status']=='declined' and n['appearances']==0 and n['fixtures']==[] and n['fatigue']==0
   panel=page.locator('.latest-season .season-competitions');panel.locator('summary').click()
   expect(panel.locator('h3').first).to_have_text(tr('Domestic Cup',locale));expect(panel).to_contain_text(tr('Global Nations Cup',locale));expect(panel).to_contain_text(tr('Selected for national duty' if plan=='accept' else 'You declined this call-up to protect your club fitness.',locale))
   assert panel.locator('.competition-fixtures li').count()>=1
   expect(panel.locator('.match-contribution')).to_have_count(comp['cup']['appearances']+n['appearances'])
   contribution='Player contribution: {goals} goals · {assists} assists · {clean} clean sheets'
   contributions=[m for m in comp['cup']['fixtures']+n['fixtures'] if m['played']]
   expected=[tr(contribution,locale).replace('{goals}',str(m['goals'])).replace('{assists}',str(m['assists'])).replace('{clean}',str(m['cleanSheets'])) for m in contributions]
   assert panel.locator('.match-contribution').all_text_contents()==expected
   if locale!='en':
    assert 'International workload' not in panel.inner_text() and 'Quarter-finals' not in panel.inner_text() and 'Not used in this match' not in panel.inner_text()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   panel.scroll_into_view_if_needed()
   if locale=='es' and plan=='accept':page.screenshot(path=str(artifacts/'season-cup-national-es.png'),full_page=True)
   page.reload();page.wait_for_load_state('networkidle');assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==saved
   page.locator('.career-report>summary').click();page.on('dialog',lambda d:d.accept());page.get_by_role('button',name=tr('Retire and see my legacy',locale),exact=True).click()
   expect(page.locator('.competition-record')).to_be_visible()
   retired=page.locator('.career-timeline .season-competitions');expect(retired).to_have_count(4);assert retired.last.get_attribute('open') is None;retired.last.locator('summary').focus();page.keyboard.press('Enter')
   expect(retired.last).to_contain_text(tr('Global Nations Cup',locale));expect(retired.last.locator('.match-contribution')).to_have_count(comp['cup']['appearances']+n['appearances']);assert retired.last.locator('.match-contribution').all_text_contents()==expected
   page.locator('.competition-record details>summary').click()
   rows=page.locator('.competition-record tbody tr');expect(rows).to_have_count(4)
   assert rows.last.locator('td').nth(4).inner_text()==str(n['appearances'])
   totals=page.locator('.competition-totals dd').all_text_contents();assert len(totals)==11;assert int(totals[8])==sum(s['competitions']['cup']['goals'] for s in saved['history']);caps=sum(s['competitions']['national']['appearances'] for s in saved['history']);assert int(totals[3])==caps
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   with page.expect_download() as dl:page.locator('.download-record').click()
   path=artifacts/f'{locale}-{plan}.json';dl.value.save_as(str(path));record=json.loads(path.read_text());assert record['records']['competitions']['national']['appearances']==caps
   with page.expect_download() as dl:page.locator('.result-page .button').first.click()
   assert dl.value.suggested_filename.endswith('.png')
   if locale=='es' and plan=='accept':dl.value.save_as(str(artifacts/'retired-competitions-es.png'));page.screenshot(path=str(artifacts/'retirement-es.png'),full_page=True)
   page.reload();page.wait_for_load_state('networkidle');expect(page.locator('.competition-record')).to_be_visible()
   results.append({'locale':locale,'plan':plan,'caps':n['appearances'],'fitness':latest['fitness'],'clubApps':latest['appearances']});print('PASS',locale,plan,'global call-up, separated totals, retirement, JSON/PNG, mobile and reload',flush=True);c.close()
 for locale in ['es','en','it','pt','zh','de']:
  accepted=next(r for r in results if r['locale']==locale and r['plan']=='accept');rested=next(r for r in results if r['locale']==locale and r['plan']=='rest');assert accepted['fitness']<rested['fitness'] and accepted['clubApps']==rested['clubApps']
 assert not errors,errors
 (artifacts/'results.json').write_text(json.dumps(results,indent=2));b.close()
 print('PASS: six languages × accept/decline; real international fatigue, global knockout results and retired records; no console errors',flush=True)
