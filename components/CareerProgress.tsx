'use client'
import type {GameState} from '@/lib/game/types'
import {pendingThread} from '@/lib/game/threads'
import {achievements,stageGoal,goalLabels,nextMilestones} from '@/lib/game/achievements'
import {useLanguage} from './LanguageProvider'
import {localize} from '@/lib/i18n/render'
import {t} from '@/lib/i18n/translate'
export function CareerProgress({state}:{state:GameState}) {
 const locale=useLanguage(),goal=stageGoal(state),earned=achievements(state),latest=state.history.at(-1),unlocked=earned.filter(a=>a.season.number===latest?.number),milestones=nextMilestones(state)
 return localize(<section className="panel career-progress" aria-label="Career goals"><div className="goal-current"><h3>Your next season target</h3><p>{goalLabels[goal.id]}</p><small>Targets recognise progress; they do not change your legacy score.</small></div>{unlocked.length>0&&<div className="new-achievements" role="status"><strong>Achievement unlocked</strong><ul>{unlocked.map(a=><li key={a.id}>{a.label}</li>)}</ul></div>}<details className="progress-details"><summary>Career milestones & progress</summary><div className="milestone-progress">{milestones.map(m=><label key={m.metric}><span>{m.label}</span><b translate="no">{m.actual}/{m.target}</b><progress max={m.target} value={Math.min(m.actual,m.target)} aria-label={t(m.label,locale)}/></label>)}</div>{earned.length>0&&<ul className="achievement-list">{earned.map(a=><li key={a.id}><strong>{a.label}</strong><small translate="no">{t('Season {n}',locale,{n:a.season.number})}</small></li>)}</ul>}</details></section>,locale)
}
export function AchievementRecord({state}:{state:GameState}) {
 const locale=useLanguage(),earned=achievements(state),pending=pendingThread(state)
 return localize(<section className="panel achievement-record"><p className="eyebrow">PERSONAL HONOURS</p><h2>Your personal achievements</h2>{earned.length?<ul className="achievement-list">{earned.map(a=><li key={a.id}><strong>{a.label}</strong><small translate="no">{t('Season {n}',locale,{n:a.season.number})}</small></li>)}</ul>:<p>Career milestones begin with your first 100 appearances or a personal contribution target.</p>}{pending&&<p className="field-help">Career ended before the pending story follow-up.</p>}<p className="field-help">Achievements use your actual career record and are awarded once per milestone.</p></section>,locale)
}
