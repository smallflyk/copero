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

## Choice-driven careers (rules 1.3)

Every UI season requires one of three story decisions. Fourteen original scenarios include injury, fatigue, transfers, limited match time, trophies, contract expiry and veteran status. Trigger priority follows current player state; events from the last four completed seasons are excluded. A club change clears the story selection and requires a fresh decision. Effects are shown before choosing and saved in each season review. Capped gains show the actual available benefit. Each new review records eight ordered stages (club, story, coach, training, rehabilitation, new injury, development, matches), whose actual condition deltas reconcile to the season total. Growth multipliers explicitly warn when age-related decline is active. Conditions/attributes persist; role and positive-growth multipliers last one season. Match experience also modifies positive development (`0.75 + appearances / 44 * 0.5`). An accepted coaching request adds 8 percentage points to the season's selection chance, within the existing cap, while following the plan earns more trust.

Club offers compare estimated matches, training quality, competition, annual salary and remaining contract years. Estimates precede seasonal decisions and injuries and are not promises. Contracts fix salary for two years (three for a bigger-club move); a transfer remains possible before expiry. Initial academy cards show the actual first-season salary for the chosen player. Earnings are recorded, not spendable currency or legacy points.

Retirement records group consecutive club spells separately, reconcile salary/bonuses, show peak value, the highest-rated season and actual first milestones, and retain season decisions and consequences. PNG cards and JSON records download locally; JSON import/cloud recovery is not implemented. Old version-1 saves continue unchanged, with new decisions applied from the next season. Historical no-story seasons and rules-1.1 story decisions retain their original replay behavior; older reviews do not invent detailed attribution. The strategy guide now explicitly uses the first story option each season.

Validation: `npm test`, `npm run lint`, production build/typecheck/SEO; `scripts/check-career-choices.py` checks contextual cooldown, story reset after a club change, eight-stage attribution, keyboard choices, translated feedback and retirement, PNG download and reload in six languages. Existing full-career and mobile suites include mandatory stories and JSON export. Browser probes suppress third-party analytics and advertising requests in their isolated test contexts only.

## Career progression (rules 1.3)

Paid story choices whose positive effects are all capped or inactive are disabled in the UI and rejected by the engine. A no-cost continuation is offered if every choice is unavailable. Evaluation includes transfer trust reset, age/potential and capped selection modifiers. Changing decisions invalidates a newly unavailable choice.

Personal appearance, goal, assist, clean-sheet and consecutive-club milestones are derived from the first qualifying season, once per threshold. Age-stage season targets and three next-season story chains (minutes, recovery, continuity) are saved in new reviews. Club moves close club-specific commitments; recovery follows the player. Targets and achievements do not add legacy points. Early retirement identifies an unfinished follow-up.

A new `rules: '1.3'` marker on UI decisions preserves exact replay of recorded 1.1/1.2 decisions and their old reviews. The save format/key remain version 1. Mobile feedback shows overall changes and at most three key stages, with the complete eight-stage calculation behind a separate disclosure. All new presentation strings cover ES/EN/IT/PT/ZH/DE.

Run `scripts/check-career-progression.py` with `COPERO_BASE_URL` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to check six languages, the real saturated-save boundary, remembered recovery, unique milestones, early retirement and the free all-capped continuation. It uses isolated QA fixtures.

## Cups and national teams (rules 1.4)

New UI decisions use `rules: '1.4'`, `cupPlan` and `internationalPlan`. The domestic cup is an eight-club knockout with a coherent seven-match bracket. Priority increases selection and team strength at a fitness/injury cost; rotation protects fitness with weaker cup chances. Club totals combine up to 38 league and three cup appearances. A cup medal requires an actual appearance.

Nationality selects one of 16 playable national teams with explicit fictional strength, region and squad threshold. The 32-team field contains four eight-team regions. Eligibility checks OVR, 12 actual club appearances, 55 fitness and current injury; recorded caps and recent declined invitations modify future thresholds. Odd career seasons have two friendlies, other even seasons a regional knockout, and every fourth season a global knockout. These are fictional game competitions, not an official football calendar. International appearances cost fitness and are recorded separately from club statistics and legacy points.

All fixtures, scores, penalties, appearances and honours persist locally. Retirement includes season competition records, first milestones, totals, PNG highlights and complete JSON exports. Historical 1.1/1.2/1.3 decisions replay unchanged; historical seasons are not backfilled. Cup and national matches use independent seeded random streams. The save format/key remain version 1, with strict fixture/selection/stat validation and ten-stage attribution for new seasons.

Verification: `npm test` covers historical replay, every nationality and position, eligibility, workload choices, coherent brackets, full-career records and invalid saves. `scripts/check-competitions.py` tests six-language mobile controls, accept/decline, global brackets, retirement JSON/PNG and reload in isolated browser contexts. Existing acceptance, progression, choice and mobile scripts cover full careers and old-save upgrades. Set `COPERO_BASE_URL` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to run these against a preview or deployment.

For end-to-end nationality regression, `scripts/check-national-careers.py` creates 16 players through the real form and plays 352 seasons without save injection. It checks country thresholds, recent declines/caps, all four regional fields, every national competition type, cup/club totals, retirement details and downloads. Its report includes an independent starting state and the final UI save for deterministic replay. `scripts/check-retired-competitions.py` reopens those actual careers in isolated contexts and checks all 352 retired-season panels, individual match contributions, keyboard disclosures, six languages and narrow screens. Use `COPERO_CAREER_REPORT` to select the report, plus the shared browser environment variables above. Retired timelines retain cup/national fixtures and selection checks; fixture scores remain team scores, with the player's goals, assists and clean sheets labelled separately.

## Compact player setup

`app/create-player.css` loads after the shared styles and owns first-screen player setup geometry. Desktop keeps three compact columns; narrower screens use native horizontal scrolling and three section buttons, with a frame that fills the viewport below navigation and an action anchored at its bottom. Short windows scroll the relevant panel rather than shrinking touch targets. Expanded attribute customisation scrolls inside the frame while the main action remains visible. Identity, nationality, position and bonus edits persist when switching sections or returning from academy selection.

`scripts/check-compact-hero.py` checks six languages at 12 viewport sizes, 44px non-overlapping pitch controls, section/keyboard/touch navigation, all nationalities, validation focus, saved edits, academy selection, actual career creation, one season and resuming a save. The existing i18n browser check also covers translated articles and no-JavaScript output.
