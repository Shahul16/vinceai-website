# Build verification suite

```bash
node tests/run.mjs      # or: make test
```

Zero dependencies, deterministic, about one second. Exit code 1 on any failure,
so it gates the CI pipeline.

## What it covers

| Suite | Guards against |
|---|---|
| HTML structure | Unbalanced or mismatched tags |
| Document head | Missing doctype, lang, charset, viewport, title, canonical, og:image |
| SEO | Descriptions outside 70–165 chars, duplicates, wrong canonical host |
| Accessibility | Multiple or missing `h1`, skipped heading levels, images without alt, missing skip link |
| Links | Dead `href="#"`, unresolved local paths, anchors pointing at absent ids |
| Privacy and consent | Hardcoded analytics tags, ungated loading, consent controls built as links, dead privacy-policy link in the consent block |
| Content integrity | Published setup notes, `TODO`/`FIXME`, placeholder copy, competing CTAs, wrong company number |
| StoryBrand | Slogan in the `h1`, missing hero CTA, plan step count, absent stakes or lead capture, homepage word count |
| Performance budget | CSS over 40 KB, JS over 20 KB, images over 400 KB, payload over 2 MB |
| Config files | Malformed sitemap, pages missing from it, invalid manifest or JSON-LD, wrong robots.txt |

## Why these assertions

Each one corresponds to a defect that reached production. The suite was written
after an audit found them, so that the next occurrence costs a failed build
rather than another audit.

## Adding a test

Follow the existing shape, `describe` / `it` / `assert`. Keep it deterministic
and offline. If a test needs the network or a browser it belongs in a separate
pipeline stage, not here.
