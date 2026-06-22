'use client'
import { useState } from 'react'
export default function CopyTeamButton({name,members}:{name:string;members:string[]}){const [copied,setCopied]=useState(false);async function copy(){const text=`${name}\n${members.map((member,index)=>`${index+1}. ${member}`).join('\n')}`;try{await navigator.clipboard.writeText(text)}catch{return}setCopied(true);setTimeout(()=>setCopied(false),1600)}return <button className="btn secondary small" onClick={copy}>{copied?'✓ Copied':'Copy team'}</button>}
