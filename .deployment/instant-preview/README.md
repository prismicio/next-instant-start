# Instant Start preview patch

Path-based multi-tenant preview for the Prismic-managed Vercel deployment.

The `instant-preview.patch` patch file is applied at deployment time.

### Scripts
- `patch-apply.sh`: Apply the current patch locally. This is also the build command for Vercel.
- `patch-generate.sh`: Regenerate the patch file from local changes
- `patch-verify.sh`: Check for patch conflicts
