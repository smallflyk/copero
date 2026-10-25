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

Google Analytics 4 uses the site-wide Google tag G-4JYX8WF2SZ, included once in the shared document head. Plausible Analytics is also included once using the owner-provided pa-__HJG7Uwk26jKdaqu23Bn.js script and plausible.init(). Privacy disclosures cover both services, distinguishing Plausible’s cookie-free statistics from Google Analytics cookies and usage data in all six languages, alongside local saves, local downloads and hosting requests. No custom Analytics events send player names or career saves; The owner-provided AdSense loader (ca-pub-3506863457211473) is included once in the shared head; six-language privacy disclosures cover its advertising cookies and data use. The public contact address is support@copero.pro, displayed consistently in the footer, about page, privacy policy and Organization metadata.

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

## Choice-driven careers (rules 1.2)

Every UI season requires one of three story decisions. Fourteen original scenarios include injury, fatigue, transfers, limited match time, trophies, contract expiry and veteran status. Trigger priority follows current player state; events from the last four completed seasons are excluded. A club change clears the story selection and requires a fresh decision. Effects are shown before choosing and saved in each season review. Capped gains show the actual available benefit. Each new review records eight ordered stages (club, story, coach, training, rehabilitation, new injury, development, matches), whose actual condition deltas reconcile to the season total. Growth multipliers explicitly warn when age-related decline is active. Conditions/attributes persist; role and positive-growth multipliers last one season. Match experience also modifies positive development (`0.75 + appearances / 44 * 0.5`). An accepted coaching request adds 8 percentage points to the season's selection chance, within the existing cap, while following the plan earns more trust.

Club offers compare estimated matches, training quality, competition, annual salary and remaining contract years. Estimates precede seasonal decisions and injuries and are not promises. Contracts fix salary for two years (three for a bigger-club move); a transfer remains possible before expiry. Initial academy cards show the actual first-season salary for the chosen player. Earnings are recorded, not spendable currency or legacy points.

Retirement records group consecutive club spells separately, reconcile salary/bonuses, show peak value, the highest-rated season and actual first milestones, and retain season decisions and consequences. PNG cards and JSON records download locally; JSON import/cloud recovery is not implemented. Old version-1 saves continue unchanged, with new decisions applied from the next season. Historical no-story seasons and rules-1.1 story decisions retain their original replay behavior; older reviews do not invent detailed attribution. The strategy guide now explicitly uses the first story option each season.

Validation: `npm test`, `npm run lint`, production build/typecheck/SEO; `scripts/check-career-choices.py` checks contextual cooldown, story reset after a club change, eight-stage attribution, keyboard choices, translated feedback and retirement, PNG download and reload in six languages. Existing full-career and mobile suites include mandatory stories and JSON export. Browser probes suppress third-party analytics and advertising requests in their isolated test contexts only.
