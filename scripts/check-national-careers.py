"""Complete real UI careers for all playable nationalities; never inject/edit saves."""
import json,os,re
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
base=os.environ.get('COPERO_BASE_URL','https://copero.pro').rstrip('/')
artifacts=Path(os.environ.get('COPERO_ARTIFACT_DIR','/tmp/copero-national-careers'));artifacts.mkdir(parents=True,exist_ok=True)
exe=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE')
pools={
'Europe':['England','France','Germany','Italy','Netherlands','Portugal','Spain','Belgium'],
'Americas':['Argentina','Brazil','Mexico','United States','Uruguay','Colombia','Chile','Canada'],
'Africa':['Morocco','Nigeria','Senegal','Algeria','Egypt','Ghana','Cameroon','Tunisia'],
'Asia':['Japan','South Korea','Australia','Iran','Saudi Arabia','Qatar','China','Iraq']}
countries=['Argentina','Brazil','England','France','Germany','Italy','Japan','Mexico','Morocco','Netherlands','Nigeria','Portugal','South Korea','Spain','United States','Uruguay']
thresholds=dict(zip(countries,[70,71,72,72,70,69,60,62,62,69,60,70,59,72,61,65]))
report={'origin':base,'careers':[],'issues':[],'errors':[],'nationalReasons':{},'regionalFields':{},'kinds':{}}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,**({'executable_path':exe} if exe else {}))
 for index,country in enumerate(countries):
  c=b.new_context(viewport={'width':390 if index%2 else 1440,'height':844 if index%2 else 1000},is_mobile=bool(index%2),has_touch=bool(index%2),reduced_motion='reduce',accept_downloads=True)
  c.route(re.compile(r'https://(www\.googletagmanager\.com|www\.google-analytics\.com|plausible\.io|pagead2\.googlesyndication\.com)/'),lambda r:r.fulfill(status=200,body=''))
  page=c.new_page();page.set_default_timeout(15000);page.on('pageerror',lambda e:report['errors'].append(str(e)));page.on('console',lambda m:report['errors'].append(m.text) if m.type=='error' else None)
  page.goto(base+'/en');page.wait_for_load_state('networkidle');page.get_by_label('Player name',exact=True).fill('Review '+country)
  page.locator('.country-list').get_by_role('button',name=country,exact=True).click()
  page.locator('.attribute-editor summary').click();page.get_by_label('Career seed',exact=True).fill('nationality-review-v1')
  page.get_by_role('button',name='Find my first club',exact=False).click();page.locator('.academy-option').nth(2).click();page.get_by_role('button',name='Sign my first contract',exact=False).click();page.wait_for_url('**/en/career')
  def saved():return page.evaluate('JSON.parse(localStorage.getItem("copero.career.v1"))')
  initial=saved();assert initial['player']['nationality']==country
  region=next(r for r,teams in pools.items() if country in teams)
  for number in range(1,23):
   before=saved();player=before['player'];caps=sum(s['competitions']['national']['appearances'] for s in before['history']);declines=sum(s['competitions']['national']['status']=='declined' for s in before['history'][-3:]);threshold=thresholds[country]-min(2,caps//20)+declines
   expect(page.locator('.national-preview')).to_contain_text(f'{threshold} OVR')
   page.locator('.decision-card').nth(2 if player['fitness']<72 else 0).click()
   if player['injuryStatus']!='healthy':page.locator('select').filter(has=page.locator('option[value=full]')).select_option('full')
   page.locator('.competition-plans select').nth(0).select_option(['balanced','push','rotate'][number%3]);page.locator('.competition-plans select').nth(1).select_option('rest' if number%5==0 else 'accept')
   page.locator('.story-option:not(:disabled)').first.click();page.locator('.next-season').click();page.wait_for_function('(n)=>JSON.parse(localStorage.getItem("copero.career.v1")).history.length===n',arg=number)
   state=saved();s=state['history'][-1];comp=s['competitions'];n=comp['national'];assert n['country']==country and n['threshold']==threshold
   expected='injury' if n['injury']!='healthy' else 'fitness' if n['fitness']<55 else 'minutes' if n['clubApps']<12 else 'rating' if n['rating']<threshold else 'rest' if number%5==0 else 'selected'
   assert n['reason']==expected;report['nationalReasons'][expected]=report['nationalReasons'].get(expected,0)+1
   for stat in ['appearances','goals','assists','cleanSheets']:assert s[stat]==comp['league'][stat]+comp['cup'][stat]
   assert len(comp['cup']['fixtures'])==7 and comp['cup']['medal']==(comp['cup']['winner']==s['clubId'] and comp['cup']['appearances']>0)
   assert n['kind']==('global' if number%4==0 else 'regional' if number%2==0 else 'friendly')
   if n['status']=='called':
    report['kinds'][n['kind']]=report['kinds'].get(n['kind'],0)+1
    assert len(n['fixtures'])=={'global':31,'regional':7,'friendly':2}[n['kind']]
    if n['kind']=='regional':
     assert all(m['home'] in pools[region] and m['away'] in pools[region] for m in n['fixtures']);report['regionalFields'][region]=report['regionalFields'].get(region,0)+1
    for stat in ['goals','assists','cleanSheets']:assert n[stat]==sum(m[stat] for m in n['fixtures'])
    assert n['appearances']==sum(m['played'] for m in n['fixtures']) and n['fatigue']==n['appearances']*2
    assert n['medal']==(n.get('winner')==country and n['appearances']>0)
   else:assert not n['fixtures'] and n['appearances']==n['goals']==n['assists']==n['cleanSheets']==n['fatigue']==0 and not n['medal']
   if number<22:
    panel=page.locator('.latest-season .season-competitions');panel.locator('summary').click();expect(panel).to_contain_text(country)
    if n['kind']=='regional' and n['status']=='called':
     own=[m for m in n['fixtures'] if country in [m['home'],m['away']]]
     for match in own:expect(panel).to_contain_text(match['away'] if match['home']==country else match['home'])
     if region not in [r.get('screenshotRegion') for r in report['careers']]:panel.scroll_into_view_if_needed();page.screenshot(path=str(artifacts/f'{country}-regional.png'))
   if number==8:page.reload();page.wait_for_load_state('networkidle');assert saved()==state
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  expect(page.locator('.result-card')).to_be_visible();final=saved();assert final['status']=='retired' and len(final['history'])==22
  record=page.locator('.competition-record');record.locator('details>summary').click();rows=record.locator('tbody tr');expect(rows).to_have_count(22)
  totals=record.locator('.competition-totals dd').all_text_contents();assert record.locator('[data-metric=national-team] dd').inner_text()==country
  national=lambda key:sum(s['competitions']['national'][key] for s in final['history'])
  assert [int(record.locator('[data-metric=national-'+key+'] dd').inner_text()) for key in ['caps','goals','assists','clean-sheets']]==[national(key) for key in ['appearances','goals','assists','cleanSheets']]
  assert int(record.locator('[data-metric=cup-medals] dd').inner_text())==sum(s['competitions']['cup']['medal'] for s in final['history']) and int(record.locator('[data-metric=national-titles] dd').inner_text())==sum(s['competitions']['national']['medal'] for s in final['history'])
  for i,row in enumerate(rows.all()):assert int(row.locator('td').nth(4).inner_text())==final['history'][i]['competitions']['national']['appearances']
  # A retired player must still be able to inspect opponents, scorelines and selection checks.
  count=page.locator('.career-timeline .season-competitions').count()
  if count==22:
   page.locator('.retirement-timeline>summary').click()
   details=page.locator('.career-timeline .season-competitions')
   for i,detail in enumerate(details.all()):
    assert detail.get_attribute('open') is None;detail.locator('summary').click();season=final['history'][i];n=season['competitions']['national'];cup=season['competitions']['cup'];expect(detail).to_contain_text(country);assert detail.locator('.competition-fixtures li').count()==sum(country in [m['home'],m['away']] for m in n['fixtures'])+sum(season['clubId'] in [m['home'],m['away']] for m in cup['fixtures']);detail.locator('summary').click()
  if count!=22:report['issues'].append({'country':country,'issue':'Retirement loses access to per-season cup and national fixture/selection details','expected':22,'actual':count})
  with page.expect_download() as dl:page.locator('.download-record').click()
  dl.value.save_as(str(artifacts/f'{country}.json'));exported=json.loads((artifacts/f'{country}.json').read_text());assert exported['career']==final;assert exported['records']['competitions']['national']['appearances']==national('appearances')
  with page.expect_download() as dl:page.locator('.result-page .button').first.click()
  dl.value.save_as(str(artifacts/f'{country}.png'))
  page.reload();page.wait_for_load_state('networkidle');expect(page.locator('.competition-record')).to_be_visible();assert saved()==final
  report['careers'].append({'country':country,'region':region,'screenshotRegion':region,'initial':initial,'final':final,'caps':national('appearances'),'retiredFixturePanels':count})
  (artifacts/'report.json').write_text(json.dumps(report,indent=2));print('PLAYED',country,'22 seasons;',national('appearances'),'caps; retired fixture panels',count,flush=True);c.close()
 assert len(report['regionalFields'])==4 and len(report['kinds'])==3,report
 assert not report['errors'],report['errors']
 b.close()
 print('CALL-UP REASONS',report['nationalReasons'],'REGIONAL FIELDS',report['regionalFields'],'COMPETITIONS',report['kinds'],flush=True)
 assert not report['issues'],report['issues']
 print('PASS: 16 nationalities × 22 real UI seasons, four regional pools, call-up reasons, cup records, retirement details, JSON/PNG and reload; no console errors',flush=True)
