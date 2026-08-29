# 06 · Mobbin Pattern Teardown

Patterns sourced from Mobbin across five reference categories. For each: **what to steal**, and — more importantly — **what to change**, because a pattern lifted without adaptation to a low-literacy, low-connectivity, high-stakes context is a liability.

---

## A. Animal profile & longitudinal health → **Fi** (dog collar app)

The single closest structural analog in the entire directory: a *non-human subject* with an identity, an owner, a health timeline, documents, and vets.

| Screen | Link |
|---|---|
| Maggie's health — behaviour cards with deltas | [mobbin](https://mobbin.com/screens/cda34d5e-ab30-4739-a3ad-2bf959660a27) |
| Maggie — live profile with map + stat cards | [mobbin](https://mobbin.com/screens/be8a4e9b-74bf-4e7b-a6f1-62af2168e6b4) |
| Health tab — "Collecting data…" empty state | [mobbin](https://mobbin.com/screens/89958f60-b292-4cd5-8bca-69b2370f22f8) |
| Documents — empty state with a real payoff | [mobbin](https://mobbin.com/screens/d4c9bfe2-4c6f-47e7-87d8-d85df3267818) |

**Steal:**
- **Named subject as the page title** — "Maggie's health," not "Pet 4821." Our animal pages are titled *"Lakshmi's health"*, with the Tag ID demoted to a subtitle. Farmers name their animals; the system that respects that gets used.
- **Delta over absolute.** Fi shows `Rest ↑100%+`, `Activity ↓52%` — a value is meaningless without the animal's *own* baseline. This is exactly the right frame for milk yield: "Lakshmi is 12% below **her** average," never "Lakshmi produces 9 L/day."
- **Tabbed profile: Overview / Documents / Vets.** Maps cleanly to Timeline / Records / Care.
- **Empty states that state the payoff**, not the absence: *"Tired of digging for Tilda's records?"* → ours: *"Her vaccination card lives here, so you never search for the paper again."*

**Change:**
- Fi is sensor-fed and its empty state is passive ("Collecting data…"). **We have no sensor; the farmer is the sensor.** Every one of our empty states must end in an *action the farmer can take now*, not a wait.
- Fi's "Rank #830 among Cocker Spaniels" gamification is actively wrong here. Comparative ranking of a livelihood asset against neighbours is humiliating and suppresses reporting.

---

## B. Health score & daily insight → **Bevel, Withings, Google Fit**

| Screen | Link |
|---|---|
| Bevel — Strain/Recovery/Sleep rings + narrative insight | [mobbin](https://mobbin.com/screens/c33feab6-41f6-475a-b370-caa18c10e204) |
| Withings — score with week-over-week delta | [mobbin](https://mobbin.com/screens/3defe666-ccc4-4f4c-b7c8-9f648bb736c3) |
| Google Fit — dual-ring daily target | [mobbin](https://mobbin.com/screens/77fed061-2bba-45c1-89a9-acc3564f684c) |

**Steal:**
- **Bevel's rings are never alone.** Directly beneath sits *"A Day of Strong Recovery — On September 12, your Recovery was excellent at 93%…"* The narrative does the work; the ring is the index. Our village risk indicator always ships with one sentence of plain-language interpretation.
- **Withings anchors the number to change:** *"Congrats! Your score increased by 1 point this week."* A standalone score is uninterpretable; a *direction* is instantly meaningful.

**Change — and this is the most consequential design decision in the project:**

> **The reference concept's "Herd Health Score 82/100" is demoted out of the hero slot.**

Three reasons: (1) A composite score over a 6-animal herd is not actionable — a farmer cannot do anything differently at 82 vs 76. (2) Averaging hides the case that matters; one critical animal in a healthy herd reads as "Good." (3) It answers a question the farmer never asked. He asks *"is anything wrong right now?"*

**Replacement hero: "Needs attention today"** — a ranked list of specific animals with specific reasons and specific actions. The score survives as a small trend chip with a delta, in the Bevel/Withings idiom, doing the job it is actually good at: showing direction over time.

---

## C. AI assessment, confidence & escalation → **Oura Advisor, CVS Health, Lovi, Greg**

| Screen | Link |
|---|---|
| Oura — Medical AI intro, scope + escalation stated upfront | [flow](https://mobbin.com/flows/bac4e395-7f36-4218-b381-156e257ccb0c) |
| CVS Health — "Symptoms 3 of 4" progressive intake | [flow](https://mobbin.com/flows/992c0a32-7a1e-41dc-8ec8-f9000f860b38) |
| Lovi — scan result: "80% fit for you" + **"⚠ Wrong?"** | [flow](https://mobbin.com/flows/12e8692d-5da8-40a3-a51d-a48d2d39fa8a) |
| Greg — "Can't find your plant? Add it to Greg!" escape hatch | [flow](https://mobbin.com/flows/b7415099-ab4a-44d4-a624-543be2c7ff27) |

**Steal:**
- **Oura's framing sentence** — *"Messages from Counsel AI are informational. For medical advice, add a physician. For emergencies, call 911."* — persistently docked at the input, not buried in a one-time consent. Ours: *"This is a preliminary assessment, not a diagnosis. For emergencies call 1962."* pinned to the assessment screen.
- **Oura offers a human before you ask** — "Add a doctor · will reply after 7pm." Setting the wait expectation *before* the request is what makes the AI answer feel like a bridge rather than a fob-off. Our vet request states a realistic response window upfront.
- **CVS's "3 of 4" step counter with "More questions will appear based on your responses."** Progressive disclosure with an honest progress promise. Adaptive intake without the anxiety of an unbounded form.
- **Lovi's "⚠ Wrong?" in the result header.** A one-tap correction affordance on an AI output. This is simultaneously a trust device, a safety valve, and the cheapest training-data pipeline in existence. **We put it on every assessment.**
- **Greg's escape hatch** for the unrecognised case — the model's failure becomes a contribution, not a dead end.

**Change:**
- Lovi's "80% fit" is a *preference* score with no downside if wrong. Our confidence figure sits next to an animal's life, so it must be paired with an explicit **behavioural instruction that changes with confidence**: low confidence must escalate harder toward a human, not just render a smaller number.
- CVS's dense text-heavy form assumes fluent literacy. Ours is **icon-tile-first with voice as a peer input**; the same progressive logic, none of the reading.

---

## D. Risk map & hotspots → **DoorDash Dasher, Snapchat, Strava, Weather**

| Screen | Link |
|---|---|
| DoorDash Dasher — red hotspot zones + scrolling hotspot cards + refresh timer | [mobbin](https://mobbin.com/screens/f52f87ea-11de-4db9-9f12-b89bcb47472b) |
| Snapchat Map — soft heat blooms | [mobbin](https://mobbin.com/screens/d1e2ae59-64c5-45c5-92d6-750e36b2c817) |
| Weather — precipitation intensity legend | [mobbin](https://mobbin.com/screens/7463e436-f040-46e2-aac0-c3335f8d0e56) |
| Artsy — numbered cluster pins + count bottom sheet | [mobbin](https://mobbin.com/screens/4ecc15df-bc45-42f0-b59c-4d09682c0a70) |

**Steal:**
- **Dasher's exact structure** — translucent zones over a desaturated base map, a persistent horizontally-scrollable card rail for the zones, and *"Hotspots will refresh in 10 minutes."* That freshness line is the pattern's most underrated element: a map without a staleness indicator invites false confidence, which in an outbreak context is dangerous.
- **Weather's graded intensity legend** (Light → Moderate → Heavy → Extreme). Our risk bands are named and legended identically, never a bare colour gradient.
- **Artsy's numbered cluster pins** with a "1 of 59" paged bottom sheet — the right way to move between clusters without losing map context.

**Change:**
- Consumer heatmaps resolve to individual points on zoom. **Ours must not.** Officer maps clamp at village-level aggregate — resolving to an individual farm turns a health tool into a surveillance tool and ends farmer trust permanently (see [02](02-market-research.md) §5).
- Dasher's heat means *opportunity*. Ours means *risk*, so it needs an explicit "what this means / what to do" affordance on every zone card — a red blob with no instruction produces panic or apathy, never action.

---

## E. Offline, sync & alerts → **Instagram, Docusign, Craft, Cleo, monday.com**

| Screen | Link |
|---|---|
| Instagram — "Your story is uploading… 86" pill | [mobbin](https://mobbin.com/screens/87195638-f604-48bc-b5fb-3a1691ec6895) |
| Docusign — "Syncing offline envelopes" + inline "Failed to sync" | [mobbin](https://mobbin.com/screens/5e8c61aa-c77e-4013-8310-5808541018ba) |
| Craft — sync diagnostics (New / Uploading / Synced) | [mobbin](https://mobbin.com/screens/209d65ed-3bb0-4e91-a13a-7cae838be9a1) |
| Particle News — full-screen offline failure | [mobbin](https://mobbin.com/screens/fa68f741-7d4e-4962-9c7e-15e3bf70d084) |
| Cleo AI — date-grouped alerts with inline actions | [mobbin](https://mobbin.com/screens/a4d7c5bf-fd3f-4f4b-855c-1030f40182e5) |
| monday.com — All / Unread / Mentioned / Assigned filters | [mobbin](https://mobbin.com/screens/b4195096-be59-4c5f-9dca-2d32d4bf7812) |

**Steal:**
- **Instagram's optimistic pill.** The post is *already yours*; the upload is the system's problem. This is the correct mental model for a farmer's report in a dead zone: the task is done, sync is our business.
- **Docusign's per-item failure.** Failure is attached to the specific record with its own retry — never a global modal that blocks the other nine records that synced fine.
- **Cleo's date-grouped alerts with inline action buttons** ("See my insights," "Track my card") — the alert *is* the entry point to the action.
- **monday.com's filter chips**, mapped for the vet queue to All / Critical / Awaiting me / Overdue.

**Change — the sharpest correction to the reference concept:**

> **Particle News's full-screen "There was an issue / no internet" is the anti-pattern.** The reference deck's screen 16 ("You're offline · 3 reports waiting to sync") makes the same mistake: it turns a normal condition into a destination.

In rural Maharashtra, offline is not an error — **it is Tuesday**. A full-screen offline state tells the user the product is broken, at the exact moment they most need to believe it works. Our treatment: a **quiet, dismissible pill**, all reads served from cache, all writes accepted optimistically, and pending count surfaced as a small chip in Profile for anyone who wants to check. There is no offline *screen* in this product.

---

## Summary — 10 patterns adopted, 6 rejected

| # | Pattern | Source | Verdict |
|---|---|---|---|
| 1 | Named subject as page title | Fi | ✅ Adopt |
| 2 | Delta-against-own-baseline over absolutes | Fi, Withings | ✅ Adopt |
| 3 | Score always paired with a narrative sentence | Bevel | ✅ Adopt |
| 4 | Persistent scope/escalation disclaimer at point of use | Oura | ✅ Adopt |
| 5 | "n of m" adaptive step counter | CVS Health | ✅ Adopt |
| 6 | One-tap "this looks wrong" on every AI output | Lovi | ✅ Adopt |
| 7 | Translucent zones + card rail + freshness timer | DoorDash Dasher | ✅ Adopt |
| 8 | Named, legended intensity bands | Weather | ✅ Adopt |
| 9 | Optimistic upload pill | Instagram | ✅ Adopt |
| 10 | Per-item sync failure with local retry | Docusign | ✅ Adopt |
| 11 | Composite score as dashboard hero | *reference concept* | ❌ Reject → "Needs attention today" |
| 12 | Full-screen offline state | Particle News, *reference concept* | ❌ Reject → non-blocking pill |
| 13 | Peer ranking / leaderboards | Fi | ❌ Reject → humiliating for a livelihood asset |
| 14 | Photo marked "(optional)" | *reference concept* | ❌ Reject → promote to step 3 of 4 |
| 15 | Individual-resolution heatmap | Snapchat, Strava | ❌ Reject → clamp at village aggregate |
| 16 | Icon-only navigation & controls | most consumer apps | ❌ Reject → icon + label always |

---

# Second pass — visual craft

The first teardown answered *what the screens should do*. This pass answered *whether they look like a product someone would trust*, by studying apps chosen for execution quality rather than for domain overlap.

## F. Typographic authority → **pliability, Life Reset, Babbel, Vestiaire, Greenlight**

| Screen | Link |
|---|---|
| pliability — full-bleed display type, two-tone weight contrast | [mobbin](https://mobbin.com/screens/f7f0ec2e-89bf-4361-a9f3-ee19a8cd43bc) |
| Life Reset — a single enormous number carrying the entire screen | [mobbin](https://mobbin.com/screens/12ecc05c-3816-461d-b1bf-4f935d432f60) |
| Babbel — display type cropped by the viewport, deliberately | [mobbin](https://mobbin.com/screens/f97d060d-fe4e-4690-8437-9e4d5233d77e) |
| Vestiaire Collective — serif editorial headline over a utilitarian shell | [mobbin](https://mobbin.com/screens/7e790e03-cf14-4d10-ba85-0c3355f0a39e) |
| Greenlight — hero balance as the largest element, actions as small outlined tiles beneath | [mobbin](https://mobbin.com/screens/6d511bb7-7c0a-47f4-9616-1055828c1f90) |

**What this diagnosed in our own screens:** the original scale ran 44 / 26 / 19 / 16 — only a **1.4× step from screen title to body**. Every level was *almost* the same size as its neighbour, which is what made the first pass read as competent-but-flat. Meanwhile section headers at 13px semibold in `--ink-600` were nearly as loud as the content under them.

**Fixed:** the scale opens up at the top (52 / 30 / 20 / 16.5) and *recedes* at the label end — section headers dropped to an 11px tracked uppercase overline in `--ink-400`. Negative tracking scales with size. Marathi gets a +1sp step, which the first pass documented and never implemented.

**Rejected:** serif display type. It is what gives Vestiaire and Vocabulary their character, but Devanagari serif support is unreliable across cheap Android devices, and a two-script product cannot have its personality live in a typeface only one of its scripts can render.

## G. Structure without shadow → **Zocdoc, Places, Gentler Streak, Crouton, Starling**

| Screen | Link |
|---|---|
| Zocdoc — grouped sections, hairline dividers, zero shadow | [mobbin](https://mobbin.com/screens/e82fc8af-6d09-407d-b390-7b62188707a0) |
| Places — warm off-white canvas, cards defined by tone alone | [mobbin](https://mobbin.com/screens/831987d5-a34e-43ec-9efb-7633ea2ac888) |
| Gentler Streak — inset groups with small uppercase section labels | [mobbin](https://mobbin.com/screens/07d9ec6a-cb0e-4cb3-9a3c-4505d32f74ab) |
| Starling — flat rows on grey, colour reserved for amounts | [mobbin](https://mobbin.com/screens/a2e8fff6-90ad-4830-b49d-f5c47e5273f4) |

**What this diagnosed:** we had put `box-shadow` on *every card* — twelve floating elements per screen, which is twelve simultaneous claims to prominence. That is the single biggest reason the first pass looked busier than it needed to.

**Fixed:** hairline borders carry structure; shadow is reserved for the three things genuinely above the page (sheets, toasts, the FAB). Severity now travels on a **3px coloured left edge**, used identically on farmer attention cards, herd rows, vet queue items and district clusters — one scannable vertical axis instead of four different devices.

## H. Warm neutral ground → **Places, Vocabulary, Bloom**

Our canvas was `#F5F7F6` against `#FFFFFF` cards — a 2% separation, so cards never actually read as objects and shadow was doing work that tone should have done. Moving to warm paper `#F4F1E9` gave white a real edge to sit against, which is precisely what made removing the shadows possible. Every grey was re-biased warm to match; a cool `#E2E7EB` border on a warm canvas is the fastest way to make an interface look unresolved.

## I. Colour discipline → **Binance, Copilot Money, Starling**

| Screen | Link |
|---|---|
| Binance — no card chrome at all; hierarchy is entirely type weight and alignment | [mobbin](https://mobbin.com/screens/73715843-3c1e-4f92-a7dc-7fce993615d9) |
| Copilot Money — dark brand header, uppercase micro-labels, change as plain coloured text | [mobbin](https://mobbin.com/screens/30755611-5390-482f-a49b-dfa77e67d8f4) |

**What this diagnosed:** we were spending green everywhere — filled icon chips, quick-action tiles, empty-state medallions, secondary button borders, guide panels. When the accent is on everything, it means nothing, and the actual primary action stops standing out.

**Fixed:** green is now **only** the filled action. Quick actions became outlined neutral tiles; guide panels became `--surface-2`; secondary buttons became neutral-bordered. Delta values dropped their coloured pill for plain coloured text (Binance/Copilot), and **one filled primary per view** — in the ranked attention list only the top item is filled, because three stacked green buttons contradict the ranking the list exists to express.

**Also fixed:** the risk palette now ships three values per band — *mark* for bars and arcs, *ink* for text, *wash* for fills. The first pass used the mark colour for label text on its own tint, which does not clear 4.5:1 and would have failed an accessibility audit while looking fine on a designer's monitor.

## J. Silence as a design element → **Fi**

Our herd list badged all six animals, three of them "Normal". Labelling the default state turns the exception into noise. **The healthy state is now silent** — no badge, no edge bar — so the three animals that need something are the only marked rows on the screen.

## Second-pass summary

| # | Change | Source | Why it mattered |
|---|---|---|---|
| 17 | Type scale opened to 52/30/20/16.5, tracking scales negative | pliability, Greenlight | 1.4× title-to-body step read as flat |
| 18 | Section headers → 11px tracked overline, `--ink-400` | Gentler Streak, Copilot | They were competing with their own content |
| 19 | Hairline borders replace shadow on all resting surfaces | Zocdoc, Places | Twelve floating cards = no hierarchy |
| 20 | Warm paper canvas `#F4F1E9`, all greys re-biased warm | Places, Vocabulary | 2% tonal separation made cards invisible |
| 21 | 3px coloured left edge as the single severity device | — (consolidation) | Four different severity treatments became one |
| 22 | Green reserved for filled actions only | Binance, Starling | Accent on everything means accent on nothing |
| 23 | Deltas as plain coloured text, not pills | Binance, Copilot | Pills at every metric add weight, not meaning |
| 24 | One filled primary per ranked view | Greenlight | Three stacked primaries contradict the ranking |
| 25 | Risk bands split into mark / ink / wash | — (accessibility) | Mark-colour text on its own tint fails 4.5:1 |
| 26 | Healthy state renders no badge | Fi | Labelling the default makes the exception invisible |
| 27 | Devanagari +1sp compensation actually implemented | — (own spec) | Documented in pass one, shipped in pass two |
| ❌ | Serif display type | Vestiaire, Vocabulary | Personality cannot live in a face only one script renders |
