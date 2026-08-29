const canonicalHost = 'www.pokemonchampions.pro'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.hostname === 'pokemonchampions.pro') {
      url.hostname = canonicalHost
      return Response.redirect(url, 301)
    }

    const response = await env.ASSETS.fetch(request)

    if (url.pathname === '/opengraph-image' && response.ok) {
      const headers = new Headers(response.headers)
      headers.set('content-type', 'image/png')
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }

    return response
  },
}
