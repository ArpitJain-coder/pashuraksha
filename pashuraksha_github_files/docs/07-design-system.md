# 07 · Design System

Built for a ₹9,000 Android phone held in bright sunlight by someone whose first language is Marathi and who is worried about their animal. Every token below is defensible against that sentence.

---

## 1. Colour

### Risk scale — the most important decision in the system
Severity is **never** carried by colour alone. Every band = **colour + label + icon shape + position**.

| Band | Token | Mark | Ink (text) | Wash (fill) | Label (EN / मराठी) | Icon | Meaning to the farmer |
|---|---|---|---|---|---|---|---|
| Critical | `--risk-critical` | `#BE2C22` | `#8E1C15` | `#FBEAE7` | Critical / गंभीर | ▲ filled triangle | Act now. Separate the animal, call for help. |
| High | `--risk-high` | `#D2620F` | `#8A3F06` | `#FAEDE1` | High / जास्त | △ outline triangle | Today. A vet should see this. |
| Moderate | `--risk-moderate` | `#DFA100` | `#7A5800` | `#FAF1DA` | Watch / लक्ष ठेवा | ● circle | Watch closely, re-check tonight. |
| Low | `--risk-low` | `#2C7A45` | `#1F5B32` | `#E7F2E9` | Low / कमी | ✓ check | Normal. Keep an eye out. |
| Unknown | `--risk-unknown` | `#8A867B` | `#5C594F` | `#F0EEE7` | Not enough info | ? | We need more before we can say. |

Each band carries **three** values, not one. The *mark* colour is for bars, dots and arcs; the *ink* is the only value ever used for text on the wash, because the mark colour alone does not clear 4.5:1 on its own tint. Getting this wrong is the most common way a risk palette fails an accessibility audit while looking fine on a designer's monitor.

**The default state is silent.** A healthy animal gets no badge at all in the herd list — only the three that need something are marked. Labelling every row "Normal" turns the exception into visual noise, which is precisely backwards.

`--risk-unknown` exists deliberately. A system that always produces a confident band is lying some of the time.

### Brand & surface
```
--brand-900 #0F2E20   deep forest — dark blocks, the "do this first" panel
--brand-800 #12452E   gradient partner for headers
--brand-700 #14603F   primary actions  ◄ the only filled colour in the UI
--brand-600 #1B7A4E   active nav, links
--brand-100 #E1EFE7   selected states
--accent-600 #B26B23  earth ochre — vaccination only
--ink-900 #191B17     primary text
--ink-600 #66635A     secondary text
--ink-400 #95917F     tertiary, section labels, placeholder
--line      #E5E0D5   card borders          ◄ carries structure instead of shadow
--line-soft #EFEBE2   dividers inside a group
--surface   #FFFFFF   cards
--surface-2 #FAF8F3   inset panels, pressed states
--canvas    #F4F1E9   app background        ◄ warm paper
```

Three decisions in that block are load-bearing:

1. **The canvas is warm paper, not cool grey.** The earlier `#F5F7F6` sat 2% away from card white, so cards never separated and every screen needed a shadow to compensate. `#F4F1E9` gives white cards a real edge to sit against, which is what lets shadows disappear entirely. It also suits an agricultural product better than a cool neutral, at no cost to legibility.

2. **Green is deeper and rarer.** `--brand-700` replaced the brighter `#1F7A4D` for filled actions, and green fills were removed from icon chips, quick-action tiles, empty-state medallions and secondary buttons. Green now means *one thing*: this is the action. Everything else is neutral.

3. **All neutrals are warm.** Mixing a cool grey line (`#E2E7EB`) against a warm canvas is the single fastest way to make an interface look unresolved. Every grey in the system now shares the same warm bias.

Green as primary is deliberate and not decorative: it is the colour of the domain, it reads well in sunlight, and it leaves the entire red–amber range unambiguously reserved for severity. **No decorative element in this product is ever red or amber.**

**Contrast verified:** all body text ≥4.5:1, all UI boundaries ≥3:1, and each risk band's *ink* value tested against its own wash at 4.5:1+.

---

## 2. Type

System stack (`-apple-system`/`Roboto`/`Noto Sans Devanagari`). No webfont — a 200KB font download over 2G is a product failure.

| Role | Size / Line | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display (score, count) | 52 / 51 | 700 | −0.040em | Tabular numerals |
| H1 screen title | 30 / 34 | 700 | −0.030em | Question headings in the report flow |
| H2 section | 20 / 26 | 680 | −0.018em | |
| H3 card title | 16.5 / 22 | 650 | −0.012em | |
| Body | **16 / 24** | 400 | 0 | **Hard floor — never smaller for farmer-facing content** |
| Body strong | 16 / 24 | 600 | 0 | |
| Label | 13.5 / 19 | 650 | −0.005em | |
| **Overline** | 11 / 14 | 700 | +0.100em | Uppercase, `--ink-400`. Section headers only. |
| Caption | 12.5 / 17 | 400 | 0 | Timestamps and metadata only. Never instructions. |

**Two corrections from the first pass.** The original scale ran 44/26/19/16 — only a 1.4× step between the screen title and body, which left headlines looking apologetic and section headers competing with the content beneath them. The scale now opens up at the top (52/30) and *shrinks* at the label end: section headers dropped from 13px semibold ink-600 to an 11px tracked uppercase overline in ink-400, so they recede to being wayfinding and let the content carry the page.

Tracking is negative and increases with size — untracked type at 30px+ reads loose and amateur. The one exception is the overline, where positive tracking is what makes small uppercase legible.

Uppercase is applied *only* to the overline, and only ever to English strings. Devanagari has no case, so `text-transform` is a no-op there rather than a bug — but it does mean Marathi section headers rely on size and colour alone, which is why the overline is also the lightest colour in the type system.

Devanagari renders ~15% smaller at the same point size than Latin; Marathi strings get +1sp compensation. Copy is written in Marathi first and translated into English, not the reverse — English-first copy produces Marathi that is grammatically correct and tonally wrong.

---

## 3. Space, radius, elevation

4px base grid. Spacing scale: `4, 8, 12, 16, 20, 24, 32, 40, 56`.

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 10px | chips, inputs |
| `--r-md` | 16px | cards |
| `--r-lg` | 22px | sheets, modals |
| `--r-full` | 999px | pills, avatars |

**Structure is carried by hairline borders, not shadow.** Resting cards, list rows, queue items, accordions and clusters all use `1px solid var(--line)` and no shadow at all. This is the Zocdoc / Places / Gentler Streak pattern, and it is why the screens now read as calm: a page of twelve shadowed cards has twelve things floating at once, which is a hierarchy claim the content cannot honour.

Elevation is reserved for things genuinely *above* the page — and there are only three of them.
```
--e1  0 1px 2px  rgba(25,27,23,.04)   the FAB, and nothing else at rest
--e2  0 6px 20px rgba(25,27,23,.09)   bottom sheets, the map's zone rail
--e3  0 16px 40px rgba(25,27,23,.18)  modals, toasts, the critical interrupt
```
Coloured shadows were removed entirely. The green glow under the primary button (`0 2px 8px rgba(31,122,77,.24)`) dated the whole interface and did no work that the fill colour wasn't already doing.

**Where hierarchy comes from instead:** a 3px coloured left edge. Attention cards, herd rows needing action, vet queue items and district clusters all use the same device, so severity is scannable down a single vertical axis without a single shadow or fill.

---

## 4. Touch targets & density

| Element | Min size | Radius |
|---|---|---|
| Any interactive element | 48 × 48 dp | — |
| Primary CTA | 54 dp height, full-bleed minus 18dp gutters | 14 |
| Symptom tile | 104 × 96 dp — thumb-sized, glanceable, iconated | 14 |
| Card / list row | — | 16 |
| Sheet / modal | — | 24 |
| Nav bar item | 56 dp, **icon + label**, never icon alone | — |

Radius is standardised at **14 for controls, 16 for containers, 24 for sheets**. The first pass mixed 10/16/22 across controls that sat next to each other, which is invisible in isolation and obvious in a row.

**One filled primary per view.** In a ranked list — the home attention stack, most of all — only the top-ranked item carries a filled green button; everything below steps down to an outlined secondary. Three filled primaries stacked vertically is three competing claims about what matters most, which defeats the ranking the list exists to express.

The farmer app runs at **lower density than a consumer app on purpose**. Fewer things per screen, larger. The user may be standing in a shed at 6am with one hand on a rope.

---

## 5. Motion

Motion here does three jobs and no others: **explain causality, show system state, and direct attention in an emergency.** Nothing moves for delight.

| Token | Duration | Easing | Use |
|---|---|---|---|
| `--m-instant` | 120ms | `cubic-bezier(.2,0,.2,1)` | Press feedback, chip toggle |
| `--m-quick` | 200ms | `cubic-bezier(.2,0,0,1)` | Card enter, sheet open |
| `--m-flow` | 320ms | `cubic-bezier(.32,.72,0,1)` | Screen transitions, step advance |
| `--m-deliberate` | 1200ms | staged | AI assessment reasoning |
| `--m-alert` | 900ms | 2 pulses then rest | Critical badge attention |

**Specific behaviours implemented in the prototype:**
- **Screen transitions** slide 16px + fade — direction signals hierarchy (forward = left, back = right).
- **Step advance** in the report flow moves the progress bar *before* content changes, so progress reads as caused by the tap.
- **The assessment gauge** animates its arc from 0 over 900ms with a `cubic-bezier(.32,.72,0,1)` — deliberately slower than feels necessary. An instantly-rendered risk number reads as a lookup; a number that *arrives* reads as a judgement.
- **Staged reasoning** during assessment reveals 3 lines at 380ms intervals. This is honest — real work is happening — and it manages the expectation that the result is considered.
- **Skeletons shimmer** at 1.4s cycle, matching the final layout's geometry so nothing jumps on load.
- **The sync pill** slides up from the bottom, rests 3s, retreats. It never blocks and never requires dismissal.
- **Critical alerts** pulse twice then stop. Continuous animation on an emergency is stressful and gets ignored within a day.
- **`prefers-reduced-motion`** collapses every transform to a 120ms opacity fade. Fully implemented.

---

## 6. Component inventory

`RiskBadge` · `AnimalCard` · `AttentionCard` · `SymptomTile` · `StepperControl` · `PhotoCapture` · `AssessmentGauge` · `ReasoningList` · `ActionPlanStep` · `CaseCard` · `TriageQueueItem` · `ClusterCard` · `MapZone` · `AlertRow` · `SyncPill` · `EmptyState` · `SkeletonBlock` · `ErrorInline` · `BottomSheet` · `VoiceButton` · `LanguageSwitch` · `TabBar` · `SegmentedControl` · `StatTile` · `Sparkline` · `Toast`

---

## 7. Content principles

1. **Verbs, not nouns.** "Separate her from the others" beats "Isolation recommended."
2. **Second person, present tense.** "You reported this 2 days ago."
3. **Never abbreviate a clinical term** the farmer hasn't been taught. "HS" is meaningless; "a possible respiratory infection" is not.
4. **Quantities in familiar units.** Litres, days, rupees, number of animals. Never percentiles or z-scores in farmer copy.
5. **Uncertainty is stated, not hedged into vagueness.** "We're not sure — a vet should look" is trustworthy. "May possibly indicate potential concerns" is noise.
6. **No exclamation marks in health copy.** Ever.
7. **Error copy names the cause and the recovery.** "Couldn't reach the server. Your report is saved and will send automatically."
