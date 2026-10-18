export default function GoogleTag() {
 return <>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4JYX8WF2SZ"/>
  <script id="google-tag" dangerouslySetInnerHTML={{__html:`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4JYX8WF2SZ');`}}/>
 </>
}
