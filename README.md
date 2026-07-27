# Polluted Hub — Website

Marketing site for the Polluted Hub Roblox script hub. Plain HTML, CSS and JavaScript
with no build step or dependencies.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole page — hero, preview, games, why-us, Discord, FAQ |
| `styles.css` | Glassmorphic blue theme, layout and responsive rules |
| `script.js` | Game data, interactive hub preview, copy button, mobile nav |
| `assets/logo.svg` | Logo used in the nav, hero, footer and favicon |

## Running it

Open `index.html` directly, or serve the folder:

```
python3 -m http.server
```

Then visit http://localhost:8000.

## Editing content

**Games and preview modules** live in the `GAMES` array at the top of `script.js`.
Each entry drives a card in the games grid. Entries that also have a `sections`
array show up as tabs in the interactive preview, so adding a game to the preview
is just adding `sections` to it.

**The Discord invite** is a placeholder `href="#"` on the buttons marked
`btn-discord` in `index.html` — swap in the real invite URL.

**The loader script** shown in the download section is the `<code id="scriptCode">`
element in `index.html`.

## Replacing the logo

`assets/logo.svg` is a stand-in drawn to match the Polluted Hub artwork. To use the
real image, drop it in as `assets/logo.png` and update the `src` on the `<img>` tags
and the favicon `<link>` in `index.html`.

## Deploying

Vercel serves this as-is with no build command — `vercel.json` only enables clean
URLs. Any static host (GitHub Pages, Netlify, Cloudflare Pages) works the same way.
