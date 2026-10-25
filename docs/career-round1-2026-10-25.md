# Career improvements, rules 1.2 — 2026-10-25

## Behavior

- Fourteen original story events replace the four-event rotation. Injury, low fitness, selected club move, last-season trophy, limited appearances, rating decline, veteran age and expired contract trigger relevant events in that priority order. The previous four completed events are excluded; eligible general events fill the gaps. Selection is deterministic and consumes no season RNG.
- Changing the club selection clears the pending story choice. A stale event/choice pair cannot advance the season.
- Eight ordered stages explain actual changes: club continuity/transfer, story, coach response/position review, training/recovery, rehabilitation, new injury, development/ageing, and matches/honours. Each stage begins with the preceding stage's result and reconciles to the whole-season condition changes. Selection and injury availability are recorded separately.
- Story previews and reviews distinguish nominal gains from gains limited by condition caps or potential. Growth modifiers explain that they do not affect age-related decline.
- ES/EN/IT/PT/ZH/DE cover new events, triggers and attribution. Retirement age/endings, singular/plural counts, academy salary units and rehabilitation headings use complete translated phrases.
- Version-1 saves remain supported. Existing no-story and rules-1.1 decisions replay unchanged; old reviews are preserved without fabricated attribution. Rules 1.2 applies to newly selected UI seasons. Public rules and reproducible strategy examples reflect the new selection logic.

## Validation

- 52 Node tests pass, including a golden legacy save/next-decision comparison, cooldown and state trigger checks, capped-effect checks, corrupt-save rejection, 30 complete contextual careers across all ten positions, and exact deterministic replay.
- Lint, isolated production build, TypeScript and SEO export checks pass: 84 localized HTML pages, 72 indexable URLs, valid canonical/hreflang, sitemap and private career noindex.
- Browser acceptance: ten positions × 22 seasons = 220 actual UI seasons, five desktop and five mobile careers. Every resulting save independently replays exactly through the engine and visible scores reconcile. Branches: 57 bigger-club moves, 35 moves for minutes, 23 full rehabilitations, 21 early returns, five minutes requests, four position reviews. No application console errors.
- Mobile regression: six languages × five portrait sizes (320–760px), touch landscape, desktop, safe-area padding, fixed single action, disclosure keyboard controls, transfer/rehabilitation, duplicate-click prevention, refresh, 17 further seasons to retirement and PNG export. These are browser emulations, not physical-device tests.
- Six-language contextual regression: club selection invalidates the pending choice, four subsequent contextual decisions obey cooldown, eight-stage changes reconcile, labels/results are translated, retirement/PNG/reload work. QA contexts suppress third-party analytics and advertising requests.
- Chrome DevTools mobile inspection confirmed the expanded Spanish attribution remains readable without horizontal overflow. Example fitness 15 → 27: story +14, training −3, rehabilitation +13, new minor injury −12.

Reproduce with `npm test`, `npm run lint`, `npm run build`, `npm run typecheck`, `npm run check:seo`, then the three browser scripts documented in README. Browser artifacts are temporary QA files, not production saves.
