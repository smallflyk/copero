import { Children,cloneElement,isValidElement,type ReactNode,type ReactElement } from 'react'
import { localizedPath,type Locale } from './config'
import { t } from './translate'
// Translate presentation nodes, never input values, player names, seeds or saved game data.
export function localize(node:ReactNode,locale:Locale):ReactNode {
 if(typeof node==='string')return t(node,locale)
 // JSX's static siblings become dynamic children after cloning. React's traversal
 // supplies scoped keys for those siblings and preserves keys in mapped lists.
 if(Array.isArray(node))return Children.map(node,child=>localize(child,locale))
 if(!isValidElement(node))return node
 const element=node as ReactElement<Record<string,unknown>>
 if(element.props.translate==='no')return node
 const props:Record<string,unknown>={}
 for(const key of ['aria-label','placeholder','title','alt'])if(typeof element.props[key]==='string')props[key]=t(element.props[key] as string,locale)
 if(typeof element.props.href==='string')props.href=localizedPath(element.props.href,locale)
 if(element.props.children!==undefined)props.children=localize(element.props.children as ReactNode,locale)
 return cloneElement(element,props)
}
