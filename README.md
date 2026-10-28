# tantuyu.slidevs

Each presentation lives in `slides/<slug>/slides.md`. The build and local-development
commands discover those entries automatically.

## Slide source structure

```text
slides/
├── _shared/
│   ├── package.json      # Private local Slidev addon
│   ├── components/       # Counter, Footer, Image, InputExample, LoginExample
│   ├── layouts/          # Shared tty-* layouts
│   └── snippets/         # Shared code snippets
├── api-world/
│   ├── slides.md
│   ├── global-bottom.vue # Presentation-specific footer
│   ├── styles/
│   └── public/
├── web-basic/
│   ├── slides.md
│   └── public/
└── web-vuln/
    ├── slides.md
    └── public/
```

`web-basic` and `web-vuln` load the shared components and layouts through this
headmatter configuration:

```yaml
---
theme: default
addons:
  - "@/../_shared"
---
```

Slidev's `@/` prefix resolves from the presentation's directory, so
`@/../_shared` points to `slides/_shared/`. The addon's `package.json` is required
by Slidev; it is private and does not need to be published or installed separately.

Keep reusable components and layouts in `slides/_shared/`. Keep deck-specific
components, layouts, styles, and assets inside the presentation's own directory;
local components and layouts can override addon components and layouts.
`api-world` does not load the addon because it currently uses its own footer and
theme layouts.

`_shared/` intentionally has no `slides.md`, so build, dev, and the landing page
continue to discover only presentation directories.

`scripts/slides.mjs` defines the discovery API's `SlideSource`, `SlideMetadata`,
and `SlideWithMetadata` types with JSDoc. The landing page inherits Astro's strict
TypeScript configuration (including `allowJs`) so imports infer those types
directly; frontmatter values remain `unknown` until narrowed.

## Local development

The `api-world` cover uses a solid background; no animated background asset is required.

```sh
pnpm install
pnpm dev
```

`pnpm dev` presents an interactive slide selector. Start a presentation directly with:

```sh
pnpm dev api-world
pnpm dev api-world -- --port 3031 --no-open
```

The landing page is an Astro static site. Run it locally with:

```sh
pnpm dev:landing
```

The landing-page search filters presentation titles, ignoring case and surrounding
whitespace. Nonmatching cards are hidden; if nothing matches, only the no-results
message is shown in the list. Clearing the search restores all presentations.

The landing-page theme initially follows the system color scheme, including live
changes. The top-right button switches between light and dark and remembers the
choice in `localStorage` under `theme`. If storage is unavailable, switching still
works for the current page. Without JavaScript, the system theme applies and the
toggle stays hidden. This setting does not change individual Slidev presentations.

The landing-page footer links to the author's GitHub profile and this repository.

Build every discovered slide presentation and regenerate the Astro landing page:

```sh
pnpm build
```

To regenerate only `dist/index.html` and its landing-page assets:

```sh
pnpm build:landing
```

Preview the complete built site (homepage and all slide presentations):

```sh
pnpm build
pnpm preview
```

Open `http://127.0.0.1:4173/`. Preview serves `dist/` without rebuilding; run
`pnpm build` again after changing source files. If the homepage has not been built,
preview exits with a build instruction.

Direct links and refreshes such as `/api-world/2` and `/api-world/presenter/2`
load that presentation's `index.html`. Unknown presentations and missing assets
return 404 rather than the homepage.

Override the port or explicitly expose preview to your local network:

```sh
pnpm preview --port 4174
pnpm preview --host 0.0.0.0 --port 4174
```

The default host is loopback-only. An occupied port is an error rather than a
silent port change. This server is for local preview, not production hosting.

## Manual Cloudflare deployment

The project and package are named `tantuyu.slidevs`. The configured Cloudflare
Worker name is `tantuyu-slidevs`, because Worker names cannot contain periods.
Astro and Slidev build locally; Cloudflare serves the generated `dist/` directory.

The existing deployment remains at
<https://tty-slides.huangmayor0905.workers.dev>. Deploying with the renamed
configuration creates a separate Worker expected at
<https://tantuyu-slidevs.huangmayor0905.workers.dev>; this does not rename or
delete the existing deployment. The new Worker has not been published yet.

Install dependencies and authenticate before the first deployment:

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm build
```

Validate Cloudflare routing locally, then check and publish the deployment:

```sh
pnpm exec wrangler dev
# Stop the local server before continuing.
pnpm exec wrangler deploy --dry-run
pnpm exec wrangler deploy
```

For subsequent updates, keep the complete `dist/` directory and build only the
changed presentation with `pnpm build api-world` (this also rebuilds the homepage),
or use `pnpm build:landing` for homepage-only changes. Then run
`pnpm exec wrangler deploy`. Rebuild everything after changing shared dependencies
or when `dist/` is missing. Builds do not automatically remove old assets or
deleted presentation directories; remove obsolete generated output before publishing.

The Worker handles extensionless presentation routes such as `/api-world/2` and
`/api-world/presenter/2`. Missing assets and unknown presentations return 404.
Wrangler's local state is excluded from version control.

The remote VPS workflow has been manually disabled in GitHub Actions. Its local
configuration is retained as `.github/workflows/deploy.yml.disabled`, which GitHub
does not execute once the rename is pushed. Disabling a workflow does not cancel
runs already in progress.

Learn more from the [Astro](https://docs.astro.build) and [Slidev](https://sli.dev/) documentation.
