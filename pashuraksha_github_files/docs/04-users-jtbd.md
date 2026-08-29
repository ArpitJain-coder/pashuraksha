# 04 · Users, Problem Map & Jobs To Be Done

---

## 1. Personas

### P1 — Arpit Kale · Smallholder dairy farmer *(primary)*
34 · Village Wadgaon, Haveli block, Pune · **6 animals** (4 crossbred cattle, 2 buffalo) · ~48 L/day
- Android phone (₹9k, 4G, intermittent), WhatsApp-fluent, reads Marathi comfortably, English poorly
- Milk is ~70% of household income, paid per-litre by the village collection centre
- **Behaviour today:** notices something off → watches for a day → asks his father and a neighbour → tries a home remedy or an over-the-counter injection from the agri shop → calls the dispensary on day 3–5
- **What he's actually afraid of:** not the disease — the *cost*. A vet visit, a wasted trip to a dispensary that's closed, and the neighbours knowing his animal is sick before he knows what it is
- **Trust anchor:** the LDO he has met in person. Not an app. Not a score.

### P2 — Sunita Pawar · Marginal livestock keeper *(primary, low-digital)*
47 · Village Kondhapuri · **2 buffalo** · milk sold locally and consumed at home
- Feature phone. Her son's smartphone is in the house on weekends only
- Low text literacy; fully fluent verbally in Marathi
- **Behaviour today:** talks to the Gopal Mitra or the para-vet during the vaccination round; otherwise nothing
- **Why she matters strategically:** if the system only hears from P1-type households, the surveillance signal is systematically biased toward better-off, better-connected farms. Her reports are epidemiologically the *most* valuable and the *hardest* to get. **She is served by IVR writing into the same queue, and by the field worker's tablet — not by asking her to install anything.**

### P3 — Dr. Ramesh Deshmukh · Livestock Development Officer *(primary — the gatekeeper)*
41 · BVSc & AH · covers **4 dispensaries across 11 villages**, ~9,000 animals
- Smartphone + a desktop at the dispensary. Comfortable with software; contemptuous of software that wastes his time
- **Behaviour today:** phone rings all day, unranked. Drives 60–90 km. Half his visits, in his own estimate, did not need him
- **What he wants:** to know, at 8am, which four animals actually need him today and in what order — with a photo, a history, and a route
- **What makes him abandon a tool in one week:** duplicate data entry, false alarms, and any screen that tells him what the diagnosis is

### P4 — Kavita More · Para-vet / Gopal Mitra *(secondary — the data engine)*
29 · runs vaccination drives, ear-tagging, basic first-aid across 5 villages
- Android tablet issued by the department; often out of network in the field
- **Behaviour today:** paper register → evening data entry into a portal → transcription errors
- **Why she matters:** she is the highest-volume data creator in the system and the trusted human face for P2-type households. **Offline-first exists for her.**

### P5 — Dr. Anjali Kulkarni · District Animal Husbandry Officer *(the buyer)*
52 · reports to the Commissioner · accountable for outbreak response, vaccine cold-chain, and MVU deployment across the district
- **Behaviour today:** learns about clusters from lab confirmations and phone calls from LDOs — typically 1–2 weeks after onset
- **What she needs:** defensible early signal, and the ability to move vaccine stock and MVUs *before* the confirmation arrives
- **What she is judged on:** outbreaks contained, mortality, vaccination coverage %

---

## 2. Problem → user map

| Problem | P1 Arpit | P2 Sunita | P3 Dr. Ramesh | P4 Kavita | P5 Dr. Anjali |
|---|---|---|---|---|---|
| **P1 Reporting latency** | 🔴 Acute — waits 3–5 days | 🔴 Acute — may never report | 🟡 Inherits it as late-stage cases | 🟡 Sees it during rounds | 🟠 Root cause of her blind spots |
| **P2 Triage blindness** | 🟠 Waits, doesn't know if it's urgent | 🟠 No access at all | 🔴 **Acute — his core pain** | 🟡 Escalates without ranking | 🟠 Can't allocate MVUs well |
| **P3 Signal fragmentation** | ⚪ Invisible to him | ⚪ Invisible | 🟡 No neighbour context when deciding | 🔴 Acute — duplicate entry | 🔴 **Acute — her core pain** |
| **Cost/trust anxiety** | 🔴 Acute | 🔴 Acute | ⚪ | ⚪ | ⚪ |
| **Zoonotic exposure** | 🟠 Unaware | 🔴 High (raw milk, close contact) | 🟡 Aware, under-reports | 🟠 Frontline exposure | 🟠 Cross-dept accountability |

🔴 acute 🟠 significant 🟡 moderate ⚪ not felt

**What the map tells us:** no single screen serves everyone. The farmer app must reduce *anxiety and latency*; the vet app must reduce *wasted travel*; the officer app must reduce *time-to-signal*. Building one "livestock app" for all three — which is what the reference concept drifts toward — produces three mediocre products. **Three surfaces, one data spine.**

---

## 3. Jobs To Be Done

### JTBD-1 · The core job (P1, P2)
> **When** I notice one of my animals is off feed or behaving strangely,
> **I want to** find out how serious it is and what to do right now — without paying for a visit or looking foolish —
> **so I can** act before it costs me milk, spreads to the others, or kills her.

**Forces analysis** — this is the job the whole product lives or dies on:

| Force | Content | Design response |
|---|---|---|
| **Push** (away from status quo) | Last year he lost 18 days of milk on two animals because he waited | Show the *cost of waiting* in litres and rupees, not in risk scores |
| **Pull** (toward the new) | "I can know in one minute, for free, at 6am, without calling anyone" | ≤60s, ≤4 taps, no call required, immediate answer |
| **Anxiety** (of the new) | "Will this bring an inspector? Will they cull my animal? Will the village know?" | Explicit privacy promise in onboarding, in Marathi. Never expose farm identity below village aggregate. **This is the #1 adoption blocker and it is a copy problem, not a tech problem.** |
| **Habit** (of the old) | Asking the neighbour is free, instant, and socially normal | Don't fight it — *absorb* it. Show anonymised "3 other farms near you reported similar signs this week." That is the neighbour, at scale, with better data. |

### JTBD-2 · The quiet-month job (P1) — the retention job
> **When** nothing is obviously wrong with my herd,
> **I want to** still get something useful from the app,
> **so that** it stays worth opening and I remember it exists when something *does* go wrong.

*This is the job most agri-apps fail.* Served by: vaccination due-dates, deworming reminders, yield tracking against the animal's own baseline, and seasonal/weather-linked risk advisories.

### JTBD-3 · The morning-planning job (P3)
> **When** I start my day covering 11 villages,
> **I want to** know which cases genuinely need me, ranked, with enough evidence to decide before I drive,
> **so I can** spend my hours on the animals that need a veterinarian instead of on travel and reassurance.

### JTBD-4 · The confidence job (P3)
> **When** I'm deciding whether a reported case is an isolated illness or the start of something,
> **I want to** see what else has been reported around that village in the last 14 days,
> **so I can** escalate early without staking my credibility on a hunch.

### JTBD-5 · The field-capture job (P4)
> **When** I'm vaccinating in a village with no network,
> **I want to** record what I did once, on the spot,
> **so I don't** re-enter it at night from paper and get it wrong.

### JTBD-6 · The allocation job (P5)
> **When** an unusual pattern is forming somewhere in my district,
> **I want to** see it days before lab confirmation, with enough substantiation to justify a decision,
> **so I can** move vaccine stock and MVUs before it becomes an outbreak I have to explain.

### JTBD-7 · The zoonotic job (P5, and society)
> **When** reported animal symptoms carry human-transmission risk,
> **I want** the health department notified automatically with the location,
> **so that** the humans handling those animals are warned before anyone is sick.

*This job is unasked-for by every user and is the highest social-value feature in the product.*

---

## 4. Anti-personas — who we are explicitly not building for in V1

- **The 500-head commercial dairy.** Different economics, wants IoT and ERP integration, will demand roadmap attention disproportionate to its epidemiological value. V3 at the earliest.
- **The agri-input retailer.** Wants product placement in the recommendation flow. Admitting them corrupts triage integrity — the moment recommendations can be bought, honest reporting dies.
- **The researcher wanting a raw data export.** Legitimate, valuable, and a distraction until the loop works.

---

## 5. The one behavioural bet

Everything rests on a single unproven assumption:

> **A farmer who currently waits 3–5 days will file a 60-second structured report on day 0 — if the report is free, private, answered instantly, and occasionally puts a real vet in his shed.**

**This must be tested before a line of production code is written** (see [07](07-product-roadmap.md), Phase 0). The cheapest valid test is a WhatsApp-based concierge MVP in two villages: a human behind the number does the triage, an LDO is on call, and we measure *report rate and day-0 share* — not satisfaction. If farmers won't report to a human on WhatsApp, they will not report to an app, and no amount of design fixes it.
