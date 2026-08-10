# Brand Assets

`source/` holds the master brand files as supplied. They are high-resolution and
**not** web-optimised — do not link to them from the site.

The production, web-optimised derivatives live in `../assets/img/`:

| Web asset | Derived from | Use |
|---|---|---|
| `logo-primary.png` (+`@2x`) | `logo-primary-master.png` | Header, light backgrounds |
| `logo-light.png` | `logo-primary-master.png` (recoloured) | Footer, dark backgrounds |
| `logo-icon.png` | `logo-icon-master.png` | Chevron mark, watermark, PWA icon |
| `favicon.ico` / `favicon-32` / `favicon-16` / `apple-touch-icon` | `logo-icon-master.png` | Browser + device icons |

All web derivatives have transparent backgrounds. See `BRAND-GUIDELINES.md`
for colour, typography, and usage rules.
