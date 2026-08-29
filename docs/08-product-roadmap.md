# 08 · Product Roadmap

**Sequencing rule:** every phase must tighten the loop — *farmer reports → vet acts → outcome recorded → baseline improves*. Anything that doesn't tighten the loop waits, no matter how impressive it demos.

---

## Phase 0 · Validate the behavioural bet — *Weeks 0–6*

**Nothing gets built until this passes.** The entire product rests on one assumption ([04](04-users-jtbd.md) §5): that farmers who currently wait 3–5 days will report on day 0.

| Activity | Detail |
|---|---|
| **WhatsApp concierge MVP** | 2 villages, ~120 households. A published number. A human does triage; one LDO on call. Zero code. |
| **Field immersion** | 20 farmer interviews, 6 vet ride-alongs, 2 vaccination drives shadowed, 1 dispensary day observed end to end. |
| **Baseline measurement** | Establish current SAT by recall. This number is the denominator for every claim made later. |

**Gate criteria — all three must hold to proceed:**
1. ≥30% of households file ≥1 report in 6 weeks
2. ≥40% of reports arrive within 24h of symptom onset
3. The on-call LDO says the structured reports saved them time — unprompted

**If the gate fails:** the problem is trust and access, not tooling. Pivot toward the para-vet as the reporting interface (P4-mediated capture) rather than direct-to-farmer. This is a real and respectable outcome, and finding it in week 6 for the cost of a phone number is the point.

---

## Phase 1 · V1 Pilot — "Report and route" — *Months 2–6*

**Goal:** prove SAT reduction in 3 blocks. Ship the smallest thing that closes the loop once.

### In scope
| Surface | Scope |
|---|---|
| **Farmer (Android)** | Onboarding + Tag ID linking · herd list · **report flow** · rule-based assessment + action plan · request vet · case tracking · vaccination reminders · Marathi + Hindi · full offline write path |
| **Vet console** | Ranked triage queue · case detail with photos + animal history · neighbourhood context · advise / visit / refer / close · outcome capture |
| **Field worker** | Offline vaccination drive capture · ear-tag registration |
| **Officer** | Read-only district view: reported cases, village aggregates, basic cluster flag |
| **Integration** | Read animal identity from Bharat Pashudhan; write vaccination + treatment events back |

### Explicitly out of scope for V1
Photo-based ML · IVR path · yield tracking · zoonotic auto-routing to health dept · MVU dispatch integration · English localisation · iOS

> **The hardest call here: no photo ML in V1.** Photos are captured and shown to the *vet* — high value, zero model risk. An image classifier that is wrong about a sick animal in month 3 destroys trust the project may never recover. The photos captured in V1 become the labelled training set for V2.

### Success gate
- **SAT down ≥40%** vs Phase 0 baseline
- ≥0.8 reports/active farmer/month sustained through month 5 (retention, not launch spike)
- Vet false-alarm rate **<25%**
- ≥2 of 3 LDOs still using the queue daily at month 6 without prompting

---

## Phase 2 · V2 Scale — "See it coming" — *Months 6–12*

**Goal:** turn accumulated reports into an early-warning signal a district officer will act on. This is the phase where the product becomes the *state's*, not just the farmer's.

| Theme | Scope |
|---|---|
| **Cluster engine** | Spatio-temporal anomaly detection against a 90-day village baseline. Confidence-scored candidates, never auto-declared outbreaks. |
| **Officer dashboard** | Risk map with village-aggregate clamping · cluster detail with substantiating evidence · **lead-time-vs-lab-confirmation metric** (the ROI number that renews the contract) |
| **Photo assessment** | Trained on V1-captured images. Ships **vet-facing first** — assisting the vet's read before it ever speaks to a farmer. |
| **IVR / 1962 path** | Feature-phone reports into the same queue. Critical for de-biasing the surveillance signal toward P2-type households. |
| **Zoonotic routing** | Auto-flag to the district health department on brucellosis/anthrax/rabies indicators. Highest social value in the product. |
| **Yield tracking** | Per-animal baseline + deviation. Serves JTBD-2 retention and makes the invisible 80% of loss visible. |
| **MVU dispatch** | Integrate with existing 1962 dispatch so triage output becomes a real vehicle movement. |

### Success gate
- Cluster detection **≥5 days ahead** of the earliest lab confirmation, on ≥3 retrospectively-validated events
- ≥1 documented instance of resource reallocation (vaccine or MVU) driven by a PashuSetu signal
- District officer renews / expands to full district

---

## Phase 3 · V3 Expand — *Year 2*

| Theme | Scope |
|---|---|
| **Multi-state** | 4 languages, state-configurable disease priorities and escalation ladders |
| **Predictive risk** | Weather + seasonality + movement + historical incidence → forward-looking village risk |
| **Vaccination optimisation** | Route and prioritise drives by predicted risk instead of by calendar |
| **Lab integration** | Sample tracking, result routing back to the originating case |
| **Insurance** | Verified health history unlocks livestock insurance underwriting — a genuine farmer-side monetisation that doesn't corrupt triage |
| **IoT enrichment** | Collar/bolus ingestion for large farms. **Optional layer, never a prerequisite.** |
| **Coop distribution** | Partnership channel via dairy cooperatives (see [03](03-competitive-analysis.md) Set B) |

---

## Feature prioritisation — RICE

Scored for the **Phase 1 decision**. Reach = pilot households/vets touched per quarter; Impact 0.25–3; Confidence %; Effort in person-weeks.

| Feature | R | I | C | E | **RICE** | Call |
|---|---|---|---|---|---|---|
| Report flow (offline, voice, photo) | 1800 | 3 | 90% | 10 | **486** | 🟢 V1 core |
| Vet triage queue | 40 | 3 | 95% | 6 | **19** ‡ | 🟢 V1 core |
| Rule-based assessment + action plan | 1800 | 2.5 | 85% | 5 | **765** | 🟢 V1 core |
| Vaccination reminders (retention) | 1800 | 1.5 | 80% | 3 | **720** | 🟢 V1 core |
| Offline sync engine | 1800 | 2 | 90% | 8 | **405** | 🟢 V1 core |
| Bharat Pashudhan integration | 1800 | 2 | 60% | 8 | **270** | 🟢 V1 — low confidence is procedural, not technical |
| Cluster detection engine | 12 | 3 | 55% | 14 | **1.4** ‡ | 🟡 V2 |
| Photo ML assessment | 1800 | 2 | 45% | 16 | **101** | 🟡 V2 — capture data in V1 |
| IVR path | 900 | 2.5 | 70% | 10 | **157** | 🟡 V2 |
| Zoonotic auto-routing | 1800 | 1 | 75% | 4 | **337** | 🟡 V2 — high social value, low felt demand |
| Yield tracking | 1800 | 1.5 | 65% | 9 | **195** | 🟡 V2 |
| Marketplace | 1800 | 1 | 40% | 20 | **36** | 🔴 Never — corrupts triage integrity |
| IoT collars | 20 | 2.5 | 50% | 18 | **1.4** ‡ | 🔴 V3, optional layer only |

‡ **RICE systematically under-values vet and officer features because their Reach is tiny.** Read those rows against strategy, not the score: 40 vets are the gatekeepers to 1,800 farmers, and the officer is the buyer. *Raw RICE would build a farmer-only app that no vet answers and no state pays for.* This is exactly the failure mode the score is blind to — noting it here so the number doesn't quietly make the decision.

---

## 12-month view

```
M0 ─── M1 ─── M2 ─── M3 ─── M4 ─── M5 ─── M6 ─── M7 ─── M8 ─── M9 ─── M10 ── M11 ── M12
│ Phase 0    │                Phase 1 · V1 Pilot              │        Phase 2 · V2        │
│ concierge  │                                                │                            │
├─validate───┤                                                │                            │
             ├─design+build──┤                                │                            │
                             ├─3-block pilot─────────────────┤                            │
                                     ├─offline+integration─┤  │                            │
                                                              ├─cluster engine───────┤     │
                                                              ├─photo ML (vet-facing)─────┤
                                                                     ├─IVR────────┤        │
                                                                            ├─officer dash─┤
▲ Gate 0                                    ▲ Gate 1                                ▲ Gate 2
  behaviour validated                         SAT −40%                                lead-time ≥5d
```

---

## Team

| Phase | Shape |
|---|---|
| **0** | 1 PM/researcher, 1 designer, 1 field coordinator, 1 on-call LDO (partner) |
| **1** | +2 Android, 1 backend, 1 data, 0.5 QA, 1 vet advisor (part-time, clinical review of every rule) |
| **2** | +1 ML, +1 backend, +1 GIS/epidemiology advisor, +1 field ops |

**The vet advisor is not optional.** Every triage rule requires clinical sign-off. This is the difference between a hackathon demo and a system a state can deploy.

---

## Risk register

| Risk | P | I | Mitigation | Owner |
|---|---|---|---|---|
| Farmers don't report | M | Critical | Phase 0 gate before any build; para-vet-mediated fallback path | PM |
| Vets abandon the queue | M | Critical | 25% false-alarm hard guardrail; vets co-design the queue in Phase 1 | PM + vet advisor |
| Triage misses a serious case | L | Critical | Rule-based conservative floors; deaths short-circuit to escalation; every output has a human path | Vet advisor |
| Perceived as surveillance → culling fear | M | High | Village-aggregate clamping; explicit Marathi privacy copy in onboarding; no farm-level officer view, ever | Design + Policy |
| Bharat Pashudhan integration blocked | M | High | Design for standalone operation with a manual Tag ID entry fallback; integration is an accelerator, not a dependency | Eng lead |
| Connectivity worse than modelled | M | Medium | Offline-first is architectural; IVR fallback in V2 | Eng lead |
| Government procurement stalls | H | Medium | Pilot on innovation-cell funds, not a line-item tender; build the ROI evidence first | PM |
| Model produces a confidently wrong public advisory | L | Critical | No auto-published advisories. Human officer approval required on every farmer-facing broadcast. | Policy |

---

## What "done" looks like at 12 months

Not "the app has 50,000 downloads." This:

> **In three blocks of Pune district, the median time from a farmer first noticing a sick animal to a completed containment action has fallen from ~4 days to under 12 hours; three disease clusters were flagged and acted on before lab confirmation; and the district Animal Husbandry Officer has asked for it across all fourteen blocks.**
