# Publishing jinsko.com

`.github/workflows/publish.yml` builds Hugo and deploys its artifact directly to GitHub Pages. It does not push generated files to `gh-pages` or trigger an additional branch-based Pages build. Pull requests build only; pushes to `main` and manual runs on `main` publish. Hugo Extended 0.169.0, Hugo Narrow v2.1.4, and the custom domain configuration remain unchanged.

## One-time repository setting

For this workflow to publish, open [Settings → Pages](https://github.com/jinsko1/Website-Project/settings/pages) and change **Build and deployment → Source** from **Deploy from a branch** to **GitHub Actions**. Do not select one of GitHub's suggested generators: the repository already contains its workflow. After committing/pushing this change and selecting the source, run **Hugo Publish** on `main` if it has not already started. Keep the existing custom domain and DNS settings. The old `gh-pages` branch may remain; it is no longer the publishing source.

This account setting is not changed by editing a workflow file. Until it is changed, the migration is not active and direct deployment can fail with a Pages source/configuration error.

## Behavior

The workflow uploads only `public/`, then deploys after that build succeeds. Production runs share a concurrency group with cancellation disabled so a newer push does not interrupt an active publish; GitHub keeps the latest pending run. PRs use separate groups and do not upload or deploy. A manual dispatch permits publishing without an empty commit. Deployment has `pages: write` and `id-token: write`; building requires only repository read access.

## Remaining GitHub Pages limitation

This migration removes the intermediate branch publication and separate generated build workflow. It does **not** bypass GitHub's publishing service. `syncing_files` is a backend deployment stage and can still stall. `deploy-pages@v5` caps its timeout at 600000 ms (10 minutes); a larger job timeout does not extend that cap. Repeated publication failures despite valid artifacts require GitHub-side investigation or a separately authorized hosting migration. Changing the workflow cannot promise to eliminate a provider outage. The Node `punycode` deprecation warning is not the observed timeout cause.

If a publish fails, rerun the failed job once. If it repeats, preserve the failed run URL and deployment ID for support rather than creating a stream of new pushes. No unbounded automatic retry loop is configured.

References: [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [official Hugo workflow](https://github.com/actions/starter-workflows/blob/main/pages/hugo.yml), and [deploy-pages v5 timeout implementation](https://github.com/actions/deploy-pages/blob/v5/src/internal/deployment.js).
