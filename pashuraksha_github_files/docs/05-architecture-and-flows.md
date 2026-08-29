# 05 · Information Architecture, User Flows & System Architecture

---

## 1. Product principles (these settle arguments)

1. **Action over assessment.** Every screen showing a risk must show the next action more prominently than the risk itself.
2. **The AI never diagnoses.** It triages, ranks, and routes. Language is always *"possible / consistent with / needs veterinary confirmation."*
3. **Offline is invisible, never blocking.** Reports are written locally and always succeed from the user's point of view. Sync is a background fact, surfaced as a quiet pill — never a wall.
4. **Icon + label, always.** No icon-only controls anywhere in the farmer app.
5. **Numbers a farmer already uses.** Litres, days, rupees, animal names. Not percentiles.
6. **Privacy below village aggregate is absolute.** No officer surface ever resolves an individual farm.
7. **Every AI output is correctable.** A visible "This doesn't look right" on every assessment — it is a trust device *and* the training-data pipeline.
8. **Escalation is a ladder, never a cliff.** Self-care → para-vet → LDO → MVU dispatch → lab referral → district escalation.

---

## 2. System architecture

```
┌─────────────── CAPTURE ────────────────┐
│  Farmer app (Android, offline-first)   │
│  IVR / 1962 voice path  ──────────────┐│
│  Field-worker tablet (offline-first)  ││
└────────────────┬──────────────────────┘│
                 │ queued, idempotent writes
                 ▼
┌──────────── CASE SPINE ────────────────┐
│  Case store · animal-level history     │
│  keyed to Bharat Pashudhan 12-digit    │
│  Tag ID  (identity is NOT ours)        │
└────────┬───────────────────┬───────────┘
         │                   │
         ▼                   ▼
┌── TRIAGE ENGINE ──┐  ┌── CLUSTER ENGINE ──┐
│ rule-based core   │  │ spatio-temporal    │
│ + ML severity     │  │ anomaly vs 90-day  │
│ + photo model     │  │ village baseline   │
│ Outputs: severity,│  │ Outputs: emerging  │
│ confidence, route,│  │ cluster candidates │
│ zoonotic flag     │  │ + lead-time signal │
└────────┬──────────┘  └─────────┬──────────┘
         ▼                       ▼
┌──────────── ACT & OBSERVE ─────────────┐
│ Vet triage queue  ·  MVU dispatch hint │
│ District dashboard ·  Health dept flag │
│ Outcome recorded ──► back to baseline  │
└────────────────────────────────────────┘
         │
         └──► writes vaccination / treatment
              events INTO Bharat Pashudhan
```

**Two engines, deliberately separate.** The triage engine answers *"how urgent is this one animal"* (per-case, must be fast, must be conservative). The cluster engine answers *"is something happening here"* (population-level, can be slow, must be sensitive). Conflating them is the most common architectural mistake in disease surveillance — a model tuned to be sensitive enough for outbreak detection will flood a vet queue with false alarms.

### Why rules before ML
The V1 triage core is **rule-based**, derived from standard veterinary triage criteria, with ML layered on for severity ranking and photo assessment. Reasons: (a) explainable to a vet, who must trust it; (b) auditable by a government buyer; (c) works from day one with zero training data; (d) fails safely — a rule over-escalates, a bad model under-escalates.

---

## 3. Information architecture — three surfaces, one spine

### Surface A · Farmer app (P1, P2)
```
Home  ──  My Herd  ──  [ REPORT ]  ──  Alerts  ──  Profile
 │           │             │             │           │
 │           │             │             │           ├─ Language (मराठी/हिंदी/EN)
 │           │             │             │           ├─ Farm & KYC
 │           │             │             │           └─ Privacy & data
 │           │             │             ├─ Health advisories (village)
 │           │             │             ├─ Vaccination due
 │           │             │             └─ Case updates
 │           │             ├─ 1. What did you notice   (symptom, voice or tap)
 │           │             ├─ 2. Which animal(s)       (+ how many affected)
 │           │             ├─ 3. Photo / video          (first-class, not optional)
 │           │             ├─ 4. Since when + context   (feed, water, deaths, vaccination)
 │           │             └─ → Assessment → Action plan → (optional) Request vet
 │           ├─ Animal profile
 │           │   ├─ Health timeline
 │           │   ├─ Vaccination record (Tag ID linked)
 │           │   ├─ Yield baseline & deviation
 │           │   └─ Open cases
 │           └─ Add animal (Tag ID scan / manual)
 ├─ Needs attention today   ◄── the actual hero
 ├─ Open cases (status + next step)
 ├─ Around you (village signal, anonymised)
 └─ Due soon (vaccination / deworming)
```

### Surface B · Vet & field console (P3, P4)
```
Queue  ──  Map/Route  ──  Cases  ──  Drives  ──  Me
  │           │             │          │
  │           │             │          ├─ Vaccination drive (offline capture)
  │           │             │          └─ Ear-tagging / registration
  │           │             ├─ Case detail
  │           │             │   ├─ Farmer report + photos
  │           │             │   ├─ Animal history (Tag ID)
  │           │             │   ├─ Neighbourhood context (14-day)
  │           │             │   ├─ AI triage + reasoning (collapsed)
  │           │             │   └─ Actions: advise / visit / refer lab / escalate / close
  │           │             └─ Bulk close & advise
  │           └─ Today's route, ordered by severity × travel cost
  ├─ Ranked triage queue (severity, not recency)
  └─ Filters: critical / high / awaiting me / overdue
```

### Surface C · District officer (P5)
```
Overview  ──  Map  ──  Clusters  ──  Resources  ──  Reports
   │           │          │             │             │
   │           │          │             │             └─ Export, NADCP formats
   │           │          │             ├─ MVU positions & load
   │           │          │             ├─ Vaccine stock vs demand forecast
   │           │          │             └─ LDO load balance
   │           │          ├─ Emerging cluster detail
   │           │          │   ├─ Lead-time vs baseline
   │           │          │   ├─ Substantiating reports (village-aggregated only)
   │           │          │   └─ Actions: dispatch MVU / order lab / notify health dept
   │           │          └─ Confirmed vs suspected
   │           └─ Risk choropleth + hotspot rings
   └─ State risk, active cases, coverage %, trend
```

---

## 4. Core user flows

### Flow 1 · Report an issue *(the flow that matters most)*
**Target: ≤60 seconds, ≤4 taps, works fully offline.**

```
Home ─[Report]─► Step 1: What did you notice?
                 · large symptom tiles, icon + Marathi label
                 · 🎤 "Bolun sanga" (say it) as a peer control
                 · multi-select, no wrong answers
                 ▼
                 Step 2: Which animal?
                 · pre-filled from herd, photo chips
                 · "How many others show this?" stepper
                 · ⚠️ if deaths > 0 → severity floor = HIGH, skip to escalate
                 ▼
                 Step 3: Show me
                 · camera-first; guidance overlay ("mouth, feet, udder")
                 · skippable, but skipping is a visible downgrade in confidence
                 ▼
                 Step 4: Context
                 · since when · eating/drinking · vaccination status
                 · 🔴 human-contact question if zoonotic indicators present
                 ▼
                 [Assessing…] 1.2s deliberate pause, staged reasoning shown
                 ▼
                 ASSESSMENT
                 · ACTION FIRST: "Separate her from the others — now"
                 · severity band + plain-language meaning
                 · "Why we think so" — collapsed, expandable
                 · confidence + "This is not a diagnosis"
                 · [Request veterinary help]  [This doesn't look right]
                 ▼
                 ACTION PLAN (4 steps, checkable, works offline)
                 ▼
                 Case created → tracked in Alerts
```

**Deliberate departures from the reference concept:**
- Photo is **step 3 of 4**, not "optional" at the end. It is the highest-value signal for remote triage; burying it as optional guarantees it's skipped.
- The assessment leads with **what to do**, not with a score. A 82/100 ring answers a question the farmer never asked.
- **Deaths > 0 short-circuits the flow.** No one should tap through four screens of symptom pickers when an animal has already died.
- Every screen state is reachable offline; the case is created locally and syncs later.

### Flow 2 · Vet triages the morning queue
```
Open app ─► Queue ranked by severity × time-open × travel cost
         ─► Critical card: photo thumb, village, distance, animals affected, age of report
         ─► Case detail
             · farmer's own words (voice transcript if spoken)
             · photos
             · animal history from Tag ID
             · "3 similar reports within 4 km in 11 days"  ◄── the credibility unlock
             · AI triage summary, reasoning expandable, confidence stated
         ─► Decide: Advise remotely | Add to today's route | Refer to lab | Escalate to district
         ─► If route: auto-ordered by geography, farmer notified with an ETA window
         ─► After visit: outcome + diagnosis recorded → improves baseline + writes to Bharat Pashudhan
```

### Flow 3 · Field worker runs a vaccination drive offline
```
Select village ─► roster loads from cache ─► tap animals as vaccinated
              ─► batch/vial number scanned once, applied to the batch
              ─► every write local, instant, optimistic
              ─► pill: "12 records will sync when you're online"
              ─► on reconnect: silent background sync, per-record retry on failure
```

### Flow 4 · District officer acts on an emerging cluster
```
Overview ─► "Emerging cluster · Ahmednagar block · confidence Medium"
         ─► Cluster detail: 12 farms, 38 animals, 3 deaths, 11-day window
         ─► "Detected 6 days before the earliest lab referral"  ◄── the ROI number
         ─► Substantiating evidence (village-aggregated, never farm-identified)
         ─► Actions: Dispatch MVU · Order lab sampling · Notify health dept (zoonotic) · Advisory to farmers
```

### Flow 5 · IVR path (feature phone, P2)
```
Call 1962 ─► language select ─► "Describe what you're seeing" (recorded)
         ─► 3 structured yes/no keypad questions (deaths? off feed? how many?)
         ─► case created in the SAME queue, flagged source=IVR, confidence=lower
         ─► SMS confirmation + callback with the action plan
```

### Flow 6 · Quiet-month retention loop
```
Weekly: "Ganga's vaccination is due in 6 days" ─► one-tap book with the drive
Monthly: "Your herd's milk is steady. Lakshmi is 12% below her own average — worth a look."
Seasonal: "Heavy rain expected. 3 things to check this week."
```

---

## 5. State matrix

Every list, card and flow in the prototype implements these. **States are not edge cases; they are most of the product.**

| State | Where it appears | Treatment |
|---|---|---|
| **Empty — first run** | Herd, Cases, Alerts | Illustrated, one clear primary action, explains the payoff. Never a bare "No data." |
| **Empty — good news** | Alerts, Needs attention | Positive framing: "Nothing needs your attention today." Distinct from first-run empty. |
| **Loading — skeleton** | Lists, dashboards | Shimmer skeletons matching final layout. No spinners on content areas. |
| **Loading — deliberate** | AI assessment | 1.2s staged reasoning ("Reading your report… comparing with 47 nearby reports…"). Instant answers read as guesses; visible work reads as care. |
| **Offline** | Global | Quiet pill, non-blocking. Reads/writes continue from cache. Never a full-screen wall. |
| **Pending sync** | Report, drive capture | Per-item chip: "Will sync when online." Optimistic — the user's task is already done. |
| **Sync failed** | Same | Inline, per-item, with a retry. Never a global modal. |
| **Error — recoverable** | Any network action | Plain language, cause, retry. "Couldn't reach the server. Your report is saved." |
| **Error — validation** | Report form | Inline, at the field, before submit is possible. |
| **Low confidence** | AI assessment | Explicit downgrade + a stronger nudge to human help. Confidence is never hidden. |
| **AI unavailable** | Assessment | Degrade to the rule-based path + direct vet routing. The product still works. |
| **Success** | Report filed, vet assigned | Confirmation with the *next* thing, plus a real timeline. Not a dead-end checkmark. |
| **Critical** | Deaths reported, zoonotic flag | Interrupts flow. Red, single action, calls forward. Cannot be dismissed accidentally. |
| **Stale data** | Officer dashboard | "Last updated 14 min ago" always visible. Dashboards that hide staleness get trusted wrongly. |

---

## 6. Notification taxonomy

Four tiers, deliberately few. Notification fatigue kills surveillance products faster than bad models.

| Tier | Example | Channel | Interrupts? |
|---|---|---|---|
| **Critical** | Vet assigned & en route; suspected zoonotic exposure | Push + SMS + call | Yes |
| **Important** | Health cluster reported near your village; case status changed | Push | Badge only |
| **Routine** | Vaccination due in 6 days | Push, batched weekly | No |
| **Ambient** | Monthly herd summary | In-app only | No |

Rule: **a farmer receives at most one Important notification per week.** If the cluster engine wants to send more, the threshold is wrong.

---

## 7. Accessibility & localisation floor

- Minimum touch target **48×48dp**; primary actions **56dp**
- Minimum body text **16sp**; farmer-app primary numerals **≥28sp**
- Contrast **≥4.5:1** for text, **≥3:1** for UI boundaries — verified for the red/amber/green risk scale
- **Colour is never the sole carrier of severity** — always paired with a text label and a distinct icon shape (colour-blind safety, and it survives cheap LCD panels in daylight)
- Full string externalisation, Marathi as the source language for review — not a post-hoc translation of English copy
- Voice input available on every free-text field; audio playback available on every assessment
- Works on a 4-year-old 2GB Android device: target <150ms interaction latency, <25MB install
