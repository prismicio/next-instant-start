# Instant Start preview patch

Path-based multi-tenant preview for the Prismic-managed Vercel deployment. Public `src/` on `main` stays clean; `instant-preview.patch` is applied at build time.

**Vercel build command**

```sh
./.deployment/instant-preview/patch-apply.sh . && npm run build
```

**Update the patch**

```sh
./.deployment/instant-preview/patch-apply.sh .   # optional
# edit src/
./.deployment/instant-preview/patch-generate.sh .
git add .deployment/instant-preview/instant-preview.patch
```

**Verify locally**

```sh
./.deployment/instant-preview/patch-verify.sh
./.deployment/instant-preview/patch-apply.sh .
npm run build
git checkout HEAD -- src/ && git clean -fd src/
```
