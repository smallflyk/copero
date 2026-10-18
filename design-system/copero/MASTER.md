# Copero — Club dossier design system

## Product and scope
Free browser football career simulator, built with Next.js 15, React 19 and CSS. The player-creation tool is the homepage Hero. Preserve the compact tool, its ten positions, local saves, all simulation rules, and canonical SEO content.

## Direction
A club scouting dossier: a deep-green football-field background with a subtle grid, cream text, condensed sports headlines, technical captions, and one floodlit tactical pitch. The original shirt is the signature visual. Marketing pages read like a football publication; the career dashboard reads like a player report.

The ui-ux-pro-max search matched block-based sports entertainment and its sports typography entry recommended Barlow Condensed. Its generic luxury serif/pink palette was rejected as unsuitable for this football product. Local Barlow Condensed headings and DM Sans body text keep the athletic character and improve small-text readability.

## Tokens
- Field background: #0b2118 with a subtle 72px grid
- Surface: #142d23; raised: #1c392c
- Text: #f0efdc; secondary text: #b8c7b5
- Rule/border: #355042
- Primary action: #bc4429, white text
- Recessed field: #10271d; field text: #f4f5e9
- Selected marker on field: #d5ec80, #0b2118 text
- Focus: #d5ec80 on dark surfaces
- Error: #ffc5ac on #3b211c

## Type and rhythm
Barlow Condensed 600 for headings and score numerals; DM Sans 400–700 for copy; system monospace for uppercase utility labels. Body 16px / 1.65, form controls 14–16px, utility text >=12px. Spacing: 4, 8, 12, 16, 24, 32, 48, 80px. Borders and alignment express hierarchy; shadows only distinguish the primary workbench. No decorative rotations.

## Components
- Header: compact wordmark, desktop navigation, accessible disclosure menu on mobile.
- Workbench: dark-green shell, numbered underlined steps, identity shirt stage, searchable green country tiles, dark pitch. Selected nationality uses lime fill, dark text and a check; selected pitch position uses lime fill and pressed semantics.
- Main CTA: solid terracotta, >=44px high. Secondary actions use visible borders.
- Career: framed player identity, strong OVR block, equal condition columns, selected decision includes a clear border/inset indicator.
- Results: ink-green legacy ticket and clear six-stat grid, readable charts, original downloadable card with matching colours.
- Guides/articles: constrained readable lines, category/reading-time separation, numbered guide cards, lightly ruled data tables.

## Interaction and accessibility
Transitions 180ms for colour/border/shadow only. Keep keyboard focus, native controls, real labels, 44px touch controls, visible pressed state and error feedback. Mobile labels remain legible. Respect reduced motion. Never remove content to fit a fixed height. No new third-party runtime requests, tracking, animation library, or UI dependency.

## Validation
Check widths 375, 390, 768, 1024, 1440. Check setup, academy navigation, complete career, result download, corrupt saves, keyboard focus, horizontal overflow, canonical metadata and one H1. Screenshots and engine checks are evidence; do not claim live deployment or rankings.
