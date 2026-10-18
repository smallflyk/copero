import test from 'node:test'
import assert from 'node:assert/strict'
import {createElement} from 'react'
import {sourceModule} from '../scripts/source-module.mjs'
const {localize}=sourceModule('lib/i18n/render.tsx')

test('localized static siblings receive stable keys and nested navigation lists keep separate scopes',()=>{
 const input=createElement('header',null,
  createElement('div',null,'Copero'),
  [createElement('a',{key:'/guides',href:'/guides'},'Football career guides')],
  createElement('a',{href:'/#create-player'},'Start your career'))
 const result=localize(input,'es')
 const keys=result.props.children.map(child=>child.key)
 assert.ok(keys.every(key=>key!==null))
 assert.equal(new Set(keys).size,keys.length)
 assert.deepEqual(localize(input,'de').props.children.map(child=>child.key),keys)
 assert.equal(result.props.children[1].props.href,'/es/guides')
 assert.equal(result.props.children[2].props.href,'/#create-player')
 assert.equal(input.props.children[0].key,null)
})

test('localizing children preserves player names, input values and translated surrounding text',()=>{
 const name=createElement('span',{translate:'no'},'Start your career')
 const input=createElement('div',null,name,createElement('input',{value:'Career seed',title:'Start your career',readOnly:true}))
 const result=localize(input,'es')
 assert.equal(result.props.children[0].props.children,'Start your career')
 assert.equal(result.props.children[1].props.value,'Career seed')
 assert.notEqual(result.props.children[1].props.title,'Start your career')
})
