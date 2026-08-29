/* ============================================================
   PashuSetu — seed data, imagery and copy
   Copy follows docs/09-content-guide.md
   ============================================================ */

/* ---------- Offline-safe illustration: drawn silhouettes, no emoji ----------
   Emoji render differently on every platform and read as toys in a health
   product. These are flat SVG side profiles — same everywhere, at any size. */
function beast(sky, ground, coat, kind){
  const legs = (xs, h) => xs.map(x=>`<rect x="${x}" y="52" width="6.5" height="${h}" rx="3.2"/>`).join('');
  let body = '';
  if(kind === 'goat'){
    body = `<g fill="${coat}">
      <rect x="48" y="34" width="44" height="20" rx="9"/>
      <ellipse cx="38" cy="39" rx="10" ry="7.5"/>
      ${legs([54,64,80,88], 18)}
      <path d="M92 36q8 2 5 14" stroke="${coat}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M31 33q-4-9 2-12M37 32q-2-10 4-12" stroke="${coat}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M33 45q-6 1-8 4" stroke="${coat}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  } else {
    const horn = kind === 'buffalo'
      ? `<path d="M24 31q-11-3-12-12M32 28q-3-12 6-14" stroke="${coat}" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : `<path d="M23 30q-7-2-8-8M32 27q-1-8 6-9" stroke="${coat}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
    body = `<g fill="${coat}">
      <rect x="44" y="28" width="56" height="27" rx="12"/>
      <ellipse cx="31" cy="39" rx="14" ry="10.5"/>
      <rect x="38" y="30" width="16" height="16" rx="7"/>
      ${legs([50,64,82,92], 21)}
      <path d="M100 32q10 4 6 20" stroke="${coat}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      ${horn}
      <ellipse cx="19" cy="42" rx="5.5" ry="4.5"/></g>`;
  }
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
  <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${ground}"/></linearGradient></defs>
  <rect width="120" height="90" fill="url(#s)"/>
  <ellipse cx="60" cy="74" rx="52" ry="7" fill="rgba(0,0,0,.10)"/>${body}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
}
function scene(sky, ground, shapes){
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
  <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${ground}"/></linearGradient></defs>
  <rect width="120" height="90" fill="url(#s)"/>${shapes}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
}

const IMG = {
  farmer:  'images/farmer.png',
  vet:     'images/vet.png',
  officer: 'images/officer.png',
  cow:     'images/cow_lakshmi.png',
  cow2:    'images/cow_gir.png',
  cow3:    'images/cow_lakshmi.png',
  buffalo: 'images/buffalo.png',
  calf:    'images/calf.png',
  goat:    'images/calf.png',
  /* clinical close-ups, abstracted */
  mouth:   scene('#E6D2C8','#C9A899', '<ellipse cx="60" cy="46" rx="34" ry="22" fill="#A8776A"/><ellipse cx="60" cy="46" rx="26" ry="15" fill="#8E5D52"/><circle cx="49" cy="42" r="4" fill="#F2E4DC"/><circle cx="66" cy="50" r="3.4" fill="#F2E4DC"/><circle cx="72" cy="41" r="3" fill="#F2E4DC"/>'),
  hoof:    scene('#DED5C6','#A89684', '<path d="M52 28c-5 12-6 26-3 40 1.6 6 8 6 9.6 0 3-13 2.6-28-1.6-40-1-3.4-4-3.4-5 0z" fill="#4A4038"/><path d="M66 28c-5 12-6 26-3 40 1.6 6 8 6 9.6 0 3-13 2.6-28-1.6-40-1-3.4-4-3.4-5 0z" fill="#4A4038"/>'),
  field:   scene('#C6DCEA','#D8CFAF', '<path d="M0 62q30-12 60 0t60-4v32H0z" fill="#A8B98C"/><path d="M0 74q34-8 62 2t58-6v20H0z" fill="#8CA372"/>')
};

/* ---------- Symptom pictograms ----------
   Purpose-drawn, consistent optical weight, no platform variance.
   Concrete rather than abstract: this set is read by people who may not
   read the label under it. */
function pic(inner){ return `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.1"
  stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`; }
const PIC = {
  fever:    pic('<path d="M16.5 24V10a3.5 3.5 0 0 1 7 0v14a5.5 5.5 0 1 1-7 0z"/><path d="M20 15v10" stroke-width="3.4"/><path d="M28.5 11c1.8 1.8 1.8 4.2 0 6M33 8.5c3 3 3 7 0 10"/>'),
  cough:    pic('<ellipse cx="13.5" cy="20" rx="8" ry="9.5"/><circle cx="10.8" cy="17.2" r="1.2" fill="currentColor" stroke="none"/><circle cx="10.8" cy="22.8" r="1.2" fill="currentColor" stroke="none"/><path d="M23.5 13.6 29.5 10.5M24 20h6.5M23.5 26.4 29.5 29.5"/>'),
  nasal:    pic('<ellipse cx="20" cy="16" rx="8.5" ry="9.5"/><circle cx="16.8" cy="14" r="1.3" fill="currentColor" stroke="none"/><circle cx="23.2" cy="14" r="1.3" fill="currentColor" stroke="none"/><path d="M20 25.5c-1.8 2.6-3 4.4-3 6a3 3 0 0 0 6 0c0-1.6-1.2-3.4-3-6z"/>'),
  appetite: pic('<path d="M6.5 20h21c0 6.6-4.7 11.5-10.5 11.5S6.5 26.6 6.5 20z"/><path d="M11 16.5c0-2.8 2.7-4.5 6-4.5s6 1.7 6 4.5"/><circle cx="30.5" cy="11.5" r="6"/><path d="M26.5 15.5 34.5 7.5"/>'),
  diarr:    pic('<path d="M20 6.5c-2.6 3.6-4.5 6.6-4.5 8.8a4.5 4.5 0 0 0 9 0c0-2.2-1.9-5.2-4.5-8.8z"/><path d="M12 22c-1.7 2.4-3 4.4-3 5.9a3 3 0 0 0 6 0c0-1.5-1.3-3.5-3-5.9z"/><path d="M28 22c-1.7 2.4-3 4.4-3 5.9a3 3 0 0 0 6 0c0-1.5-1.3-3.5-3-5.9z"/>'),
  breath:   pic('<path d="M20 6.5v10"/><path d="M15.5 11.5h9"/><path d="M20 16.5c-2-3-5.2-4.2-7.5-2.6-2.6 1.8-3.2 6-2.4 10.4.7 3.6 2.6 5.8 4.9 5.5 2.4-.3 4-2.6 4.6-5.8.4-2.3.4-4.9.4-7.5z"/><path d="M20 16.5c2-3 5.2-4.2 7.5-2.6 2.6 1.8 3.2 6 2.4 10.4-.7 3.6-2.6 5.8-4.9 5.5-2.4-.3-4-2.6-4.6-5.8-.4-2.3-.4-4.9-.4-7.5z"/>'),
  lame:     pic('<path d="M15 11c-2.4 5.6-3 12.4-1.4 18.6.8 3 3.8 3 4.6 0 1.6-6.2 1.2-13-1-18.6-.5-1.6-1.7-1.6-2.2 0z"/><path d="M25.5 11c-2.4 5.6-3 12.4-1.4 18.6.8 3 3.8 3 4.6 0 1.6-6.2 1.2-13-1-18.6-.5-1.6-1.7-1.6-2.2 0z"/><path d="M6 33.5c2.6 2 5.6 3 9 3"/>'),
  mouth:    pic('<path d="M6 20c0-5.2 6.2-9.5 14-9.5S34 14.8 34 20s-6.2 9.5-14 9.5S6 25.2 6 20z"/><circle cx="14.5" cy="17.5" r="1.9" fill="currentColor" stroke="none"/><circle cx="21" cy="23" r="1.9" fill="currentColor" stroke="none"/><circle cx="26" cy="16.5" r="1.7" fill="currentColor" stroke="none"/>'),
  udder:    pic('<path d="M10 14.5c0-3.6 4.5-6.5 10-6.5s10 2.9 10 6.5c0 5.6-3.2 9.6-6.3 11.5"/><path d="M10 14.5c0 5.6 3.2 9.6 6.3 11.5"/><path d="M16.3 26 15 32.5M23.7 26 25 32.5"/><path d="M5.5 13c-1 1.6-1.2 3.4-.6 5M34.5 13c1 1.6 1.2 3.4.6 5"/>'),
  milk:     pic('<path d="M12 15h13l-1.8 15.5a2 2 0 0 1-2 1.8h-5.4a2 2 0 0 1-2-1.8z"/><path d="M10.5 15h16M15 9.5h7v5.5h-7z"/><path d="M32.5 12v13M28.5 20.5l4 4.5 4-4.5"/>'),
  weak:     pic('<ellipse cx="20" cy="19.5" rx="11" ry="11"/><path d="M13.5 17.5c1.4-1.2 3.2-1.2 4.6 0M21.9 17.5c1.4-1.2 3.2-1.2 4.6 0"/><path d="M15 26c2.4-2 7.6-2 10 0"/>'),
  other:    pic('<circle cx="20" cy="20" r="12.5"/><path d="M20 13.5v13M13.5 20h13"/>')
};

/* ------------------------------------------------------------ */
const DB = {

  farmer: { name:'Arpit Kale', img:IMG.farmer, farm:'Kale Farm', village:'Wadgaon', block:'Haveli',
    district:'Pune', phone:'+91 98••• ••412', joined:'March 2026',
    weekLitres:312, litreDelta:-18 },

  vet: { name:'Dr. R. Deshmukh', img:IMG.vet, role:'Livestock Development Officer',
    posting:'Haveli block · 4 dispensaries · 11 villages', visitsToday:5 },

  officer: { name:'Dr. Anjali Kulkarni', img:IMG.officer, role:'District Animal Husbandry Officer',
    district:'Pune', blocks:14 },

  /* ---- herd: mid-season, mixed health, real vaccination gaps ---- */
  animals: [
    { id:'a1', name:'Lakshmi', tag:'274 8891 0034', species:'Cattle', breed:'HF Cross',
      sex:'Female', age:'4 yr', img:IMG.cow, status:'attention', risk:'high',
      riskLabel:'See a vet today', yield:6.2, baseline:9.1, yieldDelta:-32, vacc:78,
      note:'Off feed for two days, with discharge from her nose.', caseId:'PS-2841' },

    { id:'a2', name:'Ganga', tag:'274 8891 0035', species:'Buffalo', breed:'Murrah',
      sex:'Female', age:'6 yr', img:IMG.buffalo, status:'watch', risk:'moderate',
      riskLabel:'Keep watching', yield:7.8, baseline:8.2, yieldDelta:-5, vacc:100,
      note:'Giving about half a litre less than she usually does.', caseId:null },

    { id:'a3', name:'Radha', tag:'274 8891 0036', species:'Cattle', breed:'Gir',
      sex:'Female', age:'3 yr', img:IMG.cow2, status:'healthy', risk:'low',
      riskLabel:'Fine', yield:8.4, baseline:8.1, yieldDelta:4, vacc:100,
      note:'Steady.', caseId:null },

    { id:'a4', name:'Nandi', tag:'274 8891 0037', species:'Cattle', breed:'Deoni',
      sex:'Male', age:'5 yr', img:IMG.cow3, status:'healthy', risk:'low',
      riskLabel:'Fine', yield:0, baseline:0, yieldDelta:0, vacc:100,
      note:'Working animal. Nothing to report.', caseId:null },

    { id:'a5', name:'Tulsi', tag:'274 8891 0038', species:'Buffalo', breed:'Pandharpuri',
      sex:'Female', age:'7 yr', img:IMG.buffalo, status:'due', risk:'unknown',
      riskLabel:'Vaccine overdue', yield:5.9, baseline:6.0, yieldDelta:-2, vacc:40,
      note:'Her FMD booster was due 23 days ago.', caseId:null },

    { id:'a6', name:'Moti', tag:'274 8891 0039', species:'Cattle', breed:'HF Cross',
      sex:'Female', age:'11 mo', img:IMG.calf, status:'healthy', risk:'low',
      riskLabel:'Fine', yield:0, baseline:0, yieldDelta:0, vacc:100,
      note:'Calf. Growing well.', caseId:null }
  ],

  /* ---- symptom vocabulary: a picture first, the word second ---- */
  symptoms: [
    { id:'fever',    en:'Fever',           mr:'ताप' },
    { id:'cough',    en:'Coughing',        mr:'खोकला' },
    { id:'nasal',    en:'Runny nose',      mr:'नाकातून स्राव' },
    { id:'appetite', en:'Not eating',      mr:'खात नाही' },
    { id:'diarr',    en:'Loose motion',    mr:'हगवण' },
    { id:'breath',   en:'Hard breathing',  mr:'श्वास घेण्यास त्रास' },
    { id:'lame',     en:'Limping',         mr:'लंगडणे' },
    { id:'mouth',    en:'Sores in mouth',  mr:'तोंडात फोड' },
    { id:'udder',    en:'Swollen udder',   mr:'कासेला सूज' },
    { id:'milk',     en:'Less milk',       mr:'दूध कमी' },
    { id:'weak',     en:'Looks weak',      mr:'अशक्तपणा' },
    { id:'other',    en:'Something else',  mr:'इतर काही' }
  ],

  /* ---- the case the farmer already has open ---- */
  openCase: {
    id:'PS-2841', animal:'Lakshmi', tag:'274 8891 0034', filed:'two days ago',
    vet:'Dr. R. Deshmukh', eta:'Today, 4:00–6:00 PM',
    steps:[
      { t:'You sent this report',       s:'26 August, 7:12 AM. No signal at the time — it sent itself at 9:40.', done:true },
      { t:'Sorted as High',             s:'26 August, 9:41 AM', done:true },
      { t:'Dr. Deshmukh took the case', s:'27 August, 8:05 AM', done:true },
      { t:'He visits your farm',        s:'Today, between 4:00 and 6:00 PM', done:false, now:true },
      { t:'What he found',              s:'He will record this after the visit', done:false }
    ]
  },

  /* ---- alerts ---- */
  alerts: [
    { id:'n1', tier:'critical', unread:true, ic:'vet', tone:'critical',
      t:'Dr. Deshmukh is coming today',
      d:'Between 4 and 6 PM, for Lakshmi. Keep her separated, and have her tag number ready.',
      m:'2 hours ago', act:'Open the case', go:'f-case', group:'Today' },

    { id:'n2', tier:'important', unread:true, ic:'pin', tone:'high',
      t:'The same signs near Wadgaon',
      d:'Three farms within 4 km reported fever and a runny nose in the last 11 days. Worth watching your herd closely this week.',
      m:'5 hours ago', act:'What to watch for', sheet:'nearby', group:'Today' },

    { id:'n3', tier:'routine', unread:false, ic:'vial', tone:'accent',
      t:'Tulsi is 23 days past her booster',
      d:'A vaccination round reaches Wadgaon on 3 September. One tap puts her on the list.',
      m:'Yesterday', act:'Add her', toast:'Tulsi is on the list for 3 September.', group:'Earlier' },

    { id:'n4', tier:'ambient', unread:false, ic:'chart', tone:'brand',
      t:'Your August summary',
      d:'312 litres this week — 18 below your usual. Almost all of the gap is Lakshmi.',
      m:'2 days ago', act:null, group:'Earlier' },

    { id:'n5', tier:'routine', unread:false, ic:'rain', tone:'info',
      t:'Heavy rain this week',
      d:'Wet bedding brings foot trouble and mastitis. Three things worth checking.',
      m:'4 days ago', act:'See the list', toast:'Three things to check this week.', group:'Earlier' }
  ],

  /* ---- vet triage queue ---- */
  queue: [
    { id:'PS-2841', sev:'critical', animal:'Cattle · Female · 4 yr', owner:'A. Kale',
      village:'Wadgaon', km:6.2, age:'2 days waiting', animals:1, deaths:0, conf:82,
      img:IMG.cow, mine:true, signs:'Fever, runny nose, off feed',
      quote:'She has fever and she is not eating. There is discharge from her nose since two days.',
      ctx:'Three similar reports within 4 km in the last 11 days.',
      why:[ {t:'Fever, nasal discharge and going off feed, together', w:'Points strongly', c:'var(--risk-critical)'},
            {t:'Milk down 32% against her own average', w:'Points strongly', c:'var(--risk-critical)'},
            {t:'Vaccination schedule only 78% complete', w:'Adds to it', c:'var(--risk-high)'},
            {t:'A cluster of similar reports nearby', w:'Adds to it', c:'var(--risk-high)'} ] },

    { id:'PS-2839', sev:'critical', animal:'Buffalo · Female · 5 yr', owner:'S. Jadhav',
      village:'Village X', km:11.4, age:'6 hours waiting', animals:6, deaths:3, conf:74,
      img:IMG.buffalo, mine:true, signs:'Three sudden deaths, swelling, high fever',
      quote:'Three died since yesterday. The others have swelling under the jaw and high fever.',
      ctx:'Deaths reported. Sent to the district office automatically.',
      why:[ {t:'Three deaths in 48 hours', w:'Decisive', c:'var(--risk-critical)'},
            {t:'Fast onset across six animals', w:'Points strongly', c:'var(--risk-critical)'},
            {t:'Swelling under the jaw described', w:'Adds to it', c:'var(--risk-high)'} ] },

    { id:'PS-2836', sev:'high', animal:'Cattle · Female · 7 yr', owner:'M. Shinde',
      village:'Kondhapuri', km:8.8, age:'1 day waiting', animals:2, deaths:0, conf:69,
      img:IMG.mouth, mine:true, signs:'Sores in mouth, drooling, limping',
      quote:'She is drooling and will not chew. Two of them are limping now.',
      ctx:'Blister-type signs. FMD to be ruled out. Cover in this village is 61%.',
      why:[ {t:'Mouth lesions and lameness together', w:'Points strongly', c:'var(--risk-critical)'},
            {t:'Village FMD cover at 61%', w:'Adds to it', c:'var(--risk-high)'} ] },

    { id:'PS-2831', sev:'moderate', animal:'Goat · Male · 2 yr', owner:'P. Gaikwad',
      village:'Village Z', km:3.1, age:'2 days waiting', animals:1, deaths:0, conf:58,
      img:IMG.goat, mine:true, signs:'Loose motion, a little weak',
      quote:'Loose motion since two days. Eating less but still standing.',
      ctx:'On its own. No pattern around this village.',
      why:[ {t:'One animal, no fever reported', w:'Weak', c:'var(--risk-moderate)'},
            {t:'Nothing similar nearby', w:'Weak', c:'var(--risk-low)'} ] },

    { id:'PS-2828', sev:'low', animal:'Cattle · Female · 3 yr', owner:'R. Pawar',
      village:'Wadgaon', km:6.0, age:'3 days waiting', animals:1, deaths:0, conf:41,
      img:IMG.cow2, mine:true, signs:'Milk down slightly, nothing else',
      quote:'Half a litre less for three days. Otherwise she seems normal.',
      ctx:'Likely feed-related. Advice from here should be enough.',
      why:[ {t:'One non-specific sign', w:'Weak', c:'var(--risk-low)'} ] }
  ],

  /* ---- district clusters ---- */
  clusters: [
    { id:'c1', name:'Ahmednagar road belt', sev:'critical', villages:12, animals:38,
      deaths:3, window:'11 days', risk:91, lead:6, conf:'Medium', zoo:false,
      sus:'Looks like haemorrhagic septicaemia', x:150, y:120, r:52 },
    { id:'c2', name:'Wadgaon–Kondhapuri', sev:'high', villages:7, animals:19,
      deaths:0, window:'14 days', risk:72, lead:4, conf:'Medium', zoo:false,
      sus:'Blister-type signs. FMD to be ruled out', x:250, y:230, r:42 },
    { id:'c3', name:'Shirur east', sev:'moderate', villages:4, animals:9,
      deaths:0, window:'9 days', risk:48, lead:2, conf:'Low', zoo:false,
      sus:'Respiratory signs, nothing specific yet', x:92, y:268, r:32 },
    { id:'c4', name:'Junnar north', sev:'critical', villages:3, animals:6,
      deaths:1, window:'5 days', risk:88, lead:5, conf:'Medium', zoo:true,
      sus:'Brucellosis indicators. People are at risk here', x:296, y:96, r:34 }
  ],

  district: { active:128, coverage:87, blocks:14, trend:[42,48,45,52,61,58,67,74,71,83,88,91] },

  /* ---- offline queue: two waiting, one failed ---- */
  pending: [
    { id:'p1', t:'Report · Lakshmi',        s:'26 August, 7:12 AM',   st:'ok',   lbl:'Sent' },
    { id:'p2', t:'Photos · Lakshmi',        s:'2 photos · 1.4 MB',    st:'wait', lbl:'Waiting' },
    { id:'p3', t:'Vaccinations · 12 animals', s:'Kondhapuri round',   st:'wait', lbl:'Waiting' },
    { id:'p4', t:'Photo · hoof close-up',   s:'0.8 MB',               st:'fail', lbl:"Didn't send" }
  ],

  /* ---- Comprehensive i18n for English, Marathi & Hindi ---- */
  i18n: {
    en: {
      good: 'Good morning,',
      attn: 'Needs you today',
      clear: 'Nothing needs you today',
      clearD: 'All six are eating, and the milk is where it should be. We will tell you the moment that changes.',
      report: 'Report',
      herd: 'My animals',
      home: 'Home',
      alerts: 'Alerts',
      profile: 'You',
      farmer: 'Farmer',
      vet: 'Veterinarian',
      officer: 'District Officer',
      q1: 'What did you notice?',
      q1s: 'Pick everything that looks different. There is no wrong answer here.',
      q1more: 'More questions may follow, depending on what you pick.',
      speak: 'Say it instead',
      speakS: 'Speak in your language — we will fill this in',
      listening: 'Listening…',
      cont: 'Continue',
      vacc: 'Vaccines',
      help: 'Call a vet',
      picked: 'picked',
      pickone: 'Pick at least one, or just say it',
      whichAnimal: 'Which animal?',
      tapNoticed: 'Tap the one you noticed this in.',
      othersAffected: 'Is anything else affected?',
      othersSameSigns: 'Others with the same signs',
      deathsLast7Days: 'Deaths in the last 7 days',
      getHelpNow: 'Get help now',
      showWhatYouSee: 'Show us what you can see',
      photoSubtitle: 'A photo does more than any answer you could type. The veterinarian sees exactly what you are seeing.',
      wholeAnimal: 'The whole animal',
      closeUp: 'A close-up',
      skipPhoto: 'I cannot take a photo now',
      lastFewThings: 'Last few things',
      whenStarted: 'When did it start?',
      hadVaccines: 'Has she had her vaccines?',
      anyoneUnwell: 'Is anyone at home unwell?',
      seeWhatToDo: 'See what to do',
      whatWeThink: 'What we think',
      doThisFirst: 'Do this first',
      askForVet: 'Ask for a veterinarian',
      showFourSteps: 'Show me the four steps',
      sendRequest: 'Send the request',
      call1962: 'Call 1962 instead',
      quickActions: 'Quick actions',
      nearYou: 'Near you',
      thisWeek: 'This week',
      milkCollected: 'Milk collected',
      litres: 'litres',
      searchPlaceholder: 'Search by name or tag number',
      all: 'All',
      needsYou: 'Needs you',
      vaccinesDue: 'Vaccines due',
      fine: 'Fine',
      addAnimal: 'Add an Animal',
      registerAnimal: 'Register a new animal',
      animalName: 'Animal name',
      earTag: '12-digit Ear Tag Number',
      species: 'Species',
      cattle: 'Cattle',
      buffalo: 'Buffalo',
      goat: 'Goat',
      breed: 'Breed',
      sexAge: 'Sex & Age',
      saveToHerd: 'Save to Herd',
      scanEarTag: 'Scan an ear tag',
      typeTagNumber: 'Type the number instead',
      history: 'History',
      records: 'Records',
      milkStr: 'Milk',
      controls: 'Controls',
      language: 'Language',
      offlineMode: 'Offline mode',
      reducedMotion: 'Reduced motion',
      statesEdgeCases: 'States & edge cases',
      departmentNote: 'Department of Animal Husbandry · Government of Maharashtra'
    },
    mr: {
      good: 'सुप्रभात,',
      attn: 'आज लक्ष द्या',
      clear: 'आज काळजीचे काही नाही',
      clearD: 'सहाही जनावरे खात आहेत आणि दूधही नेहमीसारखे आहे. काही बदलले तर आम्ही लगेच सांगू.',
      report: 'तक्रार',
      herd: 'माझी जनावरे',
      home: 'मुख्य',
      alerts: 'सूचना',
      profile: 'आपले प्रोफाइल',
      farmer: 'शेतकरी',
      vet: 'पशू वैद्यक',
      officer: 'जिल्हा अधिकारी',
      q1: 'तुम्हाला काय दिसले?',
      q1s: 'जे वेगळे वाटते ते सर्व निवडा. इथे चूक असे काही नाही.',
      q1more: 'तुमच्या निवडीनुसार आणखी प्रश्न येऊ शकतात.',
      speak: 'बोलून सांगा',
      speakS: 'मराठीत बोला — आम्ही भरून घेऊ',
      listening: 'ऐकत आहोत…',
      cont: 'पुढे',
      vacc: 'लसीकरण',
      help: 'डॉक्टर',
      picked: 'निवडले',
      pickone: 'किमान एक निवडा, किंवा बोलून सांगा',
      whichAnimal: 'कोणते जनावर?',
      tapNoticed: 'ज्यात हे दिसले त्या जनावरावर टॅप करा.',
      othersAffected: 'इतर जनावरांना त्रास आहे का?',
      othersSameSigns: 'तशीच लक्षणे असलेली इतर जनावरे',
      deathsLast7Days: 'गेल्या ७ दिवसांतील मृत्यू',
      getHelpNow: 'तात्काळ मदत मिळवा',
      showWhatYouSee: 'फोटो काढून दाखवा',
      photoSubtitle: 'फोटोमुळे डॉक्टरांना स्पष्ट परिस्थिती दिसते आणि त्वरित सल्ला मिळतो.',
      wholeAnimal: 'संपूर्ण जनावर',
      closeUp: 'जवळून फोटो (क्लोज-अप)',
      skipPhoto: 'मी आता फोटो काढू शकत नाही',
      lastFewThings: 'शेवटच्या काही गोष्टी',
      whenStarted: 'हे कधी सुरू झाले?',
      hadVaccines: 'लसीकरण झाले आहे का?',
      anyoneUnwell: 'घरातील कोणी आजारी आहे का?',
      seeWhatToDo: 'काय करावे ते पहा',
      whatWeThink: 'आमचे मूल्यांकन',
      doThisFirst: 'प्रथम हे करा',
      askForVet: 'डॉक्टरांची मदत मागा',
      showFourSteps: '४ टप्पे दाखवा',
      sendRequest: 'विनंती पाठवा',
      call1962: '१९६२ वर कॉल करा',
      quickActions: 'जलद कृती',
      nearYou: 'तुमच्या परिसरात',
      thisWeek: 'या आठवड्यात',
      milkCollected: 'संकलित दूध',
      litres: 'लीटर',
      searchPlaceholder: 'नाव किंवा टॅग क्रमांकाने शोधा',
      all: 'सर्व',
      needsYou: 'लक्ष द्या',
      vaccinesDue: 'लस बाकी',
      fine: 'ठीक आहे',
      addAnimal: 'जनावर जोडा',
      registerAnimal: 'नवीन जनावराची नोंदणी करा',
      animalName: 'जनावराचे नाव',
      earTag: '१२-अंकी कान टॅग क्रमांक',
      species: 'प्रजाती',
      cattle: 'गाय/बैल',
      buffalo: 'म्हस',
      goat: 'शेळी',
      breed: 'जात (नसल)',
      sexAge: 'लिंग आणि वय',
      saveToHerd: 'गोठ्यात जतन करा',
      scanEarTag: 'टॅग स्कॅन करा',
      typeTagNumber: 'क्रमांक हाताने टाका',
      history: 'इतिहास',
      records: 'नोंदी',
      milkStr: 'दूध',
      controls: 'नियंत्रणे',
      language: 'भाषा',
      offlineMode: 'ऑफलाईन मोड',
      reducedMotion: 'कमी ॲनिमेशन',
      statesEdgeCases: 'स्थिती व विशेष केसेस',
      departmentNote: 'पशूसंवर्धन विभाग · महाराष्ट्र शासन'
    },
    hi: {
      good: 'शुभ प्रभात,',
      attn: 'आज ध्यान देने योग्य',
      clear: 'आज सब ठीक है',
      clearD: 'सभी छह मवेशी सही खा रहे हैं और दूध सामान्य है। कुछ बदलाव होते ही हम आपको सूचित करेंगे।',
      report: 'रिपोर्ट',
      herd: 'मेरे मवेशी',
      home: 'होम',
      alerts: 'अलर्ट',
      profile: 'प्रोफाइल',
      farmer: 'किसान',
      vet: 'पशुचिकित्सक',
      officer: 'जिला अधिकारी',
      q1: 'आपने क्या देखा?',
      q1s: 'जो भी अलग लगे उसे चुनें। यहाँ कोई गलत जवाब नहीं है।',
      q1more: 'आपके चुनाव के अनुसार आगे प्रश्न पूछे जाएंगे।',
      speak: 'बोलकर बताएं',
      speakS: 'हिंदी में बोलें — हम इसे दर्ज कर लेंगे',
      listening: 'सुन रहे हैं…',
      cont: 'आगे बढ़ें',
      vacc: 'टीकाकरण',
      help: 'डॉक्टर बुलाएं',
      picked: 'चुने गए',
      pickone: 'कम से कम एक चुनें या बोलकर बताएं',
      whichAnimal: 'कौन सा पशु?',
      tapNoticed: 'जिस पशु में लक्षण दिखे उस पर टैप करें।',
      othersAffected: 'क्या किसी अन्य पशु को भी समस्या है?',
      othersSameSigns: 'समान लक्षणों वाले अन्य पशु',
      deathsLast7Days: 'पिछले 7 दिनों में मृत्यु',
      getHelpNow: 'तुरंत मदद पाएं',
      showWhatYouSee: 'फोटो खींचकर दिखाएं',
      photoSubtitle: 'फोटो से डॉक्टर को सटीक जानकारी मिलती है और सही इलाज में मदद मिलती है।',
      wholeAnimal: 'पूरा पशु',
      closeUp: 'नज़दीकी फोटो (क्लोज-अप)',
      skipPhoto: 'मैं अभी फोटो नहीं ले सकता',
      lastFewThings: 'अंतिम कुछ जानकारी',
      whenStarted: 'यह कब शुरू हुआ?',
      hadVaccines: 'क्या टीका लगा है?',
      anyoneUnwell: 'क्या घर में कोई अस्वस्थ है?',
      seeWhatToDo: 'आगे क्या करें देखें',
      whatWeThink: 'हमारा मूल्यांकन',
      doThisFirst: 'सबसे पहले यह करें',
      askForVet: 'डॉक्टर से संपर्क करें',
      showFourSteps: '4 कदम दिखाएं',
      sendRequest: 'अनुरोध भेजें',
      call1962: '1962 पर कॉल करें',
      quickActions: 'त्वरित कार्य',
      nearYou: 'आपके आसपास',
      thisWeek: 'इस सप्ताह',
      milkCollected: 'एकत्रित दूध',
      litres: 'लीटर',
      searchPlaceholder: 'नाम या टैग नंबर से खोजें',
      all: 'सभी',
      needsYou: 'ध्यान दें',
      vaccinesDue: 'टीकाकरण बाकी',
      fine: 'ठीक है',
      addAnimal: 'पशु जोड़ें',
      registerAnimal: 'नए पशु का पंजीकरण करें',
      animalName: 'पशु का नाम',
      earTag: '12-अंकों का कान टैग नंबर',
      species: 'प्रजाति',
      cattle: 'गाय/बैल',
      buffalo: 'भैंस',
      goat: 'बकरी',
      breed: 'नस्ल',
      sexAge: 'लिंग और आयु',
      saveToHerd: 'झुंड में सहेजें',
      scanEarTag: 'टैग स्कैन करें',
      typeTagNumber: 'नंबर खुद दर्ज करें',
      history: 'इतिहास',
      records: 'रिकॉर्ड',
      milkStr: 'दूध',
      controls: 'नियंत्रण',
      language: 'भाषा',
      offlineMode: 'ऑफ़लाइन मोड',
      reducedMotion: 'कम मोशन',
      statesEdgeCases: 'विशेष स्थितियां',
      departmentNote: 'पशुपालन विभाग · महाराष्ट्र सरकार'
    }
  }
};
