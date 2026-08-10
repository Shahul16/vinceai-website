# Knowledge-hub review

148 books across 22 folders, reviewed against this website.

**Six folders produced changes. Sixteen did not, and the honest reason is that
they are books about the services Vince AI sells, not about a 1.5 MB static
brochure site.** Applying Kubernetes or microservice patterns here would be
exactly the over-engineering those same books warn about, so I have not.

---

## Applied

### `tdd + bdd` (11 books), the largest gap

*The Art of Unit Testing*, *Test-Driven JavaScript Development*,
*developer-testing*, *quality-code*.

The site had **no automated tests**. Verification was me running throwaway
scripts, which shipped nothing and protected nothing after I stopped.

Added `tests/run.mjs`, 245 assertions, zero dependencies, about one second,
exit code 1 on failure. Every assertion guards a defect that actually reached
production on this site.

**It found two live bugs the moment it ran:**

1. **The document outline started at `h4` on every page.** The mega-menu group
   labels ("Capabilities", "Industries") were `<h4>` elements sitting before the
   `<h1>`. A screen-reader user navigating by heading met two orphan level-4
   headings before the page title. Nav labels are not document headings —
   they are now `<p>`, and the footer column titles moved from `h4` to `h2`.

2. **Four pages jumped `h1` → `h3`** because sections built entirely from cards
   had no `h2` to hang them from. Added section headings, visually hidden where
   a visible one would be noise.

Both are WCAG 1.3.1 failures. Both had survived every manual pass, including
mine, which is the argument for automation, made concretely.

### `agile-software-development` → *Continuous Delivery*, Humble & Farley

Their thesis: every change reaches release through one automated pipeline, and
deployment stops being an event. There was no pipeline at all.

Added `.github/workflows/ci.yml`, runs the suite on every push and pull
request, with a deploy job gated on it passing. The deploy step is stubbed
because I do not know your host; the gate is not.

### `software-development` → *Clean Code*, *Code Complete*, *The Pragmatic Programmer*

Comments should explain why, not what. Passed through the CSS and JS so each
non-obvious block says what it is guarding, the consent gate explains why no
`gtag` tag may be added to the HTML, the metrics block explains why pageviews
were rejected. Added `.editorconfig` and a `Makefile` so the entry points are
discoverable instead of tribal.

### `git` → *Pro Git*

Added `.gitattributes` (line-ending normalisation, binary declarations, brand
masters excluded from language stats) and `CONTRIBUTING.md` with a commit
convention that asks for the reasoning rather than a restatement of the diff.

### `startups` → *Lean Analytics*, Croll & Yoskovitz

Their test for a good metric: comparative, understandable, and **a ratio**.
Pageviews fail all three, the book names total signups as a vanity metric
outright.

The site had consent-gated GA4 but measured nothing actionable. Defined the One
Metric That Matters as **enquiry rate = enquiries submitted / homepage
sessions**, and instrumented the funnel to make it computable:
`cta_click` → `form_start` → `enquiry_submitted`, plus
`form_validation_blocked` to expose where the form loses people, and
`guide_signup`, `phone_click`, `email_click`. All fire only after consent,
because `gtag` does not exist before it.

### `Website and Portfolio Creators Book` (10 books)

Covered in `MESSAGING-REVIEW.md`, StoryBrand, Ries, Sinek, Cialdini.

---

## Reviewed, not applied

| Folder | Books | Why not |
|---|---|---|
| `docker` | 11 | A static site needs no container. `python3 -m http.server` is the dev environment. |
| `dev-ops` | 8 | Mostly Kubernetes. Orchestrating 22 HTML files would be parody. The CI half is applied above. |
| `microservices` | 11 | No services here to decompose. |
| `rest`, `apis` | 12 | The site consumes no API and exposes none. |
| `go`, `nodejs`, `express` | 28 | No server. Adding one would be a regression. |
| `react`, `angular2` | 3 | A framework would make this site slower and less accessible, not more. |
| `elasticsearch` | 1 | 22 pages do not need a search cluster. |
| `concurrency` | 3 | Not applicable to a document. |
| `machine learning` | 1 | Nothing here to learn from. |
| `linux`, `vim+tmux` | 4 | Tooling preference, not site guidance. |
| `java-script` (5) | 5 | Reviewed. The JS is already dependency-free, strict-mode, and IIFE-scoped; no change earned its keep. |

These are the right books for the work Vince AI sells. They are the wrong books
for this repository, and pretending otherwise would have produced changes that
look diligent and cost you performance.

---

## What the tests now prevent

The audit that produced `CHANGELOG.md` found a dead privacy-policy link inside a
GDPR consent checkbox, FormSubmit setup instructions published to visitors, a
consent control built as `<a href="#">`, and a C-suite job title with two
typos. All four were found by reading, weeks after they shipped.

All four now fail the build.
