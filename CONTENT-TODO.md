# Content still needed

Two things the books call for that I could not create honestly, because both
require real material from you. Paste-ready markup for each is below.

---

## 1. Photographs of real people, highest impact

Miller's third required website element is images of success: satisfied people,
not buildings, not abstract graphics. Your site currently has **zero
photographs**. Every visual is a typographic mark or a line icon. The team
section uses initials in circles because I had no photos.

This is the single largest remaining gap between the site and the framework.

**What to shoot**
- Head-and-shoulders portraits of all three team members, same lighting, same
  background, looking at camera
- Two or three candid working shots, screen-in-shot, people mid-conversation
- Avoid: stock photography of anonymous people in suits, handshake clichés,
  photographs of the building

**Where they go**

Team portraits, replace the initials avatar in `about.html`:

```html
<article class="card team-card reveal">
  <img class="avatar" src="assets/img/team/shahul-hameed.jpg"
       alt="Shahul Hameed" width="120" height="120" loading="lazy">
  <h3>Shahul Hameed</h3>
  <p class="role">Chief Executive Officer</p>
</article>
```

Add to `assets/css/style.css`:

```css
.team-card img.avatar { object-fit: cover; padding: 0; }
```

Save portraits at 240×240 (2× for retina), cropped square, under 60 KB each,
in `assets/img/team/`.

A working shot beside the plan section on `index.html`:

```html
<img src="assets/img/working-session.jpg" alt="A Vince AI scoping session"
     width="1200" height="800" loading="lazy"
     style="border-radius:var(--r-lg)">
```

3:2 ratio, 1200 px wide, under 200 KB.

---

## 2. Testimonials, social proof

Cialdini's social proof principle, and Miller's guidance that testimonials let a
prospect go second rather than first. You have **none**, and I did not invent
any: fabricated testimonials on a live commercial site are a misrepresentation
risk, and they are usually obvious to readers anyway.

**How to get the first three**

Ask each completed client one question: *"What would you have said about this
project before we started, and what would you say now?"* The before/after shape
is what makes a testimonial persuasive rather than decorative. Get written
permission to publish name, role, and company.

**Paste-ready markup**, drop into `index.html` between the plan section and the
services section:

```html
<section class="section section--alt">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">What clients say</span>
      <h2>Results, in their words</h2>
    </div>
    <div class="grid grid--3">

      <figure class="card quote reveal">
        <blockquote>Replace with a real client sentence, ideally naming the
        before and the after.</blockquote>
        <figcaption>
          <strong>Full Name</strong>
          Job title, Company
        </figcaption>
      </figure>

    </div>
  </div>
</section>
```

The `.quote` styles are already in the stylesheet. Repeat the `<figure>` block
per testimonial; three is enough.

**Until you have real ones, ship nothing there.** An empty section is neutral. A
fake one is a liability.

---

## 3. Decide what word you want to own

Ries's Law of the Word: a brand should own one word in the customer's mind.
Right now Vince AI owns none, nine service areas spread the claim across too
much ground.

This is a positioning decision only you can make, so I have not made it for you.
But the homepage is now structured so that whichever word you pick can sit in
the `<h1>` without touching anything else. Candidates suggested by your own
copy: *joined-up*, *practical*, *honest*.
