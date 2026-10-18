export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const unprefixed = /^\/(?:how-it-works|about|privacy-policy|terms|career|guides(?:\/[^/]+)?)\/?$/.test(url.pathname)
    if (/^\/es\/?$/.test(url.pathname)) url.pathname = '/'
    else if (unprefixed) url.pathname = '/es' + url.pathname.replace(/\/$/, '')
    if (url.hostname === 'www.copero.pro' || url.pathname !== new URL(request.url).pathname) {
      url.hostname = 'copero.pro'
      return Response.redirect(url, 301)
    }
    let response = await env.ASSETS.fetch(request)
    if (response.status === 404) {
      const locale = url.pathname.match(/^\/(es|en|it|pt|zh|de)(?:\/|$)/)?.[1] || 'es'
      const fallback = await env.ASSETS.fetch(new Request(new URL(`/${locale}/404`,url),request))
      if (fallback.ok) response = new Response(fallback.body,{status:404,headers:fallback.headers})
    }
    const headers = new Headers(response.headers)
    if (url.pathname.replace(/\/$/, '') === '/opengraph-image' && response.ok) headers.set('content-type', 'image/png')
    headers.set('X-Content-Type-Options', 'nosniff')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    return new Response(response.body, {status:response.status,statusText:response.statusText,headers})
  },
}
