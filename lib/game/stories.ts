import {getClub} from '../../data/clubs'
import {WEIGHTS} from './rules'
import {ATTRIBUTE_KEYS,type GameState,type StoryEvent,type StoryChoice} from './types'

// No random roll: the shown effects are applied exactly, then the normal season runs.
export function seasonStory(state:GameState):StoryEvent {
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
 return events[state.history.length%events.length]
}
export function storyChoice(state:GameState,id?:string):StoryChoice|undefined {
 if(id===undefined)return undefined // Original saves and published controlled comparisons remain replayable.
 const choice=seasonStory(state).choices.find(item=>item.id===id)
 if(!choice)throw new Error('Choose a valid story decision for this season.')
 return choice
}
