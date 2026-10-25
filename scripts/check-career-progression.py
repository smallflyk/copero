"""Isolated six-language UI checks for rules 1.3 boundaries and saved story follow-ups."""
import json,os,re,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
root=Path(__file__).resolve().parent.parent
base=os.environ.get('COPERO_BASE_URL','http://127.0.0.1:3100').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-career-progression'));artifacts.mkdir(parents=True,exist_ok=True)
messages=json.loads((root/'lib/i18n/messages.json').read_text());old=json.loads((root/'tests/fixtures/contextual-v12-save.json').read_text())['state']
# Valid setup data for an edge branch; never touches a real user's save.
pending=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {sourceModule} from './scripts/source-module.mjs';const {createCareer,nextSeason,defaultDecision}=sourceModule('lib/game/engine.ts');const {decodeSave}=sourceModule('lib/game/storage.ts');let s=createCareer({name:'Recovery QA',nationality:'England',position:'ST',preferredFoot:'Right',jerseyNumber:10,bonuses:{pace:0,shooting:0,passing:0,dribbling:0,defending:0,physical:0},seed:'recovery-qa',clubId:'harbor'});s.player.injuryStatus='minor';s=nextSeason(s,{...defaultDecision(s),rules:'1.3',storyEvent:'rehab',story:'protect'});decodeSave(JSON.stringify(s));console.log(JSON.stringify(s))"],cwd=root,text=True))
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE');errors=[];measurements=[]
def text(key,locale):return key if locale=='en' else messages[key][locale]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,**({'executable_path':exe} if exe else {}))
 def setup(locale,save):
  c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce')
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  c.add_init_script('if(!localStorage.getItem("copero.career.v1"))localStorage.setItem("copero.career.v1",'+json.dumps(json.dumps(save))+')')
  page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.goto(base+'/'+locale+'/career');page.wait_for_load_state('networkidle');expect(page.locator('.career-page')).to_be_visible();return c,page
 for locale in ['es','en','it','pt','zh','de']:
  for scenario,save in [('limits',old),('followup',pending)]:
   c,page=setup(locale,save);expect(page.locator('.career-progress')).to_contain_text(text('Your next season target',locale))
   expect(page.locator('.next-season')).to_be_disabled()
   if scenario=='limits':
    specialist=page.locator('.story-option').filter(has_text=text('Work on your strongest skill',locale));expect(specialist).to_be_disabled();expect(specialist).to_contain_text(text('No usable benefit with your current limits. Choose another option.',locale))
   else:
    expect(page.locator('.chain-origin')).to_contain_text('Harbor Athletic');expect(page.locator('#story-decision')).to_contain_text(text('Your previous decision is ready for a follow-up.',locale))
   page.locator('.story-option:not(:disabled)').first.click();page.locator('.next-season').click();page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=len(save['history'])+1)
   after=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))');latest=after['history'][-1];assert after['history'][:-1]==save['history'];assert latest['decision']['rules']=='1.4';assert latest['review']['goal']
   if scenario=='followup':assert latest['review']['thread']['origin']==1 and latest['review']['thread']['status'] in ['fulfilled','missed'];assert page.locator('.chain-origin').count()==0
   review=page.locator('.latest-season .season-feedback');review.locator('summary').first.click()
   full=review.locator('.full-attribution');assert full.get_attribute('open') is None;assert review.locator('.key-changes li').count()<=3
   compact=review.bounding_box()['height'];full.locator('summary').click();expect(full.locator('.change-breakdown')).to_be_visible();expanded=review.bounding_box()['height'];assert compact<expanded*.8
   measurements.append({'locale':locale,'scenario':scenario,'compact':round(compact),'full':round(expanded)})
   full.locator('summary').click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   if locale=='es' and scenario=='limits':review.scroll_into_view_if_needed();page.screenshot(path=str(artifacts/'compact-review-es.png'))
   page.reload();page.wait_for_load_state('networkidle');assert page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')==after
   if scenario=='limits':
    page.locator('.progress-details>summary').click();labels=page.locator('.career-progress .achievement-list strong').all_text_contents();assert len(labels)>=4 and len(labels)==len(set(labels))
    page.locator('.career-report>summary').click();page.on('dialog',lambda d:d.accept());page.get_by_role('button',name=text('Retire and see my legacy',locale),exact=True).click();expect(page.locator('.achievement-record')).to_be_visible()
    assert page.locator('.achievement-record li').count()==len(labels)
    for metric,threshold,key in [('appearances',300,'300 career appearances'),('goals',200,'200 career goals')]:
     if sum(s[metric] for s in after['history'])>=threshold:expect(page.locator('.achievement-record')).to_contain_text(text(key,locale))
   print('PASS',locale,scenario,'disabled costs / remembered follow-up, targets, compact detail, milestones, reload',flush=True);c.close()
 # All-capped edge: exactly one free choice remains usable and its story step charges nothing.
 capped=json.loads(json.dumps(old));capped['player'].update(fitness=99,morale=99,coachTrust=99,potential=99);capped['player']['attributes']={k:99 for k in capped['player']['attributes']}
 c,page=setup('en',capped);available=page.locator('.story-option:not(:disabled)');expect(available).to_have_count(1);expect(available).to_have_text('Keep your current routine');available.click();page.locator('.next-season').click();page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=len(capped['history'])+1)
 latest=page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1")).history.at(-1)');assert latest['review']['changes'][1]['before']==latest['review']['changes'][1]['after'];c.close()
 # Retiring with an unresolved next-season plan must not claim it was fulfilled.
 c,page=setup('en',pending);page.locator('.career-report>summary').click();page.on('dialog',lambda d:d.accept());page.get_by_role('button',name='Retire and see my legacy',exact=True).click();expect(page.locator('.achievement-record')).to_contain_text('Career ended before the pending story follow-up.');c.close()
 assert not errors,errors
 (artifacts/'measurements.json').write_text(json.dumps(measurements,indent=2));print('PASS: 6 languages × 2 progression scenarios, free continuation, unfinished early-retirement plan; no console errors',flush=True);b.close()
