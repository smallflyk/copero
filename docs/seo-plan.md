# Copero SEO implementation and measurement plan

Updated 2026-10-18. Canonical origin: https://copero.pro. Public contact: support@copero.pro (provided by the owner; mailbox delivery has not been tested).

## Search intent and positioning

Copero is a free fictional football career simulator. Its useful distinction is an immediately playable game plus transparent training, transfer, position and retirement rules. It is not a live-score service. Search research found similarly named football games at copero.org, copero.app and copero.games; this is not evidence of a precise Google ranking, keyword volume, difficulty or competitor traffic. No such metrics are invented.

Spanish is the default at `/`. Other homepages use `/en`, `/it`, `/pt`, `/zh`, `/de`; Spanish content pages use `/es/...`. All editions have equivalent server-rendered content, reciprocal hreflang and Spanish x-default. `/es` redirects to the root. Six guides plus home, guide index, rules, about, privacy and terms create 72 indexable URLs. Career state and error pages are noindex and excluded from the sitemap.

## Keyword and content map

| Preferred Spanish URL | Intent and supporting phrases |
| --- | --- |
| `/` | copero; copero juego; simulador de carrera de fútbol gratis |
| `/es/how-it-works` | reglas de Copero; cómo funciona Copero; puntuación y atributos |
| `/es/guides/how-to-play-copero` | cómo jugar Copero; crear futbolista; empezar una carrera |
| `/es/guides/copero-positions` | posiciones de Copero; delantero; portero; valoración OVR |
| `/es/guides/copero-decisions` | decisiones en Copero; entrenamiento; lesiones; confianza del entrenador |
| `/es/guides/copero-transfers` | fichajes en Copero; cambiar de club; minutos de juego |
| `/es/guides/copero-legacy-score` | puntuación final de Copero; retiro; finales de carrera |
| `/es/guides/copero-training-strategy` | entrenamiento en Copero; comparar academias; intensidad y recuperación |

English equivalents include Copero game, football career simulator, how to play Copero, Copero training strategy, transfers and legacy score. Other editions use natural local-language descriptions of these same tasks. Keywords describe intent, not measured demand. No keyword-density target, doorway nationality pages, fabricated author credentials or guaranteed ranking claims.

## Original evidence and useful content

The new training guide publishes nine complete career simulations from the actual engine: three academies multiplied by balanced, intensive and recovery training. Fixed seed `copero-strategy-v1`, engine rules 1.0, striker from England, right foot, shirt 10, shooting +4, physical +2, follow coach, stay at club and full rehabilitation when injured. Each runs from age 16 to 38. The build generates the visible table from `data/strategy-comparison.ts`; narrative and method live in `data/strategy-guide.ts`.

For example, Harbor intensive reaches peak OVR 74 with 845 appearances; balanced reaches 72 with 894 appearances. These are outcomes under one seed and decision path, not universal odds or proof that one strategy always wins. The guide states those limits and connects the result to real decisions. All six language editions include the method and nine rows before JavaScript executes.

The homepage explains the actual game beneath the playable hero and links directly to useful guides. Guides link to rules, relevant related topics and the game. Visible breadcrumbs match breadcrumb markup. Contact details and save-deletion instructions are consistent across the footer, about and privacy pages.

## Technical implementation

- Unique localized title, description, single H1, self canonical, OG/social metadata and article metadata.
- Stable root Organization and WebSite identifiers; website name Copero, alternate name Copero.pro. Game identifies truthfully as VideoGame/WebApplication with a free offer, without invented reviews or ratings.
- Correct HTML language including zh-Hans, reciprocal six-language alternates and Spanish x-default. The root is indexable and not a client-side redirect.
- Sitemap contains only 72 preferred public pages. Robots allows crawling so noindex can be read on career pages. Social image has the correct PNG response type.
- Static text, links, tables and FAQs remain readable without JavaScript. FAQ content remains visible, but obsolete FAQPage markup was removed; no FAQ search feature is promised.
- Original unrelated template URLs return 404 rather than misleading redirects to football content. Mobile tables scroll within their container, and long German titles wrap without page overflow.
- Google Analytics 4 (G-4JYX8WF2SZ) was added at the owner’s request on 2026-10-18, with matching six-language privacy disclosures. Advertising and third-party translation requests are not introduced. Fonts are local. There is no public indexable save or player-result URL.

## Validation

Local lint, TypeScript, production build and 24 Node tests pass. The SEO checker validates 84 preferred localized HTML documents (including private/error documents), 72 indexable sitemap URLs and 2,502 local links. Browser checks cover the complete career, six languages, shared local saves, responsive controls, result downloads and the new evidence-based content. The content suite additionally checks all nine rows per language, 375/768/1440 widths, no-JavaScript rendering, visible breadcrumbs, article metadata and stable domain identity.

## Search Console and ongoing work

The owner confirmed Search Console is not configured. No Google ownership verification, sitemap submission, indexing or traffic result is claimed.

1. In the owner's Google Search Console account, add the Domain property `copero.pro` and obtain its DNS TXT verification value. Add that exact value in Cloudflare DNS and complete verification. A verification value cannot be generated locally or guessed.
2. Submit `https://copero.pro/sitemap.xml`. Inspect the root and `/es/guides/copero-training-strategy`; confirm fetched canonical, rendered content and indexing status. Request indexing where appropriate through the authenticated interface.
3. After real data accumulates, record a 28-day baseline of impressions, clicks, CTR and average position by query, page, country and device. Track brand queries separately from football-simulator and gameplay queries. Compare like-for-like periods, without promising a ranking deadline.
4. Improve titles using observed query intent; expand guides when player questions or Search Console evidence reveal a missing answer. Keep content synchronized with changes to engine rules. Do not add thin keyword variants or purchase spam backlinks.
5. Google Analytics was authorized and installed on 2026-10-18. Use Analytics for site usage and Search Console for search visibility; the game save remains local.

## Primary references and research sources

- Google people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Localized versions and hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Site name and root WebSite markup: https://developers.google.com/search/docs/appearance/site-names
- Software application structured data: https://developers.google.com/search/docs/appearance/structured-data/software-app
- Search documentation updates, including FAQ rich-result removal in 2026: https://developers.google.com/search/updates
- Observed similarly named products: https://copero.org/ ; https://copero.app/ ; https://copero.games/football-career-simulator/

These sources inform implementation choices. They do not guarantee Google inclusion, a rich result, ranking or traffic.

## Deployment record

Published to https://copero.pro on 2026-10-18 using Worker copero-pro, version cc22a54a-70de-4d0a-b79e-4c90075f7be6. Direct HTTPS checks confirm six homepages, about, privacy, rules, the strategy guide and private career return 200; sitemap returns XML with 72 entries, social image returns image/png, and missing pages return 404. `/es?check=1` returns 301 to `/?check=1`. Six-language live content browser checks pass. This workstation's configured proxy closes connections to the new custom domain; direct HTTPS and a browser with proxy disabled work. Search Console is still unconfigured.

The full gameplay browser regression also passed on https://copero.pro/en: player setup and academies, all 22 seasons through retirement, duplicate-click protection, refresh restoration, valid 1080 × 1350 PNG download, save replacement and corruption handling, mobile layouts, public routes and no-JavaScript content; no runtime errors.
