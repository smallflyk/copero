import {hasStoryBenefit,hasStoryCost} from './effects'
import {threadOutcome} from './threads'
import {getClub} from '../../data/clubs'
import {WEIGHTS} from './rules'
import {ATTRIBUTE_KEYS,type GameState,type StoryEvent,type StoryChoice,type Transfer,type Decision} from './types'

// No random roll: the shown effects are applied exactly, then the normal season runs.
function baseStories(state:GameState):StoryEvent[] {
 const primary=[...ATTRIBUTE_KEYS].sort((a,b)=>WEIGHTS[state.player.position][b]-WEIGHTS[state.player.position][a])[0]
 const events:StoryEvent[]=[
  {id:'extra-session',title:'The last player on the training ground',description:'The coach offers an extra specialist session. Your body still has to get through a full season.',choices:[
   {id:'specialist',label:'Work on your strongest skill',detail:'Improve your key attribute now, but start the season with less energy.',effect:{attribute:primary,points:2,fitness:-12,coachTrust:2}},
   {id:'analysis',label:'Study the next opponent',detail:'Build trust and passing without the specialist attribute boost.',effect:{attribute:'passing',points:1,coachTrust:7,fitness:-3}},
   {id:'rest',label:'Take the recovery day',detail:'Restore energy and morale, but miss a chance to impress the coach.',effect:{fitness:12,morale:4,coachTrust:-4}},
  ]},
  {id:'selection',title:'A place in the starting eleven',description:'The manager asks how you want to earn your next opportunity. More minutes and more preparation are different bets.',choices:[
   {id:'minutes',label:'Ask for the extra match load',detail:'Increase selection opportunity this season at a cost to fitness and trust.',effect:{role:.12,fitness:-10,coachTrust:-6}},
   {id:'practice',label:'Develop away from the spotlight',detail:'More development this season, but fewer selection opportunities.',effect:{growth:1.25,role:-.08,coachTrust:4}},
   {id:'support',label:'Help the squad and stay ready',detail:'Rebuild fitness and morale while accepting a smaller role this season.',effect:{fitness:8,morale:8,role:-.1}},
  ]},
  {id:'sponsor',title:'An invitation on your day off',description:'A local sponsor offers a paid appearance. Your teammates are preparing for the next round of fixtures.',choices:[
   {id:'appearance',label:'Accept the sponsor appearance',detail:'Earn a one-off bonus, but sacrifice preparation time and coach trust.',effect:{bonus:Math.round((state.player.contract?.salary??getClub(state.player.clubId).salary)/4),morale:6,fitness:-5,coachTrust:-8}},
   {id:'training',label:'Stay for specialist training',detail:'Improve your key attribute instead of taking the bonus. The work costs energy.',effect:{attribute:primary,points:2,fitness:-8}},
   {id:'team',label:'Organise a team session',detail:'Build trust and morale at the cost of energy, without the personal bonus.',effect:{coachTrust:8,morale:6,fitness:-6}},
  ]},
  {id:'mentor',title:'The academy asks for your time',description:'A young teammate wants your help. You can mentor them, focus on yourself, or protect your recovery time.',choices:[
   {id:'mentor',label:'Make time for the young player',detail:'Strengthen trust and morale, with less time for your own development this season.',effect:{coachTrust:9,morale:7,growth:.8}},
   {id:'focus',label:'Protect your individual programme',detail:'Accelerate development this season, but spend energy and lose some coach trust.',effect:{growth:1.25,fitness:-10,coachTrust:-4}},
   {id:'recover',label:'Protect your recovery time',detail:'Restore fitness, but miss the shared work and lose a little morale.',effect:{fitness:14,morale:-3,coachTrust:-2}},
  ]},
 ]
 return events
}
// Kept only for replaying decisions recorded by rules 1.1.
export function legacySeasonStory(state:GameState):StoryEvent {return baseStories(state)[state.history.length%4]}
function contextCatalog(state:GameState):StoryEvent[] {
 const base=baseStories(state),primary=[...ATTRIBUTE_KEYS].sort((a,b)=>WEIGHTS[state.player.position][b]-WEIGHTS[state.player.position][a])[0]
 const choice=(id:string,label:string,detail:string,effect:StoryChoice['effect']):StoryChoice=>({id,label,detail,effect})
 return [...base,
  {id:'new-club',title:'A new shirt, a new dressing room',description:'A club move means a fresh relationship with the coach. Decide how to settle into the squad.',choices:[
   choice('adapt','Earn trust before asking for a bigger role','Build trust and morale, accepting fewer selection opportunities this season.',{coachTrust:12,morale:5,role:-.06}),
   base[0].choices[0],base[2].choices[2],
  ]},
  {id:'rehab',title:'The next step in your recovery',description:'You enter this season injured. Choose how to use your recovery time alongside your rehabilitation plan.',choices:[
   choice('protect','Protect the rehabilitation routine','Restore fitness but accept a smaller role while you recover.',{fitness:14,morale:-3,coachTrust:1,role:-.05}),
   choice('footage','Review match footage','Work on passing and coach trust with a small energy cost.',{attribute:'passing',points:1,coachTrust:6,fitness:-3}),
   choice('light','Stay involved with the squad','Gain morale and trust, spending energy to keep a place in the group.',{fitness:-6,morale:7,coachTrust:5,role:.04}),
  ]},
  {id:'fatigue',title:'Your legs need a different plan',description:'Your fitness is low. Extra preparation competes with the need to recover before the next season.',choices:[base[0].choices[2],base[0].choices[1],base[2].choices[2]]},
  {id:'breakthrough',title:'Too much time on the bench',description:'You played fewer than twenty-two matches last season. Choose between asking for a role and rebuilding your position in the squad.',choices:[base[1].choices[0],base[1].choices[1],base[0].choices[1]]},
  {id:'honours',title:'What comes after a trophy?',description:'Last season brought a team trophy. The squad must balance another push for success with recovery.',choices:[
   choice('lead','Set the standard for the next campaign','Build trust and morale at a physical cost.',{coachTrust:7,morale:5,fitness:-8}),
   choice('repeat','Push for a bigger role in the title defence','Gain selection opportunity while spending fitness and coach trust.',{role:.08,fitness:-10,coachTrust:-3}),
   base[0].choices[2],
  ]},
  {id:'veteran',title:'Experience changes your role',description:'You are in the later years of your career. Match preparation and recovery matter more than chasing a youth development plan.',choices:[
   choice('manage','Manage your match load','Recover fitness while accepting fewer selection opportunities.',{fitness:14,role:-.08}),
   choice('leader','Lead the squad through experience','Build trust and morale, leaving a little more room for teammates.',{coachTrust:8,morale:5,role:-.04}),
   choice('compete','Compete for every available match','Protect your playing role at a cost to fitness and coach trust.',{role:.08,fitness:-12,coachTrust:-4}),
  ]},
  {id:'renewal',title:'A contract year needs a plan',description:'Your previous contract has expired. Choose what to prioritise as you consider this season’s club offer.',choices:[
   choice('stability','Show the coach you want continuity','Gain trust and morale, with less selection opportunity this season.',{coachTrust:10,morale:4,role:-.05}),
   choice('prove','Make your case on the pitch','Increase selection opportunity with a physical cost.',{role:.08,fitness:-8}),
   base[0].choices[1],
  ]},
  {id:'tactical-focus',title:'A different way to read the game',description:'The coaching staff offer time to study team patterns. You can prepare through analysis, specialist work or recovery.',choices:[
   choice('patterns','Practise the team’s passing patterns','Improve passing and coach trust, spending energy.',{attribute:'passing',points:1,coachTrust:4,fitness:-5}),
   base[0].choices[0],base[0].choices[2],
  ]},
  {id:'team-bond',title:'A place in the dressing room',description:'A teammate asks you to help the group prepare. Balance time with the squad against your own programme.',choices:[
   choice('listen','Make time to listen to your teammates','Build morale and trust, accepting fewer selection opportunities.',{morale:8,coachTrust:5,role:-.04}),
   base[2].choices[2],choice('individual','Focus on your positional skills','Improve your key attribute, with a cost to fitness and morale.',{attribute:primary,points:1,fitness:-6,morale:-3}),
  ]},
  {id:'setback',title:'Responding to a difficult season',description:'Your rating fell last season. Decide whether to protect recovery, rebuild confidence or focus on your positional skills.',choices:[base[0].choices[2],base[0].choices[1],base[0].choices[0]]},
 ]
}
function stableRank(state:GameState,id:string) {let n=state.history.length+1;for(const char of state.seed+id)n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0}
export function legacyContextStory(state:GameState,transfer:Transfer='stay'):StoryEvent {
 const last=state.history.at(-1),p=state.player,recent=new Set(state.history.slice(-4).map(s=>s.review?.story?.eventId))
 const priorities:Record<string,[number,string]>={
  rehab:[p.injuryStatus!=='healthy'?120:0,'You start the season injured.'],
  fatigue:[p.fitness<=45?110:0,'Your fitness is low.'],
  'new-club':[transfer!=='stay'?100:0,'You selected a club move.'],
  honours:[last?.trophies?95:0,'You won a team trophy last season.'],
  breakthrough:[last&&last.appearances<22?90:0,'You had limited match time last season.'],
  setback:[last&&last.endOvr<last.ovr?85:0,'Your rating fell last season.'],
  veteran:[p.age>=32?80:0,'You are in the later years of your career.'],
  renewal:[p.contract?.yearsLeft===0?75:0,'Your previous contract has expired.'],
 }
 const candidates=contextCatalog(state).filter(e=>!recent.has(e.id)&&(!(e.id in priorities)||priorities[e.id][0]>0))
 // Six general stories keep a four-season cooldown possible even without a special trigger.
 if(!state.history.length&&p.injuryStatus==='healthy'&&p.fitness>45)return {...candidates.find(e=>e.id==='extra-session')!,reason:'Your first senior season.'}
 candidates.sort((a,b)=>(priorities[b.id]?.[0]??10)-(priorities[a.id]?.[0]??10)||stableRank(state,b.id)-stableRank(state,a.id))
 const event=candidates[0]
 return {...event,reason:priorities[event.id]?.[1]??'A fresh situation after the recent-story cooldown.'}
}

function followUpCatalog(state:GameState):StoryEvent[] {
 const base=baseStories(state)
 const variants:[string,string,string,StoryChoice][]=[
  ['minutes-fulfilled','You earned a bigger role','You reached the 22-match target at the club. Choose how to build on that progress.',{id:'build',label:'Build on the progress',detail:'More selection opportunity costs energy this season.',effect:{role:.08,fitness:-6}}],
  ['minutes-missed','The promised breakthrough needs another plan','You did not reach the 22-match target. Decide how to rebuild your place at the club.',{id:'rebuild',label:'Rebuild trust before asking again',detail:'Build trust and morale while accepting a smaller role.',effect:{coachTrust:10,morale:4,role:-.04}}],
  ['minutes-left','A new club ends the old playing-time plan','You selected a move away from the club where you set the match target. Your next role starts with a new coach.',{id:'settle',label:'Earn your new coach’s trust',detail:'Build trust at a small physical cost.',effect:{coachTrust:12,fitness:-4}}],
  ['recovery-fulfilled','Your recovery plan paid off','You returned healthy with at least 60 fitness. Decide how to protect that progress.',{id:'measured',label:'Return with a measured workload',detail:'Protect fitness while accepting fewer selection opportunities.',effect:{fitness:8,role:-.04}}],
  ['recovery-missed','Recovery needs another chapter','You have not yet returned healthy with 60 fitness. Choose your response alongside this season’s rehabilitation plan.',{id:'block',label:'Commit to another recovery block',detail:'Prioritise fitness over morale and selection this season.',effect:{fitness:16,morale:-4,role:-.08}}],
  ['loyalty-fulfilled','Staying becomes a new chapter','You chose to stay after committing to continuity. Decide how to use the relationship you kept.',{id:'responsibility',label:'Take responsibility for the squad',detail:'Build trust and selection opportunity at a physical cost.',effect:{coachTrust:6,role:.04,fitness:-6}}],
  ['loyalty-left','A departure changes your continuity plan','You selected a move after committing to continuity. That chapter closes and a new coach relationship begins.',{id:'settle',label:'Earn your new coach’s trust',detail:'Build trust at a small physical cost.',effect:{coachTrust:12,fitness:-4}}],
 ]
 return variants.map(([id,title,description,first])=>({id:`followup-${id}`,title,description,choices:[first,base[0].choices[1],base[0].choices[2]]}))
}
export function storyCatalog(state:GameState):StoryEvent[] {return [...contextCatalog(state),...followUpCatalog(state)]}
export function seasonStory(state:GameState,transfer:Transfer='stay',decision?:Decision):StoryEvent {
 const d=decision??{training:'balanced',relationship:'follow',transfer},outcome=threadOutcome(state,d)
 const event=outcome?followUpCatalog(state).find(e=>e.id===`followup-${outcome.kind}-${outcome.status}`)!:legacyContextStory(state,transfer)
 const choices=event.choices.map(choice=>hasStoryCost(choice.effect)&&!hasStoryBenefit(state,d,choice.effect)?{...choice,unavailableReason:'No usable benefit with your current limits. Choose another option.'}:choice)
 if(choices.every(c=>c.unavailableReason))choices.push({id:'hold',label:'Keep your current routine',detail:'There is no useful extra gain available. Continue without an extra story cost.',effect:{}})
 return {...event,reason:outcome?'Your previous decision is ready for a follow-up.':event.reason==='A fresh situation after the recent-story cooldown.'?'A new week of preparation with your squad.':event.reason,choices}
}
export function storyChoice(state:GameState,id?:string,eventId?:string,transfer:Transfer='stay',decision?:Decision):StoryChoice|undefined {
 if(id===undefined){if(eventId!==undefined||decision?.rules)throw new Error('Choose a valid story decision for this season.');return undefined}
 const modern=decision?.rules==='1.3'
 const event=eventId===undefined?legacySeasonStory(state):modern?seasonStory(state,transfer,decision):legacyContextStory(state,transfer)
 const choice=(eventId===undefined||eventId===event.id)?event.choices.find(item=>item.id===id):undefined
 if(!choice||modern&&choice.unavailableReason)throw new Error('Choose a valid story decision for this season.')
 return choice
}
