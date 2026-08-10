<div align="center">
  <img src="assets/img/logo-primary.png" alt="Vince AI Ltd" width="320">
  <p><strong>Technology and AI, built around your business.</strong></p>
  <p>
    <img alt="HTML5" src="https://img.shields.io/badge/HTML5-valid-000?style=flat-square">
    <img alt="CSS3" src="https://img.shields.io/badge/CSS3-design%20system-000?style=flat-square">
    <img alt="JavaScript" src="https://img.shields.io/badge/JS-vanilla%20%C2%B7%20zero%20deps-000?style=flat-square">
    <img alt="A11y" src="https://img.shields.io/badge/a11y-WCAG%202.1%20AA-C0C0C0?style=flat-square">
  </p>
</div>

---

The official website for **Vince AI Ltd**, a London-based software and AI
consultancy. Static HTML, CSS, and vanilla JavaScript. No build step, no
dependencies, no framework.

## Quick start

```bash
make serve     # http://localhost:8000
make test      # build verification suite, 245 assertions, ~1s
```

No build step, no dependencies. To deploy, upload the contents of this
directory to your web root. There is nothing to compile.

`make test` runs the same suite as CI, so a green local run means a green
pipeline. Run it before you push.

## Structure

```
.
├── index.html                 Home
├── services.html              Services index
├── services/                  9 service detail pages
│   ├── software-development.html
│   ├── ai-automation.html
│   ├── it-consultancy.html
│   ├── cloud-microsoft365.html
│   ├── data-analytics.html
│   ├── training.html
│   ├── licensing.html
│   ├── web-presence.html
│   └── systems-integration.html
├── about.html                 Who We Are (+ team)
├── industries.html            Industries
├── insights.html              What We Think
├── careers.html               Careers
├── contact.html               Contact + validated form
├── thank-you.html             Form confirmation (noindex)
├── sitemap.html               Human sitemap
├── 404.html                   Error page
├── privacy-policy.html        UK GDPR privacy notice
├── terms-of-service.html      Terms
├── cookie-policy.html         Cookie policy
│
├── assets/
│   ├── css/style.css          Design system, 53 tokens, ~480 lines
│   ├── js/main.js             Nav, validation, reveal, ~160 lines
│   └── img/                   Optimised logos + favicons
│
├── tests/run.mjs              Build verification, 245 assertions, no deps
├── .github/workflows/ci.yml   Pipeline: verify on every push, deploy gated
├── brand/                     Brand guidelines + master source art
│
├── robots.txt
├── sitemap.xml                20 URLs
├── site.webmanifest           PWA manifest
├── .htaccess                  HTTPS, security headers, caching
├── .editorconfig / .gitattributes / Makefile
└── .gitignore
```

## Documentation

| File | What it covers |
|---|---|
| `CHANGELOG.md` | Every defect found on the live site, and its fix |
| `MESSAGING-REVIEW.md` | StoryBrand analysis behind the homepage copy |
| `BOOKS-REVIEW.md` | Which of the 148 knowledge-hub books applied, and which did not |
| `CONTENT-TODO.md` | The two things still needed from you: photography, testimonials |
| `CONTRIBUTING.md` | Local workflow, commit convention, house rules |
| `tests/README.md` | What the suite covers and why each assertion exists |

## Measurement

The One Metric That Matters is **enquiry rate, enquiries submitted ÷ homepage
sessions**. Pageviews are deliberately not the target; a rising pageview count
tells you nothing you can act on.

The funnel is instrumented as `cta_click` → `form_start` → `enquiry_submitted`,
with `form_validation_blocked` to show where the form loses people. All events
fire only after consent is granted.

## Brand

| Token | Hex | Use |
|---|---|---|
| Pure Black | `#000000` | Wordmark, headings, dark surfaces |
| Metallic Silver | `#C0C0C0` | Chevron mark, accents, rules |
| Pure White | `#FFFFFF` | Backgrounds, inverse text |

The logo is the **Vince AI** wordmark with the metallic chevron positioned at
the upper right. Three web-optimised variants ship in `assets/img/`:

- `logo-primary.png`, black wordmark, for light backgrounds (header)
- `logo-light.png`, white wordmark, for dark backgrounds (footer)
- `logo-icon.png`, chevron only, for favicons and watermarks

All have transparent backgrounds. Master files and full usage rules are in
[`brand/`](brand/).

## Design system

Everything is driven by CSS custom properties in `:root`. Retheme the entire
site by editing tokens, no component CSS needs touching.

```css
:root {
  --black: #000000;
  --silver: #C0C0C0;
  --white: #FFFFFF;

  --s-1: 4px;  --s-5: 24px;  --s-9: 96px;   /* 8pt spacing scale */
  --r-md: 10px;                              /* radius */
  --shadow-md: 0 6px 18px rgba(0,0,0,.09);   /* elevation */
  --maxw: 1180px;                            /* layout */
}
```

**Components**: buttons (5 variants × 3 sizes), cards, mega menu, hero, stats,
checklist, CTA band, form fields, footer.

**Breakpoints**: 900px, 820px (nav collapses), 560px.

**Cookie consent**: banner + a footer "Manage Cookies" button that reopens it.
The choice is stored in `localStorage` and analytics is loaded only on grant.

## Accessibility

- Semantic landmarks (`header` / `nav` / `main` / `footer`) with a skip link
- Exactly one `<h1>` per page, ordered heading hierarchy
- `aria-expanded` on the mobile toggle, `aria-current="page"` on active nav
- Form errors announced via `role="alert"` and `aria-invalid`
- Visible `:focus-visible` rings, adapted for dark surfaces
- Black on white = 21:1 contrast (AAA)
- Honours `prefers-reduced-motion`
- Works fully with JavaScript disabled

## SEO

Per-page `<title>`, meta description, canonical URL, Open Graph and Twitter
cards. `Organization` JSON-LD on the homepage. `sitemap.xml`, `robots.txt`,
and a human-readable sitemap page.

## Before you deploy

1. **Wire up the contact form.** `contact.html` posts to `thank-you.html`.
   Point `action` at your handler and validate server-side, client validation
   is UX only, never a security control. Whichever processor you use, it is
   already disclosed in the Privacy Policy; keep that accurate if you switch.
   Do not put activation or setup instructions in the page body.
2. **Set your GA4 ID.** Open `assets/js/main.js` and set `GA_ID`. Until you do,
   the site loads no analytics and sets no cookies. Analytics only ever loads
   after a visitor clicks Accept, do not add a `gtag` tag to the HTML, as that
   would fire before consent and break the promise the banner makes.
3. **Enable HTTPS.** `.htaccess` forces it and redirects www → apex on Apache.
   Configure the equivalent on Nginx. Canonicals assume the apex host.
4. Submit `sitemap.xml` to Google Search Console.

See [`CHANGELOG.md`](CHANGELOG.md) for the full list of issues found on the live
site and fixed here, [`MESSAGING-REVIEW.md`](MESSAGING-REVIEW.md) for the
StoryBrand analysis behind the homepage copy, and
[`CONTENT-TODO.md`](CONTENT-TODO.md) for the two things still needed from you
(photography and testimonials).

## Browser support

Chrome, Edge, Firefox, Safari (latest two versions), iOS Safari 13+,
Chrome Android. Degrades gracefully in older browsers, `backdrop-filter` and
`IntersectionObserver` both have fallbacks.

## Licence

© 2026 Vince AI Ltd. All rights reserved.
Registered in England and Wales, Company No. 17307271.

The Vince AI name, logo, and chevron device are trademarks of Vince AI Ltd.
