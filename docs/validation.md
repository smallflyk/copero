# Copero implementation and validation

Date: October 18, 2026. Domain confirmed by the user: https://copero.pro. Work completed locally; no deployment, DNS change, Search Console submission, or ranking improvement is claimed.

## Implemented scope

The previous template is now an original English football-career product. Its existing Next.js 15 / React 19 / TypeScript foundation and static Cloudflare Worker Assets deployment approach are retained. The source PRD is reference material: its suggested copero.net domain is superseded by the user's explicit copero.pro selection.

- Player setup: ten positions, sixteen nationalities, preferred foot, shirt number, six optional bonus points, and a reproducible seed.
- Three fictional starting academies, plus conditional later offers from the fictional club pool.
- Pure seeded engine: positional OVR, coach choices, training trade-offs, availability, injuries, rehabilitation, transfers, salary, market value, honours, growth, decline, and mandatory retirement at 38.
- Versioned save validation, reload restoration, in-tab fallback for blocked/full storage, and confirmation before replacement.
- Complete retirement totals, clubs played for, five endings, transparent score breakdown, season timeline, rating curve, and real 1080 × 1350 PNG download.
- Original dark football-data interface and responsive player/season forms.
- Landing page, detailed rules, five product-specific guides, about, privacy, and terms. No fake public-result-link button or unsupported feature claim.

## Changed modules

| Area | Files |
| --- | --- |
| Simulation | `lib/game/types.ts`, `rules.ts`, `engine.ts`, `storage.ts`, `data/clubs.ts` |
| Player journey | `components/CreatePlayer.tsx`, `CareerGame.tsx`, `CareerResult.tsx`, `app/career/page.tsx` |
| Interface | `components/Shell.tsx`, `Pitch.tsx`, `Article.tsx`, `app/page.tsx`, `layout.tsx`, `globals.css`, `not-found.tsx`, `public/icon.svg` |
| Rules and content | `app/how-it-works/`, `app/guides/`, `data/guides.ts`, `app/about/`, `privacy-policy/`, `terms/` |
| SEO | `data/site.ts`, `lib/seo.ts`, `app/sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `scripts/check-seo.mjs` |
| Tests and tooling | `tests/engine.test.mjs`, `worker.test.mjs`, `scripts/source-module.mjs`, `browser-check.py`, `eslint.config.mjs`, `package.json`, `package-lock.json`, `next.config.mjs` |
| Hosting | `cloudflare-worker.mjs`, `wrangler.jsonc` |
| Documentation | `README.md`, `docs/seo-plan.md`, this report, retained PRD, screenshots |

The unrelated old routes, components, data, MDX content, old QA screenshots, ad authorization file, and domain verification file were removed from active sources. A full pre-refactor source archive, including earlier local fixes, remains outside the repository at `/Users/smallflyk/code/copero-template-backups/pokemon-template-before-copero-20261018.tar.gz`. The pre-existing untracked pnpm lock was not overwritten; npm's lockfile is the documented installation source.

## Actual verification results

| Check | Result |
| --- | --- |
| `npm run lint` | Passed, zero warnings; ESLint runs explicitly with TypeScript and React Hooks rules |
| `npm run typecheck` | Passed in both the checkout and isolated production-build copy |
| `npm test` | 16 tests passed, zero failures |
| `npm run build` | Passed; 18 static framework routes generated |
| `npm run check:seo` | Passed: 13 HTML files, 11 indexable content URLs, 216 local links/anchors |
| `npm audit --audit-level=low` | Passed, zero reported vulnerabilities |
| `wrangler types … --include-runtime false` | Generated the expected ASSETS binding |
| `wrangler deploy --dry-run` | Passed with 77 static asset files and only ASSETS; nothing uploaded |
| Browser E2E | Passed in headless Chromium against the production export |
| `git diff --check` | Passed |

The Node suite includes 120 complete careers (12 seeds across all 10 positions), representing 2,640 completed seasons. It checks deterministic replay, numerical bounds, retirement totals, positional weighting, decisions with measurable effects, conditional offers, rehabilitation, ageing, goalkeeper contribution, corrupt saves, random-state restoration, local-storage failure, reachable top ending, and Worker response behaviour.

Browser E2E creates a goalkeeper, allocates all bonus points, signs an academy contract, protects against two immediate season-click events, reloads a live save, plays through all 22 seasons, checks a 23-entry timeline including retirement, downloads and validates a 1080 × 1350 PNG, confirms replacement, recovers from corrupted data, and opens public content pages. It checks 390px mobile and 1440px desktop layouts, static no-JavaScript homepage/FAQ content, and absence of browser runtime errors.

## SEO measures verified

- User-confirmed apex canonical origin and matching og:url.
- One visible H1, one title, and one description per exported HTML page; distinct titles for indexable pages.
- Real VideoGame, WebSite, FAQ, Article, and Breadcrumb JSON-LD; no fabricated rating markup.
- Static content, substantive interlinked guides, English document language, social card, and favicon.
- `/career` is noindex/follow and absent from the sitemap. Robots permits crawling so that noindex can be read.
- No old product identity or old analytics/ad scripts in the exported pages. No irrelevant bulk redirects.
- No invented keyword volumes, KD scores, traffic numbers, testimonials, or claimed ranking gains.

## Environment and remaining work

Gameplay needs no environment variables, API key, backend, or database. Live deployment needs Cloudflare authentication and permission for the configured account/domain. The new `copero-pro` Worker is separate from the former template Worker.

Remaining P1 work: D1-backed public result snapshots, cross-device share URLs, and a tested result endpoint. These features are not advertised as available. Local PNG download, timeline, and rating curve are already implemented.

Before launch, verify live copero.pro TLS/DNS and provide a real site-owner contact address. Direct reference-site TLS failed during this run, so the external site's current UI and availability were not verified or cloned. Search Console ownership, sitemap submission, live indexing inspection, and live social-card fetch remain post-deployment owner actions. Ranking and search traffic require real search data after indexing.

## Screenshot-reference player creation update

The user supplied a Spanish-language three-panel creation-tool reference. The English Copero tool now follows that layout: identity with original SVG kit, searchable two-column nationality buttons, and a tactical pitch with ten position buttons. The kit previews name, number, country flag, and kit colours immediately. Selected countries and positions expose pressed state, country search includes a no-results state, and the mobile layout stacks the panels without horizontal overflow. Six optional bonus points, reproducible seeds, three academy choices, and existing save replacement confirmation remain available. Nationality is cosmetic; the UI does not promise international-team simulation.

Validation after this update: ESLint, all 16 engine/Worker tests, production static build, TypeScript, and SEO export checks passed (13 HTML pages, 11 indexable URLs, 216 local links). Playwright additionally verified live shirt updates, country filtering and empty results, selected goalkeeper position, desktop/mobile layouts, the complete goalkeeper career through retirement, storage restoration, PNG download, public routes, and no-JavaScript SEO content. No browser runtime errors were recorded. Desktop and mobile creation screenshots were visually inspected and saved in `docs/screenshots/player-creator-*.png`. No live deployment was performed.

## Homepage Hero placement

The player creation tool is now the first homepage section directly below navigation. The former promotional hero and its decorative pitch were removed from the homepage, and the separate lower creation section was removed. The workbench owns the single `Copero Football Career Simulator` H1. Existing `#create-player` links still target this one tool. Desktop and mobile first-viewport screenshots were updated. Production build, ESLint, TypeScript, SEO checks (214 local links), and the full browser career flow passed. Browser assertions check that the creation section starts within 150px on desktop and the identity panel appears in the first mobile viewport. No deployment was performed.

## UI/UX Pro Max visual refactor

Applied the explicitly requested `/Users/smallflyk/.agents/skills/ui-ux-pro-max/SKILL.md`. The local design-system search matched sports entertainment and the sports typography entry recommended Barlow Condensed. The applied football-specific system is recorded in `design-system/copero/MASTER.md`: warm paper, ink green, terracotta actions, a dedicated dark tactical field, self-hosted Barlow Condensed and DM Sans with OFL licences. The general luxury serif/pink recommendation was evaluated and replaced with the sports-specific direction.

Changed the shared navigation/footer, creation workbench, academy choices, career dashboard, result ticket, chart, downloaded card, guides/articles/tables, favicon and social card. Game rules, saved-game schema, URL structure and page metadata remain intact. Added a mobile disclosure menu, consistent focus states, step semantics, academy heading focus, named condition meters, and 44px pitch/attribute controls. Repositioned the central tactical controls to prevent overlapping hit areas.

Production verification: ESLint, TypeScript, all 16 engine/Worker tests, static export and SEO validation passed (13 HTML, 11 indexable URLs, 266 local links including the mobile navigation). Responsive browser review covered widths 375, 390, 768, 1024 and 1440, mobile menu navigation, every pitch position, and guide/rules/privacy pages. The updated browser regression also asserts real mobile stacking and non-overlapping 44px pitch controls at all five widths. Final tool heights were approximately 889px at 1440 and 2029px at 390, retaining the previous compact layout. Fonts and all UI assets are served locally; there is no new runtime third-party service. No live deployment was performed.

## Spanish-first multilingual release

The user requested Spanish as the default and the six languages in the reference: Español (es), English (en), Italiano (it), Português (pt), 简体中文 (zh-Hans on /zh), and Deutsch (de). Every edition is statically rendered under its own prefix. Cloudflare redirects the root and recognized former unprefixed content URLs into /es with 301 and preserves the query. The local static root remains usable as Spanish HTML without JavaScript and enters /es when JavaScript runs.

Translation covers navigation, player creation, localized country search and position abbreviations, academy choices, gameplay decisions, validations and confirmations, saved English narratives on display, result breakdowns, PNG labels, FAQ, all five guides, rules, about, privacy and terms. Internal country/position enums, RNG state and the save schema are unchanged. User-chosen player names are preserved. Language is carried by the URL; there is no translation API or tracking cookie. The privacy policy says this consistently in all languages. Localized guides consolidate the original English explanations while preserving rules and limitations; the original full English guides remain in data/guides.ts.

The requested Hero copy (`FREE BROWSER GAME · NO SIGN-UP`, `Your name. Your country. Your position.` and `The rest of the story is yours to write.`) was removed from the component, so it is absent in every language. The title and actual creation controls remain.

SEO verification passed for 78 localized HTML pages: 66 indexable pages plus six private career and six error pages. Each public page has correct html language, localized title/description, a self canonical, six reciprocal hreflang entries plus Spanish x-default, matching OG URL and translated applicable JSON-LD. The sitemap includes exactly 66 public URLs; career/error pages are noindex. No localhost references appear in metadata of these localized pages. Next emits metadataBase warnings for its framework-generated global error documents; the six application error documents have explicit production metadata and the Worker serves them with a real 404 status.

Final verification: ESLint, production build, TypeScript, 22 Node tests, SEO checker, full English goalkeeper career to retirement, and a separate six-language browser regression all passed. That regression checked 30 homepage language/viewport combinations (375/390/768/1024/1440), non-overlapping 44px pitch buttons, mobile stacking, selector state, localized article routes, Spanish validation and country search, academy focus, identical saved state across all language switches, translated season summaries, PNG download in all six languages, and no-JavaScript translated HTML. No browser runtime errors. The Chinese PNG and Spanish homepage were visually inspected. No production deployment was performed.

## Copero SEO release — 18 October 2026

This section supersedes earlier root redirect, guide-count, contact-status and undeployed notes. Spanish now serves at the canonical root, `/es` redirects to root, six guides are available in six languages and the sitemap has 72 indexable URLs. Added localized product content, a reproducible nine-career strategy comparison, descriptive internal links, visible breadcrumbs, root website/organization identity, article metadata and support@copero.pro contact information. Removed obsolete FAQPage schema while preserving visible FAQs.

Lint, 24 Node tests, isolated production build, TypeScript and the SEO checker pass: 84 preferred localized HTML pages, 72 indexable URLs, 2,502 local links. Local full-career and six-language browser suites pass. The new content suite passes locally and on the real custom domain, including all nine comparison rows in all six languages, no-JavaScript content, breadcrumbs, schemas and mobile widths 375/768/1440. Browser layout assertions wait for local fonts and layout frames to settle after viewport changes.

Cloudflare deployment succeeded: Worker copero-pro, version cc22a54a-70de-4d0a-b79e-4c90075f7be6, https://copero.pro. Real HTTPS checks pass for six homepages, Spanish about/privacy/rules/strategy guide/career, robots, sitemap and social image. Career contains noindex; sitemap has 72 entries; `/es?check=1` redirects 301 with query preserved; unknown route returns 404. Results saved in docs/live-http-check.json. Live comparison screenshots are in docs/screenshots/seo-comparison-*.png and the Spanish table was visually inspected.

The workstation's configured proxy rejected the new domain's TLS connection, while direct HTTPS returned valid responses. Live browser checks therefore use COPERO_BROWSER_DIRECT=1. This does not change the deployed site. No Google ownership verification, indexing, ranking or traffic outcome is claimed. The owner confirmed Search Console is not configured; next operational step is Domain verification and sitemap submission in the owner's Google account.

The full gameplay browser regression also passed on https://copero.pro/en: player setup and academies, all 22 seasons through retirement, duplicate-click protection, refresh restoration, valid 1080 × 1350 PNG download, save replacement and corruption handling, mobile layouts, public routes and no-JavaScript content; no runtime errors.

## React child key warning fix — 18 October 2026

The Header navigation already had explicit keys. The recursive localize() helper used Array.map on JSX static sibling arrays, turning them into dynamic arrays without assigning keys. It now uses React.Children.map, which supplies stable scoped keys while preserving mapped list identity. The change applies to Header, Footer and other localized trees. Two regression tests verify stable unique keys, localized links, preserved player names and unchanged input values. The trusted source-module test loader now supports the React runtime and .tsx modules.

All 26 Node tests, lint, isolated production build, TypeScript and SEO checks pass. Eight development routes (root, all six prefixed home routes and Spanish guides) produced no key warning or console/runtime error. Published Worker version f5bb481d-59cf-4a6c-8f5a-ffd03ccb750a to https://copero.pro.

## Full live game acceptance — 18 October 2026

Ten players created through the actual UI completed 220 seasons, including five careers under mobile emulation. All conditional decision branches, refresh restoration, displayed totals, bounded statistics and 10 exact engine replays passed. Separate full-career and six-language suites passed on copero.pro; all 26 Node tests and lint passed. Browser storage failure and restart cancellation were also tested. See docs/game-acceptance-2026-10-18.md for evidence, scores, method and remaining product/usability limitations. No production gameplay changes were needed during this acceptance run.

## Mobile career compact layout and fixed action — 18 October 2026

Published Worker version efdd912b-8df9-45fb-b841-4d6b349b773b. Same 390px saved-season fixture shrank from 3,929px to 1,742px (55.7%). Mobile uses compact status/training cards, collapsible attributes/retirement and history, and one fixed bottom season action with safe-area/scroll padding. Desktop stays expanded with inline action. Retirement removes the dock and returns to the top.

26 Node tests, lint, isolated build, TypeScript, SEO checker and complete goalkeeper browser career pass. New six-language/30-portrait-case mobile suite passes in development, production preview and on copero.pro, including touch landscape, desktop, synthetic safe area, accessible disclosures, conditional transfers/rehabilitation, focused-control/footer visibility, duplicate clicks, saved-state recovery, 17 remaining seasons to retirement and PNG. No runtime/console errors. HTTP smoke checks pass. Full record: docs/mobile-career-2026-10-18.md.
