# Career choices — rules 1.1 (2026-10-19)

## Behavior

- Offers show quoted annual salary, remaining contract years, estimated appearances, training quality, competition and coach trust. Terms/trade-offs and a comparison table use native disclosures to keep phones compact. Salary is fixed for the contract; renewals last two years, bigger-club transfers three. Existing eligibility rules still apply, and transfers are allowed before expiry. Salary is a career-record goal, not spendable currency or legacy points. Academy cards show the first-season quote for the actual player.
- Each UI season requires a story decision. Four original scenarios rotate, each with three alternatives. Shown numerical effects apply before the normal season, subject to existing attribute/condition caps. There is no success-probability roll for story choices. Conditions and attribute changes persist; selection/development modifiers last one season. Positive growth additionally uses match experience (`0.75 + appearances / 44 * 0.5`); age-related decline is not reversed by growth multipliers.
- An accepted coaching request adds 8 percentage points to that season's selection opportunity (within the selection cap); following the plan builds more trust. Unsuccessful requests retain trust/morale costs. This resolves the previous weak upside for requesting minutes.
- Reviews save the chosen effect, condition/rating before and after, quote projection and actual matches, source club and bonus. They distinguish direct story effects from the total changes caused by the whole season. No claimed guarantee of trophies, matches or growth.
- Retirement records show consecutive club spells, reconciled totals and earnings, peak value, actual first milestones, and the best season by final rating/appearances/earliest tie-break. PNG and complete JSON downloads are local. No import, public result URL or cloud recovery is claimed.
- Version-1 saves remain supported. Earlier history is preserved, and new choices apply from the next season. Historical seasons without a story retain original replay behavior. English model data is translated only for display. Six-language rules/privacy disclosures explain the additional local fields and JSON download. Published training comparisons explicitly select the first story choice each season.

## Verification

- 43 Node tests, lint, isolated production build, TypeScript, and SEO checks pass. SEO covers 84 localized HTML pages and 72 indexable canonical URLs; private career pages remain noindex.
- Added paired same-seed tests for story effects, actual selection/fitness/trust differences, accepted coaching requests, salary contracts and expiry, old-save continuation, malformed new fields, records/repeat club visits, and translated narratives. Thirty additional full engine careers (10 positions × 3 story routes) validate and reload after every season and replay exactly.
- Real UI acceptance: 10 newly created players, 220 seasons (five desktop and five mobile careers), all transfer/rehabilitation/coaching branches, refreshes, deterministic training comparisons, bounded outcomes, retirement totals and local JSON download. No saves injected or edited in this suite. An independent Node verifier replays every UI decision and checks complete saves and visible scores.
- Six-language choice probe covers all four scenarios, keyboard selection, selected states, translated offer terms/effects/reviews, and reload preservation.
- Mobile regression covers six languages × five portrait sizes (320–760px), 844×390 touch landscape, desktop, one fixed bottom action, safe-area padding, unobscured footer/focused recovery field, disclosures, duplicate clicks, summary focus, legacy save continuation, retirement and PNG download. The dock links directly to the outstanding story choice; after choosing it, the link returns to all decisions.

Tests use isolated browser contexts and suppress third-party analytics requests only in those contexts. Responsive checks are browser emulation, not certification on physical devices. Temporary browser reports/screenshots are under `/tmp/copero-game-acceptance`, `/tmp/copero-mobile-career`; they include fictional test players.

## Deployment

Push `main` through the existing GitHub Actions workflow, which repeats lint/tests/build/type/SEO checks, deploys Cloudflare and verifies the live release identity and main routes. The workflow verifies the deployed Git commit, all six language homepages, private-career noindex, sitemap, robots, redirects and key content pages.
