# 03 · Competitive Analysis

Five competitor sets matter, and they are *not* competing with each other. Understanding which set we sit in determines whether we win.

---

## Set A — Government rails (the incumbent, and our host)

| Player | What it does | Strength | Gap we exploit |
|---|---|---|---|
| **Bharat Pashudhan Portal / INAPH** | Animal registry, 12-digit Tag ID, vaccination & treatment records. 39 crore+ animals. | Universal identity. Legal system of record. Unmatched coverage. | **Captures events after they happen.** It is a ledger, not a sensor. Nothing detects a cluster forming. Data entry is worker-driven, not farmer-driven. |
| **NADCP / LHDCP** | Mass FMD + brucellosis vaccination programme. | Proven: FMD outbreaks 132→40. | Annual, population-wide, blunt. Cannot catch sporadic local events. |
| **1962 helpline + 4,019 MVUs** | Toll-free call → mobile vet dispatched to doorstep. | Real physical dispatch capacity, already funded and running. | **Unstructured intake.** First-caller-first-served, no severity ranking, no photo, no prior history, no routing optimisation. |

**Strategic position: build ON Set A, never against it.** They own identity and dispatch. They lack sensing and triage. We are the missing middle. Concretely: PashuSetu reads animal identity from Bharat Pashudhan and writes case outcomes back; PashuSetu turns a 1962 call into a ranked, evidenced dispatch ticket.

---

## Set B — Dairy-chain IoT / SaaS

| Player | Model | Strength | Gap |
|---|---|---|---|
| **Stellapps** — $45M+ raised, $26M Series C (Oct 2024), 42,000 villages, 3.5M farmers ([source](https://www.stellapps.com/about/), [AgroSpectrum](https://agrospectrumindia.com/2025/12/23/startups-that-matter-how-indian-agritech-became-pillar-of-food-security-in-2025.html)) | IoT across milk chain: quality testing, herd monitoring, traceability | Enormous distribution. Real hardware in real villages. Credible investors (Gates Foundation, Omnivore, Blume). | **Enters via the dairy cooperative, not the animal.** Optimises milk *quality and payment*, not animal *health*. Health monitoring is a byproduct. No epidemiological/state-surveillance layer. Hardware-gated. |
| **Prompt Equipments** and similar milk-chain automation | AMCUs, chilling, weighing | Deep coop relationships | Same: infrastructure play, not health-outcome play. |

**Threat level: Low-Medium, high partnership value.** Stellapps could add symptom triage but it is off their revenue axis (they monetise per-litre and per-device, not per-case). Their 42,000-village footprint is the single best V3 distribution channel we could ask for.

---

## Set C — Farmer advisory AI (the closest competitors)

| Player | Model | Strength | Gap |
|---|---|---|---|
| **MooFarm** | AI advice on health, nutrition, herd management in local languages; claims 10–15% productivity lift ([Benison Media](https://benisonmedia.com/livestock-innovations-in-indias-growing-startup-landscape/)) | Local-language advisory at scale; farmer-first | **Advisory, not action.** Tells a farmer what to think; does not get a vet to the shed. No state integration, no surveillance aggregation. |
| **Pashushala / PashuGPT** | LLM assistant trained on 3 yrs proprietary data; beta Apr 2025; **13 Indian languages**; marketplace for livestock, equipment, vet services, insurance ([YourStory](https://yourstory.com/2025/06/this-startup-aims-to-be-the-chatgpt-for-indias-livestock-farmers)) | Best-in-class multilingual conversational layer. Marketplace monetisation. | **Chat is an answer machine, not a triage machine.** No severity ranking, no vet dispatch loop, no case state. Marketplace incentives conflict with honest triage (an app that sells medicine has a reason to say "try this first"). |

**Threat level: High on the farmer relationship, Low on the state contract.** These are the players who could own the farmer's home screen. Our defensibility is *the closed loop*: PashuGPT can tell you your buffalo may have HS; only a system wired into LDO rosters and MVU dispatch can put a vet in your shed by evening — and only that same system produces data a district officer will act on.

> **The sharpest competitive line:** *they answer questions; we close cases.*

---

## Set D — Global precision livestock (the technology frontier, wrong economics)

Connecterra, Halter, Allflex/MSD SenseHub, CattleEye, Ceres Tag.

Sensor-first: collars, boluses, ear tags, computer-vision gait scoring. Genuinely excellent detection — often 24–48h ahead of human observation.

**Why they don't compete here:** unit economics. These systems assume 200–2,000-head commercial herds where a ₹4,000–8,000 per-animal device amortises against industrial milk revenue. The Indian median is **2–7 animals per household**. A device-gated product cannot reach that user at any price.

**What we steal:** their detection *logic* — deviation-from-baseline thinking, herd-level anomaly framing — applied to human observation instead of accelerometer data. **What we reject:** hardware as a precondition. Sensors are a V3 enrichment for large dairy farms, layered onto a system that already works without them.

---

## Set E — Human-health analogs (pattern donors, not competitors)

Ada Health, K Health, Babylon, Oura Advisor, Practo. Not in this market, but they have already solved — and been regulated on — the exact hard problem: **structured symptom intake → risk stratification → escalation to a human, without ever claiming to diagnose.**

Everything they learned about disclaimers, confidence communication, escalation ladders, and "this is not medical advice" framing transfers directly. See [08-mobbin-pattern-teardown.md](08-mobbin-pattern-teardown.md).

---

## The white space

Plot the market on two axes — **who the primary user is** (farmer ↔ state) and **what the system produces** (information ↔ dispatched action):

```
                     PRODUCES DISPATCHED ACTION
                              ▲
                              │
              1962 / MVUs  ●  │  ●  ◄── PashuSetu
              (unstructured)  │      (triaged, evidenced,
                              │       farmer-initiated)
    STATE ◄───────────────────┼───────────────────► FARMER
                              │
        Bharat Pashudhan  ●   │   ●  PashuGPT / MooFarm
        (ledger)              │      (advisory chat)
                          ●   │   ●  Stellapps
                     NADCP    │      (milk-chain IoT)
                              ▼
                      PRODUCES INFORMATION
```

**Nobody occupies the top-right quadrant.** The government has dispatch capacity but unstructured, state-initiated intake. The startups have the farmer relationship but stop at advice. The white space is: **farmer-initiated, structurally-captured, severity-triaged reports that both dispatch a real vet and aggregate into a state-grade early-warning signal.**

---

## Defensibility — honest assessment

| Moat candidate | Real? | Notes |
|---|---|---|
| **Longitudinal animal-level symptom history keyed to Tag ID** | ✅ Strong | Compounds monthly. A competitor starting in Year 3 has no baseline, and baselines are what make deviation detection work. |
| **Vet-side workflow lock-in** | ✅ Strong | Once an LDO runs their day out of the triage queue, switching cost is their entire workflow. Vets are ~2,000× rarer than farmers — winning them is winning the market. |
| **Government integration + data-sharing agreements** | ✅ Medium-Strong | Slow to earn, slow for others to replicate. Procurement is a moat, unromantic as that is. |
| **The AI model itself** | ❌ Weak | Livestock symptom triage is a small-data classification problem within reach of any competent team, and foundation-model access is commoditised. **Do not pitch the model as the moat.** |
| **Farmer app UX** | ❌ Weak alone | Copyable in a quarter. Matters enormously for adoption; provides zero defensibility. |

**Conclusion:** the moat is the **loop** (farmer → structured report → vet action → outcome recorded → baseline improves), not any single component. Every roadmap decision in [07](07-product-roadmap.md) is scored on whether it tightens that loop.
