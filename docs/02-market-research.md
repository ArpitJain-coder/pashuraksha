# 02 · Market Research

> **Verification note:** every figure below is traceable to a linked source. Government statistics move between DAHD press releases and Livestock Census revisions — re-verify before any formal submission or pitch.

---

## 1. Market size & the shape of the loss

### The loss is real, recurring, and mostly invisible

| Figure | Value | Source |
|---|---|---|
| Annual economic loss to **FMD alone** in India | **₹20,000–25,000 crore** (~$4.45B) | [ResearchGate](https://researchgate.net/publication/270215319_Estimation_of_economic_losses_due_to_foot_and_mouth_disease_in_India) |
| Farm-level FMD loss, **severe incidence scenario** | **$3.2B/yr** (₹221,110 million) | [ScienceDirect / Prev. Vet. Med.](https://www.sciencedirect.com/science/article/abs/pii/S0167587721000623) |
| Farm-level FMD loss, **moderate scenario** | $270M | same |
| Share of direct loss from **milk-yield drop in lactating animals** | **80%** | same |

**Read this table carefully — it contains the strategy.**

Two things follow:

1. **The 12× gap between the severe ($3.2B) and moderate ($270M) scenarios is the entire business case.** The value of this product is not "treat sick cows." It is *keeping a moderate year from becoming a severe year* by catching clusters before they propagate. That is a surveillance value proposition, not a telemedicine one.

2. **80% of the loss is milk that didn't get produced, not animals that died.** This reframes the farmer-facing value proposition completely. Mortality is rare and salient; yield loss is common and invisible. A farmer who loses 4 litres/day for three weeks across two animals has lost more than the neighbour whose calf died — but only one of them *feels* it. **The product must make invisible losses visible**, or farmers will rate its value by the rare dramatic saves and churn during quiet months.

### Supply-side scarcity

| Figure | Value | Source |
|---|---|---|
| Maharashtra cattle-units per veterinarian | **~2,180 : 1** | [Pashudhan Praharee](https://www.pashudhanpraharee.com/state-wise-cattle-to-veterinarian-ratio-in-india/) |
| LDO coverage burden | **3–5 dispensaries/hospitals per officer** | [Acta Scientific — Status of Animal Husbandry in Maharashtra](https://actascientific.com/ASVS/pdf/ASVS-04-0269.pdf) |
| Buffalo population CAGR (Maharashtra) | 5.09% (vs 6.53% national) | same |
| Poultry growth (Maharashtra) | 17.63% | same |

The demand side is growing at 5–17% CAGR. The supply of veterinarians is not. **The gap can only be closed by triage, not by throughput.**

---

## 2. The rails that already exist

This is the single most important section for product strategy. India has spent five years building livestock digital infrastructure. **Competing with it is suicide; building on it is the wedge.**

| Asset | Scale | Source |
|---|---|---|
| Animals registered on **Bharat Pashudhan Portal** | **39 crore+**, each with a unique **12-digit Tag ID** | [IANS](https://ianslive.in/nadcp-contributing-to-more-disease-secure-livestock-sector-in-india--20260822135511) |
| **Mobile Veterinary Units (MVUs)** operational | **4,019** | same |
| Farmers served by MVUs | **136 lakh** | same |
| Animals treated by MVUs | **276 lakh** | same |
| **1962** toll-free animal helpline | Live in TN, Telangana, Gujarat, UP, Uttarakhand, AP, Assam, Jharkhand, Karnataka, Kerala + | [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1823690), [Kerala AHD](https://ahd.kerala.gov.in/en/mobile-veterinary-unit/) |
| Gujarat MVU scheme | 85 lakh animals treated free; now a national model | [Prokerala](https://www.prokerala.com/news/articles/a1696527.html) |

### NADCP outcomes — proof the mechanism works, and where it stops

| Disease | 2019 outbreaks | 2025 outbreaks | Source |
|---|---|---|---|
| Foot & Mouth Disease | 132 | **40** | [Organiser](https://organiser.org/2026/08/26/377028/bharat/nadcp-impact-fmd-outbreaks-fall-from-132-to-40-brucellosis-cases-also-decline-since-2019/) |
| Brucellosis | 22 | **15** | same |

**Interpretation:** mass vaccination — a blunt, annual, population-wide instrument — captured the large, predictable share of the problem. The FMD curve has flattened at ~40 outbreaks/yr and brucellosis has barely moved (22→15 in six years). The residual is **sporadic, fast-moving, locally-clustered events** that annual vaccination structurally cannot catch. That residual is exactly what real-time farmer-sourced surveillance addresses. *NADCP's success defines our market: we are the instrument for the part vaccination can't reach.*

DAHD has publicly signalled intent toward "AI-enabled analytics, vaccination traceability, real-time dashboards and evidence-based planning" — meaning the buyer has already articulated the need. **This is a stated-demand market, not a market-creation problem.**

---

## 3. Adoption reality: the literacy and connectivity floor

| Finding | Implication |
|---|---|
| Voice is consistently the **most intuitive and trusted** interaction mode in rural ecosystems; benchmarking of leading agri platforms plus farmer feedback converge on this ([AgriBazaar](https://blog.agribazaar.com/digital-rural-first-tool-local-language-redefining-agritech/)) | Voice input is a **primary** affordance in the report flow, sized and placed as a peer to tapping — not a settings toggle. |
| Platforms serving small/marginal farmers ship **IVRS access for non-smartphone users** ([AIKosh](https://aikosh.indiaai.gov.in/home/use-cases/details/ai_powered_voice_assistant_for_farmers.html)) | A feature-phone report path must write into the *same* case queue. If IVR is a second-class silo, the epidemiological signal is biased toward smartphone households. |
| Most rural users prefer native-language service delivery ([Markhub24](https://www.markhub24.com/post/voice-search-in-india-winning-the-next-wave-of-regional-queries)) | Marathi first, Hindi second, English third — in that priority for copy review, not as an afterthought translation pass. |
| Bharat-VISTAAR and similar state AI advisory platforms are launching voice-first ([Agritell](https://www.agritell.com/agriculture-news/how-the-ai-agriculture-platform-bharat-vistaar-will-transform-indian-farming/)) | Voice-first is table stakes by 2026, not a differentiator. Differentiate on *what happens after the report*, not on the input modality. |

**Design consequence:** the report flow is capped at **≤60 seconds and ≤4 taps** for the common case, with every question answerable by tapping a picture *or* speaking. Anything longer and reporting loses to worrying.

---

## 4. Market sizing (bottom-up, Maharashtra pilot → national)

| Tier | Definition | Basis |
|---|---|---|
| **Pilot (Year 1)** | 3 blocks × ~40 villages × ~600 livestock households | Single district AH budget line; MVU-adjacent deployment |
| **State (Year 2–3)** | Maharashtra AH Dept — district AH officers, LDOs, para-vets, Gopal Mitras | State budget + NADCP/LHDCP convergence funds |
| **National (Year 4+)** | 39 crore animals already tagged on Bharat Pashudhan; ~4,019 MVUs to route | Central scheme integration |

**Buyer:** State Animal Husbandry Department (the brief's own originator is Maharashtra State Innovation Society). **User:** the farmer. **These are different people** — a classic public-sector split. The state buys *surveillance and reporting*; the farmer adopts for *"my animal, faster help."* The product must be genuinely valuable to both or one side stops feeding it. Most gov-tech livestock projects fail precisely here: they are built as compliance-reporting tools, farmers get nothing back, data quality collapses, and the dashboard shows a beautifully rendered lie.

**Adjacent commercial market (do not pursue in V1, but it de-risks Year 3+):** private dairy cooperatives and milk-chain aggregators have a direct P&L interest in yield protection and already run village-level collection infrastructure. Indian dairy and dairy-adjacent startups have collectively raised **$500M+** ([Dudh Hisaab](https://dudhhisaab.com/tools/dairy-startups-india)) — the capital and the distribution both exist.

---

## 5. Risks to the market thesis

| Risk | Severity | Mitigation |
|---|---|---|
| **Farmer reporting decays after novelty** — the classic agri-app death | High | Every report returns something immediately useful even when the answer is "nothing's wrong." Vaccination-due nudges and yield tracking give quiet-month value. |
| **Vets ignore the queue** if false-alarm rate is high | High | Hard guardrail at ~25% (see [01](01-problem-statement.md) §5). Triage thresholds are tuned to vet tolerance, not model F1. |
| **Data becomes a compliance ritual** — officers report what looks good | High | Farmer-side value loop is independent of officer reporting. Cross-validate reported clusters against MVU dispatch logs and lab referrals. |
| **Perceived as surveillance of farmers** (culling fear, movement restrictions) | Medium-High | Never expose individual farm identity in public/officer heatmaps below village aggregate. State this in onboarding, in plain Marathi. This is a trust make-or-break. |
| **Duplicates an incoming government feature** | Medium | Integrate, don't compete. Position as the sensing + triage layer that writes into Bharat Pashudhan. |
| **Connectivity worse than assumed** | Medium | Offline-first is architectural, not a feature. IVR fallback for the bottom tier. |
