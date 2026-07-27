# Polluted Hub — Website

Marketing site for the Polluted Hub Roblox script hub. A single self-contained
`index.html` with no build step.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The entire site — markup, styles and script |
| `assets/logo.png` | Logo used in the nav, About page, footers and favicon |

## Running it

Open `index.html` directly, or serve the folder:

```
python3 -m http.server
```

Then visit http://localhost:8000.

## How it works

The site is a three-page SPA driven by hash routing — no server-side routing needed:

- `#` — script list with live search
- `#about` — comparison table and positioning
- `#script/<game-name>` — per-game detail page with the loadstring and copy button

## Editing content

**Scripts** live in the `games` array near the top of the `<script>` block. Each entry
needs `name`, `icon` (an [Iconify](https://icon-sets.iconify.design/) name), `tags`,
`desc`, `features` and `script`. Adding an entry updates the grid, the search index and
the related-scripts suggestions automatically.

**Discord links** point at `https://discord.gg/pollutedhub` in six places: the nav, the
About page CTA, the game-page help card, and the Discord icon in each of the three
footers. The YouTube and Telegram footer icons are still `href="#"` placeholders.

## Known caveats

- **Tailwind is loaded from `cdn.tailwindcss.com`**, which is the play-CDN build. It
  prints a "should not be used in production" console warning, adds ~400 KB on every
  page load, and flashes unstyled content on slow connections. For production, compile
  Tailwind to a static CSS file instead.
- **Icons come from Iconify's runtime API.** Icon glyphs are fetched from
  `api.iconify.design` on page load, so they need network access to appear.
- **Fonts come from Google Fonts.** They fall back to system sans if unreachable.
- The footers read `© 2025`.

## Deploying

There is no build step — the site is served straight from the repo root. `vercel.json`
pins that explicitly:

```json
{
  "framework": null,        // no framework preset ("Other")
  "buildCommand": null,     // nothing to build
  "installCommand": null,   // no dependencies to install
  "outputDirectory": ".",   // serve the repo root
  "cleanUrls": true,
  "trailingSlash": false
}
```

`framework: null` matters: if the Vercel project's dashboard preset is set to anything
else (for example `services`), the deploy fails with *"Project framework is set to
'services', but no services are declared."* The `vercel.json` value overrides the
dashboard setting. If a deploy still fails on framework detection, change it directly at
**Project → Settings → Build & Deployment → Framework Preset → Other**.

Any static host (GitHub Pages, Netlify, Cloudflare Pages) works the same way — point it
at the repo root with no build command.
