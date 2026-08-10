# Messaging review against the knowledge-hub books

Source: `Books/Website and Portfolio Creators Book/`

Primary lens: **Donald Miller, *Building a StoryBrand***, it is the only book in
the folder that gives a testable checklist for a homepage. Cross-checked against
**Al Ries, *The 22 Immutable Laws of Branding***, **Simon Sinek, *Start With
Why***, and **Robert Cialdini, *Influence***.

---

## The grunt test

Miller's test: a visitor must answer three questions within five seconds —
what do you offer, how will it make my life better, what do I do next.

| | Before | After |
|---|---|---|
| What do you offer? | "Technology and AI, built around your business", a tagline, not an offer | "We make your business run on better software" |
| How does it improve my life? | Not stated above the fold | "One team… instead of five suppliers who each blame the others" |
| What do I do next? | "Get in touch" ✅ | "Get in touch" ✅ |

Two of three failed. The old `<h1>` was a brand slogan; Miller's point is that
above the fold must promise an aspirational identity, promise to solve a
problem, or state plainly what you do. It did none of the three.

## Miller's five required website elements

| # | Element | Before | Now |
|---|---|---|---|
| 1 | Offer above the fold | ✗ slogan + 40-word subhead | ✓ offer + 16-word subhead |
| 2 | Obvious calls to action | ~ five different wordings | ✓ "Get in touch", 69 instances, verbatim |
| 3 | Images of success | ✗ **none, no photography anywhere** | ✗ still open, see `CONTENT-TODO.md` |
| 4 | Bite-sized revenue streams | ✗ nine areas, flat | ✓ four lead, nine on the services page |
| 5 | Very few words | ✗ long paragraphs | ✓ 395 words in `<main>`, scannable |

Element 3 is the one gap I could not close: it needs photographs that do not
exist yet.

## SB7 elements that were missing entirely

The old homepage had a hero, a service grid, and a features list. Four of the
seven story beats were absent:

- **The problem.** Added, a named problem section. Miller: define the problem
  and you open a loop the reader wants closed.
- **The plan.** Added, three steps: tell us the problem, get a written scope,
  we build and hand over. A visible plan reduces the perceived risk of calling.
- **The stakes.** Added, "Doing nothing is not free". Miller is blunt that a
  story without stakes is inert, and this is the beat businesses skip most.
- **Success.** Added, "Six months from now", a concrete picture of the resolved
  state.

## Where the books disagree with your current structure

**Ries, Law of Contraction: a brand gets stronger as its focus narrows.** Nine
service areas is the widest possible position. His examples are Starbucks
narrowing to coffee and Subway narrowing to one sandwich. Your homepage now
leads with four and keeps the full nine on the services page, which is Miller's
umbrella-then-divisions pattern, but the underlying business question is yours
to answer, not mine.

**Ries, Law of the Word: own one word in the customer's mind.** Vince AI
currently owns none. Noted in `CONTENT-TODO.md` as a decision for you.

**Sinek, Golden Circle: lead with why.** The old "Why Vince AI" section listed
features, not a why. The new problem and stakes sections do the work a why is
meant to do, they explain the belief behind the company before the services.

**Cialdini, social proof.** Absent. No testimonials, no client names, no case
studies. I did not invent any; see `CONTENT-TODO.md` for how to gather three
real ones and the markup to drop them into.

## Also added

- **Transitional call to action.** Miller distinguishes the direct ask ("buy
  now") from the transitional one ("can I take you out again"). You had none —
  a visitor not ready to talk had no way to stay in contact. Added an email
  capture tied to the guides you already list on the insights page.
- **Credentials strip** below the fold: UK registered with company number, UK
  GDPR, London based, one-working-day reply. Cialdini's authority principle,
  using only facts you can substantiate.

## Deliberately not changed

Your service descriptions, legal pages, and team details are accurate and read
well. Miller's framework governs the homepage and the path to enquiry; it is not
a reason to rewrite pages that are already doing their job.
