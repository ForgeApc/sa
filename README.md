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

**Discord links** are `https://discord.gg` with no invite code, in four places: the nav,
the About page CTA, the game-page help card, and the social icons in all three footers.
The footer social links (Discord, YouTube, Telegram) are all still `href="#"`.

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

Vercel serves this as-is with no build command — `vercel.json` only enables clean URLs.
Any static host (GitHub Pages, Netlify, Cloudflare Pages) works the same way.
