# 01 · Problem Statement — Refined

**Product:** PashuSetu — livestock health early-warning & veterinary triage network
**SIH 2026 · PS 26128** · Government of Maharashtra · Maharashtra State Innovation Society
**Theme:** Agriculture, FoodTech & Rural Development

---

## 1. The statement as given

> "Efficient systems for early detection, prevention, and management of livestock diseases and animal health issues."

This is a *capability* statement, not a problem statement. Built literally, it produces what most teams will build: a symptom form, a classifier, a dashboard. That solution loses, because it assumes the bottleneck is **diagnosis**. It isn't.

## 2. What the bottleneck actually is

Read the brief's own description closely and three distinct failures are named, none of which are "we can't tell what the disease is":

- *"Disease symptoms may be reported late"* → **latency**
- *"diagnostic facilities may be distant"* → **access**
- *"information from farms, dispensaries, laboratories, vaccination drives and surveillance programmes may remain fragmented"* → **fragmentation**

A veterinarian standing in the shed diagnoses a sick animal in minutes. The loss happens in the **three to seven days before anyone qualified is standing in that shed**, and in the fact that the thousand such observations happening across a district in that same week never combine into a signal anyone can act on.

**The scarce resource is not diagnostic intelligence. It is qualified attention, correctly routed.** Maharashtra runs roughly **2,180 cattle units per veterinarian**, with Livestock Development Officers holding charge of 3–5 dispensaries each. You cannot add vets from an app. You can make sure the vet's next four hours go to the four animals that most need them.

## 3. Refined problem statement

> **Compress the time between the first observable sign of illness in a village animal and the first correct containment action — and make each of those observations legible, in aggregate, as an early-warning signal at village, block and district level.**

### Decomposed into three solvable sub-problems

| # | Sub-problem | Who feels it | Why it persists today |
|---|---|---|---|
| **P1** | **Reporting latency.** Farmers observe symptoms but wait, self-medicate, or ask a neighbour first. By the time a call is made, the containment window is closing and other animals are exposed. | Farmer, herd | No low-friction way to report. Calling a vet feels like "escalating"; there is no cheap intermediate step between *worry* and *summon a doctor*. Language and literacy add friction. |
| **P2** | **Triage blindness.** Vets receive unstructured phone calls with no history, no photo, no location context. They cannot rank whose animal to see first, and travel time dominates their day. | Vet, LDO, para-vet | No structured intake. No prior record at the animal level. Routing is first-caller-first-served, not severity-first. |
| **P3** | **Signal fragmentation.** Vaccination records, treatment logs, lab referrals and dispensary visits sit in separate systems. Clusters are recognised retrospectively, often after spread. | Block/District AH officer, State | Data is captured for compliance reporting, not for detection. Nothing correlates farmer-reported symptoms across neighbouring farms in near-real-time. |

## 4. The core insight

**Farmers are already the densest sensor network in rural India — they look at their animals several times a day.** The system does not need new hardware to detect disease early. It needs to make *reporting an observation* cheaper than *worrying about it*, and then treat the resulting stream as epidemiological data rather than as a support-ticket queue.

Every design decision in this project follows from that. Three consequences:

1. **The report is the product.** Everything else — the risk model, the map, the vet console — is downstream of whether a farmer files a 40-second report on a Tuesday morning instead of waiting until Friday.
2. **The AI's job is triage and routing, not diagnosis.** It answers *"how urgent is this, who should see it, and what should you do in the next two hours"* — never *"your cow has HS."* This is both clinically correct and legally necessary.
3. **A single report has to be worth filing even if nothing is wrong.** If the only payoff is an outbreak alert, farmers stop reporting during quiet periods, and the sensor network goes dark exactly when baseline data matters most.

## 5. Success metrics

### North Star
**Symptom-to-Action Time (SAT)** — median hours from *first symptom noticed by the farmer* (self-reported at intake) to *first completed containment action* (isolation confirmed, vet assigned and en route, or vaccination scheduled).

Baseline to establish in pilot; target a **≥60% reduction** by end of pilot.

### Supporting metrics

| Layer | Metric | Why it matters |
|---|---|---|
| Farmer | Reports per active farmer per month | Sensor density. Below ~0.8/mo the network is too sparse to detect clusters. |
| Farmer | % of reports filed within 24h of symptom onset | Direct driver of SAT. |
| Vet | Cases triaged per vet-day | Whether triage is actually buying attention back. |
| Vet | Median travel-time-per-case | Routing quality. |
| System | Cluster detection lead time vs. official outbreak declaration | The whole point of P3. Target: flag 5–10 days earlier. |
| Outcome | Case fatality rate & milk-yield recovery in reported vs. unreported cohorts | The only number that convinces a state to scale it. |

### Counter-metric (guardrail)
**False-alarm load:** % of escalated cases a vet closes as *"no action needed."* If this rises above **~25%**, vets begin ignoring the queue and the system dies quietly. This metric governs how aggressive the triage model is allowed to be — it is a product constraint, not a model-tuning detail.

### Vanity metrics we explicitly refuse to optimise
Downloads, registered animals, "AI accuracy %" in isolation, dashboard page-views. All four are gameable and none correlate with an animal getting treated sooner.

## 6. Non-goals

- **Not a diagnosis engine.** No screen ever states a disease as fact. Preliminary assessment, confidence, and a named human in the loop — always.
- **Not an EMR replacement.** Bharat Pashudhan is the system of record; PashuSetu writes into it, it does not compete with it.
- **Not a marketplace.** No feed, medicine, or cattle sales in V1. It would corrupt the trust required for honest symptom reporting.
- **Not IoT-first.** Collars and boluses are a V3 signal *enrichment*, never a V1 prerequisite. Hardware-gated adoption fails at ₹-per-animal economics for a 3-animal household.
- **Not a replacement for the 1962 helpline.** It is a structured front-end that makes 1962 dispatches smarter.

## 7. Constraints taken as binding

| Constraint | Design consequence |
|---|---|
| Low-connectivity villages | Offline-first write path. Reports queue locally and sync opportunistically. Never a blocking offline wall. |
| Mixed literacy; Marathi/Hindi primary | Icon + label always (never icon alone). Voice input as a peer to typing, not a fallback. Numbers over prose. |
| Feature-phone households exist | IVR path (1962-style) writes into the same case queue. Smartphone is the rich client, not the only client. |
| Vet time is the scarce input | Every vet-facing screen is ranked by severity, and shows travel cost before case detail. |
| Government data standards | Animal identity keyed to the 12-digit Bharat Pashudhan Tag ID from day one. |
| Zoonotic risk (brucellosis, anthrax) | Human-exposure prompts are mandatory in the report flow, and route to the health department, not just AH. |

## 8. Why now

- **The rails exist.** 39 crore+ animals are registered on the Bharat Pashudhan Portal with 12-digit tag IDs, and 4,019 Mobile Veterinary Units are already dispatching. Five years ago this product would have had to build identity and dispatch itself. Today it only has to build *sensing and triage* on top.
- **NADCP has proven the model works but has hit its ceiling.** FMD outbreaks fell from 132 (2019) to 40 (2025) through mass vaccination. Vaccination is a blunt annual instrument; the remaining losses are in *sporadic, fast-moving, locally-clustered* events that only faster reporting catches.
- **Voice AI in Indian languages crossed the usability line in 2024–25.** The literacy barrier that killed a decade of rural agri-apps is now an engineering problem, not a wall.

---

*Sources for figures cited: see [02-market-research.md](02-market-research.md). All government statistics should be re-verified against the latest DAHD release before any formal submission.*
