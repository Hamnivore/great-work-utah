# Personas

A tight cast of people we *imagine being* while clicking through every prototype. The question we ask of every screen is: **"would [name] actually use this — and feel served?"**

## Priority Hierarchy (the tradeoff rule)

When a design decision serves one persona at the expense of another, we serve in this order:

1. **Founders building world-changing things** (Priya, Sam, Dr. Amir) — the people whose work would land in `places_you_can_work/` at S or A tier. **These are our main, main people.**
2. **Scrappy founders who could grow into category one** (Marcus) — the people whose work *might* land in S/A in five years.
3. **The talent the founders need** (Ben) — senior operators and engineers looking for meaningful work.
4. **The helpers** (Helen) — mentors, advisors, board members, fractional execs.

Everyone else — investors browsing on their phones, journalists, curious students, government staffers — is a welcome side-effect, not a target.

> **The judgment call:** if we have to choose, we serve the highest-impact people. A feature that delights Helen but adds friction for Priya is a feature we don't ship.

---

## The Founders (Main, Main People)

### Priya Vadrevu — 31, Salt Lake City

**Situation:** Founder/CEO of a 12-person hard-tech company in SLC. 18 months in, has a working product, just closed a small seed, raising a $5M Series A in three months. She needs a CTO and two senior engineers *yesterday* but has zero hours to spend on LinkedIn.

She knows hiring is the most important thing she does — Bezos, Jobs, and every founder she respects has said so — but she also knows that a bad hire costs her six months and that interviewing is the single biggest tax on her week.

**What success looks like on our app:**

- She opens it on her phone between meetings.
- In under 60 seconds, she finds three senior engineers who specifically *want* to work on hard tech in Utah and have raised their hand.
- For each of the three, she can **ask the wiki questions** — *"has this person ever shipped a regulated medical product?"*, *"how does their experience compare to the engineers Recursion hired in 2022?"*, *"what would they likely care about most in our offer?"* — and get cited, real answers.
- She makes a confident decision to talk to two of the three **without scheduling a single screening call.**
- She messages both before her next meeting.

**Prototype questions:**

1. "Would Priya use this between meetings, on her phone, with one hand?"
2. "Can Priya make a confident go/no-go on a candidate without scheduling a call?"
3. "Does the depth of information justify her trust in the leads we surface?"

### Sam Lin — 38, Salt Lake City

**Situation:** Ex-Recursion ML engineer (5 years), just left to start her own computational biology company. Has the network, knows the playbook, raising a small pre-seed. Hiring five people in six months. Knows the talent in Utah's bio scene already — but wants to be discoverable to people *outside* her network.

**What success looks like:** Her new company appears on the app within a week of launching. People she's never met find her because they searched "AI + biology + Utah." Three of them are exactly the kind of weirdos she wants to work with.

**Prototype question:** "Would Sam want her company shown the way we're showing it? Would it make her proud?"

### Dr. Amir Hassan — 29, Salt Lake City

**Situation:** PhD candidate at the University of Utah, fourth year, developing novel non-invasive imaging technology. Wants to spin it out into a company but has no idea how. Has never started a business. Doesn't know what a CEO does. The work is genuinely world-changing if it ships — and currently a $0 line item that sits between him, his PI, and the tech transfer office.

**What success looks like:** He opens the app and sees three things: (1) other Utah research that became great companies, (2) the people who helped them — first-time CEOs, IP attorneys, scientific advisors, (3) a way to raise his hand and be discovered by an experienced operator who *wants* to find a project like his.

**Prototype question:** "Would Amir feel less alone after using this? Would he understand what to do next?"

---

## The Could-Be-Founders

### Marcus Reyes — 34, Ogden

**Situation:** Just left the Marines after 12 years (logistics + manufacturing). Starting a custom-fabrication and small-batch manufacturing business. Doesn't yet know if he's running a lifestyle business or building the next Hexcel. Has skill, grit, no networking instincts.

**What success looks like:** He sees that companies like Hexcel and Browning started in Utah, and that there are people in his sector who have walked his path. He raises his hand as a "veteran building in advanced manufacturing." Within a week, an experienced operator pings him to coffee.

**Prototype question:** "Does this feel approachable to someone who has never used a startup product before?"

> Marcus is the bridge case. If we cleanly serve Priya, Sam, and Amir, we should *also* cleanly serve Marcus. If something only serves Marcus and not the top three — defer it.

---

## The People the Founders Need

### Ben Whitlock — 42, Park City

**Situation:** Ex-FAANG engineering manager (Meta, then Stripe). Moved to Park City two years ago for the skiing. Has 2-3 years of FU money. Currently consulting part-time, deeply bored. Reads Hacker News every morning and feels nothing. Wants to find Something That Matters — preferably in Utah so he doesn't have to leave the mountains.

**What success looks like:** He stumbles onto the app, spends 20 minutes browsing high-confidence places to do meaningful work, and finds two that genuinely excite him. He raises his hand. Within 48 hours, Sam Lin's COO emails him about a Head of Eng role.

**Prototype question:** "Does this give Ben a reason to be excited again?"

---

## The Helpers

### Helen Park — 56, Salt Lake City

**Situation:** Sold her ed-tech company for $80M in 2018. Now angel investing and board-advising. Has time and capital for 2-3 founders per year and wants them to be mission-driven Utah hard-tech founders specifically. Currently sources entirely through her personal network, which means she misses the Sams and Dr. Amirs she'd most want to back.

**What success looks like:** She uses the app weekly to scan new high-tier entries and new "raised hand" founders. Sees a profile, recognizes greatness, sends a one-line intro: "I'd love to help if useful."

**Prototype question:** "Does Helen find someone genuinely worth her time within 5 minutes?"

---

## Who We're *Not* Designing For (in v1)

These people may use the product, and that's fine — but we don't optimize for them:

- **Investors browsing for deal flow** — welcome, but their needs (term sheets, financials, traction) aren't our story. They're a side-effect of serving founders well.
- **Government staffers** auditing the ecosystem — not the audience.
- **Journalists** doing a "Utah is hot" piece — not the audience, but a great PR side-effect.
- **Job hunters who don't care about impact** — actively *not* the audience. There are 50 better places for them to look.
- **Lifestyle / SMB entrepreneurs** (the food truck owner, the boutique agency) — wonderful people, wrong product. The brief explicitly tilts us toward deep-tech / world-changing.

## Using This Doc During Prototyping

For every screen we mock up, run the persona test in this order:

1. **Priya test:** Does this serve her in 60 seconds on her phone? *Can she dig in deep enough to skip an interview?*
2. **Sam test:** Would this make her proud to be on it? Does it make her company easy to ask hard questions about?
3. **Amir test:** Does this make a first-time founder feel less alone?
4. **Marcus test:** Is this approachable without startup-jargon literacy?
5. **Ben test:** Does this give a senior operator a reason to be excited again? Does his profile make him *findable on the dimensions that matter*?
6. **Helen test:** Can a busy advisor find someone worth their time in 5 minutes?

If a screen passes 1–3, ship it. If it fails any of those but passes 4–6, hold it. If it fails 1–6, redesign.

**Across all screens:** does this generate signal the wiki can learn from? A click, a skip, a question asked, a filter applied — every interaction should make the next user's experience sharper.
