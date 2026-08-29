# PashuSetu — Livestock Health Early-Warning & Veterinary Triage

**Smart India Hackathon 2026 · Problem Statement 26128**
Government of Maharashtra · Maharashtra State Innovation Society · Agriculture, FoodTech & Rural Development

---

## The short version

The brief asks for "efficient systems for early detection, prevention and management of livestock diseases." Built literally, that produces a symptom form, a classifier and a dashboard — and loses, because it assumes the bottleneck is **diagnosis**.

It isn't. A vet standing in the shed diagnoses in minutes. The loss happens in the **3–7 days before anyone qualified is standing there**, and in the fact that a thousand such observations across a district that same week never combine into a signal anyone can act on.

> **Refined problem:** compress the time between the first observable sign of illness in a village animal and the first correct containment action — and make each of those observations legible, in aggregate, as an early-warning signal at village, block and district level.

**North star:** Symptom-to-Action Time (SAT). **Guardrail:** vet false-alarm rate below 25%.

---

## What's in here

```
docs/
  01-problem-statement.md      Refined statement, sub-problems, metrics, non-goals, constraints
  02-market-research.md        Sized losses, existing government rails, adoption floor, risks
  03-competitive-analysis.md   5 competitor sets, the white-space map, honest moat assessment
  04-users-jtbd.md             5 personas, problem→user map, 7 JTBD, anti-personas, the one bet
  05-architecture-and-flows.md System architecture, IA for 3 surfaces, 6 flows, state matrix
  06-mobbin-pattern-teardown.md 10 patterns adopted, 6 rejected — with links and reasoning
  07-design-system.md          Tokens, type, motion spec, accessibility floor
  08-product-roadmap.md        Phase 0→3, RICE, 12-month plan, team, risk register
  09-content-guide.md          Voice, 12 writing rules, the five moments, localisation

prototype/
  index.html   Device frame + director panel
  styles.css   The full design system as CSS
  data.js      Seed data — a farm mid-season, not a fresh install
  app.js       Router, 30 screens, all interactions and states
```

**Suggested reading order:** `01` → `04` → `06` → prototype → `09` → `08`.

---

## Running the prototype

```bash
cd "/Users/manojjain/Documents/Palak App/prototype" && python3 -m http.server 8756
```

Then open **http://localhost:8756**. No build step, no dependencies, no network calls — it runs entirely offline, which felt like the right constraint for a product about connectivity gaps.

### What to try

| | |
|---|---|
| **The core flow** | Farmer → Home → the green **+** button. Four steps, prefilled, ≤60 seconds. |
| **The interrupt** | In report step 2, increase **deaths** to 1. The flow short-circuits — no one should tap through four screens of symptom pickers when an animal has already died. |
| **Voice input** | Report step 1 → "Say it instead." Listens, then fills the symptom tiles. |
| **AI humility** | Assessment → "This doesn't look right to me" (the Lovi pattern — a trust device *and* the training-data pipeline). |
| **Offline** | Toggle **Offline mode** in the left panel, then file a report. Notice there is no offline *screen* — just a quiet pill. Toggle it back to watch the queue drain. |
| **Per-item sync failure** | Profile → Sync. One photo failed; the other three didn't. Retry is attached to the item, not to a global modal. |
| **Privacy promise** | Profile → Privacy & data. This screen is an adoption feature, not a legal one. |
| **Vet console** | Role switch → Veterinarian. Queue ranked by severity, not by who called first. Case detail carries neighbourhood context — the credibility unlock. |
| **The 25% guardrail** | Veterinarian → Me. The false-alarm meter with the red limit line. |
| **District** | Role switch → District officer → Map. Four clusters, village-aggregate only. Cluster detail leads with **days of lead time**, which is the number that renews the contract. |
| **Navigation** | Open an animal from Home, then go back — you land on Home. Open the same animal from My animals and back goes there instead. Every back button runs off a real history stack; nothing hardcodes its parent. |
| **Language** | Toggle to मराठी in the left panel. |
| **States** | Left panel → States & edge cases: loading skeleton, failed refresh, critical interrupt, empty herd, all-clear home, filtered-empty alerts. |
| **Reduced motion** | Toggle in the left panel. Every transform collapses to a 120ms fade. |

---

## The five decisions worth defending

1. **The herd health score is not the hero.** A composite score across six animals is not actionable — you cannot do anything differently at 82 versus 76, and averaging hides the one critical animal. The home screen leads with **"Needs attention today"**: specific animals, specific reasons, specific actions. The score survives as a trend chip with a delta, doing the job it is actually good at.

2. **There is no offline screen.** In rural Maharashtra, offline is not an error — it is Tuesday. A full-screen offline state tells the user the product is broken at the exact moment they most need to believe it works. Writes are optimistic, reads come from cache, and sync is a quiet pill.

3. **Photos are step 3 of 4, not "optional."** A photo is the highest-value signal for remote triage. Marking it optional guarantees it gets skipped. Skipping is still allowed — it visibly lowers confidence and escalates to a human sooner, which is the honest trade.

4. **The AI triages; it never diagnoses.** No screen states a disease as fact. The assessment leads with *what to do in the next two hours*, with reasoning collapsed underneath, confidence stated plainly, and a one-tap correction on every output. This is clinically correct, legally necessary, and — more practically — it is what makes a veterinarian willing to use the queue.

5. **No officer surface resolves an individual farm.** Farmers report honestly only while their farm is unidentifiable. That honesty is the entire data asset. Village-aggregate clamping is not a privacy nicety bolted on at the end; it is the precondition for the product working at all.

---

## Method note

All interface icons are drawn for this product on a single 24px grid, and the twelve symptom pictograms on a 40px grid. Nothing is emoji: emoji render differently on every device, vary wildly in optical weight, and read as toys in a product about a sick animal.

Interface patterns were researched on **Mobbin** across five reference categories — animal health (Fi), health scoring (Bevel, Withings, Google Fit), AI assessment and escalation (Oura Advisor, CVS Health, Lovi, Greg), risk maps (DoorDash Dasher, Weather, Artsy), and offline/sync (Instagram, Docusign, Craft). Ten patterns were adopted and six deliberately rejected; the reasoning for each, with links, is in [docs/06-mobbin-pattern-teardown.md](docs/06-mobbin-pattern-teardown.md).

The reference concept supplied at the start of this project was used for **flow structure only**, as intended. Where its design decisions conflicted with the research — the score-as-hero, the full-screen offline state, the optional photo — the research won, and the reasoning is written down rather than assumed.

---

## Honest limitations

- **Government statistics** cited in `02` come from press releases and secondary sources. Re-verify against the latest DAHD release before any formal submission.
- **The behavioural bet is unvalidated.** Everything rests on farmers reporting on day 0 instead of day 4. `08` Phase 0 specifies the cheapest valid test — a WhatsApp concierge in two villages, six weeks, no code. Findings there could reasonably redirect the product toward para-vet-mediated capture instead of direct-to-farmer.
- **The triage rules are illustrative.** Every rule needs a licensed veterinarian's sign-off before it reaches a real animal. That advisor is budgeted from Phase 1 in the team plan, and is not optional.
- **Imagery is drawn SVG**, so the whole thing runs with no network. Real photography would change the emotional register of the onboarding and animal screens considerably.
- **Two of the twelve symptom pictograms do not yet work** — "hard breathing" and "swollen udder" still read as abstract shapes. They need an illustrator and comprehension testing with farmers who cannot read the label underneath. Listed in [docs/09-content-guide.md](docs/09-content-guide.md) §8 rather than quietly left.
- **Hindi is stubbed.** The picker offers it; strings fall back to Marathi. It needs a native writer.
