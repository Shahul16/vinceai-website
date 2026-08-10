# Contributing

## Local development

```bash
make serve     # http://localhost:8000
make test      # build verification suite
```

No build step and no dependencies. Edit the HTML, CSS, and JS directly.

## Before you push

`make test` must pass. It is the same suite CI runs, so a green local run means
a green pipeline. It takes about a second, there is no reason to skip it.

The suite is not decoration. Every assertion in it guards a defect that has
actually shipped on this site: a dead privacy-policy link inside a consent
checkbox, internal setup notes published to visitors, analytics that would have
fired before consent, headings that started the document outline at `h4`. It
catches those on the next commit rather than the next audit.

## Commit messages

```
<type>: <what changed, imperative>

<why, if it isn't obvious>
```

Types: `feat`, `fix`, `content`, `style`, `perf`, `a11y`, `seo`, `docs`, `chore`.

```
a11y: promote footer column titles from h4 to h2

The mega-menu labels were h4 elements appearing before the h1, so every
page's outline started at h4. Nav labels are not document headings.
```

Explain the reasoning, not the diff. The diff already shows what changed.

## Adding a page

1. Copy the closest existing page, the header, footer, and consent banner are
   duplicated into each file deliberately, because a static site with no build
   step has nowhere else to put them.
2. Update `<title>`, meta description (70–165 characters, unique), and canonical.
3. Add it to `sitemap.xml` and `sitemap.html`.
4. Run `make test`. The suite will tell you if you missed step 2 or 3.

## Editing copy

The homepage follows Miller's StoryBrand structure, offer, problem, plan,
stakes, success, one repeated call to action. `MESSAGING-REVIEW.md` explains why
each section exists. If you change the `<h1>` or remove a section, read that
first; the tests enforce parts of it.

Use one call to action, worded identically everywhere: **Get in touch**. The
suite fails the build if a competing variant appears.

## House rules

- UK English. `organisation`, `modernising`, `enquiry`.
- No dependencies without a concrete reason. The site is fast because it has none.
- No `href="#"`. If it triggers behaviour it is a `<button>`.
- Never add a `gtag` snippet to the HTML, analytics loads from `main.js` only
  after consent, and a hardcoded tag would break that promise. The suite fails
  the build if one appears.
- Keep the performance budget: CSS under 40 KB, JS under 20 KB, no image over
  400 KB, total payload under 2 MB.
