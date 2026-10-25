# Career measurement contract · career-v1

This contract describes new client instrumentation. Historical GA4 data contains only automatic/enhanced events and cannot be used to infer a historical gameplay funnel. The existing Google tag remains installed once. Automatic history page views remain enabled; no extra page-view installation was added.

| Event | Accepted business state | Does not mean | Deduplication |
| --- | --- | --- | --- |
| career_start | Newly created local career successfully loaded at its exact target career route within 10 minutes | Start-button click, navigation attempt or restored old save | Once per local run |
| season_complete | Engine accepted the next season and the new game state was committed in persistent or session-only storage | A chosen story/training option, failed simulation or a repeated click | Once per local run and season number |
| career_complete | A successful playing → retired transition, manual or at the age limit | Rendering/reloading an existing retired save | Once per local run |
| career_restart | A new career successfully loaded after a completed career, including confirmed retirement restart across layouts | Restart click, canceled confirmation or merely opening setup | Once per new replay run; valid intent expires after 10 minutes |
| career_continue | First accepted season in a newly created replay career | Opening or creating that replay | Once per replay run |
| career_export | A valid local PNG/JSON Blob was handed to the browser | Proof of a saved disk file, sharing or referral traffic | Each successful export handoff; adoption reports must count users |
| career_error | Known profile/season/export failure branch | A free-text error log | Per failed attempt; error_step enum only |

Profile-step clicks are deliberately not counted as successful game starts. Success is measured after the destination career has loaded, avoiding event loss during cross-layout navigation without delaying players.

Every custom event includes `measurement_version=career-v1`, `game_mode=career`, and `site_language=es|en|it|pt|zh|de`. Relevant events add `career_type=new|replay|existing`, numeric `season_number=0..22`, `completion_type=manual|age_limit`, `export_format=png|json`, or `error_step=profile|season|export`. They do not carry player names, seeds, save contents, decisions, career IDs, or run tokens.

`copero.measurement.v1` stores only local handoff/deduplication receipts independently of `copero.career.v1`. Starting a genuinely new run creates a fresh local token even when the deterministic game ID is identical. Old game saves and old seasons are never rewritten or backfilled. Missing, expired, corrupt or blocked analytics storage cannot prevent gameplay. `ga-disable-G-4JYX8WF2SZ` and missing/blocked tags are respected. Counting is best effort: local receipts do not guarantee delivery or globally exactly-once processing in racing browser tabs.

## Analysis contract

Primary entry population: **session** source/medium `google / organic`; device category `mobile`; exact session landing page separately `/`, `/en`, `/it`, `/pt`, `/zh`, `/de` (optional normal query strings). Resume visitors count as effectively participating after **any** accepted `season_complete` following their entry, not only their first-ever season. Additional all-device/direct reports are context, not replacements for that population.

Use separate closed ordered analyses for entry → valid season, valid season → retirement, and retirement → replay → replay's first season. State whether the tool counts users or sessions. GA4's user-level funnel can span sessions or different careers and must not be called a strict same-session/per-career funnel. Do not concatenate disjoint sub-funnels into a strict end-to-end queue. If using a 30-minute per-step limit, say per adjacent step; do not claim a 30-minute global limit. Report manual and automatic retirements separately. Parameters must be verified in actual requests before configuring new reports.

Recommended event-scope custom dimensions, if configuring the property: `site_language`, `career_type`, `measurement_version`; optionally `season_number` (23 possible values) to identify first-season steps. Do not register local tokens or identifiers. This code change does not itself register dimensions, publish a GA4 funnel, activate filters or designate key events.

Freshness: compare fixed equal-length **processed** windows after the actual deployment; exclude mixed-version launch days or label them mixed. Re-read the same historical window to detect backfill without changing the original sealed baseline. No data or zero denominator means N/A, not zero conversion or total abandonment. Native `form_submit` is not a validated career start.

## Client verification

Run `scripts/check-career-analytics.py` against a static production preview. It uses a separate mobile-UA/touch context for each language and installs fail-closed routing before first navigation. Only same-origin assets/documents and original official Google tag scripts may leave the context. All analytics, Plausible and advertising collectors are handled locally, never forwarded. Script hashes, intercepted protocol, locale parameters, referrer, lifecycle counts, exports and privacy-canary checks are written to the explicitly selected private artifact directory.

The test executes real form validation, creation, decisions, duplicate-click guards, season advancement, retirement, cancellation, cross-layout replay, identical-ID new runs and replay's first valid season. English also runs the full 22-season automatic retirement. Reloading mid-career or after retirement must not backfill events. Unit tests cover stale/wrong-target handoffs, corrupt/blocked storage, tag opt-out and failure isolation. This proves client behavior, not GA4 ingestion, rankings or conversion uplift.

Analysis exports and raw requests belong under ignored `.private/analytics/`, outside `public/` and static export output. A baseline manifest is sealed before instrumentation changes and checked afterwards. Never commit user analytics evidence to the public GitHub repository.
