# GitHub → Cloudflare automatic deployment

Repository: https://github.com/smallflyk/copero. Production: https://copero.pro. Existing Worker: copero-pro. Account: f374eebcbf49e49d869c284792be5d54.

## Behavior

`.github/workflows/deploy-cloudflare.yml` runs on each push to main. Manual runs are supported on main only. Deployments are serialized so two runs cannot upload/promote production simultaneously. GitHub token permissions are contents:read; checkout credentials are not persisted. Official checkout/setup-node actions are pinned to their verified v6 commit SHAs. Node 22 and npm ci use package-lock.json.

The workflow runs lint, Node tests, production build, TypeScript and SEO checks before deploying. Any failure stops deployment and leaves the previously deployed Worker serving. Wrangler is the version locked in package-lock.json, rather than an unpinned CI download. It deploys the existing Worker/domain configured in wrangler.jsonc.

A generated `out/__release.json` identifies the exact Git commit (no token or private data). After deploying, scripts/check-live-deployment.mjs verifies that commit is actually served, then checks all six home languages, game noindex, guides, privacy, sitemap, robots, social image, Spanish alias redirect and real 404 responses. The generated marker remains in ignored out/ and is not committed.

The cloud workflow runs Node/build/SEO checks and HTTP smoke checks. Full interactive browser regression scripts remain available separately; this workflow does not claim to run them on every push.

## One required repository secret

CI cannot reuse a developer's interactive Wrangler OAuth login. Create a deployment API token in Cloudflare, using Edit Cloudflare Workers as the starting template and limiting its resources to this account and copero.pro. The deployment needs Workers Scripts Edit for the account, and Zone Read / Workers Routes Edit for the copero.pro custom domain. Account Read may be included for account lookup. Do not grant global administration or unrelated account resources. If customizing the template, retain any additional deployment permission Cloudflare explicitly requires for the existing Worker.

Add the token directly to https://github.com/smallflyk/copero/settings/secrets/actions/new under the exact name `CLOUDFLARE_API_TOKEN`. Never put it in the source, workflow YAML, README, commit, log or chat. This repository has a fixed public account ID in the configuration, so another account-ID secret is unnecessary.

CLI alternative, with an interactive hidden value prompt:

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo smallflyk/copero
```

After adding the secret, rerun the workflow or push a new main commit. Inspect https://github.com/smallflyk/copero/actions and confirm both Deploy and Verify steps succeed before treating the integration as operational. A missing secret deliberately fails with a clear error after validation; it is never silently reported as a successful deployment.

## Operations

- Normal update: commit and push to main; wait for the Actions run to finish.
- Retry after a transient failure: rerun failed jobs from the relevant Actions run.
- Manual deployment: select Deploy copero.pro → Run workflow → main.
- Revert code with git revert and push to main to deploy the reverted state. The release marker will identify the revert commit.
- Rotate the deployment token by updating the same GitHub secret. Do not upload local Wrangler authentication files.
- Keep this workflow as the sole Git-triggered production deployer; do not also enable a separate native Workers Builds pipeline for the same main branch without intentionally coordinating them.

References: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/ ; https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency
