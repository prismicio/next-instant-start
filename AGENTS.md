# Agents

Prismic + Next.js App Router instant-start starter. Slice-based pages, preview routes, slice simulator. Repository already wired in `prismic.config.json`.

## Setup

Don't try to setup manually. Always run first:

```sh
npm run init
```

It installs dependencies, checks Prismic login, and sets up local simulator URL for live preview.

## Prismic work

If not already installed, install Prismic skills once:

```sh
npx skills add --global prismicio/skills
```

Use that skill for all Prismic ops: push/pull types and slices, repo settings, previews, tokens, webhooks, docs. Do not guess CLI syntax or edit model JSON by hand.
