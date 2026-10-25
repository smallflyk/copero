"""Live UI acceptance: real creation and decisions; never inject or edit saves."""
import json,os,re,time
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','https://copero.pro').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-game-acceptance'));artifacts.mkdir(parents=True,exist_ok=True)
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
positions=['ST','LW','RW','CAM','CM','CDM','LB','RB','CB','GK']
report={'origin':base,'careers':[],'branches':{'bigger':0,'minutes':0,'full':0,'early':0,'ask':0,'position':0},'errors':[]}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-proxy-server','--disable-quic','--disable-http2'] if os.environ.get('COPERO_BROWSER_DIRECT')=='1' else [],**({'executable_path':exe} if exe else {}))
 def new_player(position,seed,academy,mobile=False):
  context=b.new_context(reduced_motion='reduce',viewport={'width':390 if mobile else 1440,'height':844 if mobile else 1000},is_mobile=mobile,has_touch=mobile)
  context.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda route:route.fulfill(status=200,body=''))
  page=context.new_page();page.set_default_timeout(12000)
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.on('console',lambda msg:report['errors'].append(msg.text) if msg.type=='error' else None)
  page.goto(base+'/en');page.wait_for_load_state('networkidle')
  page.get_by_label('Player name',exact=True).fill('Acceptance '+position)
  page.get_by_role('button',name=position,exact=True).click()
  page.locator('.attribute-editor summary').click();page.get_by_label('Career seed',exact=True).fill(seed)
  page.get_by_role('button',name='Find my first club',exact=False).click()
  expect(page.locator('.academy-option')).to_have_count(3);page.locator('.academy-option').nth(academy).click()
  page.get_by_role('button',name='Sign my first contract',exact=False).click();page.wait_for_url('**/en/career')
  expect(page.locator('h1')).to_have_text('Acceptance '+position)
  return context,page
 def saved(page):return page.evaluate("JSON.parse(localStorage.getItem('copero.career.v1'))")
 def advance(page,n):
  expect(page.locator('.next-season')).to_be_disabled()
  page.locator('.story-option').nth((n-1)%3).click()
  expect(page.locator('#story-effects')).to_be_visible()
  page.locator('.next-season').click();page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=n)
  page.wait_for_function('!document.querySelector(".next-season") || document.querySelector(".next-season").textContent.includes("Play season")')
 for index,position in enumerate(positions):
  start=time.monotonic();mobile=index>=5
  context,page=new_player(position,'acceptance-'+position,index%3,mobile)
  initial=saved(page);assert initial['player']['age']==16 and initial['player']['position']==position
  assert page.locator('select').filter(has=page.locator('option[value=full]')).count()==0
  assert page.locator('select').filter(has=page.locator('option[value=stay]')).locator('option').count()==1
  for season in range(1,23):
   state=saved(page)
   training='recovery' if state['player']['fitness']<50 else 'intensive'
   page.locator('.decision-card').nth({'intensive':0,'balanced':1,'recovery':2}[training]).click()
   if season==1 and position!='GK':
    relationship='position' if index%2 else 'ask';page.locator('select').filter(has=page.locator('option[value=follow]')).select_option(relationship);report['branches'][relationship]+=1
   transfer=page.locator('select').filter(has=page.locator('option[value=stay]'))
   if transfer.count():
    values=transfer.locator('option').evaluate_all('(items)=>items.map(e=>e.value)')
    choice='minutes' if index%2 and season%3==0 and 'minutes' in values else 'bigger' if 'bigger' in values else 'stay'
    transfer.select_option(choice)
    if choice!='stay':report['branches'][choice]+=1
   recovery=page.locator('select').filter(has=page.locator('option[value=full]'))
   assert bool(recovery.count())==(state['player']['injuryStatus']!='healthy')
   if recovery.count():
    choice='early' if index%2 else 'full';recovery.select_option(choice);report['branches'][choice]+=1
   advance(page,season)
   current=saved(page);latest=current['history'][-1]
   assert latest['review']['story']['choiceId']==latest['decision']['story']
   assert len(current['history'])==season and current['player']['age']==16+season
   assert 0<=latest['appearances']<=44 and 0<=latest['goals']<=50
   assert all(1<=value<=99 for value in current['player']['attributes'].values())
   if season==5:
    page.reload();page.wait_for_load_state('networkidle');assert saved(page)==current
    if position in ['ST','CDM']:page.screenshot(path=str(artifacts/f'career-{position}.png'),full_page=True)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(position,season)
  expect(page.locator('.result-card')).to_be_visible();final=saved(page)
  assert final['status']=='retired' and final['player']['age']==38
  counts=[sum(s[key] for s in final['history']) for key in ['appearances','goals','assists','trophies']]
  visible=[int(s.replace(',','')) for s in page.locator('.result-stats strong').all_text_contents()]
  assert visible[:4]==counts,(position,visible,counts)
  score=int(page.locator('.legacy-score strong').inner_text().split('/')[0]);assert 0<=score<=100
  assert page.locator('.score-row').count()==5
  assert page.locator('.career-timeline>ol>li').count()==23
  if position=='GK':assert visible[1]==0 and visible[5]>0
  if position=='ST':
   with page.expect_download() as dl:page.locator('.download-record').click()
   dl.value.save_as(str(artifacts/'career-record.json'))
   exported=json.loads((artifacts/'career-record.json').read_text());assert exported['career']==final
   assert exported['records']['earnings']==sum(s['salary']+s['review']['bonus'] for s in final['history'])
  if position in ['ST','GK']:page.screenshot(path=str(artifacts/f'result-{position}.png'),full_page=True)
  elapsed=round(time.monotonic()-start,1)
  report['careers'].append({'initialPosition':position,'mobile':mobile,'automatedSeconds':elapsed,'initial':initial,'final':final,'visibleScore':score})
  print('PASS',position,'22 seasons, score',score,'mobile' if mobile else 'desktop',flush=True);context.close()
 # Compare training and deterministic replay through real form submissions.
 probes=[]
 for training in ['balanced','intensive','recovery','balanced']:
  context,page=new_player('ST','acceptance-compare',0)
  page.locator('.decision-card').nth({'intensive':0,'balanced':1,'recovery':2}[training]).click();advance(page,1)
  probes.append(saved(page));context.close()
 assert probes[0]==probes[3],'same seed/setup/decisions must reproduce exact UI save'
 assert probes[1]['player']['fitness']<probes[2]['player']['fitness']
 assert probes[1]['player']['attributes']!=probes[2]['player']['attributes']
 report['decisionComparison']={name:state['player'] for name,state in zip(['balanced','intensive','recovery'],probes)}
 assert all(report['branches'][key]>0 for key in ['bigger','minutes','full','early','ask','position']),report['branches']
 assert not report['errors'],report['errors']
 (artifacts/'acceptance.json').write_text(json.dumps(report,indent=2))
 print('PASS: 10 positions, 220 actual UI seasons, all conditional decision branches, mobile careers, refreshes, totals, deterministic replay and real training differences; no console errors',flush=True)
 b.close()
