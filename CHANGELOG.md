# Change log

## v2.1, 10 August 2026
Review of the live site at vinceai.co.uk, with every finding fixed in this build.

### Critical

**Dead Privacy Policy link inside the GDPR consent checkbox.**
`contact.html` rendered "in accordance with our Privacy Policy" where the link was
`href="#"`. The one link a data subject is most entitled to follow pointed nowhere.
Now resolves to `privacy-policy.html`.

**FormSubmit setup instructions published to visitors.**
The live contact page displayed: *"Submissions are delivered to … via FormSubmit. The very
first submission triggers a one-time confirmation email to that inbox — click the activation
link in it or future submissions won't be delivered."* Internal configuration notes on a public
page, and it disclosed the delivery mechanism. Removed. The processor is now disclosed properly
in the Privacy Policy instead, where it belongs.

**Job title typo, "Cheif Exective Officer".**
Two misspellings in a C-suite title on the About page. Corrected to
"Chief Executive Officer".

### High

**"Manage Cookies" was `<a href="#">`.**
Resolved to whatever page you were on (`services.html#`, `about.html#`), jumped to top, and
was not semantically a control. Now a `<button type="button">` that reopens the consent banner.

**Fourth team member's card was structurally broken.**
Safrin Fathima rendered inside Habeeba Faiza's card rather than as her own. All four members
are now separate `<article>` elements in a four-column grid.

**Logo accessible name read as "vinceai LTD".**
One run-together token to a screen reader. Now `alt="Vince AI Ltd"`.

**Google Analytics consent gating.**
The banner claims scripts load only on accept. This build guarantees it: `loadAnalytics()`
runs only when the stored choice is `granted`, no `gtag` tag exists in the HTML, and the
choice persists in `localStorage`. Set your GA4 ID in `assets/js/main.js` (`GA_ID`), until
you do, the site sets no cookies at all.

### Medium

**Meta descriptions were thin and duplicated.**
`contact.html` was 30 characters ("Get in touch with Vince AI Ltd."), `careers.html` 24. Every
page reused one string across description, og, and twitter. All 22 pages now carry distinct
descriptions between 70 and 165 characters.

**No `og:image`; Twitter card was `summary`.**
Shared links rendered without artwork. All pages now emit `og:image`, `og:image:alt`,
`og:locale`, and `twitter:card=summary_large_image`.

**Mixed US and UK English.**
"Organization" and "Inquiry type" sat alongside "modernising", "organised", and, in the same
dropdown, "General Enquiry". Standardised to en-GB throughout. (`"@type":"Organization"` in
the JSON-LD is a schema.org keyword and correctly left alone.)

**Stray full stop** on "Business Development Manager.", removed.

### Low

**Canonical host disagreed with the served host.**
Pages served from `vinceai.co.uk` declared `canonical` as `https://www.vinceai.co.uk/…`, a
duplicate-content signal. Canonicals, `sitemap.xml`, and `robots.txt` now all use the apex, and
`.htaccess` redirects www → apex to match.

**Industries mega-menu: four links, one destination.**
All four pointed at bare `industries.html`. Each sector now has an `id` and the menu deep-links
to it.

### Also in this build

- Breadcrumbs on every inner page
- `Organization` JSON-LD extended with telephone, `sameAs`, postal address, founding date
- CSP tightened and scoped so Google Analytics is the only permitted third party
- Contact page rebuilt with the full live field set, real UK and UAE numbers, registered office
- Privacy Policy gained sections on form processing and on analytics consent

---

## v2.2, 10 August 2026
Messaging pass against the knowledge-hub books in
`Books/Website and Portfolio Creators Book/`. Full analysis in
[`MESSAGING-REVIEW.md`](MESSAGING-REVIEW.md).

### Homepage failed the grunt test

Miller's five-second test asks three questions. The site answered one.
The `<h1>` was "Technology and AI, built around your business", a brand
slogan, not an offer. Replaced with a plain statement of what you do, and a
16-word subhead naming the benefit. The slogan moves to the eyebrow, where it
still reads but no longer occupies the one line that has to sell.

### Four of seven story beats were missing

The homepage had a hero, a service grid, and a features list. Added:

- **The problem**, a named problem section, so there is a loop to close
- **The plan**, three steps, so calling feels low-risk
- **The stakes**, what it costs to leave it alone
- **Success**, a concrete picture of the resolved state

### One call to action, repeated verbatim

Five different wordings were competing: "Get in touch", "Discuss this service",
"Ask us a question", "Start a project", "View our services". Miller's point is
that a visitor must read the same ask repeatedly before it registers.
Standardised to **"Get in touch"**, now 69 identical instances site-wide.

### Transitional call to action added

There was no path for a visitor who is interested but not ready to talk, they
either enquired or left. Added an email capture tied to the guides already
listed on the insights page.

### Fewer words

Homepage `<main>` is now 395 words, structured to be scanned rather than read.

### Credentials strip

Company number, UK GDPR, London base, one-working-day reply. Cialdini's
authority principle using only claims you can substantiate.

### Two gaps left open deliberately

**Photography.** Miller's third required element is images of success. The site
has no photographs at all. This needs a shoot, not code.

**Testimonials.** No social proof anywhere. I did not write placeholder quotes —
fabricated testimonials on a commercial site are a misrepresentation risk.

Both are specified with paste-ready markup in
[`CONTENT-TODO.md`](CONTENT-TODO.md).

---

## v2.3, 10 August 2026
Engineering pass against the wider knowledge hub. Full reasoning in
[`BOOKS-REVIEW.md`](BOOKS-REVIEW.md).

### Two accessibility defects, found by the new test suite

**Every page's document outline started at `h4`.** The mega-menu group labels
were `<h4>` elements positioned before the `<h1>`. A screen-reader user
navigating by heading hit two orphan level-4 headings before reaching the page
title. Nav labels are not document headings, now `<p>`. Footer column titles
moved from `h4` to `h2`.

**Four pages jumped `h1` → `h3`** where a section built entirely from cards had
no `h2` above them. Added section headings, visually hidden where a visible one
would add noise.

Both are WCAG 1.3.1 failures and both survived every manual review, including
mine. They were caught within seconds of the suite first running.

### Added: build verification suite

`tests/run.mjs`, 245 assertions, zero dependencies, about one second, exits
non-zero on failure. Covers HTML structure, head metadata, SEO, accessibility,
link and anchor resolution, consent gating, content integrity, the StoryBrand
structure, a performance budget, and the config files.

Every assertion guards a defect that has actually shipped here. The dead
privacy-policy link, the published FormSubmit notes, the consent control built
as a link, the h4-first outline, all of them now fail the build.

### Added: deployment pipeline

`.github/workflows/ci.yml` runs the suite on every push and pull request, with
a deploy job gated on it. The deploy step is stubbed for your host; the gate is
not.

### Added: conversion instrumentation

Analytics was consent-gated but measured nothing actionable. Defined the One
Metric That Matters as enquiry rate, enquiries ÷ homepage sessions, and
instrumented `cta_click` → `form_start` → `enquiry_submitted`, plus
`form_validation_blocked`, `guide_signup`, `phone_click`, `email_click`. Events
fire only after consent.

### Added: repo hygiene

`.editorconfig`, `.gitattributes`, `Makefile`, `CONTRIBUTING.md`,
`tests/README.md`, `BOOKS-REVIEW.md`.

### Also fixed

Meta description overruns had been patched in built output rather than in the
generator, so they regressed on the next build. Fixed at source, with explicit
per-service descriptions. The suite now enforces 70–165 characters and
uniqueness.

---

## v2.4, 10 August 2026
Copy audit against the Wikipedia list of AI-writing tells (WP:AITELLS). The copy
on this site was drafted with AI assistance, so this pass was self-directed.

### Spaced em dashes: 14 in page copy, 63 in the docs

Nearly every one appended an emphatic afterthought, usually with a negation
attached: "actually useful, not hype", "it cannot", "just the guides", "no
formal CV required". Wikipedia flags exactly this construction, notes that
AI-generated em dashes are typically surrounded by spaces contrary to normal
typographic practice, and cites a July 2026 study finding Claude the one
contemporary model that uses them more than professional writers.

Fourteen instances of one rhythm across a 22-page site is a voice, and it was
mine. All rewritten with commas, colons, full stops, or parentheses.

### Other flagged patterns

- **"landscape"** as an abstract noun on insights.html, on the AI-vocabulary list.
  Now "What current UK regulation actually requires".
- **"rather than"** on the software development page, a flagged negative
  parallelism. Now "instead of".
- **Mixed typography.** 28 straight quotes alongside 19 curly ones. Wikipedia
  notes that inconsistent mixing is the tell, not curly quotes themselves.
  Normalised to curly throughout: 0 straight, 47 curly.

### Editorial errors found in the same pass

- **Overclaim, mine.** The homepage read "Where most engagements start". The
  company was founded in June 2026 and is two months old; that phrasing implies
  a body of completed work. Now "Four common starting points".
- **"Built to UK GDPR"** replaces "UK GDPR compliant". Compliance is not a
  binary anyone can award themselves, and stating it flatly on a credentials
  strip is the kind of claim that invites challenge.
- **Grammar error**, introduced by my own em-dash removal: "where it adds risk
  instead" made no sense. Now "and where it adds risk".
- **Duplicate headings.** "Who we are" appeared as both the hero eyebrow and an
  `h2` on about.html. "How we work" was a heading on two pages with two
  different meanings.
- **Inconsistent phrasing.** "Reply within 1 working day" against "one working
  day" everywhere else.

### Enforced going forward

Added a Prose quality suite: 88 assertions across the 22 pages checking for
AI-vocabulary words, negative parallelisms, didactic disclaimers, vague
attributions, promotional filler, leaked chatbot output, spaced em dashes, and
mixed typography. Verified by injecting a deliberate regression, which failed
the build as intended.

Suite total: 333 assertions.

### Not changed

`privacy-policy.html` says a form provider "acts as a processor on our behalf".
A pattern-matcher flags that as copulative avoidance, but it is the wording of
UK GDPR Article 4(8) and legally precise. Left alone.
