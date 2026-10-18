import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import {createRequire} from 'node:module'
const nodeRequire=createRequire(import.meta.url)
const cache=new Map()
// Read only trusted repository modules and local translation data.
export function sourceModule(filename) {
 const absolute=path.resolve(filename)
 if(cache.has(absolute))return cache.get(absolute).exports
 const source=fs.readFileSync(absolute,'utf8')
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText
 const module={exports:{}};cache.set(absolute,module)
 const require=(specifier)=>{
  if(specifier==='react')return nodeRequire(specifier)
  if(!specifier.startsWith('.')&&!specifier.startsWith('@/'))throw new Error(`Unsupported module import: ${specifier}`)
  const target=specifier.startsWith('@/')?path.resolve(specifier.slice(2)):path.resolve(path.dirname(absolute),specifier)
  if(target.endsWith('.json'))return {default:JSON.parse(fs.readFileSync(target,'utf8'))}
  return sourceModule(fs.existsSync(target+'.ts')?target+'.ts':target+'.tsx')
 }
 new Function('exports','module','require',js)(module.exports,module,require)
 return module.exports
}
