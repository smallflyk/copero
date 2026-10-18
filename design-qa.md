# Copero QA

The project has been refactored from the original unrelated template into an English football career simulator.

See [the implementation and validation report](docs/validation.md) for the changed modules, actual test results, browser checks, SEO validation, deployment dry run, and remaining scope. See [the SEO plan](docs/seo-plan.md) for the query map and post-launch workflow.

Current screenshots:

- [Desktop home](docs/screenshots/home-desktop.png)
- [Mobile home](docs/screenshots/home-mobile.png)
- [Player creator, desktop](docs/screenshots/player-creator-desktop.png)
- [Player creator, mobile](docs/screenshots/player-creator-mobile.png)
- [Career result](docs/screenshots/career-result.png)

No live deployment has been performed during this refactor.

## Club dossier visual system

The applied UI/UX Pro Max direction and tokens are in [the design-system master](design-system/copero/MASTER.md). The final light paper / dark field interface was checked at 375, 390, 768, 1024 and 1440px. The homepage tool remains in Hero and keeps its compact height. Browser checks additionally verify true mobile panel stacking, 44px non-overlapping position buttons, and the full career lifecycle. Self-hosted fonts include their OFL licences.

Additional reviewed screens:

- [Career, mobile](docs/screenshots/career-mobile.png)
- [Guides, desktop](docs/screenshots/guides-desktop.png)

Final checks passed: ESLint, TypeScript, 16 engine/Worker tests, production build, SEO export validation, responsive navigation/position checks and full career browser regression. No browser runtime errors or live deployment.

## Six-language interface

The UI now starts in Spanish. Reviewed six language editions at five widths, preserved mobile stacking and 44px pitch targets, and tested that changing language preserves the current career. The three requested Hero marketing lines were removed. See the latest multilingual section in docs/validation.md for actual checks and routing details. Per-language homepage screenshots are in docs/screenshots/languages, and the selector and Chinese downloaded card are also saved in docs/screenshots.
