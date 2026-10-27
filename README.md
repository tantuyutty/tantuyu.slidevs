# tty-slides

Each presentation lives in `slides/<slug>/slides.md`. The build and local-development
commands discover those entries automatically.

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

Learn more from the [Astro](https://docs.astro.build) and [Slidev](https://sli.dev/) documentation.
