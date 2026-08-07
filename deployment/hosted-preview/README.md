# Instant Start hosted preview overlay

Prismic-managed path-based hosted preview for Instant Start. The public starter keeps a clean `src/` tree; this directory holds a committed patch applied before Vercel builds the shared starter project.

## Architecture

```mermaid
flowchart LR
    PageBuilder["Page Builder"] -->|"GET /api/preview/abc12345?token=..."| PreviewRoute["/api/preview/abc12345"]
    PreviewRoute -->|"Validate repo + token"| ContentAPI["abc12345 Content API"]
    PreviewRoute -->|"Draft Mode + redirect"| HostedPage["/hosted-preview/abc12345"]
    HostedPage --> ContentAPI
```

1. Obelix provisions a Production preview URL such as `https://next-instant-start.vercel.app/api/preview/abc12345`.
2. Page Builder opens that URL with the normal Prismic preview ref token.
3. The preview route validates the repository label and preview token.
4. After enabling Draft Mode, the user is redirected to `/hosted-preview/abc12345`.
5. The hosted preview page fetches and renders that repository's content with `cache: "no-store"`.

The overlay removes root-level `<PrismicPreview>` (which targets `prismic.config.json`'s repository) so tenant pages only mount one toolbar for the previewed repository. Hosted preview routes use `dynamic = "force-dynamic"` so Draft Mode is not baked into a static shell.

Canonical starter routes stay unchanged:

- `/api/preview` — local single-repository preview
- `/` — canonical homepage from `prismic.config.json`

## Files

| File | Purpose |
| --- | --- |
| `hosted-preview.patch` | **Single source of truth** — git patch applied to `src/` at build time |
| `apply.sh` | Applies `hosted-preview.patch` with conflict checking |
| `generate-patch.sh` | Captures current `src/` overlay changes into `hosted-preview.patch` |
| `verify-deployment.sh` | Asserts `src/` has no hosted preview runtime |

## Vercel configuration

Set this on the **Prismic-managed** `next-instant-start` Vercel project only. Do not add it to user clones.

**Build Command**

```sh
./deployment/hosted-preview/apply.sh . && npm run build
```

Do **not** commit a project-level `vercel.json` with this build command. User clones should keep the default `npm run build`.

No custom DNS or environment variables are required for the path-based feasibility setup.

## Updating hosted preview logic

1. Edit the hosted preview files directly under `src/`.
2. Run `./deployment/hosted-preview/generate-patch.sh .`
3. Commit `deployment/hosted-preview/hosted-preview.patch`.

`generate-patch.sh` writes the patch and restores `src/` to the clean starter tree so hosted preview runtime is not committed on `main`.

## Conflicts

A conflict happens when public `src/` changes on `main` but `hosted-preview.patch` still reflects the old base — for example, someone refactors `src/prismicio.ts` without regenerating the patch.

At build time, `apply.sh`:

1. Runs `git apply --check` on `hosted-preview.patch`
2. **Fails closed** if hunks do not apply cleanly
3. Applies the patch only when the check passes

Regenerate the patch after resolving conflicts locally:

```sh
# Make hosted preview changes in src/, then:
./deployment/hosted-preview/generate-patch.sh .
```

## Rollback

1. Restore the default Vercel Build Command: `npm run build`.
2. Redeploy the starter. Existing repositories keep their configured preview URLs until changed manually.

## Local development

```sh
# Verify the public starter stays clean
./deployment/hosted-preview/verify-deployment.sh

# Apply the patch locally (mutates src/)
./deployment/hosted-preview/apply.sh .
```

After applying locally, reset with:

```sh
git checkout HEAD -- src/ && git clean -fd src/
```

## Handoff

When a user runs `prismic init --repo <name>` on a cloned starter, the CLI:

- Removes hosted preview URLs from the repository settings
- Deletes `deployment/hosted-preview/` from the local project
- Configures the local Development preview
