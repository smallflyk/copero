# Mobile career improvement — 2026-10-18

## Changes

The mobile active-career page has one fixed bottom season action, with a link back to decisions and a live label for the chosen training plan. It uses the same handler, disabled state and duplicate-submission lock as the previous inline button. It accounts for the bottom safe area and reserves body/scroll space so the footer and focused controls remain reachable. The localized viewport enables viewport-fit=cover.

The mobile training choices are three compact, labelled buttons; the selected plan's benefit/risk description remains visible beneath them. Player identity, condition and latest-season statistics use tighter spacing. Attributes/retirement and season history use keyboard-operable native disclosures, initially closed on phones. Desktop panels stay expanded and the season button remains inline. Phone landscape uses the compact layout too. Existing game saves, rules, decisions and scoring are unchanged.

A 320px test also identified an existing overflowing header, fixed with smaller branding and tighter spacing while retaining 44px menu controls. After a season, focus and scroll return to the latest summary; the action stays fixed. At retirement, the dock and its padding disappear and the result starts at the top.

## Measured change

Same recorded career: English, 390×844 viewport, age 21 after five completed seasons, minor injury and an available transfer. Active career content height decreased from 3,929.16px to 1,742px (55.7%). The previous button began around y=2,418px in the document; the new button is immediately available at the viewport bottom. This measures this fixture, not every language or career state. Footer height is excluded.

## Validation before publishing

- 26 Node tests, ESLint, isolated production build, TypeScript and static SEO checks pass (72 indexable URLs, 2,502 local links).
- Complete browser regression passes: player creation, academies, goalkeeper career to age 38, double-click protection, restored save, valid PNG download, replacement confirmation, corrupt-save fallback, responsive layouts and public pages.
- New scripts/check-mobile-career.py passes in development and production preview. Covers six languages × five portrait sizes (320/375/390/430/760px), 844×390 touch landscape, 761/1024/1440px desktop, one fixed action, footer visibility, keyboard disclosures, no horizontal overflow, synthetic 34px safe area, actual transfer and early rehabilitation choices, refresh restoration, duplicate-click protection, summary focus, 17 remaining seasons through retirement and PNG download. No console/runtime errors.
- Additional production-preview check confirms the dock's training label follows the current choice and the focused recovery select remains above the dock.
- Uses tests/fixtures/mobile-season.json, a valid state derived from the prior UI acceptance run, in isolated browser contexts. Core full-career regression still creates a fresh player through the form. Tests do not touch normal user saves.

Phone checks are browser emulation, including synthetic inset testing, not physical iPhone/Android certification.

## Deployment

Published to https://copero.pro using Worker copero-pro, version efdd912b-8df9-45fb-b841-4d6b349b773b. Formal live-domain verification follows publication; results are recorded below when complete.

## Live verification

The full mobile suite also passed at https://copero.pro after publishing, including all 30 localized portrait combinations, landscape, desktop, synthetic safe area, footer/focused-control visibility, current-plan label, conditional transfer/rehabilitation, duplicate-click guard, refresh, summary focus and continuous play to retirement with PNG download. No console/runtime errors. Root, ES/EN/ZH career pages, rules, guide index, robots and sitemap returned HTTP 200 with the expected content types.

Live measurements are saved at docs/test-results/mobile-career-2026-10-18.json; six screenshots at docs/screenshots/mobile-career-*.png. Main files: components/CareerGame.tsx, app/interface.css, app/[locale]/layout.tsx, lib/i18n/messages.json. Regression: scripts/check-mobile-career.py, tests/fixtures/mobile-season.json.
