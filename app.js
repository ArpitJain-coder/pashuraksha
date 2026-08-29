/* ============================================================
   PashuSetu — prototype interaction layer
   Copy: docs/09-content-guide.md · Visual system: docs/07-design-system.md
   ============================================================ */

const S = {
  role:'farmer', screen:'f-splash', lang:'en', offline:false, reduced:false,
  hist:[],                       // real back stack — see back()
  sel:{ symptoms:[], animal:'a1', others:0, deaths:0, since:'2–3 days',
        photos:[], vacc:null, human:null, voice:false },
  plan:[false,false,false,false], herdFilter:'All', herdQ:'', alertFilter:'All',
  qFilter:'All', animalTab:'history', animalId:'a1', caseId:'PS-2841', clusterId:'c1',
  loginErr:false, loginBusy:false, forceEmptyHerd:false, allClear:false,
  pending: JSON.parse(JSON.stringify(DB.pending)), onboardIdx:0
};
const t  = k => (DB.i18n[S.lang][k] || DB.i18n.en[k] || k);
const $  = s => document.querySelector(s);
const vp = () => $('#vp');
const animal = id => DB.animals.find(a => a.id === id);

/* ============================================================
   ICONS — one set, 24px grid, 1.8 stroke, round joins.
   Drawn rather than borrowed so optical weight stays even.
   ============================================================ */
const svg = (d, w) => `<svg width="${w||23}" height="${w||23}" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

const ICO = {
  home:  svg('<path d="M3.2 10.4 12 3.4l8.8 7v9.1a1 1 0 0 1-1 1h-4.6v-6H8.8v6H4.2a1 1 0 0 1-1-1z"/>'),
  /* a cow head — ears, horns, muzzle. Reads at 23px, unlike a generic paw. */
  /* Horns plus ears is clutter at 23px. Ears, eyes and a muzzle carry it. */
  herd:  svg('<path d="M6.8 10.4C6.8 7.6 9.1 5.8 12 5.8s5.2 1.8 5.2 4.6v1.9c0 3.3-2.3 5.9-5.2 5.9s-5.2-2.6-5.2-5.9z"/>'
           + '<path d="M6.9 9.6C5.4 8.3 3.4 8.2 2.6 9.5c.5 1.7 2.5 2.6 4.2 2.2"/>'
           + '<path d="M17.1 9.6c1.5-1.3 3.5-1.4 4.3-.1-.5 1.7-2.5 2.6-4.2 2.2"/>'
           + '<path d="M10.1 10.8h.01M13.9 10.8h.01"/>'
           + '<ellipse cx="12" cy="14.6" rx="2.9" ry="2.1"/>'),
  bell:  svg('<path d="M18.2 8.4a6.2 6.2 0 0 0-12.4 0c0 5.8-2 7.1-2 7.1h16.4s-2-1.3-2-7.1"/><path d="M10.2 19.4a2.1 2.1 0 0 0 3.6 0"/>'),
  user:  svg('<circle cx="12" cy="8.2" r="3.7"/><path d="M4.6 20.4a7.6 7.6 0 0 1 14.8 0"/>'),
  plus:  svg('<path d="M12 5.2v13.6M5.2 12h13.6"/>', 26),
  back:  svg('<path d="M14.6 5.4 8 12l6.6 6.6"/>', 22),
  close: svg('<path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8"/>', 21),
  chevR: svg('<path d="M9.4 5.4 16 12l-6.6 6.6"/>', 18),
  chevD: svg('<path d="M5.4 9.4 12 16l6.6-6.6"/>', 18),
  list:  svg('<path d="M8.4 6.2h12.4M8.4 12h12.4M8.4 17.8h12.4"/><path d="M3.8 6.2h.01M3.8 12h.01M3.8 17.8h.01"/>'),
  map:   svg('<path d="M9 3.4 3.4 6v14.6L9 18l6 2.6 5.6-2.6V3.4L15 6z"/><path d="M9 3.4V18M15 6v14.6"/>'),
  chart: svg('<path d="M3.2 20.6h17.6"/><path d="M6.6 17.2v-5.4M11.4 17.2V5.8M16.2 17.2v-8"/>'),
  vial:  svg('<path d="M9.4 3h5.2M10.6 3v4.7l-3.3 7.5A3.4 3.4 0 0 0 10.4 20h3.2a3.4 3.4 0 0 0 3.1-4.8l-3.3-7.5V3"/><path d="M8.2 13.3h7.6"/>'),
  vet:   svg('<path d="M5.6 3v5.4a4.4 4.4 0 0 0 8.8 0V3"/><path d="M3.9 3h3.4M12.7 3h3.4"/><path d="M10 12.9v2.3a5.1 5.1 0 0 0 10.2 0v-1.1"/><circle cx="20.2" cy="11.6" r="2.2"/>'),
  mic:   svg('<rect x="9.2" y="2.6" width="5.6" height="10.6" rx="2.8"/><path d="M5.8 11.2a6.2 6.2 0 0 0 12.4 0M12 17.4V21"/>', 19),
  cam:   svg('<path d="M3.2 8.8a2 2 0 0 1 2-2h2l1.4-2h6.8l1.4 2h2a2 2 0 0 1 2 2v8.6a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>', 26),
  wifi:  svg('<path d="M2.2 8.6a15 15 0 0 1 6-3.5M12.8 5.2a15 15 0 0 1 9 3.4M5.7 12.6a10 10 0 0 1 3.1-1.8M15.4 11a10 10 0 0 1 2.9 1.6M9.2 16.6a5 5 0 0 1 5.6 0"/><path d="M3 3l18 18"/>', 15),
  check: svg('<path d="M4.4 12.4 9.6 17.6 19.6 6.8"/>', 13),
  alert: svg('<path d="M12 3.8 21.6 20H2.4z"/><path d="M12 10v4.6M12 17.6h.01"/>', 19),
  pin:   svg('<path d="M12 20.8s6.6-6 6.6-10.6a6.6 6.6 0 1 0-13.2 0C5.4 14.8 12 20.8 12 20.8z"/><circle cx="12" cy="10" r="2.3"/>', 13),
  phone: svg('<path d="M5.2 3.4h3l1.6 4-2 1.4a12 12 0 0 0 5.6 5.6l1.4-2 4 1.6v3a2.4 2.4 0 0 1-2.6 2.4C9.6 19.8 4.2 14.4 3.7 6a2.4 2.4 0 0 1 1.5-2.6z"/>', 18),
  share: svg('<path d="M12 15.4V3.8M8.2 7.6 12 3.8l3.8 3.8"/><path d="M5.2 12.8v6a1.6 1.6 0 0 0 1.6 1.6h10.4a1.6 1.6 0 0 0 1.6-1.6v-6"/>', 21),
  search:svg('<circle cx="10.8" cy="10.8" r="6.6"/><path d="M15.6 15.6 20.4 20.4"/>', 19),
  lock:  svg('<rect x="4.6" y="10.2" width="14.8" height="10.2" rx="2.4"/><path d="M8.2 10.2V7.4a3.8 3.8 0 0 1 7.6 0v2.8"/>', 17),
  rain:  svg('<path d="M7 14.6a4.4 4.4 0 0 1 .5-8.8 5.9 5.9 0 0 1 11 1.6 3.8 3.8 0 0 1-.8 7.2z"/><path d="M8.4 18.2l-.9 2.4M12.4 18.2l-.9 2.4M16.4 18.2l-.9 2.4"/>', 19),
  clock: svg('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 2"/>', 13),
  truck: svg('<path d="M2.6 6.6h10.2v10H2.6z"/><path d="M12.8 10h3.6l3 3v3.6h-6.6z"/><circle cx="6.6" cy="18.4" r="1.9"/><circle cx="16.4" cy="18.4" r="1.9"/>', 19),
  flask: svg('<path d="M9.6 3v6.2L5.4 18a2.6 2.6 0 0 0 2.3 3.8h8.6a2.6 2.6 0 0 0 2.3-3.8l-4.2-8.8V3"/><path d="M8.4 3h7.2"/>', 19),
  mega:  svg('<path d="M4 9.6v4.8a1.6 1.6 0 0 0 1.6 1.6h2.2l7.8 4.4V3.6L7.8 8H5.6A1.6 1.6 0 0 0 4 9.6z"/><path d="M19 8.6a5 5 0 0 1 0 6.8"/>', 19)
};

/* Severity marks — drawn, so they are identical on every device */
const MARK = {
  critical:'<svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 .8 9.6 9H.4z" fill="currentColor"/></svg>',
  high:    '<svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 1.4 9 8.6H1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  moderate:'<svg width="9" height="9" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.4" fill="currentColor"/></svg>',
  low:     '<svg width="9" height="9" viewBox="0 0 10 10"><path d="M1.6 5.4 4 7.8 8.4 2.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  unknown: '<svg width="9" height="9" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="1.6 1.5"/></svg>'
};

const RISK = {
  critical:{ c:'var(--risk-critical)', lb:'Serious',  mr:'गंभीर' },
  high:    { c:'var(--risk-high)',     lb:'High',     mr:'जास्त' },
  moderate:{ c:'var(--risk-moderate)', lb:'Watch',    mr:'लक्ष ठेवा' },
  low:     { c:'var(--risk-low)',      lb:'Fine',     mr:'ठीक' },
  unknown: { c:'var(--risk-unknown)',  lb:'Not sure', mr:'माहीत नाही' }
};
const badge = (r, txt) =>
  `<span class="badge b-${r}"><span class="gl">${MARK[r]}</span>${txt || (S.lang==='mr'?RISK[r].mr:RISK[r].lb)}</span>`;
const TONE = { critical:'var(--risk-critical-bg)', high:'var(--risk-high-bg)',
  accent:'var(--accent-100)', brand:'var(--brand-100)', info:'#E9EFF9' };
const ALERT_ICON = { vet:ICO.vet, pin:ICO.pin, vial:ICO.vial, chart:ICO.chart, rain:ICO.rain };

/* ============================================================
   CHROME — one top bar, one nav, no per-screen padding hacks
   ============================================================ */
function offbar(){
  if(!S.offline) return '';
  const n = S.pending.filter(p => p.st !== 'ok').length;
  return `<div class="offbar">${ICO.wifi}<span>No signal — everything still works</span>
    <span class="cnt">${n} to send</span></div>`;
}
/* back / close are ALWAYS history-driven. No screen hardcodes its parent,
   so arriving at the same screen from two places goes back to the right one. */
function topbar(o){
  o = o || {};
  const left = o.close ? `<button class="iconbtn" data-act="close" aria-label="Close">${ICO.close}</button>`
             : o.back  ? `<button class="iconbtn" data-act="back" aria-label="Back">${ICO.back}</button>`
             : '';
  const right = o.right || ((left || o.center) ? '<span class="barpad"></span>' : '');
  const mid = o.center ? `<span class="stepn grow" style="text-align:center">${o.center}</span>`
                       : `<h2>${o.title || ''}</h2>`;
  return `<div class="appbar${o.solid ? ' solid' : ''}">${left}${mid}${right}</div>`;
}
function nav(active){
  const items = [['f-home','home',t('home')],['f-herd','herd',t('herd')],['FAB','',''],
                 ['f-alerts','bell',t('alerts')],['f-profile','user',t('profile')]];
  return `<div class="nav">${items.map(([id,ic,lb])=>{
    if(id==='FAB') return `<div class="fab"><button class="fabbtn" data-act="startreport"
      aria-label="${t('report')}">${ICO.plus}</button></div>`;
    const dot = id==='f-alerts' && DB.alerts.some(a=>a.unread) ? '<span class="navdot"></span>' : '';
    return `<button class="${active===id?'on':''}" data-act="root" data-v="${id}"
      style="position:relative">${dot}${ICO[ic]}<span class="lbl">${lb}</span></button>`;
  }).join('')}</div>`;
}
function vnav(active){
  const items = [['v-queue','list','Queue'],['v-route','map','Route'],
                 ['v-drives','vial','Rounds'],['v-me','user','You']];
  return `<div class="nav">${items.map(([id,ic,lb])=>
    `<button class="${active===id?'on':''}" data-act="root" data-v="${id}">${ICO[ic]}<span class="lbl">${lb}</span></button>`).join('')}</div>`;
}
function onav(active){
  const items = [['o-overview','chart','Overview'],['o-map','map','Map'],
                 ['o-res','truck','Resources'],['o-me','user','You']];
  return `<div class="nav">${items.map(([id,ic,lb])=>
    `<button class="${active===id?'on':''}" data-act="root" data-v="${id}">${ICO[ic]}<span class="lbl">${lb}</span></button>`).join('')}</div>`;
}

const SC = {};

/* ============================================================
   FARMER — entry
   ============================================================ */
SC['f-splash'] = () => ({ light:true, chrome:false, html:`
  <div style="flex:1;background:linear-gradient(180deg,#0A1F15 0%,#12452E 50%,#1B7A4E 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:space-between;color:#fff;
    padding:60px 24px 44px;text-align:center;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;opacity:.25;mix-blend-mode:overlay">
      <img src="/images/onboard_3.png" style="width:100%;height:100%;object-fit:cover" alt="">
    </div>
    <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;margin-top:24px">
      <div style="width:100px;height:100px;border-radius:28px;background:rgba(255,255,255,.14);
        backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.25);
        display:grid;place-items:center;box-shadow:0 12px 32px rgba(0,0,0,.3);
        animation:pop 700ms var(--ease-flow)">
        <img src="/images/cow_lakshmi.png" style="width:84px;height:84px;border-radius:22px;object-fit:cover" alt="PashuSetu">
      </div>
      <div style="font-size:38px;font-weight:700;letter-spacing:-.035em;margin-top:20px;text-shadow:0 2px 8px rgba(0,0,0,.3)">PashuSetu</div>
      <div style="font-size:15px;color:rgba(255,255,255,.88);margin-top:8px;line-height:1.55;max-width:280px;font-weight:500">
        You notice it first. This gets you real help the same day.</div>
    </div>
    <div style="position:relative;z-index:2;width:100%">
      <button class="btn" style="background:#fff;color:var(--brand-900);font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.2)" data-go="f-lang">Get started</button>
      <div style="font-size:11.5px;color:rgba(255,255,255,.65);margin-top:14px;line-height:1.4">
        Department of Animal Husbandry<br>Government of Maharashtra</div>
    </div>
  </div>`});

SC['f-lang'] = () => ({ chrome:false, html:`
  <div class="body">
    ${topbar({ back:true })}
    <div class="pad">
      <div style="width:100%;height:140px;border-radius:var(--r-md);overflow:hidden;margin-bottom:18px;position:relative;box-shadow:var(--e1)">
        <img src="/images/onboard_1.png" style="width:100%;height:100%;object-fit:cover" alt="">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 20%,rgba(0,0,0,.65) 100%)"></div>
        <div style="position:absolute;bottom:12px;left:14px;right:14px;color:#fff;font-weight:700;font-size:16px;letter-spacing:-.01em">
          आपली भाषा निवडा · Language
        </div>
      </div>
      <div class="t-h1">भाषा निवडा<br><span style="color:var(--ink-400)">Choose your language</span></div>
      <div style="margin-top:18px;display:flex;flex-direction:column;gap:10px">
        ${[['mr','मराठी','Marathi'],['hi','हिंदी','Hindi'],['en','English','English']].map(([c,n,s])=>`
          <button class="pk ${S.lang===c?'on':''}" data-act="setlang" data-v="${c}" style="padding:16px">
            <span class="box">${ICO.check}</span>
            <span class="grow"><span style="font-size:19px;font-weight:650;display:block">${n}</span>
            <span class="tiny">${s}</span></span></button>`).join('')}
      </div>
      <div class="guide" style="margin-top:16px">Screens, alerts and phone calls will all use this language. You can change it whenever you like.</div>
    </div>
  </div>
  <div class="footer"><button class="btn btn-p" data-go="f-onboard">${t('cont')}</button></div>`});

const ONB = [
  { img:'/images/onboard_1.png', t:'You notice it first',
    d:'You look at your animals several times a day. Nobody sees a change sooner than you do. This turns what you noticed into help, in about a minute.' },
  { img:'/images/onboard_2.png', t:'Know whether it can wait',
    d:'Tell us what you saw. We tell you what to do in the next two hours, and whether this needs a veterinarian today or can wait.' },
  { img:'/images/onboard_3.png', t:'One report protects the village',
    d:'Reports from nearby farms are counted together, never by name. That is how an illness gets caught while it is still in three sheds instead of thirty.' }
];
SC['f-onboard'] = () => { const o = ONB[S.onboardIdx]; return { chrome:false, html:`
  <div class="body">
    <div style="display:flex;justify-content:flex-end;padding:6px 14px">
      <button class="btn-sm" style="color:var(--ink-600);font-weight:600" data-go="f-login">Skip</button></div>
    <div class="pad" style="text-align:center;padding-top:8px">
      <div style="width:100%;height:210px;border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--e2);position:relative">
        <img src="${o.img}" style="width:100%;height:100%;object-fit:cover" alt="${o.t}">
      </div>
      <div class="t-h1" style="margin-top:22px">${o.t}</div>
      <div style="font-size:15px;color:var(--ink-600);margin-top:10px;line-height:1.55">${o.d}</div>
    </div>
  </div>
  <div class="footer">
    <div style="display:flex;justify-content:center;gap:6px;margin-bottom:16px">
      ${ONB.map((_,i)=>`<span style="width:${i===S.onboardIdx?20:7}px;height:7px;border-radius:99px;
        background:${i===S.onboardIdx?'var(--brand-700)':'var(--line)'};
        transition:all var(--m-quick) var(--ease-flow)"></span>`).join('')}
    </div>
    <button class="btn btn-p" data-act="onbnext">${S.onboardIdx===2?'Set up my farm':t('cont')}</button>
  </div>`};};

SC['f-login'] = () => ({ chrome:false, html:`
  <div class="body">
    ${topbar({ back:true })}
    <div class="pad">
      <div class="t-h1">Welcome back</div>
      <div class="muted" style="margin-top:7px">Sign in with the number registered to your farm.</div>
      ${S.loginErr?`<div class="errbox" style="margin-top:18px">${ICO.alert}<span class="tx">
        <b>Mobile number required.</b> Please enter a valid 10-digit registered number.</span></div>`:''}
      <div class="field"><label>Mobile number</label>
        <input class="inp ${S.loginErr?'bad':''}" id="login-phone" inputmode="numeric" value="${S.loginPhone !== undefined ? S.loginPhone : '98765 43210'}">
        ${S.loginErr?`<div class="inperr">${ICO.alert} Enter your registered mobile number</div>`:''}</div>
      <div class="field"><label>PIN</label>
        <input class="inp" id="login-pin" type="password" value="1234"></div>
      <div style="text-align:right;margin-top:12px">
        <button class="btn-sm" style="color:var(--brand-700);font-weight:650" data-act="toast" data-v="OTP sent to your registered phone number.">Forgotten your PIN?</button></div>
    </div>
  </div>
  <div class="footer">
    <button class="btn btn-p" data-act="login" ${S.loginBusy?'disabled':''}>
      ${S.loginBusy?'<span class="spin"></span> Checking…':'Sign in'}</button>
    <button class="btn btn-s" style="margin-top:9px" data-act="root" data-v="f-home">Look around as a demo user</button>
    <div class="tiny" style="text-align:center;margin-top:16px;line-height:1.55">
      No smartphone at home? Call <b>1962</b> and report by voice. It reaches the same veterinarian.</div>
  </div>`});

/* ============================================================
   FARMER — home
   ============================================================ */
SC['f-home'] = () => {
  const attn = DB.animals.filter(a => a.status !== 'healthy');
  const f = DB.farmer;
  const cards = S.allClear ? `
    <div class="allclear">
      <div class="ic">${ICO.check}</div>
      <div class="t">${t('clear')}</div>
      <div class="d">${t('clearD')}</div>
      <button class="btn btn-s btn-sm" style="margin:16px auto 0;width:auto" data-act="startreport">
        Report something anyway</button>
    </div>` : attn.map((a,i)=>{
    const cls  = a.status==='attention' ? '' : a.status==='watch' ? 'moderate' : 'due';
    const lead = i===0 ? 'btn-p' : 'btn-s';   // one filled primary per ranked view
    return `<div class="attn ${cls}">
      <div class="attn-in">
        <img class="avatar" src="${a.img}" alt="">
        <div class="grow">
          <div class="row" style="gap:7px"><span class="attn-t">${a.name}</span>${badge(a.risk,a.riskLabel)}</div>
          <div class="attn-d">${a.note}</div>
          ${a.caseId?`<div class="tiny" style="margin-top:7px">Case ${a.caseId} · Dr. Deshmukh arrives 4–6 PM</div>`:''}
        </div></div>
      <div class="attn-a">
        ${a.caseId
          ? `<button class="btn ${lead} btn-sm grow" data-go="f-case">Open the case</button>
             <button class="btn btn-s btn-sm" data-act="viewanimal" data-v="${a.id}">Details</button>`
          : a.status==='due'
            ? `<button class="btn ${lead} btn-sm grow" data-act="toast" data-v="Tulsi is on the list for 3 September.">Put her on the list</button>
               <button class="btn btn-s btn-sm" data-act="viewanimal" data-v="${a.id}">Details</button>`
            : `<button class="btn ${lead} btn-sm grow" data-act="viewanimal" data-v="${a.id}">Look at ${a.name}</button>`}
      </div></div>`;
  }).join('');

  return { nav:'f-home', html:`
  <div class="body hasnav">
    ${offbar()}
    <div class="greet" style="display:flex;align-items:center;justify-content:space-between">
      <div>
        <div class="hi">${t('good')}</div>
        <div class="nm">${f.farm}</div>
        <div class="loc">${ICO.pin} ${f.village}, ${f.block} · ${f.district}</div>
      </div>
      <img class="avatar" src="${f.img}" alt="${f.name}" style="width:48px;height:48px;border-radius:14px;object-fit:cover;box-shadow:var(--e1)">
    </div>
    <div class="pad">
      <div class="sec-t" style="margin-top:20px">${t('attn')}
        <span class="tiny">${S.allClear?'':attn.length+' of 6'}</span></div>
      ${cards}

      <div class="sec-t">${t('quickActions')}</div>
      <div class="qa">
        <button data-act="startreport"><span class="ic">${ICO.plus}</span><span class="lb">${t('report')}</span></button>
        <button data-act="root" data-v="f-herd"><span class="ic">${ICO.herd}</span><span class="lb">${t('herd')}</span></button>
        <button data-act="toast" data-v="The next round reaches Wadgaon on 3 September."><span class="ic">${ICO.vial}</span><span class="lb">${t('vacc')}</span></button>
        <button data-act="callvet"><span class="ic">${ICO.vet}</span><span class="lb">${t('help')}</span></button>
      </div>

      <div class="sec-t">${t('nearYou')} <span class="tiny">village level only</span></div>
      <div class="nearby">
        <div class="row" style="align-items:flex-start">
          <span style="color:var(--accent-600);margin-top:1px">${ICO.pin}</span>
          <div class="grow">
            <div style="font-size:15px;font-weight:660;line-height:1.35;letter-spacing:-.014em">
              Three farms near Wadgaon reported the same signs</div>
            <div class="muted" style="margin-top:6px;line-height:1.55">
              Fever and a runny nose, within about 4 km, over the last 11 days. Farm names are never shown — not to you, not to anyone.</div>
            <button class="btn-sm" style="color:var(--brand-700);font-weight:700;padding:9px 0 0"
              data-act="sheet" data-v="nearby">What should I watch for? →</button>
          </div></div>
      </div>

      <div class="sec-t">${t('thisWeek')}</div>
      <div class="card">
        <div class="trend">
          <div class="grow">
            <div class="over">${t('milkCollected')}</div>
            <div class="row" style="gap:9px;margin-top:7px">
              <span class="big tabnum">${f.weekLitres}</span>
              <span class="muted" style="margin-bottom:4px">${t('litres')}</span>
              <span class="delta down">▼ ${Math.abs(f.litreDelta)} L</span></div>
            <div class="tiny" style="margin-top:8px;line-height:1.5">
              Below your usual week. Almost all of the gap is Lakshmi — she is 32% under her own average.</div>
          </div>
          <svg width="72" height="46" viewBox="0 0 72 46">
            <polyline points="0,14 12,11 24,16 36,13 48,20 60,30 72,36" fill="none"
              stroke="var(--risk-high)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="72" cy="36" r="3.5" fill="var(--risk-high)"/></svg>
        </div>
      </div>
      <div style="height:20px"></div>
    </div>
  </div>`};
};

/* ============================================================
   FARMER — herd & animal
   ============================================================ */
SC['f-herd'] = () => {
  let list = DB.animals;
  if(S.herdFilter!=='All') list = list.filter(a=>
    S.herdFilter==='Needs you'   ? (a.status==='attention'||a.status==='watch') :
    S.herdFilter==='Vaccines due'? a.status==='due' : a.status==='healthy');
  if(S.herdQ) list = list.filter(a=>(a.name+a.breed+a.tag).toLowerCase().includes(S.herdQ.toLowerCase()));
  if(S.forceEmptyHerd) list = [];

  const empty = S.forceEmptyHerd ? `
    <div class="empty">
      <div class="ic">${ICO.herd}</div>
      <div class="t">Add your first animal</div>
      <div class="d">Scan her ear tag once. After that her vaccination card, her milk record and everything a veterinarian has ever noted live here — so you never go hunting for paper again.</div>
      <button class="btn btn-p" data-act="openaddanimal">Scan an ear tag</button>
      <button class="btn btn-s" style="margin-top:9px" data-act="openaddanimal">Type the number instead</button>
    </div>` : `
    <div class="empty">
      <div class="ic">${ICO.search}</div>
      <div class="t">Nothing here</div>
      <div class="d">No animal matches “${S.herdQ || S.herdFilter}”.</div>
      <button class="btn btn-s" style="width:auto;margin:22px auto 0;padding:0 22px" data-act="clearherd">Clear the filter</button>
    </div>`;

  return { nav:'f-herd', html:`
  <div class="body hasnav">
    ${offbar()}
    ${topbar({ title:t('herd'), right:`<button class="iconbtn" data-act="openaddanimal" aria-label="Add">${ICO.plus}</button>` })}
    <div class="pad">
      <div class="search">${ICO.search}<input id="hq" placeholder="${t('searchPlaceholder')}" value="${S.herdQ}"></div>
    </div>
    <div style="margin-top:12px"><div class="chips">
      ${[
        ['All', t('all')],
        ['Needs you', t('needsYou')],
        ['Vaccines due', t('vaccinesDue')],
        ['Fine', t('fine')]
      ].map(([c, label])=>
        `<button class="chip ${S.herdFilter===c?'on':''}" data-act="herdfilter" data-v="${c}">${label}${c==='All'?' · '+DB.animals.length:''}</button>`).join('')}
    </div></div>
    <div class="pad" style="margin-top:14px">
      ${list.length ? `<div class="alist">${list.map(a=>`
        <button class="aitem" data-act="viewanimal" data-v="${a.id}"
          ${a.risk!=='low'?`style="border-left:3px solid ${a.status==='due'?'var(--accent-600)':RISK[a.risk].c}"`:''}>
          <img class="avatar" src="${a.img}" alt="">
          <div class="grow">
            <div class="row" style="gap:7px"><span class="nm">${a.name}</span>
              ${a.risk==='low'?'':badge(a.risk,a.riskLabel)}</div>
            <div class="meta">${a.species} · ${a.breed} · ${a.sex} · ${a.age}</div>
            <div class="tag">Tag ${a.tag}</div>
          </div>
          <span style="color:var(--ink-400)">${ICO.chevR}</span>
        </button>`).join('')}</div>` : empty}
      <div style="height:20px"></div>
    </div>
  </div>`};
};

const TIMELINE = [
  { d:'Today', t:'Dr. Deshmukh took the case', crit:false,
    s:'He will be at your farm between 4:00 and 6:00 PM.' },
  { d:'26 August 2026', t:'You reported fever, a runny nose and no appetite', crit:true,
    s:'Sorted as High. You had no signal at 7:12 AM — it sent itself at 9:40.' },
  { d:'24 August 2026', t:'Her milk went below her own line', crit:false,
    s:'6.2 litres against her usual 9.1 — a third less, over four days.' },
  { d:'18 August 2026', t:'Dewormed', crit:false,
    s:'Given by K. More during the village round.' },
  { d:'2 July 2026', t:'FMD vaccine, second of three doses', crit:false,
    s:'Batch FMD-2026-114. The third is due 14 October.' },
  { d:'11 March 2026', t:'Added to Bharat Pashudhan', crit:false,
    s:'Tag 274 8891 0034, registered to Kale Farm.' }
];
SC['f-animal'] = () => {
  const a = animal(S.animalId);
  const tabs = [['history','History'],['records','Records'],['milk','Milk']];
  const idx = tabs.findIndex(x=>x[0]===S.animalTab);
  let content = '';
  if(S.animalTab==='history'){
    content = `<div class="tl">${TIMELINE.map(x=>`
      <div class="tl-i ${x.crit?'crit':''}"><div class="d">${x.d}</div>
      <div class="t">${x.t}</div><div class="s">${x.s}</div></div>`).join('')}</div>`;
  } else if(S.animalTab==='records'){
    content = `
      <div class="card">
        <div class="row"><span class="grow t-h3">FMD vaccine</span>${badge('moderate','2 of 3 doses')}</div>
        <div class="muted" style="margin-top:6px">Third dose due 14 October. Batch FMD-2026-114.</div>
        <div class="pbar" style="margin-top:12px"><i style="width:78%;background:var(--accent-600)"></i></div>
        <div class="tiny" style="margin-top:7px">78% of her schedule done</div>
      </div>
      <div class="card" style="margin-top:10px"><div class="t-h3">Brucellosis</div>
        <div class="muted" style="margin-top:6px">Done as a calf, 11 March 2026. Nothing further needed.</div></div>
      <div class="card" style="margin-top:10px"><div class="t-h3">Deworming</div>
        <div class="muted" style="margin-top:6px">Last given 18 August 2026. Next with the September round.</div></div>
      <div class="guide">These are the same records held against tag <b>${a.tag}</b> on Bharat Pashudhan. Nothing here is a separate copy that could disagree with it.</div>`;
  } else {
    content = `
      <div class="card">
        <div class="over">Daily milk, against her own average</div>
        <div class="row" style="gap:9px;margin-top:7px">
          <span style="font-size:34px;font-weight:700;letter-spacing:-.035em" class="tabnum">${a.yield}</span>
          <span class="muted" style="margin-bottom:5px">litres a day</span>
          <span class="delta down">▼ ${Math.abs(a.yieldDelta)}%</span></div>
        <svg width="100%" height="88" viewBox="0 0 300 88" style="margin-top:14px">
          <line x1="0" y1="26" x2="300" y2="26" stroke="var(--brand-300)" stroke-width="1.5" stroke-dasharray="4 4"/>
          <text x="2" y="20" font-size="10.5" fill="var(--ink-400)">her usual · 9.1 L</text>
          <polyline points="0,28 40,25 80,30 120,27 160,38 200,52 240,60 290,64" fill="none"
            stroke="var(--risk-high)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="290" cy="64" r="4" fill="var(--risk-high)"/></svg>
        <div class="muted" style="margin-top:8px;line-height:1.55">
          She crossed below her line on 24 August — two days before anything else showed.</div>
      </div>
      <div class="guide">A fall against <b>her own</b> average tells you more than the number does. Every animal here has her own line.</div>`;
  }

  return { chrome:false, html:`
  <div class="body nopad">
    <div style="position:relative">
      <img class="hero-img" src="${a.img}" alt="">
      <div class="hero-ov"></div>
      <button class="iconbtn" data-act="back" aria-label="Back"
        style="position:absolute;top:58px;left:12px;background:rgba(0,0,0,.34);color:#fff">${ICO.back}</button>
      <div style="position:absolute;left:18px;bottom:15px;color:#fff;text-shadow:0 1px 10px rgba(0,0,0,.45)">
        <div style="font-size:28px;font-weight:700;letter-spacing:-.032em">${a.name}</div>
        <div style="font-size:13px;opacity:.9;margin-top:2px">${a.species} · ${a.breed} · ${a.sex} · ${a.age}</div></div>
      <div style="position:absolute;right:16px;bottom:17px">${badge(a.risk,a.riskLabel)}</div>
    </div>
    <div style="padding:14px 18px;background:var(--surface)">
      <div class="tiny">Bharat Pashudhan tag · ${a.tag}</div>
      ${a.caseId?`<div class="ctx" style="margin-top:12px"><div class="t">Case ${a.caseId} is open</div>
        <div class="d">Dr. Deshmukh is coming today between 4 and 6 PM. Keep her away from the others until then.</div>
        <button class="btn btn-sm btn-p" style="margin-top:11px;width:100%" data-go="f-case">Open the case</button></div>`:''}
    </div>
    <div class="tabs">
      ${tabs.map(([k,l])=>`<button class="${S.animalTab===k?'on':''}" data-act="atab" data-v="${k}">${l}</button>`).join('')}
      <span class="ink" style="width:33.33%;left:${idx*33.33}%"></span>
    </div>
    <div style="padding:18px 18px 28px;background:var(--surface);min-height:300px">${content}</div>
  </div>
  <div class="footer solid">
    <button class="btn btn-p" data-act="startreport">Report something about ${a.name}</button></div>`};
};

/* ============================================================
   FARMER — Add Animal Form
   ============================================================ */
SC['f-add-animal'] = () => {
  const defaultTag = `274 8891 00` + String(40 + DB.animals.length).padStart(2, '0');
  if(!S.addAnimalState) S.addAnimalState = { species:'Cattle', breed:'HF Cross', img:'/images/cow_lakshmi.png' };
  
  return { chrome: false, html: `
  <div class="body">
    ${offbar()}
    ${topbar({ back: true, title: t('addAnimal') })}
    <div class="pad">
      <div class="t-h2">${t('registerAnimal')}</div>
      <div class="muted" style="margin-top:4px">Bharat Pashudhan &amp; PashuSetu</div>
      
      <div class="field" style="margin-top:16px"><label>${t('animalName')}</label>
        <input class="inp" id="add-name" placeholder="e.g. Gauri, Sundari" value="Gauri"></div>
        
      <div class="field"><label>${t('earTag')}</label>
        <input class="inp" id="add-tag" placeholder="274 8891 0040" value="${defaultTag}"></div>
        
      <div class="sec-t" style="margin-top:16px">${t('species')}</div>
      <div class="segs" id="add-species-segs">
        ${[['Cattle', t('cattle')],['Buffalo', t('buffalo')],['Goat', t('goat')]].map(([s, lbl])=>`<button class="seg ${S.addAnimalState.species===s?'on':''}" data-act="addspec" data-v="${s}">${lbl}</button>`).join('')}
      </div>

      <div class="sec-t" style="margin-top:14px">${t('breed')}</div>
      <div class="segs" id="add-breed-segs">
        ${['HF Cross','Gir','Murrah','Pandharpuri','Deoni'].map(b=>`<button class="seg ${S.addAnimalState.breed===b?'on':''}" data-act="addbreed" data-v="${b}">${b}</button>`).join('')}
      </div>

      <div class="sec-t" style="margin-top:14px">${t('sexAge')}</div>
      <div class="row" style="gap:10px">
        <div class="field grow"><label>Sex</label>
          <select class="inp" id="add-sex"><option value="Female">Female</option><option value="Male">Male</option></select></div>
        <div class="field grow"><label>Age</label>
          <input class="inp" id="add-age" value="3 yr"></div>
      </div>

      <div class="sec-t" style="margin-top:14px">Select Photo / Avatar</div>
      <div class="row" style="gap:10px;overflow-x:auto;padding-bottom:6px">
        ${[
          ['cow', '/images/cow_lakshmi.png', t('cattle')],
          ['cow2', '/images/cow_gir.png', 'Gir'],
          ['buffalo', '/images/buffalo.png', t('buffalo')],
          ['calf', '/images/calf.png', t('goat')]
        ].map(([k, imgPath, lbl]) => `
          <button class="pk ${S.addAnimalState.img===imgPath?'on':''}" data-act="addimg" data-v="${imgPath}" style="flex-direction:column;align-items:center;padding:10px;width:80px;flex-shrink:0">
            <img src="${imgPath}" style="width:48px;height:48px;border-radius:12px;object-fit:cover">
            <span class="tiny" style="margin-top:4px;text-align:center">${lbl}</span>
          </button>
        `).join('')}
      </div>
      <div style="height:20px"></div>
    </div>
  </div>
  <div class="footer">
    <button class="btn btn-p" data-act="saveanimal">${t('saveToHerd')}</button>
  </div>`};
};

/* ============================================================
   FARMER — the report. The flow the whole product rests on.
   ============================================================ */
SC['f-r1'] = () => ({ chrome:false, html:`
  <div class="body">
    ${offbar()}
    ${topbar({ close:true, center:'STEP 1 OF 4' })}
    <div class="prog"><i style="width:25%"></i></div>
    <div class="pad" style="margin-top:18px">
      <div class="q">${t('q1')}</div>
      <div class="qsub">${t('q1s')} ${t('q1more')}</div>
      <button class="voice ${S.sel.voice?'rec':''}" data-act="voice">
        <span class="mic">${ICO.mic}</span>
        <span class="grow">
          <span class="t" style="display:block">${S.sel.voice?t('listening'):t('speak')}</span>
          <span class="s" style="display:block">${S.sel.voice?'“तिला ताप आहे आणि ती खात नाही”':t('speakS')}</span></span>
        ${S.sel.voice?'<span class="wave">'+[0,1,2,3,4].map(i=>`<i style="animation-delay:${i*.1}s"></i>`).join('')+'</span>':''}
      </button>
      <div class="tiles">
        ${DB.symptoms.map(s=>{
          const on = S.sel.symptoms.includes(s.id);
          return `<button class="tile ${on?'on':''}" data-act="sym" data-v="${s.id}">
            ${on?`<span class="tick">${ICO.check}</span>`:''}
            <span class="ic">${PIC[s.id]}</span>
            <span class="lb">${S.lang==='mr'?s.mr:s.en}</span></button>`;
        }).join('')}
      </div>
      <div style="height:16px"></div>
    </div>
  </div>
  <div class="footer">
    ${S.sel.symptoms.length===0?`<div class="tiny" style="text-align:center;margin-bottom:10px">${t('pickone')}</div>`:''}
    <button class="btn btn-p" data-go="f-r2" ${S.sel.symptoms.length===0?'disabled':''}>
      ${t('cont')}${S.sel.symptoms.length?` · ${S.sel.symptoms.length} ${t('picked')}`:''}</button>
  </div>`});

SC['f-r2'] = () => ({ chrome:false, html:`
  <div class="body">
    ${offbar()}
    ${topbar({ back:true, center:'STEP 2 OF 4',
      right:`<button class="iconbtn" data-act="close" aria-label="Close">${ICO.close}</button>` })}
    <div class="prog"><i style="width:50%"></i></div>
    <div class="pad" style="margin-top:18px">
      <div class="q">Which animal?</div>
      <div class="qsub">Tap the one you noticed this in.</div>
      <div class="pick">
        ${DB.animals.map(a=>`
          <button class="pk ${S.sel.animal===a.id?'on':''}" data-act="pickanimal" data-v="${a.id}">
            <span class="box">${ICO.check}</span>
            <img class="avatar sm" src="${a.img}" alt="">
            <span class="grow"><span style="font-weight:650;font-size:15.5px;display:block">${a.name}</span>
            <span class="tiny">${a.breed} · ${a.age}</span></span>
            ${a.risk==='high'?badge('high','Watch'):''}
          </button>`).join('')}
      </div>

      <div class="sec-t" style="margin-top:26px">${t('othersAffected')}</div>
      <div class="stepper">
        <span class="lb">${t('othersSameSigns')}</span>
        <div class="row" style="gap:2px">
          <button class="stbtn" data-act="others" data-v="-1" ${S.sel.others===0?'disabled':''} aria-label="Fewer">−</button>
          <span class="stval tabnum">${S.sel.others}</span>
          <button class="stbtn" data-act="others" data-v="1" aria-label="More">+</button></div>
      </div>
      <div class="stepper ${S.sel.deaths>0?'warn':''}">
        <span class="lb" style="${S.sel.deaths>0?'color:var(--risk-critical)':''}">${t('deathsLast7Days')}</span>
        <div class="row" style="gap:2px">
          <button class="stbtn" data-act="deaths" data-v="-1" ${S.sel.deaths===0?'disabled':''} aria-label="Fewer">−</button>
          <span class="stval tabnum" style="${S.sel.deaths>0?'color:var(--risk-critical)':''}">${S.sel.deaths}</span>
          <button class="stbtn" data-act="deaths" data-v="1" aria-label="More">+</button></div>
      </div>
      ${S.sel.deaths>0?`<div class="errbox" style="margin-top:12px">${ICO.alert}<span class="tx">
        <b>A death changes everything.</b> We will stop the questions here and get a veterinarian moving now.</span></div>`:''}
      <div style="height:16px"></div>
    </div>
  </div>
  <div class="footer">
    ${S.sel.deaths>0
      ? `<button class="btn btn-danger" data-act="deathpath">${t('getHelpNow')}</button>`
      : `<button class="btn btn-p" data-go="f-r3">${t('cont')}</button>`}
  </div>`});

SC['f-r3'] = () => ({ chrome:false, html:`
  <div class="body">
    ${offbar()}
    ${topbar({ back:true, center:'STEP 3 OF 4',
      right:`<button class="iconbtn" data-act="close" aria-label="Close">${ICO.close}</button>` })}
    <div class="prog"><i style="width:75%"></i></div>
    <div class="pad" style="margin-top:18px">
      <div class="q">${t('showWhatYouSee')}</div>
      <div class="qsub">${t('photoSubtitle')}</div>
      <div class="photos">
        ${[0,1].map(i=>{
          const p = S.sel.photos[i];
          return p ? `<div class="pslot filled"><img src="${p}" alt="">
              <button class="rm" data-act="rmphoto" data-v="${i}" aria-label="Remove">${ICO.close}</button>
              ${S.offline?'<div class="up"><i></i></div>':''}</div>`
            : `<button class="pslot" data-act="addphoto" data-v="${i}">${ICO.cam}
              <span>${i===0?t('wholeAnimal'):t('closeUp')}</span></button>`;
        }).join('')}
      </div>
      ${S.sel.photos.length && S.offline ? `<div class="tiny" style="margin-top:10px">
        No signal. The photos are saved on your phone and will send themselves.</div>`:''}
      <div class="guide"><b>Worth photographing:</b> her mouth and gums, her feet and hooves, the udder, and any discharge. Daylight helps more than anything.</div>
      <div class="divider"></div>
      <button class="btn btn-g btn-sm" style="width:100%" data-act="skipphoto">${t('skipPhoto')}</button>
      <div class="tiny" style="text-align:center;margin-top:10px;line-height:1.55">
        That is fine. It means we can say less — so we will ask a veterinarian sooner.</div>
      <div style="height:16px"></div>
    </div>
  </div>
  <div class="footer">
    <button class="btn btn-p" data-go="f-r4" ${S.sel.photos.length===0?'disabled':''}>${t('cont')}</button></div>`});

SC['f-r4'] = () => {
  const zoo = S.sel.symptoms.some(s => ['fever','nasal','weak'].includes(s));
  return { chrome:false, html:`
  <div class="body">
    ${offbar()}
    ${topbar({ back:true, center:'STEP 4 OF 4',
      right:`<button class="iconbtn" data-act="close" aria-label="Close">${ICO.close}</button>` })}
    <div class="prog"><i style="width:100%"></i></div>
    <div class="pad" style="margin-top:18px">
      <div class="q">${t('lastFewThings')}</div>
      <div class="qsub">These change how urgent this is.</div>

      <div class="sec-t">${t('whenStarted')}</div>
      <div class="segs">${['Today','Yesterday','2–3 days','About a week','Longer'].map(x=>
        `<button class="seg ${S.sel.since===x?'on':''}" data-act="since" data-v="${x}">${x}</button>`).join('')}</div>

      <div class="sec-t">${t('hadVaccines')}</div>
      <div class="segs">${['All of them','Some of them','None','I am not sure'].map(x=>
        `<button class="seg ${S.sel.vacc===x?'on':''}" data-act="vaccq" data-v="${x}">${x}</button>`).join('')}</div>

      ${zoo?`
      <div class="sec-t" style="color:var(--risk-critical)">${t('anyoneUnwell')}</div>
      <div class="card flat" style="border-color:#F2CFC9;background:var(--risk-critical-bg)">
        <div style="font-size:13.5px;line-height:1.55;color:var(--risk-critical-ink)">
          A few animal illnesses pass to people, through milk or close handling. We ask this to protect your family. It is never used against you or your farm.</div>
        <div class="segs" style="margin-top:12px">${['Nobody','Someone has a fever','Someone has a cut','I am not sure'].map(x=>
          `<button class="seg ${S.sel.human===x?'on':''}" data-act="humanq" data-v="${x}">${x}</button>`).join('')}</div>
      </div>`:''}

      <div class="guide"><b>Already on file</b>, so you do not have to type it: ${animal(S.sel.animal).name}'s age, her breed, her vaccination record, and that her milk has been down 32% since 24 August.</div>
      <div style="height:16px"></div>
    </div>
  </div>
  <div class="footer">
    <button class="btn btn-p" data-act="assess" ${!S.sel.vacc?'disabled':''}>${t('seeWhatToDo')}</button>
    ${!S.sel.vacc?'<div class="tiny" style="text-align:center;margin-top:10px">Answer the vaccine question to carry on</div>':''}
  </div>`};
};

/* ---------------- assessing ---------------- */
const REASONS = [
  'Reading what you sent',
  "Checking Lakshmi's record and her vaccines",
  'Comparing 47 reports around Wadgaon',
  'Working out how urgent this is'
];
SC['f-assessing'] = () => ({ chrome:false, html:`
  <div class="body" style="display:flex">
    <div class="assessing">
      <div class="orb"><span class="gl">${ICO.vet}</span></div>
      <div class="t-h2" style="margin-top:26px">Working this out</div>
      <div class="muted" style="margin-top:8px">A few seconds. We are not guessing.</div>
      <div class="reasons">${REASONS.map((r,i)=>`<div class="rline" id="rl${i}">
        <span class="tk">${ICO.check}</span>${r}</div>`).join('')}</div>
    </div>
  </div>`, after: () => {
    REASONS.forEach((_,i)=> setTimeout(()=>{ const e=$('#rl'+i); if(e) e.classList.add('show'); },
      S.reduced ? 60*i : 340*i));
    setTimeout(()=>{ if(S.screen==='f-assessing') go('f-assessment', 'replace'); }, S.reduced ? 400 : 1650);
  }});

/* ---------------- assessment ---------------- */
const EVID = [
  { t:'Fever, a runny nose and going off feed, all together', w:'Points strongly', c:'var(--risk-critical)' },
  { t:'Her milk is down 32% from her own average since 24 August', w:'Points strongly', c:'var(--risk-critical)' },
  { t:'Her vaccination schedule is only 78% done', w:'Adds to it', c:'var(--risk-high)' },
  { t:'Three farms within 4 km reported the same signs in 11 days', w:'Adds to it', c:'var(--risk-high)' },
  { t:'No deaths, and no sores in her mouth', w:'Makes it less urgent', c:'var(--risk-low)' }
];
SC['f-assessment'] = () => {
  const conf = S.sel.photos.length ? 82 : 61;
  const score = 82, sev = 'high', C = 2*Math.PI*58;
  return { chrome:false, html:`
  <div class="body">
    ${offbar()}
    ${topbar({ close:true, title:t('whatWeThink'),
      right:`<button class="iconbtn" data-act="toast" data-v="Shared to WhatsApp." aria-label="Share">${ICO.share}</button>` })}
    <div class="pad">
      <div class="verdict">
        <div class="verdict-top ${sev}">
          <div class="over" style="margin-bottom:12px">Lakshmi · just now</div>
          <div class="gauge">
            <svg width="138" height="138">
              <circle cx="69" cy="69" r="58" fill="none" stroke="#E9E3D7" stroke-width="11"/>
              <circle id="arc" class="arc" cx="69" cy="69" r="58" fill="none" stroke="${RISK[sev].c}"
                stroke-width="11" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>
            <div class="val"><span class="num" style="color:${RISK[sev].c}">${score}</span>
              <span class="of">urgency</span></div>
          </div>
          <div style="margin-top:14px">${badge(sev,'She should see a veterinarian today')}</div>
        </div>
      </div>

      <div class="act-now">
        <div class="k">${t('doThisFirst')}</div>
        <div class="t">Move Lakshmi away from the other five.</div>
        <div class="d">Any corner or shed will do. Give her a separate bucket for feed and water, and wash your hands after handling her. Nothing else you do today matters as much as this.</div>
      </div>

      <div class="acc" id="acc1">
        <button class="acc-h" data-act="acc" data-v="acc1"><span class="t">Why we are saying this</span>
          <span class="tiny">5 reasons</span><span class="cv">${ICO.chevD}</span></button>
        <div class="acc-b"><div class="acc-in">
          ${EVID.map(e=>`<div class="ev"><span class="dot" style="background:${e.c}"></span>
            <span class="grow"><span class="t" style="display:block">${e.t}</span>
            <span class="w" style="display:block">${e.w}</span></span></div>`).join('')}
        </div></div>
      </div>

      <div class="conf">
        <span style="font-size:12.5px;font-weight:700;white-space:nowrap">How sure we are</span>
        <span class="confbar"><i id="cbar" style="width:0%"></i></span>
        <span class="tabnum" style="font-size:13.5px;font-weight:700">${conf}%</span>
      </div>
      ${S.sel.photos.length?'':`<div class="tiny" style="margin-top:8px;line-height:1.55">
        We are less sure because there were no photos. That is why we are pushing you towards a veterinarian sooner.</div>`}

      <div class="disclaim">${ICO.alert}<span class="tx">
        <b>This is not a diagnosis.</b> It is a first read, to help you act fast. Only a veterinarian can tell you what the illness actually is. If this is an emergency, call <b>1962</b>.</span></div>

      <button class="wrongbtn" data-act="sheet" data-v="wrong">This does not match what I am seeing</button>
      <div style="height:14px"></div>
    </div>
  </div>
  <div class="footer">
    <button class="btn btn-p" data-go="f-vetreq">${t('askForVet')}</button>
    <button class="btn btn-s" style="margin-top:9px" data-go="f-plan">${t('showFourSteps')}</button>
  </div>`, after: () => {
    const C2 = 2*Math.PI*58;
    requestAnimationFrame(()=>setTimeout(()=>{
      const a=$('#arc'); if(a) a.style.strokeDashoffset = C2*(1-score/100);
      const b=$('#cbar'); if(b) b.style.width = conf+'%';
    }, 60));
  }};
};

/* ---------------- action plan ---------------- */
const PLAN = [
  { t:'Separate her from the others',
    d:'Any shed, corner or tied spot away from the rest. Her own bucket for feed, her own for water.' },
  { t:'Write down her temperature and what she eats',
    d:'Morning and evening, if you have a thermometer. Even “ate half” is worth writing down.' },
  { t:'Keep her milk apart',
    d:'Do not mix it with the rest, do not sell it, and do not drink it raw until the veterinarian has seen her.' },
  { t:'Keep her tag number to hand',
    d:'274 8891 0034. It is the first thing he will ask for, and it saves ten minutes at the gate.' }
];
SC['f-plan'] = () => {
  const done = S.plan.filter(Boolean).length;
  return { chrome:false, html:`
  <div class="body">
    ${offbar()}
    ${topbar({ back:true, title:'What to do now' })}
    <div class="pad">
      <div class="planbar">
        <span class="bar"><i style="width:${done/4*100}%"></i></span>
        <span class="tiny" style="font-weight:700;white-space:nowrap">${done} of 4 done</span></div>
      ${done===4?`<div class="allclear" style="margin-bottom:12px">
        <div class="ic">${ICO.check}</div><div class="t">All four done</div>
        <div class="d">You have done everything that helps before he arrives.</div></div>`:''}
      <div class="plan">
        ${PLAN.map((p,i)=>`
          <button class="pstep ${S.plan[i]?'done':''}" data-act="plan" data-v="${i}">
            <span class="n">${S.plan[i]?ICO.check:i+1}</span>
            <span class="grow"><span class="t" style="display:block">${p.t}</span>
            <span class="d" style="display:block">${p.d}</span></span>
          </button>`).join('')}
      </div>
      <div class="guide">These four work with no signal at all. Tick them off whenever you finish one — it saves on your phone.</div>
      <div style="height:14px"></div>
    </div>
  </div>
  <div class="footer"><button class="btn btn-p" data-go="f-vetreq">Ask for a veterinarian</button></div>`};
};

/* ---------------- ask for a vet ---------------- */
SC['f-vetreq'] = () => ({ chrome:false, html:`
  <div class="body">
    ${offbar()}
    ${topbar({ back:true, title:'Ask for a veterinarian' })}
    <div class="pad">
      <div class="card">
        <div class="row"><img class="avatar" src="${DB.vet.img}" alt="">
          <div class="grow">
            <div class="t-h3">Dr. R. Deshmukh</div>
            <div class="muted">Livestock Development Officer, Haveli</div>
            <div class="tiny" style="margin-top:4px">Usually replies within three hours during the day</div>
          </div></div>
        <div class="divider"></div>
        <div class="muted" style="line-height:1.6">He gets your report, both photos, Lakshmi's vaccination record and the three nearby reports — so he can decide before he sets out.</div>
      </div>

      <div class="sec-t">What he will see</div>
      <div class="card flat">
        ${[['Your report','Fever, runny nose, not eating. Started 2–3 days ago.'],
           ['Two photos','The whole animal, and a close-up'],
           ['The animal','Lakshmi · HF Cross · 4 yr · tag 274 8891 0034'],
           ['Where you are','Kale Farm, Wadgaon — shown to him, and to nobody else']].map(([k,v],i)=>`
          <div style="${i?'border-top:1px solid var(--line-soft);margin-top:11px;padding-top:11px':''}">
            <div class="over">${k}</div><div class="muted" style="margin-top:3px">${v}</div></div>`).join('')}
      </div>

      <div class="ctx" style="margin-top:12px"><div class="t">Who else sees this</div>
        <div class="d">Dr. Deshmukh and the block office. The district dashboard sees Wadgaon — not your farm, not your name.</div></div>
      <div style="height:14px"></div>
    </div>
  </div>
  <div class="footer">
    <button class="btn btn-p" data-act="sendvet">${S.offline?'Send when the signal returns':t('sendRequest')}</button>
    <button class="btn btn-s" style="margin-top:9px" data-act="callvet">${ICO.phone} ${t('call1962')}</button>
  </div>`});

/* ---------------- case tracking ---------------- */
SC['f-case'] = () => { const c = DB.openCase; return { chrome:false, html:`
  <div class="body">
    ${offbar()}
    ${topbar({ back:true, title:`Case ${c.id}`, right:badge('high') })}
    <div class="pad">
      <div class="card">
        <div class="row"><img class="avatar" src="${IMG.cow}" alt="">
          <div class="grow"><div class="t-h3">${c.animal}</div>
          <div class="muted">You reported this ${c.filed} · tag ${c.tag}</div></div></div>
      </div>

      <div class="card raised" style="margin-top:10px;background:var(--brand-900);color:#fff">
        <div class="over" style="color:var(--brand-300)">Veterinarian on the way</div>
        <div style="font-size:21px;font-weight:700;margin-top:7px;letter-spacing:-.028em">${c.eta}</div>
        <div style="font-size:14px;color:rgba(255,255,255,.78);margin-top:5px">${c.vet}</div>
        <div class="row" style="margin-top:14px;gap:8px">
          <button class="btn btn-sm grow" style="background:rgba(255,255,255,.15);color:#fff"
            data-act="callvet">${ICO.phone} Call him</button>
          <button class="btn btn-sm grow" style="background:#fff;color:var(--brand-900)"
            data-act="toast" data-v="Directions sent to Dr. Deshmukh.">Send directions</button></div>
      </div>

      <div class="sec-t">Where this has got to</div>
      <div class="card">
        <div class="track">${c.steps.map(s=>`
          <div class="tstep ${s.done?'done':''} ${s.now?'now':''}">
            <span class="tdot">${s.done?ICO.check:''}</span>
            <span class="grow"><span class="t" style="display:block">${s.t}</span>
            <span class="s" style="display:block">${s.s}</span></span></div>`).join('')}</div>
      </div>

      <div class="sec-t">Before he arrives</div>
      <button class="card" style="width:100%;text-align:left" data-go="f-plan">
        <div class="row"><span class="grow t-h3">Your four steps</span>
          <span class="tiny">${S.plan.filter(Boolean).length} of 4 done</span>
          <span style="color:var(--ink-400)">${ICO.chevR}</span></div></button>
      <div style="height:20px"></div>
    </div>
  </div>`};
};

/* ---------------- alerts ---------------- */
SC['f-alerts'] = () => {
  let list = DB.alerts;
  if(S.alertFilter==='Important') list = list.filter(a=>a.tier==='critical'||a.tier==='important');
  if(S.alertFilter==='Vaccines')  list = list.filter(a=>a.ic==='vial');
  if(S.alertFilter==='__none')    list = [];
  return { nav:'f-alerts', html:`
  <div class="body hasnav">
    ${offbar()}
    ${topbar({ title:t('alerts'), right:`<button class="iconbtn" data-act="toast"
      data-v="All marked as read." aria-label="Mark all read">${ICO.check}</button>` })}
    <div class="chips">${['All','Important','Vaccines'].map(c=>
      `<button class="chip ${S.alertFilter===c?'on':''}" data-act="alertfilter" data-v="${c}">${c}</button>`).join('')}</div>
    <div class="pad" style="margin-top:14px">
      ${list.length===0?`<div class="empty"><div class="ic">${ICO.bell}</div>
        <div class="t">Nothing here</div>
        <div class="d">No alerts match this filter right now.</div>
        <button class="btn btn-s" style="width:auto;margin:22px auto 0;padding:0 22px"
          data-act="alertfilter" data-v="All">Show everything</button></div>`
      : ['Today','Earlier'].map(g=>{
        const gl = list.filter(a=>a.group===g); if(!gl.length) return '';
        return `<div class="sec-t" style="margin-top:${g==='Today'?'0':'24px'}">${g}</div>
        <div style="display:flex;flex-direction:column;gap:9px">
          ${gl.map(a=>`<button class="alert ${a.unread?'unread':''}"
            ${a.go?`data-go="${a.go}"`:a.sheet?`data-act="sheet" data-v="${a.sheet}"`
              :a.toast?`data-act="toast" data-v="${a.toast}"`:'data-act="noop"'}>
            <span class="ai" style="background:${TONE[a.tone]}">${ALERT_ICON[a.ic]}</span>
            <span class="grow"><span class="t" style="display:block">${a.t}</span>
            <span class="d" style="display:block">${a.d}</span>
            <span class="m" style="display:block">${a.m}${a.act?' · <b style="color:var(--brand-700)">'+a.act+'</b>':''}</span></span>
          </button>`).join('')}</div>`;
      }).join('')}
      <div style="height:20px"></div>
    </div>
  </div>`};
};

/* ---------------- profile & sync ---------------- */
SC['f-profile'] = () => {
  const f = DB.farmer;
  const wait = S.pending.filter(p=>p.st!=='ok').length;
  const rows = [
    ['Language', S.lang==='mr'?'मराठी':S.lang==='hi'?'हिंदी':'English', 'setlang-toggle'],
    ['Alerts', 'At most one a week', ''],
    ['Who sees my reports', 'Worth two minutes', 'sheet-privacy'],
    ['Bharat Pashudhan', 'Six animals linked', ''],
    ['Helpline', '1962 · free to call', 'callvet']
  ];
  return { nav:'f-profile', html:`
  <div class="body hasnav">
    ${offbar()}
    ${topbar({ title:t('profile') })}
    <div class="pad">
      <div class="card">
        <div class="row"><img class="avatar lg" src="${f.img}" alt="${f.name}">
          <div class="grow"><div style="font-weight:700;font-size:19px;letter-spacing:-.02em">${f.name}</div>
          <div class="muted">${f.farm} · ${f.village}</div>
          <div class="tiny" style="margin-top:3px">${f.phone} · with us since ${f.joined}</div></div></div>
      </div>

      <div class="sec-t">Sending</div>
      <div class="card">
        <div class="row"><span class="grow t-h3">${S.offline?`${wait} things waiting`:'Everything is sent'}</span>
          ${S.offline?badge('moderate','No signal'):badge('low','Up to date')}</div>
        <div class="tiny" style="margin-top:5px;line-height:1.5">${S.offline
          ? 'They will go on their own as soon as you have signal. There is nothing for you to do.'
          : 'Last sent a moment ago.'}</div>
        <div style="margin-top:10px">
          ${S.pending.map(p=>`<div class="pendrow ${p.st}">
            <span class="grow"><span style="font-size:14.5px;font-weight:600;display:block">${p.t}</span>
            <span class="tiny">${p.s}</span></span>
            <span class="st">${p.lbl}</span>
            ${p.st==='fail'?`<button class="btn-sm btn-s" style="height:32px;padding:0 12px"
              data-act="retry" data-v="${p.id}">Try again</button>`:''}
          </div>`).join('')}
        </div>
        ${S.pending.some(p=>p.st==='fail')?`<div class="tiny" style="margin-top:11px;color:var(--risk-critical);line-height:1.5">
          One photo did not go — the file was too big for the connection. Everything else went through.</div>`:''}
      </div>

      <div class="sec-t">Settings</div>
      <div class="group">
        ${rows.map(([k,v,act])=>`
          <button class="grow-row" ${act?`data-act="${act}"`:`data-act="toast" data-v="${k}"`}>
            <span class="grow"><span style="font-size:15.5px;font-weight:600;display:block">${k}</span>
            <span class="tiny">${v}</span></span>
            <span style="color:var(--ink-400)">${ICO.chevR}</span></button>`).join('')}
      </div>
      <div style="height:24px"></div>
    </div>
  </div>`};
};

/* ============================================================
   VETERINARIAN
   ============================================================ */
SC['v-queue'] = () => {
  let q = DB.queue;
  if(S.qFilter==='Serious') q = q.filter(x=>x.sev==='critical');
  if(S.qFilter==='Yours')   q = q.filter(x=>x.mine);
  if(S.qFilter==='Waiting longest') q = q.filter(x=>x.age.includes('days'));
  const v = DB.vet;
  return { light:true, vnav:'v-queue', html:`
  <div class="body nopad hasnav">
    <div class="vhead">
      <div class="row" style="align-items:flex-start;justify-content:space-between">
        <div class="grow">
          <div class="nm">${v.name}</div>
          <div class="sb">${v.posting}</div>
        </div>
        <img class="avatar" src="${v.img}" alt="${v.name}" style="width:52px;height:52px;border-radius:14px;border:2px solid rgba(255,255,255,0.25)">
      </div>
      <div class="vstats">
        <div class="vstat"><div class="n tabnum">${DB.queue.length}</div><div class="l">Waiting</div></div>
        <div class="vstat"><div class="n tabnum" style="color:#FFB4A2">${DB.queue.filter(x=>x.sev==='critical').length}</div><div class="l">Serious</div></div>
        <div class="vstat"><div class="n tabnum">${v.visitsToday}</div><div class="l">Visits today</div></div>
      </div>
    </div>
    <div class="sheetup">
      <div class="chips">${['All','Serious','Yours','Waiting longest'].map(c=>
        `<button class="chip ${S.qFilter===c?'on':''}" data-act="qfilter" data-v="${c}">${c}</button>`).join('')}</div>
      <div class="pad" style="margin-top:14px">
        <div class="tiny" style="margin-bottom:11px">Sorted by how serious it is, then how long it has waited, then how far you would drive.</div>
        ${q.length ? `<div style="display:flex;flex-direction:column;gap:9px">${q.map(c=>`
          <button class="qitem" data-act="vcase" data-v="${c.id}" style="border-left-color:${RISK[c.sev].c}">
            <div class="qitem-in">
              <img class="thumb" src="${c.img}" alt="">
              <div class="grow">
                <div class="row" style="gap:7px"><span class="id">${c.id}</span>${badge(c.sev)}
                  ${c.deaths?`<span class="badge b-critical">${c.deaths} dead</span>`:''}</div>
                <div class="t">${c.signs}</div>
                <div class="m"><span>${ICO.pin} ${c.village} · ${c.km} km</span>
                  <span>${c.animals} animal${c.animals>1?'s':''}</span>
                  <span>${ICO.clock} ${c.age}</span></div>
              </div></div>
          </button>`).join('')}</div>`
        : `<div class="empty"><div class="ic">${ICO.check}</div><div class="t">Nothing in this filter</div>
           <div class="d">Which is the point. Clear the filter to see the rest of the queue.</div>
           <button class="btn btn-s" style="width:auto;margin:22px auto 0;padding:0 22px"
             data-act="qfilter" data-v="All">Show everything</button></div>`}
        <div style="height:20px"></div>
      </div>
    </div>
  </div>`};
};

SC['v-case'] = () => {
  const c = DB.queue.find(x=>x.id===S.caseId) || DB.queue[0];
  return { chrome:false, html:`
  <div class="body">
    ${topbar({ back:true, solid:true, title:c.id, right:badge(c.sev) })}
    <div class="pad" style="margin-top:14px">
      <div class="card">
        <div class="row" style="align-items:flex-start"><img class="avatar lg" src="${c.img}" alt="">
          <div class="grow"><div class="t-h3">${c.animal}</div>
          <div class="muted">${c.owner} · ${c.village} · ${c.km} km away</div>
          <div class="tiny" style="margin-top:5px">${c.age} · ${c.animals} affected${c.deaths?` · <b style="color:var(--risk-critical)">${c.deaths} dead</b>`:''}</div>
        </div></div>
      </div>

      <div class="sec-t">In the farmer's words</div>
      <div class="card">
        <div style="font-size:15.5px;font-weight:500;line-height:1.55">“${c.quote}”</div>
        <div class="tiny" style="margin-top:8px">Spoken in Marathi, transcribed. Sent with no signal — reached us 2h 28m later.</div>
        <div class="photos" style="margin-top:13px">
          <div class="pslot filled"><img src="${c.img}" alt=""></div>
          <div class="pslot filled"><img src="${IMG.mouth}" alt=""></div>
        </div>
      </div>

      <div class="ctx"><div class="t">Around this farm</div><div class="d">${c.ctx}</div></div>

      <div class="acc open" id="acc2">
        <button class="acc-h" data-act="acc" data-v="acc2"><span class="t">How this was sorted</span>
          <span class="tiny">${c.conf}% confidence</span><span class="cv">${ICO.chevD}</span></button>
        <div class="acc-b"><div class="acc-in">
          ${c.why.map(w=>`<div class="ev"><span class="dot" style="background:${w.c}"></span>
            <span class="grow"><span class="t" style="display:block">${w.t}</span>
            <span class="w" style="display:block">${w.w}</span></span></div>`).join('')}
          <div class="tiny" style="margin-top:13px;line-height:1.55">
            Rule-based, signed off clinically. It ranks urgency so you can plan a day. It does not offer a diagnosis, and it never will.</div>
        </div></div>
      </div>

      <div class="sec-t">This animal's record</div>
      <div class="card flat">
        ${[['2 Jul 2026','FMD, second of three doses · batch FMD-2026-114'],
           ['18 Aug 2026','Dewormed during the village round'],
           ['24 Aug 2026','Milk crossed below her own baseline']].map(([d,x],i)=>`
          <div class="row" style="align-items:flex-start;${i?'border-top:1px solid var(--line-soft);margin-top:10px;padding-top:10px':''}">
            <span class="tiny" style="width:92px;flex:none;font-weight:650">${d}</span>
            <span class="muted grow">${x}</span></div>`).join('')}
      </div>
      <div style="height:16px"></div>
    </div>
  </div>
  <div class="footer solid">
    <div class="actgrid">
      <button class="btn btn-p" data-act="vaction" data-v="Added to today's route. The farmer has been given a 4–6 PM window.">Add to my route</button>
      <button class="btn btn-s" data-act="vaction" data-v="Advice sent to the farmer in Marathi.">Advise from here</button>
      <button class="btn btn-g" data-act="vaction" data-v="Lab sampling requested. A kit is assigned to the mobile unit.">Send for lab</button>
      <button class="btn btn-g" data-act="vaction" data-v="Escalated to Dr. Kulkarni at the district office.">Escalate</button>
    </div>
  </div>`};
};

SC['v-route'] = () => ({ vnav:'v-route', html:`
  <div class="body hasnav">
    ${topbar({ title:"Today's route", solid:true, right:'<span class="badge b-info">42 km · 5 stops</span>' })}
    <div class="pad" style="margin-top:14px">
      <div class="ctx"><div class="t">Ordered by urgency, then by geography</div>
        <div class="d">The two serious ones first, the rest on the way back. About 26 km less than taking them in the order they called.</div></div>
      <div class="sec-t">Stops</div>
      <div style="display:flex;flex-direction:column;gap:9px">
        ${[['9:30 AM','Village X · S. Jadhav','PS-2839','critical','11.4 km','Three dead. Take a sampling kit.'],
           ['11:15 AM','Kondhapuri · M. Shinde','PS-2836','high','8.8 km','Blister-type signs, two animals.'],
           ['2:00 PM','Village Z · P. Gaikwad','PS-2831','moderate','3.1 km','Loose motion, one goat.'],
           ['4:00 PM','Wadgaon · A. Kale','PS-2841','critical','6.2 km','Fever and runny nose. Milk down a third.'],
           ['5:30 PM','Wadgaon · R. Pawar','PS-2828','low','0.4 km','Milk drop only. Ten minutes.']
          ].map(([tm,who,id,sev,km,note])=>`
          <button class="card" style="text-align:left;width:100%;border-left:3px solid ${RISK[sev].c}"
            data-act="vcase" data-v="${id}">
            <div class="row"><span class="tabnum" style="font-weight:700;font-size:13px;width:68px;flex:none">${tm}</span>
              <span class="grow"><span style="font-weight:650;font-size:15.5px;display:block;letter-spacing:-.014em">${who}</span>
              <span class="tiny">${id} · ${km}</span></span>${badge(sev)}</div>
            <div class="muted" style="margin-top:8px">${note}</div>
          </button>`).join('')}
      </div>
      <div style="height:20px"></div>
    </div>
  </div>`});

SC['v-drives'] = () => ({ vnav:'v-drives', html:`
  <div class="body hasnav">
    ${topbar({ title:'Vaccination rounds', solid:true })}
    <div class="pad" style="margin-top:14px">
      ${S.offline?`<div class="ctx" style="background:var(--risk-moderate-bg);border-color:#EFDFB4">
        <div class="t" style="color:var(--risk-moderate-ink)">Working with no signal</div>
        <div class="d" style="color:var(--risk-moderate-ink)">Tap them off as you go. Nothing is lost — the records send themselves the moment you are back in range.</div></div>`:''}
      <div class="card">
        <div class="row"><span class="grow"><span class="t-h3" style="display:block">Kondhapuri · FMD round</span>
          <span class="muted">Batch FMD-2026-118 · vial 4 of 9</span></span>${badge('moderate','Part done')}</div>
        <div class="planbar" style="margin-top:14px"><span class="bar"><i style="width:31%"></i></span>
          <span class="tiny" style="font-weight:700">12 of 39</span></div>
      </div>
      <div class="sec-t">The list <span class="tiny">saved on this device</span></div>
      <div class="alist">
        ${[['Kamla','274 8892 0011','done'],['Sheru','274 8892 0012','done'],['Bijli','274 8892 0013','done'],
           ['Ratna','274 8892 0014','next'],['Gauri','274 8892 0015',''],['Kali','274 8892 0016','']].map(([n,tg,st])=>`
          <button class="aitem" data-act="toast"
            data-v="${st==='done'?n+' is already recorded.':n+' marked as done. Saved on this device.'}">
            <span class="avatar sm ph" style="color:${st==='done'?'var(--risk-low)':'var(--ink-400)'}">
              ${st==='done'?ICO.check:ICO.herd}</span>
            <span class="grow"><span class="nm">${n}</span><span class="tag" style="display:block">Tag ${tg}</span></span>
            ${st==='done'?badge('low','Done'):st==='next'?badge('moderate','Next'):''}
          </button>`).join('')}
      </div>
      <div style="height:20px"></div>
    </div>
  </div>`});

SC['v-me'] = () => ({ vnav:'v-me', html:`
  <div class="body hasnav">
    ${topbar({ title:'You', solid:true })}
    <div class="pad" style="margin-top:14px">
      <div class="card"><div class="row"><img class="avatar lg" src="${DB.vet.img}" alt="${DB.vet.name}">
        <div class="grow"><div style="font-weight:700;font-size:18px;letter-spacing:-.02em">${DB.vet.name}</div>
        <div class="muted">${DB.vet.role}</div>
        <div class="tiny" style="margin-top:3px">${DB.vet.posting}</div></div></div></div>

      <div class="sec-t">This month</div>
      <div class="actgrid">
        <div class="card"><div class="over">Cases closed</div>
          <div class="row" style="gap:8px;margin-top:6px">
            <span style="font-size:28px;font-weight:700;letter-spacing:-.03em" class="tabnum">64</span>
            <span class="delta up">▲ 22%</span></div></div>
        <div class="card"><div class="over">Driving per case</div>
          <div class="row" style="gap:7px;margin-top:6px">
            <span style="font-size:28px;font-weight:700;letter-spacing:-.03em" class="tabnum">8.4</span>
            <span class="muted" style="margin-bottom:5px">km</span></div>
          <div class="tiny" style="margin-top:4px">was 14.1 km</div></div>
      </div>

      <div class="sec-t">Are we wasting your time?</div>
      <div class="card">
        <div class="row"><span class="grow t-h3">False alarms</span>
          <span style="font-size:24px;font-weight:700;letter-spacing:-.03em" class="tabnum">17%</span></div>
        <div class="pbar" style="margin-top:11px;position:relative">
          <i style="width:17%;background:var(--risk-low)"></i>
          <span style="position:absolute;left:25%;top:-3px;width:2px;height:13px;background:var(--risk-critical)"></span>
        </div>
        <div class="tiny" style="margin-top:10px;line-height:1.55">
          Cases you closed as “nothing needed”. The red mark is the 25% limit. Past it, we are sending you too much — and we retune the sorting, rather than asking you to put up with it.</div>
      </div>
      <div style="height:20px"></div>
    </div>
  </div>`});

/* ============================================================
   DISTRICT OFFICER
   ============================================================ */
const spark = (d,w,h,col) => {
  const mx=Math.max(...d), mn=Math.min(...d);
  const pts=d.map((v,i)=>`${i/(d.length-1)*w},${h-((v-mn)/(mx-mn||1))*(h-6)-3}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};

SC['o-overview'] = () => { const d = DB.district; return { light:true, onav:'o-overview', html:`
  <div class="body nopad hasnav">
    <div class="ohead">
      <div class="row" style="align-items:flex-start;justify-content:space-between">
        <div class="grow">
          <div class="over" style="color:var(--brand-300)">District surveillance</div>
          <div style="font-size:26px;font-weight:700;letter-spacing:-.03em;margin-top:6px">Pune district</div>
          <div style="font-size:12.5px;color:var(--brand-300);margin-top:4px">
            ${DB.officer.name} · ${d.blocks} blocks · updated 14 minutes ago</div>
        </div>
        <img class="avatar" src="${DB.officer.img}" alt="${DB.officer.name}" style="width:52px;height:52px;border-radius:14px;border:2px solid rgba(255,255,255,0.25)">
      </div>
      <div class="kpis">
        <div class="kpi"><div class="n tabnum">${d.active}</div><div class="l">Open cases</div></div>
        <div class="kpi"><div class="n tabnum" style="color:#FFB4A2">4</div><div class="l">Forming clusters</div></div>
        <div class="kpi"><div class="n tabnum">${d.coverage}%</div><div class="l">Vaccination cover</div></div>
      </div>
      <div style="margin-top:16px;background:rgba(255,255,255,.09);border-radius:var(--r-sm);padding:14px">
        <div class="row"><span class="grow" style="font-size:13.5px;font-weight:650">District risk</span>
          <span class="badge b-critical">${MARK.critical} Rising</span></div>
        ${spark(d.trend,300,38,'#FFB4A2')}
        <div style="font-size:12.5px;color:var(--brand-300);margin-top:5px">
          Up 18% over twelve weeks. The Ahmednagar road belt is driving it.</div>
      </div>
    </div>

    <div class="sheetup">
      <div class="pad">
        <div class="sec-t" style="margin-top:0">Forming clusters
          <span class="tiny">flagged before any lab result</span></div>
        <div style="display:flex;flex-direction:column;gap:9px">
          ${DB.clusters.map(c=>`
            <button class="cluster ${c.sev==='critical'?'critical':''}" data-act="cluster" data-v="${c.id}"
              style="border-left-color:${RISK[c.sev].c}">
              <div class="row" style="gap:7px"><span class="grow t-h3">${c.name}</span>${badge(c.sev)}</div>
              <div class="muted" style="margin-top:6px">${c.sus}</div>
              ${c.zoo?`<div class="badge b-critical" style="margin-top:9px">${MARK.critical} People are at risk — health department told</div>`:''}
              <div class="zstats" style="margin-top:11px">
                <div><div class="n tabnum">${c.villages}</div><div class="l">villages</div></div>
                <div><div class="n tabnum">${c.animals}</div><div class="l">animals</div></div>
                <div><div class="n tabnum" style="${c.deaths?'color:var(--risk-critical)':''}">${c.deaths}</div><div class="l">dead</div></div>
                <div><div class="n tabnum">${c.window.split(' ')[0]}d</div><div class="l">window</div></div>
              </div></button>`).join('')}
        </div>
        <div style="height:20px"></div>
      </div>
    </div>
  </div>`};
};

SC['o-map'] = () => ({ onav:'o-map', html:`
  <div class="body nopad hasnav">
    <div class="map">
      <svg viewBox="0 0 390 396" preserveAspectRatio="xMidYMid slice">
        <rect width="390" height="396" fill="#E9E5DA"/>
        <path d="M0 300Q90 250 180 290T390 260V396H0Z" fill="#E2DFD0"/>
        <path d="M0 120Q120 90 200 130T390 110V0H0Z" fill="#EDEAE0"/>
        <path d="M-10 210Q120 170 220 220T400 190" stroke="#D6D2C2" stroke-width="14" fill="none"/>
        <path d="M60-10Q90 140 40 260T90 410" stroke="#DCD8C9" stroke-width="9" fill="none"/>
        <path d="M300-10Q270 130 320 250T280 410" stroke="#DCD8C9" stroke-width="9" fill="none"/>
        ${[[40,60],[120,40],[240,70],[330,150],[70,190],[190,180],[300,300],[130,330],[250,350]].map(([x,y])=>
          `<g><circle cx="${x}" cy="${y}" r="2.5" fill="#A9A491"/>
           <text x="${x+6}" y="${y+3.5}" font-size="8" fill="#8E8977">village</text></g>`).join('')}
        ${DB.clusters.map(c=>`
          <g class="zone" data-act="cluster" data-v="${c.id}" style="cursor:pointer">
            <circle cx="${c.x}" cy="${c.y}" r="${c.r}" fill="${RISK[c.sev].c}" opacity=".18"/>
            <circle cx="${c.x}" cy="${c.y}" r="${c.r*.6}" fill="${RISK[c.sev].c}" opacity=".24"/>
            <circle class="pulse" cx="${c.x}" cy="${c.y}" r="8" fill="none" stroke="${RISK[c.sev].c}" stroke-width="2"/>
            <circle cx="${c.x}" cy="${c.y}" r="13" fill="${RISK[c.sev].c}"/>
            <text x="${c.x}" y="${c.y+4.5}" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">${c.villages}</text>
          </g>`).join('')}
      </svg>
      <div class="fresh">Updated 9 minutes ago · village level</div>
      <div class="legend">
        <div class="over" style="margin-bottom:6px">Risk</div>
        ${['critical','high','moderate','low'].map(k=>
          `<div class="lr"><span class="sw2" style="background:${RISK[k].c};opacity:.45"></span>${RISK[k].lb}</div>`).join('')}
      </div>
    </div>
    <div class="zrail">
      ${DB.clusters.map(c=>`
        <button class="zcard" data-act="cluster" data-v="${c.id}">
          <div class="row" style="gap:7px"><span class="t grow">${c.name}</span>${badge(c.sev)}</div>
          <div class="muted" style="margin-top:6px;font-size:13px">${c.sus}</div>
          <div class="zstats">
            <div><div class="n tabnum">${c.villages}</div><div class="l">villages</div></div>
            <div><div class="n tabnum">${c.animals}</div><div class="l">animals</div></div>
            <div><div class="n tabnum" style="${c.deaths?'color:var(--risk-critical)':''}">${c.deaths}</div><div class="l">dead</div></div>
            <div><div class="n tabnum">${c.risk}</div><div class="l">risk</div></div>
          </div></button>`).join('')}
    </div>
    <div class="pad">
      <div class="ctx"><div class="t">Why this does not zoom to a farm</div>
        <div class="d">It stops at the village on purpose. Farmers report honestly because their own farm cannot be picked out here. That honesty is the only reason this map has anything on it.</div></div>
      <div style="height:20px"></div>
    </div>
  </div>`});

SC['o-cluster'] = () => {
  const c = DB.clusters.find(x=>x.id===S.clusterId) || DB.clusters[0];
  return { chrome:false, html:`
  <div class="body">
    ${topbar({ back:true, solid:true, title:'Cluster', right:badge(c.sev) })}
    <div class="pad" style="margin-top:14px">
      <div class="t-h1" style="font-size:25px">${c.name}</div>
      <div class="muted" style="margin-top:6px">${c.sus}</div>
      ${c.zoo?`<div class="errbox" style="margin-top:13px">${ICO.alert}<span class="tx">
        <b>People are at risk here.</b> The district health department was told automatically at 06:40 this morning, with the list of villages. No farm was named.</span></div>`:''}

      <div class="lead">
        <div class="row" style="align-items:flex-start">
          <span style="color:var(--risk-low)">${ICO.clock}</span>
          <div class="grow"><div class="n tabnum">${c.lead} days early</div>
          <div class="l">Ahead of the first lab referral from this area. That is your window to move vaccine and a mobile unit before it spreads further.</div></div></div>
      </div>

      <div class="sec-t">What this is built from</div>
      <div class="card">
        ${[['Farmer reports', `${c.animals} animals across ${c.villages} villages`],
           ['Over', c.window],
           ['Deaths reported', String(c.deaths)],
           ['Vaccination cover here','61% — 26 points below the district'],
           ['Confidence', `${c.conf} · this is not a confirmed outbreak`]].map(([k,v],i)=>`
          <div class="row" style="align-items:flex-start;${i?'border-top:1px solid var(--line-soft);margin-top:11px;padding-top:11px':''}">
            <span class="muted grow">${k}</span>
            <span style="font-weight:650;font-size:14.5px;text-align:right;max-width:56%">${v}</span></div>`).join('')}
      </div>

      <div class="ctx" style="margin-top:12px"><div class="t">Village totals only</div>
        <div class="d">Twelve farms fed this. Which twelve is not available on this screen, to you, or in any export.</div></div>

      <div class="sec-t">What you can do</div>
      <div style="display:flex;flex-direction:column;gap:9px">
        ${[['truck','Send a mobile unit','Two are free within 18 km'],
           ['flask','Order lab sampling','Six samples · results in 48 hours'],
           ['vial','Move vaccine forward','Ring vaccination, 4 km radius'],
           ['mega','Send an advisory to farmers','Needs your approval before it goes']].map(([ic,tt,dd])=>`
          <button class="card" style="text-align:left;width:100%" data-act="oaction" data-v="${tt}">
            <div class="row"><span style="color:var(--brand-700)">${ICO[ic]}</span>
              <span class="grow"><span class="t-h3" style="display:block">${tt}</span>
              <span class="tiny">${dd}</span></span>
              <span style="color:var(--ink-400)">${ICO.chevR}</span></div></button>`).join('')}
      </div>
      <div class="tiny" style="margin-top:15px;line-height:1.55">
        No advisory goes out on its own. A person approves every message that reaches a farmer.</div>
      <div style="height:20px"></div>
    </div>
  </div>`};
};

SC['o-res'] = () => ({ onav:'o-res', html:`
  <div class="body hasnav">
    ${topbar({ title:'Resources', solid:true })}
    <div class="pad" style="margin-top:14px">
      <div class="sec-t" style="margin-top:0">Mobile veterinary units</div>
      <div class="card">
        <div class="row"><span class="grow"><span class="t-h3" style="display:block">Nine of twelve are out</span>
          <span class="tiny">Three idle, at Shirur and Junnar</span></span>${badge('moderate','Worth moving')}</div>
        <div class="divider"></div>
        <div class="muted" style="line-height:1.6">Two of the idle units are within 18 km of the Ahmednagar road belt. Moving them cuts about nine hours off the response there.</div>
        <button class="btn btn-p btn-sm" style="width:100%;margin-top:13px"
          data-act="oaction" data-v="Moving two mobile units">Move them</button>
      </div>

      <div class="sec-t">Vaccine stock against forecast</div>
      <div class="card">
        ${[['FMD',82,'var(--risk-low)','About 8 weeks left'],
           ['HS',34,'var(--risk-high)','Two and a half weeks — reorder now'],
           ['Brucella',61,'var(--risk-moderate)','About 5 weeks left']].map(([n,v,c,s])=>`
          <div style="margin-bottom:15px">
            <div class="row"><span class="grow" style="font-weight:600;font-size:14.5px">${n}</span>
              <span class="tiny">${s}</span></div>
            <div class="pbar" style="margin-top:7px"><i style="width:${v}%;background:${c}"></i></div></div>`).join('')}
        <div class="tiny" style="line-height:1.55">Forecast from cluster risk, not from last year's usage. HS demand is climbing in the belt where the cluster sits.</div>
      </div>

      <div class="sec-t">How the load is spread</div>
      <div class="card">
        ${[['Dr. R. Deshmukh','Haveli',12,'var(--risk-high)'],
           ['Dr. S. Kadam','Shirur',5,'var(--risk-low)'],
           ['Dr. P. Jagtap','Junnar',9,'var(--risk-moderate)']].map(([n,b,c,col],i)=>`
          <div class="row" style="padding:9px 0;${i?'border-top:1px solid var(--line-soft)':''}">
            <span class="grow"><span style="font-weight:650;font-size:15px;display:block">${n}</span>
            <span class="tiny">${b} block</span></span>
            <span class="tabnum" style="font-size:20px;font-weight:700;color:${col}">${c}</span>
            <span class="tiny">open</span></div>`).join('')}
      </div>
      <div style="height:20px"></div>
    </div>
  </div>`});

SC['o-me'] = () => ({ onav:'o-me', html:`
  <div class="body hasnav">
    ${topbar({ title:'You', solid:true })}
    <div class="pad" style="margin-top:14px">
      <div class="card"><div class="row"><img class="avatar lg" src="${DB.officer.img}" alt="${DB.officer.name}">
        <div class="grow"><div style="font-weight:700;font-size:18px;letter-spacing:-.02em">${DB.officer.name}</div>
        <div class="muted">${DB.officer.role}</div>
        <div class="tiny" style="margin-top:3px">${DB.officer.district} · ${DB.officer.blocks} blocks</div></div></div></div>
      <div class="sec-t">Is this working?</div>
      <div class="card">
        <div class="over">Time from first sign to first action</div>
        <div class="row" style="gap:9px;margin-top:7px">
          <span style="font-size:34px;font-weight:700;letter-spacing:-.035em" class="tabnum">11</span>
          <span class="muted" style="margin-bottom:5px">hours, typically</span>
          <span class="delta up">▼ from 4 days</span></div>
        <div class="tiny" style="margin-top:9px;line-height:1.55">
          The one number this whole system exists to move. Everything else on these screens is in service of it.</div>
      </div>
      <div class="sec-t">Exports</div>
      <div class="group">
        ${[['Monthly NADCP return','Ready for 31 August'],['Case-level data','Village aggregate only'],
           ['Vaccination coverage','By block and by disease']].map(([k,v])=>`
          <button class="grow-row" data-act="toast" data-v="${k} — would download.">
            <span class="grow"><span style="font-size:15.5px;font-weight:600;display:block">${k}</span>
            <span class="tiny">${v}</span></span>
            <span style="color:var(--ink-400)">${ICO.chevR}</span></button>`).join('')}
      </div>
      <div style="height:20px"></div>
    </div>
  </div>`});

/* ============================================================
   STATE DEMOS
   ============================================================ */
SC['s-loading'] = () => ({ nav:'f-home', html:`
  <div class="body hasnav">
    <div class="greet"><div class="hi">${t('good')}</div><div class="nm">Kale Farm</div></div>
    <div class="pad" style="margin-top:18px">
      <div class="skel" style="height:12px;width:140px"></div>
      <div style="display:flex;flex-direction:column;gap:9px;margin-top:14px">
        ${[0,1].map(()=>`<div class="sk-card">
          <div class="skel" style="width:52px;height:52px;border-radius:14px;flex:none"></div>
          <div class="grow"><div class="skel" style="height:15px;width:58%"></div>
          <div class="skel" style="height:11px;width:86%;margin-top:9px"></div>
          <div class="skel" style="height:11px;width:44%;margin-top:6px"></div></div></div>`).join('')}
      </div>
      <div class="skel" style="height:12px;width:100px;margin-top:26px"></div>
      <div class="qa" style="margin-top:12px">${[0,1,2,3].map(()=>`<div class="skel" style="height:78px;border-radius:14px"></div>`).join('')}</div>
      <div class="skel" style="height:12px;width:120px;margin-top:26px"></div>
      <div class="skel" style="height:100px;margin-top:12px;border-radius:16px"></div>
    </div>
  </div>`, after: () => setTimeout(()=>{ if(S.screen==='s-loading') go('f-home','replace'); }, 2200)});

SC['s-error'] = () => ({ nav:'f-home', html:`
  <div class="body hasnav">
    ${topbar({ title:t('home') })}
    <div class="pad">
      <div class="errbox">${ICO.alert}<span class="tx">
        <b>We could not refresh.</b> The server did not answer. You are looking at what was saved on your phone at 7:12 this morning — all of it still works.</span></div>
      <div class="row" style="gap:8px;margin-top:12px">
        <button class="btn btn-s btn-sm grow" data-go="s-loading">Try again</button>
        <button class="btn btn-g btn-sm grow" data-act="root" data-v="f-home">Use what is saved</button>
      </div>
      <div class="sec-t">Saved on this phone <span class="tiny">7:12 AM</span></div>
      <div class="attn"><div class="attn-in"><img class="avatar" src="${IMG.cow}" alt="">
        <div class="grow"><div class="row" style="gap:7px"><span class="attn-t">Lakshmi</span>
          ${badge('high','See a vet today')}</div>
        <div class="attn-d">Off feed for two days, with discharge from her nose.</div></div></div>
        <div class="attn-a"><button class="btn btn-p btn-sm grow" data-go="f-case">Open the case</button></div></div>
      <div class="guide">A failed refresh never empties the screen. Old information with an honest timestamp beats a blank page every time.</div>
    </div>
  </div>`});

SC['s-critical'] = () => ({ nav:'f-home', html:`
  <div class="body hasnav">${topbar({ title:t('home') })}
    <div class="pad"><div class="tiny">A critical interrupt is showing over this screen.</div></div>
  </div>`, after: () => showInterrupt()});

/* ============================================================
   ROUTER — one back stack, no screen hardcodes its parent
   ============================================================ */
const ROOTS = new Set(['f-home','f-herd','f-alerts','f-profile',
  'v-queue','v-route','v-drives','v-me','o-overview','o-map','o-res','o-me']);
const TRANSIENT = new Set(['f-splash','f-lang','f-onboard','f-login','f-assessing','s-loading']);
const defaultRoot = () => S.role==='vet' ? 'v-queue' : S.role==='officer' ? 'o-overview' : 'f-home';

function paint(dir){
  const out = SC[S.screen]();
  let html = out.html;
  if(out.nav)  html += nav(out.nav);
  if(out.vnav) html += vnav(out.vnav);
  if(out.onav) html += onav(out.onav);
  const div = document.createElement('div');
  div.className = 'screen active ' + (dir==='b' ? 'in-b' : 'in-f');
  div.innerHTML = html;
  vp().innerHTML = '';
  vp().appendChild(div);
  document.body.classList.toggle('lang-mr', S.lang==='mr');
  $('#sb').className = 'statusbar' + (out.light ? ' light' : '');
  $('#sb-net').innerHTML = S.offline ? '<span style="opacity:.55">no signal</span>' : '▮▮▮';
  if(out.after) out.after();
  syncJump();
}
function go(id, mode){
  if(!SC[id]) return;
  if(mode !== 'replace' && S.screen !== id && !TRANSIENT.has(S.screen)) S.hist.push(S.screen);
  else if(mode === 'replace' && S.hist[S.hist.length-1] === id) S.hist.pop();
  S.screen = id;
  paint('f');
}
function back(){
  let prev = S.hist.pop();
  while(prev && TRANSIENT.has(prev)) prev = S.hist.pop();
  S.screen = prev || defaultRoot();
  paint('b');
}
/* "Close" abandons a flow and returns to wherever the flow was started from,
   which is not necessarily the previous screen. */
function closeFlow(){
  const origin = S.flowOrigin || defaultRoot();
  const i = S.hist.lastIndexOf(origin);
  if(i >= 0) S.hist.length = i;
  S.screen = origin;
  S.flowOrigin = null;
  paint('b');
}
function root(id){ S.hist = []; S.screen = id; paint('f'); }
function rerender(){
  const out = SC[S.screen]();
  let html = out.html;
  if(out.nav)  html += nav(out.nav);
  if(out.vnav) html += vnav(out.vnav);
  if(out.onav) html += onav(out.onav);
  const d = vp().querySelector('.screen');
  if(!d) return paint('f');
  d.innerHTML = html;
  document.body.classList.toggle('lang-mr', S.lang==='mr');
  $('#sb').className = 'statusbar' + (out.light ? ' light' : '');
  $('#sb-net').innerHTML = S.offline ? '<span style="opacity:.55">no signal</span>' : '▮▮▮';
  if(out.after) out.after();
}
function syncJump(){
  document.querySelectorAll('.jump').forEach(x =>
    x.classList.toggle('on', x.dataset.screen === S.screen));
}

/* ---------------- transient UI ---------------- */
let toastT, pillT;
function toast(msg){ const el=$('#toast'); el.innerHTML = `${ICO.check}<span>${msg}</span>`;
  el.classList.add('show'); clearTimeout(toastT);
  toastT = setTimeout(()=>el.classList.remove('show'), 2800); }
function pill(html, ms){ const el=$('#pill'); el.innerHTML = html; el.classList.add('show');
  clearTimeout(pillT); pillT = setTimeout(()=>el.classList.remove('show'), ms||3400); }
function sheet(html){ $('#sheet').innerHTML = `<div class="grab"></div>${html}`;
  $('#sheet').classList.add('show'); $('#scrim').classList.add('show'); }
function closeSheet(){ $('#sheet').classList.remove('show'); $('#scrim').classList.remove('show'); }
function showInterrupt(){
  $('#interrupt').innerHTML = `
    <div class="ic">${ICO.alert}</div>
    <h3>An animal has died</h3>
    <p>We have stopped the questions. A veterinarian is being alerted right now, and the block office has been told.</p>
    <p style="font-size:13.5px;opacity:.85">Do not move the carcass. Keep the others away from that spot, and away from the same water.</p>
    <div style="margin-top:28px;display:flex;flex-direction:column;gap:9px">
      <button class="btn" style="background:#fff;color:var(--risk-critical)" data-act="closeint" data-v="send">Send an urgent request</button>
      <button class="btn" style="background:rgba(255,255,255,.16);color:#fff" data-act="closeint" data-v="call">${ICO.phone} Call 1962 now</button>
    </div>`;
  $('#interrupt').classList.add('show');
}

const SHEETS = {
  wrong: `
    <h3>What does not match?</h3>
    <p class="muted" style="margin-top:9px;line-height:1.6">Tell us, and a veterinarian reads it. This is how it gets better — and you will not be the first person to disagree with it.</p>
    <div class="pick" style="margin-top:18px">
      ${['She looks worse than this says','She looks better than this says',
         'These are not the signs I meant','I picked the wrong animal'].map(x=>
        `<button class="pk" data-act="wrongpick" data-v="${x}"><span class="box">${ICO.check}</span>
        <span class="grow">${x}</span></button>`).join('')}
    </div>`,
  nearby: `
    <h3>Three farms near you reported the same signs</h3>
    <p class="muted" style="margin-top:9px;line-height:1.6">Fever and a runny nose, within about 4 km, over eleven days. That is not an outbreak. It is a reason to be careful this week.</p>
    <div class="sec-t">Worth doing</div>
    ${[['Keep anything new apart for a week','Bought, borrowed, or brought back from a fair.'],
       ['Do not share water troughs','The most common way this travels between herds.'],
       ["Get Tulsi's booster done",'Twenty-three days late. The round reaches Wadgaon on 3 September.']]
      .map(([a,b])=>`<div class="card flat" style="margin-bottom:9px"><div class="t-h3">${a}</div>
        <div class="muted" style="margin-top:5px">${b}</div></div>`).join('')}
    <button class="btn btn-g" style="margin-top:8px" data-act="closesheet">Close</button>`,
  privacy: `
    <h3>Who sees your reports</h3>
    <div style="margin-top:16px">
      ${[[1,'Your veterinarian','Your report, your photos, your animals’ records, and where your farm is — so he can actually reach you.'],
         [1,'The block office','How many cases are open and where they have got to. Not your photos.'],
         [0,'The district dashboard','Wadgaon. Not your farm, not your name, not your number.'],
         [0,'Other farmers','Nothing about you at all. Nearby reports appear to them as counts.'],
         [0,'Anyone selling anything','No access whatsoever. Nothing here is for sale, and it never will be.']]
        .map(([yes,k,d])=>`<div class="row" style="align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--line-soft)">
          <span style="color:${yes?'var(--risk-low)':'var(--ink-400)'};margin-top:2px">${yes?ICO.check:ICO.lock}</span>
          <span class="grow"><span class="t-h3" style="display:block">${k}</span>
          <span class="muted" style="line-height:1.55">${d}</span></span></div>`).join('')}
    </div>
    <p class="tiny" style="margin-top:16px;line-height:1.6">Reporting a sick animal has never brought an inspection or a culling order through this app. It is not built to, and that is deliberate.</p>
    <button class="btn btn-g" style="margin-top:16px" data-act="closesheet">Close</button>`
};

/* ============================================================
   EVENTS
   ============================================================ */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if(a && handle(a.dataset.act, a.dataset.v, a)) return;
  const g = e.target.closest('[data-go]');
  if(g) go(g.dataset.go);
});
document.addEventListener('input', e => {
  if(e.target.id === 'login-phone'){
    S.loginPhone = e.target.value;
    if(S.loginErr) S.loginErr = false;
  }
  if(e.target.id === 'hq'){
    S.herdQ = e.target.value;
    const y = vp().querySelector('.body').scrollTop;
    rerender();
    const i = $('#hq'); if(i){ i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
    vp().querySelector('.body').scrollTop = y;
  }
});

function handle(act, v, node){
  switch(act){
    case 'noop': return true;
    case 'back':  back(); return true;
    case 'close': closeFlow(); return true;
    case 'root':  root(v); return true;

    case 'setlang': S.lang = v; syncPanel(); rerender(); return true;
    case 'setlang-toggle': S.lang = S.lang==='en' ? 'mr' : S.lang==='mr' ? 'hi' : 'en'; syncPanel(); rerender(); return true;
    case 'onbnext': if(S.onboardIdx < 2){ S.onboardIdx++; rerender(); } else go('f-login'); return true;
    case 'login':
      if(S.loginBusy) return true;
      const phoneEl = $('#login-phone');
      const val = phoneEl ? phoneEl.value.trim() : (S.loginPhone || '');
      if(!val || val.length < 5){
        S.loginErr = true;
        rerender();
        return true;
      }
      S.loginErr = false;
      S.loginBusy = true;
      rerender();
      setTimeout(()=>{
        S.loginBusy = false;
        toast('Signed in successfully as Arpit Kale.');
        root('s-loading');
      }, 700);
      return true;

    case 'startreport':
      S.flowOrigin = S.screen;
      S.sel = { symptoms:['fever','nasal','appetite'], animal:'a1', others:0, deaths:0,
                since:'2–3 days', photos:[], vacc:null, human:null, voice:false };
      S.plan = [false,false,false,false];
      go('f-r1'); return true;
    case 'sym': { const i = S.sel.symptoms.indexOf(v);
      i >= 0 ? S.sel.symptoms.splice(i,1) : S.sel.symptoms.push(v); rerender(); return true; }
    case 'voice':
      S.sel.voice = !S.sel.voice; rerender();
      if(S.sel.voice) setTimeout(()=>{ S.sel.voice = false;
        ['fever','appetite','nasal'].forEach(x=>{ if(!S.sel.symptoms.includes(x)) S.sel.symptoms.push(x); });
        if(S.screen==='f-r1'){ rerender(); toast('Heard: fever, not eating, runny nose.'); }
      }, 2600);
      return true;
    case 'pickanimal': S.sel.animal = v; rerender(); return true;
    case 'others': S.sel.others = Math.max(0, S.sel.others + (+v)); rerender(); return true;
    case 'deaths': S.sel.deaths = Math.max(0, S.sel.deaths + (+v)); rerender(); return true;
    case 'deathpath': showInterrupt(); return true;
    case 'closeint':
      $('#interrupt').classList.remove('show');
      if(v === 'call') toast('Calling 1962, the animal helpline.');
      else go('f-vetreq');
      return true;
    case 'addphoto': {
      const pool = [IMG.cow, IMG.mouth, IMG.hoof];
      S.sel.photos.push(pool[S.sel.photos.length % 3]); rerender();
      if(S.offline) pill(`<span class="sp"></span>Photo saved on your phone. It will send itself.`);
      return true; }
    case 'rmphoto': S.sel.photos.splice(+v,1); rerender(); return true;
    case 'skipphoto': S.sel.photos = []; go('f-r4'); return true;
    case 'since': S.sel.since = v; rerender(); return true;
    case 'vaccq': S.sel.vacc = v; rerender(); return true;
    case 'humanq': S.sel.human = v; rerender();
      if(v !== 'Nobody') toast('Noted. The health department is told only if this is confirmed.');
      return true;
    case 'assess': go('f-assessing'); return true;
    case 'acc': { const el = document.getElementById(v); if(el) el.classList.toggle('open'); return true; }
    case 'plan': S.plan[+v] = !S.plan[+v]; rerender(); return true;
    case 'sendvet':
      if(S.offline){
        S.pending.unshift({ id:'p'+Date.now(), t:'Request · Lakshmi', s:'Just now', st:'wait', lbl:'Waiting' });
        pill(`<span class="sp"></span>Saved. It will go the moment you have signal.`, 4200);
      } else {
        pill(`${ICO.check}Sent to Dr. Deshmukh. He usually replies within three hours.`, 4000);
      }
      go('f-case'); return true;
    case 'callvet': toast('Calling 1962, the animal helpline.'); return true;

    case 'openaddanimal':
      S.addAnimalState = { species:'Cattle', breed:'HF Cross', img:'/images/cow_lakshmi.png' };
      go('f-add-animal');
      return true;
    case 'addspec':
      if(!S.addAnimalState) S.addAnimalState = {};
      S.addAnimalState.species = v;
      document.querySelectorAll('#add-species-segs .seg').forEach(b => b.classList.toggle('on', b.dataset.v === v));
      return true;
    case 'addbreed':
      if(!S.addAnimalState) S.addAnimalState = {};
      S.addAnimalState.breed = v;
      document.querySelectorAll('#add-breed-segs .seg').forEach(b => b.classList.toggle('on', b.dataset.v === v));
      return true;
    case 'addimg':
      if(!S.addAnimalState) S.addAnimalState = {};
      S.addAnimalState.img = v;
      document.querySelectorAll('[data-act="addimg"]').forEach(b => b.classList.toggle('on', b.dataset.v === v));
      return true;
    case 'saveanimal': {
      const nameInp = $('#add-name');
      const tagInp = $('#add-tag');
      const sexInp = $('#add-sex');
      const ageInp = $('#add-age');

      const name = (nameInp && nameInp.value.trim()) || 'New Animal';
      const tag = (tagInp && tagInp.value.trim()) || ('274 8891 00' + Math.floor(10 + Math.random() * 80));
      const sex = (sexInp && sexInp.value) || 'Female';
      const age = (ageInp && ageInp.value.trim()) || '3 yr';
      const spec = (S.addAnimalState && S.addAnimalState.species) || 'Cattle';
      const brd = (S.addAnimalState && S.addAnimalState.breed) || 'HF Cross';
      const image = (S.addAnimalState && S.addAnimalState.img) || '/images/cow_lakshmi.png';

      const newAnimal = {
        id: 'a' + (DB.animals.length + 1),
        name: name,
        tag: tag,
        species: spec,
        breed: brd,
        sex: sex,
        age: age,
        img: image,
        status: 'healthy',
        risk: 'low',
        riskLabel: 'Fine',
        yield: 7.5,
        baseline: 7.5,
        yieldDelta: 0,
        vacc: 100,
        note: 'Recently registered animal.',
        caseId: null
      };

      DB.animals.unshift(newAnimal);
      S.forceEmptyHerd = false;
      S.animalId = newAnimal.id;
      S.animalTab = 'history';

      toast(`Added ${name} (Tag ${tag}) to your herd!`);
      go('f-animal', 'replace');
      return true;
    }

    case 'viewanimal': S.animalId = v; S.animalTab = 'history'; go('f-animal'); return true;
    case 'atab': S.animalTab = v; rerender(); return true;
    case 'herdfilter': S.herdFilter = v; S.forceEmptyHerd = false; rerender(); return true;
    case 'clearherd': S.herdFilter = 'All'; S.herdQ = ''; S.forceEmptyHerd = false; rerender(); return true;
    case 'alertfilter': S.alertFilter = v; rerender(); return true;
    case 'qfilter': S.qFilter = v; rerender(); return true;
    case 'vcase': S.caseId = v; go('v-case'); return true;
    case 'vaction': toast(v); setTimeout(()=>back(), 900); return true;
    case 'cluster': S.clusterId = v; go('o-cluster'); return true;
    case 'oaction': sheet(`
      <h3>${v}</h3>
      <p class="muted" style="margin-top:9px;line-height:1.6">This is logged against the cluster, the assigned officers are told, and it appears in the district action record. Nothing reaches a farmer without your approval.</p>
      <button class="btn btn-p" style="margin-top:20px" data-act="confirmo" data-v="${v}">Confirm</button>
      <button class="btn btn-g" style="margin-top:9px" data-act="closesheet">Cancel</button>`);
      return true;
    case 'confirmo': closeSheet(); toast(v + ' — logged.'); return true;
    case 'retry': { const p = S.pending.find(x=>x.id===v);
      if(p){ p.st='wait'; p.lbl='Trying'; rerender();
        setTimeout(()=>{ p.st='ok'; p.lbl='Sent';
          if(S.screen==='f-profile') rerender(); toast('The photo went through.'); }, 1400); }
      return true; }
    case 'sheet': sheet(SHEETS[v]); return true;
    case 'wrongpick': closeSheet(); toast('Sent for a veterinarian to look at. Thank you.'); return true;
    case 'closesheet': closeSheet(); return true;
    case 'toast': toast(v); return true;
  }
  return false;
}
$('#scrim').addEventListener('click', closeSheet);

/* ============================================================
   DIRECTOR PANEL
   ============================================================ */
const MENU = {
  farmer:[['f-splash','Splash'],['f-lang','Choose a language'],['f-onboard','Onboarding'],
          ['f-login','Sign in, and its error'],['f-home','Home · needs you today'],['f-herd','My animals'],
          ['f-add-animal','Add an animal'],['f-animal','One animal'],['f-r1','Report 1 · what you saw'],['f-r2','Report 2 · which animal'],
          ['f-r3','Report 3 · photos'],['f-r4','Report 4 · context'],['f-assessing','Working it out'],
          ['f-assessment','What we think'],['f-plan','What to do now'],['f-vetreq','Ask for a vet'],
          ['f-case','Tracking the case'],['f-alerts','Alerts'],['f-profile','You · sending']],
  vet:[['v-queue','Triage queue'],['v-case','A case in full'],['v-route',"Today's route"],
       ['v-drives','Vaccination round'],['v-me','Am I being wasted?']],
  officer:[['o-overview','District overview'],['o-map','Risk map'],['o-cluster','One cluster'],
           ['o-res','Resources'],['o-me','Is it working?']],
  states:[['s-loading','Loading'],['s-error','Refresh failed'],['s-critical','A death is reported'],
          ['emptyherd','Empty herd'],['allclear','Home · nothing wrong'],['emptyalerts','Alerts · empty filter']]
};
function buildPanel(){
  [['nav-farmer','farmer'],['nav-vet','vet'],['nav-officer','officer'],['nav-states','states']].forEach(([el,k])=>{
    const c = document.getElementById(el);
    c.querySelectorAll('.jump').forEach(x=>x.remove());
    MENU[k].forEach(([id,label],i)=>{
      const b = document.createElement('button');
      b.className = 'jump';
      b.dataset.screen = id;
      b.innerHTML = `<span class="n">${String(i+1).padStart(2,'0')}</span><span>${label}</span>`;
      b.addEventListener('click', ev => {
        ev.stopPropagation();
        S.forceEmptyHerd = false; S.allClear = false;
        if(S.alertFilter === '__none') S.alertFilter = 'All';
        if(id === 'emptyherd'){ S.forceEmptyHerd = true; setRole('farmer', true); root('f-herd'); return; }
        if(id === 'allclear'){  S.allClear = true;       setRole('farmer', true); root('f-home'); return; }
        if(id === 'emptyalerts'){ setRole('farmer', true); S.alertFilter = '__none'; root('f-alerts'); return; }
        if(/^f-(r[1-4]|assess|plan|vetreq)/.test(id)){
          S.flowOrigin = 'f-home';
          S.sel = { symptoms:['fever','nasal','appetite'], animal:'a1', others:1, deaths:0,
                    since:'2–3 days', photos:[IMG.cow, IMG.mouth], vacc:'Some of them',
                    human:null, voice:false };
        }
        setRole(id.startsWith('v-') ? 'vet' : id.startsWith('o-') ? 'officer' : 'farmer', true);
        root(id);
      });
      c.appendChild(b);
    });
  });
}
function setRole(r, quiet){
  S.role = r;
  document.querySelectorAll('.role button').forEach(b => b.classList.toggle('on', b.dataset.role === r));
  $('#devnote').textContent = {
    farmer:'Farmer · Arpit Kale, six animals in Wadgaon. One case is already open — this is a farm mid-season, not a fresh install.',
    vet:'Veterinarian · Dr. Deshmukh covers eleven villages. The queue is sorted by how serious a case is, not by who called first.',
    officer:'District officer · Dr. Kulkarni. Every screen here stops at the village. Nothing resolves an individual farm.'
  }[r];
  if(!quiet) root(defaultRoot());
}
document.querySelectorAll('.role button').forEach(b =>
  b.addEventListener('click', ()=>{ S.forceEmptyHerd = false; S.allClear = false;
    if(S.alertFilter === '__none') S.alertFilter = 'All'; setRole(b.dataset.role); }));

function syncPanel(){
  const langNames = { en: 'English', mr: 'मराठी', hi: 'हिंदी' };
  $('#langv').textContent = langNames[S.lang] || 'English';
  $('#tog-lang').classList.toggle('on', S.lang !== 'en');
}
$('#tog-lang').addEventListener('click', ()=>{ S.lang = S.lang==='en' ? 'mr' : S.lang==='mr' ? 'hi' : 'en'; syncPanel(); rerender(); });
$('#tog-off').addEventListener('click', ()=>{
  S.offline = !S.offline;
  $('#tog-off').classList.toggle('on', S.offline);
  rerender();
  if(S.offline) pill(`${ICO.wifi}No signal. Your reports are saved on this phone.`, 3600);
  else {
    pill(`<span class="sp"></span>Back in range — sending what was waiting`, 2000);
    setTimeout(()=>{ S.pending.forEach(p=>{ if(p.st==='wait'){ p.st='ok'; p.lbl='Sent'; } });
      pill(`${ICO.check}Everything has gone through.`, 2200);
      if(S.screen==='f-profile') rerender(); }, 2100);
  }
});
$('#tog-rm').addEventListener('click', ()=>{
  S.reduced = !S.reduced;
  $('#tog-rm').classList.toggle('on', S.reduced);
  document.body.classList.toggle('rm', S.reduced);
});
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  S.reduced = true; document.body.classList.add('rm'); $('#tog-rm').classList.add('on');
}

buildPanel(); syncPanel(); setRole('farmer', true); root('f-splash');
