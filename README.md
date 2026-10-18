# Copero — Football Career Simulator

An original, decision-driven browser football career game built from the attached MVP PRD. Canonical domain: **https://copero.pro**. Spanish-first interface with English, Italian, Portuguese, Simplified Chinese and German; ten positions, fictional clubs, and no account or external game API.

## Run

```bash
npm ci
npm run dev
```

Open http://localhost:3000/ (Spanish). Other homepages use `/en`, `/it`, `/pt`, `/zh`, `/de`; Spanish subpages use `/es/...`. Create a player on the homepage, choose an academy, and play at `/<locale>/career`. All languages share the same browser save.

## Implemented

- Ten positional templates, weighted OVR, six optional bonus points, and player validation.
- Three starting academies with different quality, opportunity, competition, and salary.
- Seeded TypeScript engine: training, coach trust, contextual transfers, conditional rehabilitation, fitness, injury, ageing, and team results.
- Annual seasons from age 16 to mandatory retirement at 38; optional retirement after one completed season.
- Versioned local saves, corruption/unsupported-format handling, replacement confirmation, and session fallback when storage is blocked.
- Retirement totals and transparent 100-point scoring, five endings, season timeline, rating curve, and local 1080 × 1350 PNG result card.
- Six fully rendered language editions of the landing page, rules, six guides, about, privacy and terms; private career and error pages are noindex.
- Route-preserving language menu, localised player creation, country search, events, result labels and downloadable cards.
- Correct HTML language, reciprocal hreflang, Spanish x-default, self canonical and 72 indexable URLs.
- Canonical/OG metadata, VideoGame/WebApplication, WebSite and Organization schemas matching the product, Article/Breadcrumb schemas, sitemap, robots, favicon, and a generated social image.

There are no public result links, cross-device saves, D1 backend, real teams, live football feeds, paid features, leaderboards, or multiplayer. The download is an image, not a hosted result.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run check:seo
```

Run a build before the SEO check. Avoid sharing `.next` between a production build and a running development server; stop dev or build in a separate copy. The test helper compiles only trusted local TypeScript game and translation modules for Node's test runner. Optional browser coverage is in `scripts/browser-check.py` (requires Python Playwright and Chromium):

```bash
# With npm run dev already serving on localhost:3000:
python scripts/browser-check.py
# Six-language routing, saves, articles, responsive controls and downloads:
COPERO_BASE_URL=http://localhost:3000 python scripts/check-i18n-browser.py
```

`COPERO_BASE_URL`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE`, and `COPERO_ARTIFACT_DIR` optionally select the preview, browser executable, and screenshot/download directory. The test uses an isolated browser context and does not modify your normal browser saves.

## Architecture

- `lib/game/types.ts`, `rules.ts`, `engine.ts`: data contracts and deterministic rules, v1.0.
- `lib/game/storage.ts`: `copero.career.v1` save schema and validation.
- `data/clubs.ts`: fictional clubs; `data/guides.ts`: original product-specific SEO articles.
- `components/CreatePlayer.tsx`, `CareerGame.tsx`, `CareerResult.tsx`: the complete player journey.
- `lib/i18n/`: supported languages, URL helpers, translated message catalog, interpolation, display formatting and metadata.
- `data/localized-content.ts`: translated public documents and guide bodies; English keeps the original full guide text.
- `components/LanguageProvider.tsx`, `LanguageSwitcher.tsx`: language context and accessible six-language selector.
- `app/[locale]`: statically generated editions; `app/(entry)`: canonical, indexable Spanish homepage.
- `docs/seo-plan.md`: keyword/intent mapping and launch checks.
- `docs/product-requirements.md`: the source document, retained as reference material. The user's confirmed domain is copero.pro; copero.net in the source document is superseded.

The engine persists its random state. Identical setup + seed + complete decisions reproduce results under the same engine version. Nationality, preferred foot, and shirt number personalise the career without hidden ability bonuses. Goalkeepers use defending and physical as simplified goalkeeper attributes.

## Automatic deployment

Push to `main` to run [Deploy copero.pro](https://github.com/smallflyk/copero/actions/workflows/deploy-cloudflare.yml). The workflow installs locked dependencies, runs lint/tests/build/TypeScript/SEO checks, deploys the existing Cloudflare Worker, then verifies the live Git commit and key pages. The deployment API token is stored in the repository Actions secret; no local Wrangler login is needed by CI. Failed pre-deployment checks prevent publication. See [deployment setup and operations](docs/automatic-deployment.md).

## Cloudflare

The existing static Next.js export + Worker Assets deployment mechanism is retained. `wrangler.jsonc` now targets the separate **copero-pro** Worker and **copero.pro**, not the previous template service.

```bash
npm run preview:cloudflare
npm run deploy:cloudflare
```

Deployment needs Cloudflare authentication and access to the configured account and domain, through `wrangler login` or a suitable `CLOUDFLARE_API_TOKEN`. No gameplay environment variables, AI API keys, or database bindings are needed. The SEO release was deployed on 2026-10-18 to https://copero.pro; see docs/validation.md for the version and live checks.

Current analytics and advertising are intentionally absent; privacy describes local saves, local downloads, and hosting requests. The public contact address is support@copero.pro, displayed consistently in the footer, about page, privacy policy and Organization metadata.

The original template, including the earlier local fixes, was archived outside this repository at `/Users/smallflyk/code/copero-template-backups/pokemon-template-before-copero-20261018.tar.gz`.

## Language routing and hosting

Cloudflare serves the canonical Spanish homepage at `/` and redirects `/es` to `/`. Recognized former unprefixed content URLs redirect to `/es/...` with 301 while preserving the query. Existing language prefixes are preserved. Unknown pages use the matching translated error document with status 404. `run_worker_first` is enabled. The root remains readable without JavaScript and canonicalises to https://copero.pro. The exported `/es` alias canonicalises to the root; the Worker redirects it. The save key `copero.career.v1`, English internal enum values and deterministic engine are unchanged; language is never persisted as gameplay state or a tracking cookie.

`npm run check:seo` verifies all language metadata, 72 sitemap entries, alternate routes, internal links and private-page noindex. `npm test` includes translation coverage, preserved narrative rendering, shared-save assumptions and Worker redirect/error tests.

The training strategy guide includes nine reproducible complete careers generated by the actual engine at build time. See `data/strategy-comparison.ts` for the fixed seed, decisions and limitations. Run `scripts/check-content-browser.py` for six-language, no-JavaScript and responsive content coverage.

## Full game acceptance

With Python Playwright installed, `scripts/check-game-acceptance.py` creates ten isolated players through the live UI and plays 220 seasons, including real transfer, role-change and injury decisions. It never injects or edits gameplay saves. Default target is https://copero.pro; use `COPERO_BASE_URL` to select a preview. It takes several minutes. `COPERO_ARTIFACT_DIR` selects output (default /tmp/copero-game-acceptance). `COPERO_BROWSER_DIRECT=1` bypasses system proxies in Chromium when necessary. After it succeeds:

```bash
node scripts/verify-game-acceptance.mjs /tmp/copero-game-acceptance/acceptance.json
```

The verifier independently replays all recorded decisions through the engine and checks that complete UI saves and visible legacy scores match. See docs/game-acceptance-2026-10-18.md for findings and scope limitations.

## Mobile career layout

Phones use compact season cards, collapsible report/history and one fixed next-season action with safe-area padding; desktop uses expanded panels and the inline action. The dock disappears at retirement. Run `scripts/check-mobile-career.py` with the same Playwright environment variables as the other browser suites. Its default target is localhost:3000; it uses a valid isolated saved-game fixture. See docs/mobile-career-2026-10-18.md for measured reductions and deployment validation.
