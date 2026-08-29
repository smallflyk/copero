# Content and UI QA — Pokémon Champions

## Scope

- English home: `/`
- Japanese home: `/ja`
- Codes: `/codes`
- Keyword guides: `/gameplay`, `/pokemon`, `/regulation-set-m-b`, `/tier-list`, `/best-teams`, `/replica-teams`, `/release-date`, `/mobile`, `/pc`, `/codes`
- Legal and identity surfaces: `/about`, `/privacy-policy`, `/terms`
- Shared header, footer, metadata, theme tokens, and locale switch

## Content verification

- Old site identity: no source occurrences remain.
- Sidebar codes: two researched active codes render in the desktop hero.
- Codes page: three active codes, three expired codes, and one documented mailbox distribution render with their researched dates and rewards.
- Unverified official Discord and YouTube destinations display `待确认` without invented links.
- Homepage facts are limited to the researched release dates, platforms, Google Play update date, battle modes, cross-platform support, Pokémon HOME support, and Regulation M-B rules.
- Official website, Nintendo Store, and Google Play URLs returned HTTP 200 during verification.

## Metadata verification

- Home title: 49 characters.
- Home description: 149 characters.
- Home keywords: 87 characters.
- Canonical and English/Japanese `hreflang` alternates render.
- Japanese content is scoped with `lang="ja"`; the document language updates to Japanese on the localized route.
- All 10 keyword guides have unique 40–60 character titles, 140–160 character descriptions, canonical URLs, article Open Graph metadata, and Article/Breadcrumb JSON-LD.

## Visual and runtime verification

- Desktop viewport: 1280 px wide, no horizontal overflow.
- Mobile viewport: 390 × 844, no horizontal overflow; the decorative code sidebar hides as designed and the mobile menu remains usable.
- English and Japanese hero copy, navigation, code sidebar, buttons, and stats render without overlap or clipping.
- Theme tokens resolve to `--nav-theme: 213 58% 44%` and `--nav-theme-light: 213 58% 56%` in the existing light layout.
- Browser console warnings/errors: none on the Cloudflare Pages local preview.
- Production build: passed with 109 statically generated pages.

Final result: passed.
