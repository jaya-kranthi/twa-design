/* TWA Weather Data Marketplace — prototype app
 * Pure vanilla JS. Hash router + per-role nav (full re-render) + theme + sample data.
 */
'use strict';

/* ---------------- tiny DOM helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else if (v != null) n.setAttribute(k, v);
  }
  for (const kid of kids.flat()) if (kid != null) n.append(kid.nodeType ? kid : document.createTextNode(kid));
  return n;
}
const ICONS = {
  grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  catalog:'M4 6h16M4 12h16M4 18h10', users:'M16 11a4 4 0 10-8 0 4 4 0 008 0zM3 21a7 7 0 0114 0',
  card:'M3 6h18v12H3zM3 10h18', download:'M12 3v12m0 0l-4-4m4 4l4-4M4 21h16',
  doc:'M6 2h9l5 5v15H6zM14 2v6h6', building:'M4 21h16M6 21V5h6v16M12 9h6v12M9 9h.01M9 13h.01',
  check:'M5 13l4 4L19 7', cog:'M12 9a3 3 0 100 6 3 3 0 000-6zM19 12l2 1-2 4-2-1a7 7 0 01-2 1l-1 2h-4l-1-2a7 7 0 01-2-1l-2 1-2-4 2-1a7 7 0 010-2l-2-1 2-4 2 1a7 7 0 012-1l1-2h4l1 2a7 7 0 012 1l2-1 2 4-2 1a7 7 0 010 2z',
  bolt:'M13 2L4 14h7l-2 8 9-12h-7z', key:'M21 2l-2 2m-3 3a4 4 0 11-6 6l-5 5v3h3l5-5a4 4 0 016-6zM15 9l2 2',
  chart:'M4 20V10M10 20V4M16 20v-7M22 20H2', inbox:'M3 13h5l1 3h6l1-3h5M3 13l3-8h12l3 8v6H3z',
  layers:'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5', shield:'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z'
};
function icon(name){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','ic');s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','2');s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',ICONS[name]||ICONS.grid);s.append(p);return s;}

/* ---------------- sample data ---------------- */
const CATEGORIES=['Precipitation','Temperature','Wind','Storm tracks','Sea surface','Humidity'];
const REGIONS=['Caribbean','North Atlantic','Gulf of Mexico','Pacific NW','Global','South Asia'];
const DATASETS=[
  {id:'ds-1042',name:'Caribbean Daily Rainfall',category:'Precipitation',region:'Caribbean',time:'2019–2024',ver:'v7',updated:'2026-06-09',life:'published',size:'2.4 GB',entitled:true},
  {id:'ds-1039',name:'North Atlantic Storm Tracks',category:'Storm tracks',region:'North Atlantic',time:'2015–2024',ver:'v12',updated:'2026-06-07',life:'published',size:'860 MB',entitled:true},
  {id:'ds-1051',name:'Gulf Sea-Surface Temp',category:'Sea surface',region:'Gulf of Mexico',time:'2020–2024',ver:'v4',updated:'2026-06-05',life:'published',size:'5.1 GB',entitled:false},
  {id:'ds-1033',name:'Pacific NW Wind Profiles',category:'Wind',region:'Pacific NW',time:'2018–2024',ver:'v9',updated:'2026-05-30',life:'published',size:'1.2 GB',entitled:true},
  {id:'ds-1060',name:'Global Humidity Reanalysis',category:'Humidity',region:'Global',time:'2010–2024',ver:'v3',updated:'2026-05-28',life:'deprecated',size:'12.8 GB',entitled:false},
  {id:'ds-1024',name:'South Asia Monsoon Index',category:'Precipitation',region:'South Asia',time:'2012–2024',ver:'v15',updated:'2026-05-21',life:'published',size:'640 MB',entitled:true},
  {id:'ds-1066',name:'Atlantic Hurricane Intensity',category:'Storm tracks',region:'North Atlantic',time:'2000–2024',ver:'v2',updated:'2026-05-18',life:'draft',size:'430 MB',entitled:false},
  {id:'ds-1019',name:'Caribbean SST Anomalies',category:'Sea surface',region:'Caribbean',time:'2016–2024',ver:'v6',updated:'2026-05-12',life:'published',size:'3.3 GB',entitled:true},
];
const MEMBERS=[
  {name:'Maria Alvarez',email:'m.alvarez@northwind-re.com',role:'Org Admin',status:'active',last:'2 min ago'},
  {name:'Devin Park',email:'d.park@northwind-re.com',role:'Org User',status:'active',last:'1 h ago'},
  {name:'Lena Fischer',email:'l.fischer@northwind-re.com',role:'Org User',status:'active',last:'yesterday'},
  {name:'Omar Haddad',email:'o.haddad@northwind-re.com',role:'Org User',status:'pending',last:'—'},
  {name:'Sara Lindqvist',email:'s.lindqvist@northwind-re.com',role:'Org User',status:'deactivated',last:'3 wk ago'},
];
const PLANS=[
  {name:'Starter',cats:2,users:5,downloads:200,orgs:14},
  {name:'Growth',cats:4,users:20,downloads:2000,orgs:9},
  {name:'Enterprise',cats:6,users:100,downloads:25000,orgs:5},
];
const TENANTS=[
  {id:'org-204',name:'Northwind Re',plan:'Growth',members:12,status:'active',created:'2026-03-14'},
  {id:'org-211',name:'Meridian Logistics',plan:'Enterprise',members:48,status:'active',created:'2026-02-02'},
  {id:'org-233',name:'Cayman Agritech',plan:'Starter',members:4,status:'pending',created:'2026-06-10'},
  {id:'org-198',name:'Atlas Shipping',plan:'Growth',members:21,status:'suspended',created:'2025-11-20'},
  {id:'org-241',name:'Helios Energy',plan:'Enterprise',members:33,status:'active',created:'2026-01-09'},
];
const APPROVALS_ORG=[
  {org:'Cayman Agritech',contact:'ops@cayman-agritech.com',tier:'Starter',submitted:'2 h ago'},
  {org:'Blue Harbor Insurance',contact:'data@blueharbor.com',tier:'Growth',submitted:'5 h ago'},
  {org:'Tradewind Analytics',contact:'admin@tradewind.io',tier:'Enterprise',submitted:'1 d ago'},
];
const APPROVALS_PLAN=[
  {org:'Northwind Re',from:'Growth',to:'Enterprise',submitted:'3 h ago'},
  {org:'Helios Energy',from:'Enterprise',to:'Growth',submitted:'1 d ago'},
];
const INGESTION=[
  {ds:'Caribbean Daily Rainfall',ver:'v7',status:'succeeded',at:'2026-06-09 04:12',size:'2.4 GB',err:''},
  {ds:'North Atlantic Storm Tracks',ver:'v12',status:'succeeded',at:'2026-06-07 03:50',size:'860 MB',err:''},
  {ds:'Gulf Sea-Surface Temp',ver:'v5',status:'failed',at:'2026-06-06 03:44',size:'—',err:'Schema validation: missing required field `grid_resolution` in metadata.'},
  {ds:'South Asia Monsoon Index',ver:'v15',status:'succeeded',at:'2026-05-21 04:01',size:'640 MB',err:''},
];
const DOWNLOADS=[
  {ds:'Caribbean Daily Rainfall',ver:'v7',size:'2.4 GB',at:'2026-06-10 09:21',src:'portal'},
  {ds:'South Asia Monsoon Index',ver:'v15',size:'640 MB',at:'2026-06-09 14:03',src:'api'},
  {ds:'Pacific NW Wind Profiles',ver:'v9',size:'1.2 GB',at:'2026-06-08 11:40',src:'portal'},
];
const NOTIFS=[
  {t:'Plan-change request from Northwind Re',time:'3 h ago',type:'approval'},
  {t:'Ingestion failed: Gulf Sea-Surface Temp v5',time:'6 h ago',type:'error'},
  {t:'New org application: Cayman Agritech',time:'8 h ago',type:'approval'},
  {t:'Subscription renews in 9 days',time:'1 d ago',type:'info'},
];

/* ---------------- role + nav ---------------- */
let ROLE = 'user';
const ROLE_LABELS={user:'Org User',admin:'Org Admin',super:'Super Admin'};
const ROLE_LANDING={user:'#/dashboard',admin:'#/dashboard',super:'#/super/dashboard'};
const NAV_BY_ROLE={
  user:[
    {r:'#/dashboard',label:'Dashboard',icon:'grid'},
    {r:'#/catalog',label:'Catalog',icon:'catalog'},
    {r:'#/downloads',label:'My downloads',icon:'download'},
    {r:'#/reports',label:'Reports',icon:'chart'},
  ],
  admin:[
    {r:'#/dashboard',label:'Dashboard',icon:'grid'},
    {r:'#/catalog',label:'Catalog',icon:'catalog'},
    {r:'#/members',label:'Members',icon:'users',count:'12'},
    {r:'#/subscription',label:'Subscription',icon:'card'},
    {r:'#/reports',label:'Reports',icon:'chart'},
  ],
  super:[
    {r:'#/super/dashboard',label:'Platform overview',icon:'grid'},
    {r:'#/super/tenants',label:'Tenants',icon:'building'},
    {r:'#/super/approvals',label:'Approvals',icon:'inbox',count:'5'},
    {r:'#/super/plans',label:'Plans',icon:'card'},
    {r:'#/catalog',label:'Catalog',icon:'catalog'},
    {r:'#/super/governance',label:'Governance',icon:'shield'},
    {group:'Developer'},
    {r:'#/super/ingestion',label:'Ingestion',icon:'bolt'},
    {r:'#/super/api-key',label:'Platform key',icon:'key'},
    {r:'#/super/reports',label:'Reports',icon:'chart'},
  ],
};
// which roles may see each base view (route → roles)
const ROUTE_ROLES={
  'dashboard':['user','admin'],'super/dashboard':['super'],'onboarding':['admin'],
  'catalog':['user','admin','super'],'catalog/dataset':['user','admin','super'],
  'downloads':['user','admin'],'members':['admin'],'subscription':['admin'],
  'super/plans':['super'],'super/tenants':['super'],'super/tenants/detail':['super'],
  'super/approvals':['super'],'super/governance':['super'],'super/ingestion':['super'],
  'super/api-key':['super'],'settings/api-key':['admin'],'reports':['user','admin'],'super/reports':['super'],
  'notifications':['user','admin','super'],
  'settings/profile':['user','admin','super'],'settings/password':['user','admin','super'],
  'settings/appearance':['user','admin','super'],'settings/notifications':['user','admin','super'],
  'settings/org':['admin'],'403':['user','admin','super'],'404':['user','admin','super'],
};

function renderNav(){
  const items=NAV_BY_ROLE[ROLE].map(it=>{
    if(it.group) return el('div',{class:'nav-group-label'},it.group);
    const node=el('a',{class:'nav-item',href:it.r,'data-r':it.r},icon(it.icon),el('span',{},it.label));
    if(it.count) node.append(el('span',{class:'count'},it.count));
    return node;
  });
  $('#sidebar').replaceChildren(...items); // FULL replace — never accumulate
  markActiveNav();
}
function markActiveNav(){
  const base='#'+location.hash.slice(2).split('/').slice(0,2).join('/'); // coarse
  $$('#sidebar .nav-item').forEach(n=>{
    n.classList.toggle('active', location.hash.startsWith(n.getAttribute('data-r')) && n.getAttribute('data-r')!=='#/');
  });
}
function setRole(role){
  ROLE=role;
  $('#role-select').value=role;
  // update identity
  const id = role==='super'?['Theo Nakamura','t.nakamura@twa.io','TN']
           : role==='admin'?['Maria Alvarez','m.alvarez@northwind-re.com','MA']
           : ['Devin Park','d.park@northwind-re.com','DP'];
  $('#me-name').textContent=id[0]; $('#me-email').textContent=id[1]; $('#avatar').textContent=id[2];
  renderNav();
  go(ROLE_LANDING[role]); // land on the new persona's home
}

/* ---------------- router ---------------- */
const AUTH_VIEWS=['landing','apply','apply/pending','signin','set-password','reset-request','reset-confirm','verify-email','accept-invite','expired'];
function go(hash){ if(location.hash===hash) route(); else location.hash=hash; }
function parseRoute(){
  let path=location.hash.replace(/^#\//,'')||'landing';
  return path;
}
function route(){
  const path=parseRoute();
  // AUTH / public
  if(AUTH_VIEWS.includes(path) || path===''){
    $('#auth-app').classList.add('active'); $('#main-app').classList.remove('active');
    showView('#auth-app', path||'landing');
    if(path==='apply') renderApply();
    a11yPass();
    window.scrollTo(0,0); return;
  }
  // AUTHENTICATED
  $('#main-app').classList.add('active'); $('#auth-app').classList.remove('active');
  // resolve base + params
  let base=path, param=null;
  if(path.startsWith('catalog/dataset/')){ base='catalog/dataset'; param=path.split('/')[2]; }
  else if(path.startsWith('super/tenants/')){ base='super/tenants/detail'; param=path.split('/')[2]; }
  // role gate
  const allowed=ROUTE_ROLES[base];
  if(allowed && !allowed.includes(ROLE)){
    toast(`Not available for ${ROLE_LABELS[ROLE]}`,'err');
    go(ROLE_LANDING[ROLE]); return;
  }
  renderView(base, param);
  showView('#views', base);
  markActiveNav();
  $('#sidebar').classList.remove('open');
  a11yPass();
  window.scrollTo(0,0);
}
function showView(scope, view){
  $$(`${scope} .view`).forEach(v=>v.classList.toggle('active', v.getAttribute('data-view')===view));
}

/* ---------------- shared UI bits ---------------- */
function head(title,sub,actions){
  const h=el('div',{class:'pagehead'});
  const left=el('div',{}, el('h1',{},title)); if(sub) left.append(el('p',{},sub));
  h.append(left); if(actions) h.append(el('div',{class:'actions'},actions)); return h;
}
function crumbs(parts){ $('#crumbs').replaceChildren(el('div',{class:'crumbs'},parts.flatMap((p,i)=>{
  const a = p.r? el('a',{href:p.r},p.t): el('span',{},p.t); return i? ['/',a]:[a];})));}
function clearCrumbs(){ $('#crumbs').replaceChildren(); }
function badge(kind,text){return el('span',{class:'badge '+kind},el('span',{class:'d'}),text);}
function statusBadge(s){const m={active:'ok',published:'ok',succeeded:'ok',pending:'warn',renewing:'warn',deprecated:'warn',draft:'neutral',deactivated:'neutral',archived:'neutral',suspended:'danger',failed:'danger',expired:'danger'};return badge(m[s]||'neutral', s[0].toUpperCase()+s.slice(1));}
function sparkline(seed){const pts=Array.from({length:14},(_,i)=>20-Math.round(14*Math.abs(Math.sin(i*0.6+seed))));const d=pts.map((y,i)=>`${i*(100/13)},${y+4}`).join(' ');const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 100 30');s.setAttribute('class','spark');s.setAttribute('preserveAspectRatio','none');const pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');pl.setAttribute('points',d);pl.setAttribute('fill','none');pl.setAttribute('stroke','var(--accent)');pl.setAttribute('stroke-width','1.6');s.append(pl);return s;}
function tile(lbl,val,delta,up,asof,to,seed){const t=el('div',{class:'tile',onclick:()=>to&&go(to)});t.append(el('div',{class:'lbl'},lbl),el('div',{class:'val'},val));if(delta)t.append(el('span',{class:'delta '+(up?'up':'down')},(up?'▲ ':'▼ ')+delta));t.append(sparkline(seed||1));if(asof)t.append(el('div',{class:'asof'},'as of '+asof));return t;}
function table(cols,rows){
  const w=el('div',{class:'tablewrap'});
  const t=el('table',{class:'tbl'});
  t.append(el('thead',{},el('tr',{},cols.map(c=>el('th',{class:c.sort?'sortable':''},c.sort?c.label+' ⇅':c.label)))));
  const tb=el('tbody',{});
  rows.forEach(r=>tb.append(el('tr',{},cols.map(c=>{const td=el('td',{class:c.num?'num':'','data-l':c.label});const v=c.cell(r);td.append(v&&v.nodeType?v:document.createTextNode(v==null?'':v));return td;}))));
  t.append(tb); w.append(t); return w;
}
function pager(total){ if(total<=20) return el('div',{class:'pager'},el('span',{},`${total} item${total===1?'':'s'}`));
  const pages=Math.ceil(total/20);
  return el('div',{class:'pager'},el('span',{},`1–20 of ${total}`),el('div',{class:'pages'},
    el('button',{'aria-label':'Previous page'},'‹'),el('button',{class:'cur','aria-current':'page'},'1'),...(pages>1?[el('button',{},'2')]:[]),el('button',{'aria-label':'Next page'},'›')));}
function emptyState(ic,h,p,ctaLabel,ctaFn){const e=el('div',{class:'empty'},el('div',{class:'ico'},ic),el('h2',{},h),el('p',{},p));if(ctaLabel)e.append(el('button',{class:'btn primary',onclick:ctaFn},ctaLabel));return e;}
function kebab(actions){const m=el('div',{class:'menu',style:'display:inline-block'});const b=el('span',{class:'kebab',tabindex:'0',role:'button','aria-label':'Row actions'},'⋮');const pop=el('div',{class:'menu-pop',style:'right:0;top:24px'});actions.forEach(a=>pop.append(el('button',{onclick:(e)=>{e.stopPropagation();pop.classList.remove('open');a.fn();}},a.label)));b.addEventListener('click',e=>{e.stopPropagation();$$('.menu-pop.open').forEach(p=>p!==pop&&p.classList.remove('open'));pop.classList.toggle('open');});m.append(b,pop);return m;}

/* ---------------- view renderer ---------------- */
function renderView(base,param){
  const v=$(`#views .view[data-view="${base}"]`); if(!v) return;
  clearCrumbs();
  const R={
    'dashboard':dashUserAdmin,'super/dashboard':dashSuper,'onboarding':onboarding,
    'catalog':catalog,'catalog/dataset':()=>datasetDetail(param),'downloads':downloads,
    'members':members,'subscription':subscription,'super/plans':plans,'super/tenants':tenants,
    'super/tenants/detail':()=>tenantDetail(param),'super/approvals':approvals,'super/governance':governance,
    'super/ingestion':ingestion,'super/api-key':()=>apiKey('platform'),'settings/api-key':()=>apiKey('org'),
    'reports':()=>reports(false),'super/reports':()=>reports(true),'notifications':notifications,
    'settings/profile':()=>settings('profile'),'settings/password':()=>settings('password'),
    'settings/appearance':()=>settings('appearance'),'settings/notifications':()=>settings('notifications'),
    'settings/org':()=>settings('org'),'403':()=>sysPage('403'),'404':()=>sysPage('404'),
  };
  (R[base]||(()=>v.replaceChildren(head(base))))(v);
}

/* ===== Dashboards ===== */
function dashUserAdmin(v){
  if(ROLE==='admin'){
    const banner=el('div',{class:'banner info'},el('span',{},'◷'),
      el('div',{},el('strong',{},'Finish setting up Northwind Re. '),'Complete onboarding to get your team into the catalog. ',
      el('a',{onclick:()=>go('#/onboarding')},'Open checklist →')));
    v.replaceChildren(head('Welcome back, Maria','Northwind Re · Growth plan'),banner,
      el('div',{class:'tiles'},
        tile('Org usage','1,284','12% vs last mo',true,'today 09:00','#/reports',2),
        tile('Members','12 / 20','1 pending',true,'now','#/members',3),
        tile('Subscription','9 days','to renewal',false,'today','#/subscription',1)),
      el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Recent downloads'),el('a',{class:'small',onclick:()=>go('#/downloads')},'View all')),
        el('div',{style:'padding:0'},dlTable(DOWNLOADS))));
  } else {
    v.replaceChildren(head('Welcome back, Devin','Northwind Re'),
      el('div',{class:'tiles'},
        tile('My downloads','7','this period',true,'today','#/downloads',2),
        tile('Available datasets','24','entitled','',null,'#/catalog',4)),
      el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Recent downloads'),el('a',{class:'small',onclick:()=>go('#/downloads')},'View all')),
        el('div',{style:'padding:0'},dlTable(DOWNLOADS))));
  }
}
function dashSuper(v){
  v.replaceChildren(head('Platform overview','TWA Weather Data Marketplace'),
    el('div',{class:'tiles'},
      tile('Tenants','73','3 pending',true,'09:00','#/super/tenants',2),
      tile('Datasets','148','published / 162 total','',null,'#/catalog',4),
      tile('Ingestion (24h)','12 / 13','1 failed',false,'04:30','#/super/ingestion',3)),
    el('div',{class:'grid',style:'grid-template-columns:1fr 1fr;gap:16px'},
      el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Recent applications'),el('a',{class:'small',onclick:()=>go('#/super/approvals')},'Approvals →')),
        el('div',{style:'padding:0'},table([
          {label:'Organization',cell:r=>r.org},{label:'Tier',cell:r=>el('span',{class:'vchip'},r.tier)},{label:'Submitted',cell:r=>r.submitted}
        ],APPROVALS_ORG))),
      el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Recent ingestions')),
        el('div',{style:'padding:0'},table([
          {label:'Dataset',cell:r=>r.ds},{label:'Ver',cell:r=>el('span',{class:'vchip'},r.ver)},{label:'Status',cell:r=>statusBadge(r.status)}
        ],INGESTION.slice(0,4))))));
}
function dlTable(rows){return table([
  {label:'Dataset',cell:r=>r.ds},{label:'Version',cell:r=>el('span',{class:'vchip'},r.ver)},
  {label:'Size',num:true,cell:r=>r.size},{label:'Downloaded',cell:r=>r.at},
  {label:'Source',cell:r=>badge(r.src==='api'?'accent':'neutral',r.src)}],rows);}

/* ===== Onboarding ===== */
function onboarding(v){
  const steps=[
    {n:1,done:true,t:'Verify your organization profile',d:'Confirm Northwind Re\'s details and primary contact.',cta:'Review profile',r:'#/settings/org'},
    {n:2,done:false,t:'Invite your team',d:'Add members so they can browse and download within your plan.',cta:'Invite members',r:'#/members'},
    {n:3,done:false,t:'Review your entitlements',d:'See what your Growth plan includes and your usage limits.',cta:'View subscription',r:'#/subscription'},
  ];
  crumbs([{t:'Dashboard',r:'#/dashboard'},{t:'Onboarding'}]);
  const wrap=el('div',{style:'max-width:640px;margin:0 auto'});
  wrap.append(head('Get started','3 quick steps to set up Northwind Re'));
  const list=el('div',{class:'checklist'});
  steps.forEach(s=>list.append(el('div',{class:'step'+(s.done?' done':'')},
    el('div',{class:'n'},s.done?'✓':s.n),
    el('div',{style:'flex:1'},el('strong',{},s.t),el('div',{class:'muted small',style:'margin:3px 0 10px'},s.d),
      el('button',{class:'btn '+(s.done?'ghost':'primary')+' sm',onclick:()=>go(s.r)},s.done?'Review':s.cta)))));
  wrap.append(list);
  v.replaceChildren(wrap);
}

/* ===== Catalog ===== */
let catState={q:'',chips:[],view:'table'};
function catalog(v){
  crumbs([{t:'Catalog'}]);
  const search=el('div',{},
    el('div',{class:'search',style:'max-width:none;height:44px'},
      el('span',{'aria-hidden':'true'},'⌕'),
      el('input',{placeholder:'Search datasets — try: rainfall data for the Caribbean in 2023',value:catState.q,
        onkeydown:e=>{if(e.key==='Enter'){catState.q=e.target.value;runNL(e.target.value);}}}),
      el('button',{class:'btn primary sm',onclick:e=>{const i=e.target.closest('.search').querySelector('input');catState.q=i.value;runNL(i.value);}},'Search')));
  const chipsRow=el('div',{id:'cat-chips',style:'margin:12px 0'});
  const onFilt=(k)=>(e)=>{catState[k]=e.target.value;renderResults(v);};
  const tools=el('div',{class:'row between',style:'margin:16px 0'},
    el('div',{class:'row'},
      el('span',{class:'small muted'},'Filter:'),
      el('select',{class:'input',style:'width:auto;height:32px','aria-label':'Category',onchange:onFilt('fCat')},el('option',{value:''},'All categories'),...CATEGORIES.map(c=>el('option',{selected:catState.fCat===c?'true':null},c))),
      el('select',{class:'input',style:'width:auto;height:32px','aria-label':'Region',onchange:onFilt('fReg')},el('option',{value:''},'All regions'),...REGIONS.map(c=>el('option',{selected:catState.fReg===c?'true':null},c)))),
    el('div',{class:'row'},
      el('label',{class:'small muted',for:'cat-sort'},'Sort:'),
      el('select',{id:'cat-sort',class:'input',style:'width:auto;height:32px',onchange:onFilt('sort')},el('option',{value:'updated'},'Recently updated'),el('option',{value:'name'},'Name (A–Z)')),
      el('div',{class:'seg'},
        el('button',{class:catState.view==='table'?'active':'',onclick:()=>{catState.view='table';catalog(v);}},'☰ Table'),
        el('button',{class:catState.view==='grid'?'active':'',onclick:()=>{catState.view='grid';catalog(v);}},'▦ Grid'))));
  v.replaceChildren(head('Catalog','Browse TWA\'s curated weather datasets'),search,chipsRow,tools,el('div',{id:'cat-results'}));
  renderChips(); renderResults(v);
}
function runNL(q){
  catState.chips=[];
  const t=q.toLowerCase();
  if(/rain|precip/.test(t))catState.chips.push({f:'Category',val:'Precipitation'});
  if(/storm|hurricane/.test(t))catState.chips.push({f:'Category',val:'Storm tracks'});
  if(/wind/.test(t))catState.chips.push({f:'Category',val:'Wind'});
  if(/caribbean/.test(t))catState.chips.push({f:'Region',val:'Caribbean'});
  if(/atlantic/.test(t))catState.chips.push({f:'Region',val:'North Atlantic'});
  if(/gulf/.test(t))catState.chips.push({f:'Region',val:'Gulf of Mexico'});
  const yr=t.match(/20\d\d/); if(yr)catState.chips.push({f:'Time',val:yr[0]});
  catState.lowConf = q.trim()!=='' && catState.chips.length===0;
  renderChips(); renderResults($(`#views .view[data-view="catalog"]`));
}
function renderChips(){
  const c=$('#cat-chips'); if(!c) return;
  if(!catState.chips.length && !catState.lowConf){ c.replaceChildren(); return; }
  const row=el('div',{class:'row',style:'gap:10px'});
  if(catState.chips.length){
    row.append(el('span',{class:'ai-marker'},'✦ Interpreted by AI'));
    const chips=el('div',{class:'chips'});
    catState.chips.forEach((ch,i)=>chips.append(el('span',{class:'chip'},`${ch.f}: ${ch.val}`,
      el('button',{'aria-label':'Remove',onclick:()=>{catState.chips.splice(i,1);renderChips();renderResults($(`#views .view[data-view="catalog"]`));}},'✕'))));
    row.append(chips, el('button',{class:'btn ghost sm',onclick:()=>{catState.chips=[];catState.q='';renderChips();renderResults($(`#views .view[data-view="catalog"]`));}},'Clear'));
  }
  c.replaceChildren(row);
  if(catState.lowConf) c.append(el('div',{class:'banner warn',style:'margin-top:10px'},el('span',{},'✦'),'Showing keyword results — the AI interpretation was uncertain.'));
}
function filteredDatasets(){
  let d=DATASETS.filter(x=>x.life!=='draft'||ROLE==='super');
  catState.chips.forEach(ch=>{ d=d.filter(x=> ch.f==='Category'?x.category===ch.val : ch.f==='Region'?x.region===ch.val : true);});
  if(catState.fCat) d=d.filter(x=>x.category===catState.fCat);
  if(catState.fReg) d=d.filter(x=>x.region===catState.fReg);
  if(catState.q && catState.lowConf) d=d.filter(x=>x.name.toLowerCase().includes(catState.q.toLowerCase()));
  d=[...d].sort((a,b)=> catState.sort==='name'? a.name.localeCompare(b.name) : b.updated.localeCompare(a.updated));
  return d;
}
function renderResults(v){
  const mount=$('#cat-results'); if(!mount) return;
  const data=filteredDatasets();
  if(!data.length){ mount.replaceChildren(el('div',{class:'card'},emptyState('⌕','No datasets match','Try broadening your filters or rephrasing your search.','Clear filters',()=>{catState.chips=[];catState.q='';catState.lowConf=false;renderChips();renderResults(v);})));return;}
  if(catState.view==='grid'){
    const g=el('div',{class:'grid',style:'grid-template-columns:repeat(auto-fill,minmax(280px,1fr))'});
    data.forEach(d=>g.append(el('div',{class:'card',style:'cursor:pointer',onclick:()=>go('#/catalog/dataset/'+d.id)},
      el('div',{class:'card-b'},
        el('div',{class:'row between'},el('span',{class:'vchip'},d.ver),d.entitled?badge('ok','Entitled'):badge('neutral','Not in plan')),
        el('h2',{style:'margin:10px 0 6px'},d.name),
        el('div',{class:'muted small'},`${d.category} · ${d.region}`),
        el('div',{class:'muted small',style:'margin-top:8px'},`${d.time} · ${d.size} · updated ${d.updated}`)))));
    mount.replaceChildren(g); return;
  }
  const tbl=table([
    {label:'Name',cell:d=>el('a',{href:'#/catalog/dataset/'+d.id,style:'font-weight:500'},d.name)},
    {label:'Category',cell:d=>d.category},{label:'Region',cell:d=>d.region},
    {label:'Latest',cell:d=>el('span',{class:'vchip'},d.ver)},
    {label:'Updated',cell:d=>d.updated},
    {label:'Entitlement',cell:d=>d.entitled?badge('ok','Entitled'):badge('neutral','Not in plan')},
    {label:'',cell:d=>kebab([{label:'View detail',fn:()=>go('#/catalog/dataset/'+d.id)},
      ...(d.entitled?[{label:'Download',fn:()=>toast('Download started','ok')}]:[{label:'Request upgrade',fn:()=>toast('Upgrade request sent to your admin')}])])},
  ],data);
  const w=el('div',{},tbl,pager(data.length));
  mount.replaceChildren(w);
}
function datasetDetail(id){
  const d=DATASETS.find(x=>x.id===id)||DATASETS[0];
  const v=$(`#views .view[data-view="catalog/dataset"]`);
  crumbs([{t:'Catalog',r:'#/catalog'},{t:d.name},{t:d.ver}]);
  const versions=[d.ver,...['v'+(parseInt(d.ver.slice(1))-1),'v'+(parseInt(d.ver.slice(1))-2)]];
  const left=el('div',{},
    el('div',{class:'row',style:'gap:10px;margin-bottom:14px'},statusBadge(d.life), d.entitled?badge('ok','Entitled'):badge('neutral','Not in your plan')),
    el('div',{class:'card'},el('div',{class:'card-b'},
      el('h2',{style:'margin-bottom:10px'},'About this dataset'),
      el('p',{class:'muted',style:'margin:0 0 16px'},`Curated ${d.category.toLowerCase()} dataset for the ${d.region} region, derived from TWA's proprietary satellite feeds. Quality-controlled and immutably versioned on each ingestion.`),
      el('dl',{class:'kv'},
        kv('Dataset ID',el('span',{class:'mono'},d.id)),kv('Category',d.category),kv('Region',d.region),
        kv('Time range',d.time),kv('Latest version',el('span',{class:'vchip'},d.ver)),kv('Format','NetCDF / CSV'),kv('Size',d.size),kv('Updated',d.updated)))),
    el('div',{class:'card',style:'margin-top:16px'},el('div',{class:'card-h'},el('h2',{},'Version history')),
      el('div',{class:'card-b'},el('div',{class:'timeline'},versions.map((vv,i)=>el('div',{class:'tl'+(i===0?' cur':'')},
        el('div',{class:'dotcol'},el('div',{class:'c'})),
        el('div',{},el('div',{class:'row',style:'gap:8px'},el('span',{class:'vchip'},vv),i===0?el('span',{class:'star'},'★ current'):'',),
        el('div',{class:'muted small',style:'margin-top:3px'},`Ingested 2026-0${6-i}-0${9-i} · ${d.size}`))))))));
  const rail=el('div',{},
    el('div',{class:'card'},el('div',{class:'card-b'},
      el('div',{class:'field'},el('label',{},'Version'),el('select',{class:'input'},versions.map(vv=>el('option',{},vv)))),
      d.entitled
        ? el('button',{class:'btn primary lg',style:'width:100%',onclick:()=>toast('Download started · '+d.name,'ok')},'⤓ Download '+d.ver)
        : el('div',{},el('button',{class:'btn lg',style:'width:100%',disabled:'true'},'⤓ Download'),
            el('p',{class:'small muted',style:'margin:10px 0 8px'},'This dataset isn\'t included in your plan.'),
            el('button',{class:'btn premium sm',style:'width:100%',onclick:()=>toast('Upgrade request sent to your org admin')},'Request upgrade')))),
    ROLE!=='super'? el('div',{class:'card',style:'margin-top:16px'},el('div',{class:'card-h'},el('h2',{},'API access')),
      el('div',{class:'card-b'},el('p',{class:'small muted',style:'margin:0 0 10px'},'Pull this dataset with your org API key:'),
        el('div',{class:'snippet'},el('button',{class:'btn ghost sm copy',onclick:()=>toast('Copied snippet')},'Copy'),
`curl -H "Authorization: Bearer $TWA_ORG_KEY" \\
  https://api.twa.io/datasets/${d.id}/versions/${d.ver}/download \\
  -o ${d.id}_${d.ver}.nc`))) : govPanel(d));
  v.replaceChildren(head(d.name,`${d.category} · ${d.region}`), el('div',{class:'detail-grid'},left,rail));
}
function govPanel(d){return el('div',{class:'card',style:'margin-top:0'},el('div',{class:'card-h'},el('h2',{},'Governance')),
  el('div',{class:'card-b stack'},
    el('button',{class:'btn secondary',style:'width:100%',onclick:()=>confirmDlg('Publish dataset?','This will make the dataset catalog-visible and entitleable.','Publish',()=>toast('Dataset published','ok'))},'Publish'),
    el('button',{class:'btn secondary',style:'width:100%',onclick:()=>openDrawer('Retention & visibility',retentionForm(),[{label:'Save',cls:'primary',fn:()=>{closeDrawer();toast('Governance updated','ok');}}])},'Set retention / visibility'),
    el('button',{class:'btn danger',style:'width:100%',onclick:()=>confirmDlg('Archive '+d.name+'?','Orgs currently using it will lose access per the retention policy.','Archive',()=>toast('Dataset archived'))},'Archive dataset')));}
function retentionForm(){return el('div',{},field('Retention horizon',el('select',{class:'input'},el('option',{},'24 months'),el('option',{},'36 months'),el('option',{},'Indefinite'))),
  field('Visibility',el('select',{class:'input'},el('option',{},'All entitled orgs'),el('option',{},'Hidden (governance only)'))));}
function kv(k,val){return el('div',{},el('dt',{},k),el('dd',{},val&&val.nodeType?val:document.createTextNode(val)));}

/* ===== Downloads ===== */
function downloads(v){crumbs([{t:'Downloads'}]);
  v.replaceChildren(head(ROLE==='admin'?'Org downloads':'My downloads',ROLE==='admin'?'Download & API usage across Northwind Re':'Datasets you\'ve downloaded',
    el('button',{class:'btn secondary',onclick:()=>toast('Export started — CSV')},'⤓ Export CSV')),
    el('div',{},dlTable(DOWNLOADS),pager(DOWNLOADS.length)));}

/* ===== Members ===== */
let memFilter={role:'',status:''};
function members(v){crumbs([{t:'Members'}]);
  const data=MEMBERS.filter(m=>(!memFilter.role||m.role===memFilter.role)&&(!memFilter.status||m.status===memFilter.status));
  const tools=el('div',{class:'tabletools'},
    el('select',{class:'input',style:'width:auto;height:32px','aria-label':'Filter by role',onchange:e=>{memFilter.role=e.target.value;members(v);}},el('option',{value:''},'All roles'),...['Org Admin','Org User'].map(r=>el('option',{selected:memFilter.role===r?'true':null},r))),
    el('select',{class:'input',style:'width:auto;height:32px','aria-label':'Filter by status',onchange:e=>{memFilter.status=e.target.value;members(v);}},el('option',{value:''},'All statuses'),...['active','pending','deactivated'].map(s=>el('option',{value:s,selected:memFilter.status===s?'true':null},s[0].toUpperCase()+s.slice(1)))),
    el('span',{class:'muted small',style:'margin-left:auto'},`${data.length} of ${MEMBERS.length} members`));
  const tbl=table([
    {label:'Name',cell:m=>el('span',{style:'font-weight:500'},m.name)},
    {label:'Email',cell:m=>el('span',{class:'mono small'},m.email)},
    {label:'Role',cell:m=>badge(m.role==='Org Admin'?'accent':'neutral',m.role)},
    {label:'Status',cell:m=>statusBadge(m.status)},
    {label:'Last active',cell:m=>m.last},
    {label:'',cell:m=>kebab(m.status==='pending'
      ?[{label:'Resend invite',fn:()=>toast('Invite re-sent to '+m.email)},{label:'Revoke invite',fn:()=>confirmDlg('Revoke invite?','The pending invite to '+m.email+' will be cancelled.','Revoke',()=>toast('Invite revoked'))}]
      :[{label:'Edit role',fn:()=>editRole(m)},m.status==='deactivated'?{label:'Reactivate',fn:()=>toast(m.name+' reactivated','ok')}:{label:'Deactivate',fn:()=>confirmDlg('Deactivate '+m.name+'?','They\'ll lose access immediately. You can reactivate later.','Deactivate',()=>toast(m.name+' deactivated'))}])},
  ],data);
  const headerEls=head('Members','Manage your organization\'s team and roles',el('button',{class:'btn primary',onclick:inviteMember},'+ Invite member'));
  if(data.length){ tbl.querySelector('table').insertAdjacentElement('beforebegin',tools); v.replaceChildren(headerEls,el('div',{},tbl,pager(data.length)));}
  else v.replaceChildren(headerEls,el('div',{class:'tablewrap'},tools,emptyState('⌕','No members match','Try a different role or status filter.','Clear filters',()=>{memFilter={role:'',status:''};members(v);})));
}
function inviteMember(){openDrawer('Invite member',el('div',{},
  field('Full name',el('input',{class:'input',placeholder:'Jordan Lee'}),true),
  field('Email',el('input',{class:'input',type:'email',placeholder:'jordan@northwind-re.com'}),true),
  field('Role',el('select',{class:'input'},el('option',{},'Org User'),el('option',{},'Org Admin')),true),
  field('Message (optional)',el('textarea',{class:'input',placeholder:'Welcome to the team!'})),
  field('Invite expires',el('select',{class:'input'},el('option',{},'7 days'),el('option',{},'3 days'),el('option',{},'14 days')),true)),
  [{label:'Send invite',cls:'primary',fn:()=>{closeDrawer();toast('Invite sent to jordan@northwind-re.com','ok');}}]);}
function editRole(m){openDrawer('Edit role — '+m.name,el('div',{},
  field('Role',el('select',{class:'input'},el('option',{selected:m.role==='Org User'?'true':null},'Org User'),el('option',{selected:m.role==='Org Admin'?'true':null},'Org Admin'))),
  el('div',{class:'banner info'},el('span',{},'ℹ'),'An org must keep at least one Org Admin.')),
  [{label:'Save role',cls:'primary',fn:()=>{closeDrawer();toast('Role updated','ok');}}]);}

/* ===== Subscription ===== */
function subscription(v){crumbs([{t:'Subscription'}]);
  v.replaceChildren(head('Subscription','Your plan, entitlements, and usage',
    el('button',{class:'btn primary',onclick:reqChange},'Request plan change')),
    el('div',{class:'grid',style:'grid-template-columns:1fr 1fr;gap:16px;align-items:start'},
      el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Current plan'),badge('accent','Growth')),
        el('div',{class:'card-b'},
          el('div',{class:'row between',style:'margin-bottom:14px'},el('span',{class:'muted'},'Renews'),el('span',{},el('strong',{},'in 9 days'),' · 2026-06-21')),
          el('div',{class:'banner warn'},el('span',{},'◷'),'Renewal approaching. Access continues automatically on renewal.'),
          el('h2',{style:'margin:16px 0 10px;font-size:14px'},'Entitlement usage'),
          usageBar('Members','12 / 20',60),usageBar('Downloads (period)','1,284 / 2,000',64),
          el('div',{class:'stack',style:'margin-top:14px'},el('span',{class:'muted small'},'Allowed categories'),
            el('div',{class:'chips'},['Precipitation','Storm tracks','Wind','Sea surface'].map(c=>el('span',{class:'chip'},c)))))),
      el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Available plans')),
        el('div',{class:'card-b stack'},PLANS.map(p=>el('div',{class:'row between',style:'padding:12px;border:1px solid var(--border);border-radius:8px'+(p.name==='Growth'?';border-color:var(--accent)':'')},
          el('div',{},el('strong',{},p.name),el('div',{class:'muted small'},`${p.cats} categories · ${p.users} users · ${p.downloads.toLocaleString()} downloads`)),
          p.name==='Growth'?badge('accent','Current'):el('button',{class:'btn secondary sm',onclick:reqChange},'Request')))))));
}
function usageBar(label,val,pct){return el('div',{style:'margin-bottom:12px'},
  el('div',{class:'row between small',style:'margin-bottom:5px'},el('span',{class:'muted'},label),el('span',{class:'mono'},val)),
  el('div',{class:'bar'+(pct>85?' warn':'')},el('span',{style:`width:${pct}%`})));}
function reqChange(){openDrawer('Request plan change',el('div',{},
  field('Target plan',el('select',{class:'input'},el('option',{},'Enterprise'),el('option',{},'Starter')),true),
  field('Reason (optional)',el('textarea',{class:'input',placeholder:'We\'re onboarding 8 more analysts next quarter.'})),
  el('div',{class:'banner info'},el('span',{},'ℹ'),'Plan changes are reviewed and approved by TWA. You\'ll be notified of the outcome.')),
  [{label:'Request change',cls:'primary',fn:()=>{closeDrawer();toast('Plan-change request submitted','ok');}}]);}

/* ===== Plans (super) ===== */
function plans(v){crumbs([{t:'Plans'}]);
  v.replaceChildren(head('Plans','Define subscription tiers and their entitlements',
    el('button',{class:'btn primary',onclick:()=>planDrawer()},'+ Create plan')),
    el('div',{},table([
      {label:'Tier',cell:p=>el('strong',{},p.name)},
      {label:'Categories',num:true,cell:p=>p.cats},
      {label:'Max users',num:true,cell:p=>p.users},
      {label:'Max downloads',num:true,cell:p=>p.downloads.toLocaleString()},
      {label:'Orgs on plan',num:true,cell:p=>p.orgs},
      {label:'',cell:p=>kebab([{label:'Edit plan',fn:()=>planDrawer(p)},{label:'Delete plan',fn:()=>confirmDlg('Delete '+p.name+'?',p.orgs?'Only plans with no orgs assigned can be deleted.':'This plan will be removed.','Delete',()=>p.orgs?toast('Cannot delete — '+p.orgs+' orgs assigned','err'):toast('Plan deleted'))}])},
    ],PLANS)));}
function planDrawer(p){openDrawer(p?'Edit plan — '+p.name:'Create plan',el('div',{},
  field('Plan name',el('input',{class:'input',value:p?p.name:''}),true),
  field('Allowed categories',el('select',{class:'input',multiple:'true',style:'height:auto;min-height:120px'},CATEGORIES.map(c=>el('option',{selected:p&&p.cats>=4?'true':null},c))),true),
  field('Max users',el('input',{class:'input',type:'number',value:p?p.users:''}),true),
  field('Max downloads / period',el('input',{class:'input',type:'number',value:p?p.downloads:''}),true),
  field('Description',el('textarea',{class:'input'}))),
  [{label:p?'Save plan':'Create plan',cls:'primary',fn:()=>{closeDrawer();toast(p?'Plan saved':'Plan created','ok');}}]);}

/* ===== Tenants (super) ===== */
let tenFilter='';
function tenants(v){crumbs([{t:'Tenants'}]);
  const data=TENANTS.filter(t=>!tenFilter||t.status===tenFilter);
  const tbl=table([
      {label:'Organization',cell:t=>el('a',{href:'#/super/tenants/'+t.id,style:'font-weight:500'},t.name)},
      {label:'Plan',cell:t=>el('span',{class:'vchip'},t.plan)},
      {label:'Members',num:true,cell:t=>t.members},
      {label:'Status',cell:t=>statusBadge(t.status)},
      {label:'Created',cell:t=>t.created},
      {label:'',cell:t=>kebab([{label:'View detail',fn:()=>go('#/super/tenants/'+t.id)},
        t.status==='suspended'?{label:'Reactivate',fn:()=>toast(t.name+' reactivated','ok')}:{label:'Suspend',fn:()=>confirmDlg('Suspend '+t.name+'?','Members lose access until reactivated. Data is retained.','Suspend',()=>toast(t.name+' suspended'))}])},
    ],data);
  const tools=el('div',{class:'tabletools'},el('select',{class:'input',style:'width:auto;height:32px','aria-label':'Filter by status',onchange:e=>{tenFilter=e.target.value;tenants(v);}},el('option',{value:''},'All statuses'),...['active','pending','suspended'].map(s=>el('option',{value:s,selected:tenFilter===s?'true':null},s[0].toUpperCase()+s.slice(1)))),el('span',{class:'muted small',style:'margin-left:auto'},`${data.length} of ${TENANTS.length} organizations`));
  tbl.querySelector('table').insertAdjacentElement('beforebegin',tools);
  v.replaceChildren(head('Tenants','Organizations on the platform'),el('div',{},tbl,pager(data.length)));}
function tenantDetail(id){const t=TENANTS.find(x=>x.id===id)||TENANTS[0];const v=$(`#views .view[data-view="super/tenants/detail"]`);
  crumbs([{t:'Tenants',r:'#/super/tenants'},{t:t.name}]);
  v.replaceChildren(head(t.name,'Organization · '+t.id,el('div',{class:'row'},
    el('button',{class:'btn secondary',onclick:()=>openDrawer('Change plan — '+t.name,field('Plan',el('select',{class:'input'},PLANS.map(p=>el('option',{selected:p.name===t.plan?'true':null},p.name)))),[{label:'Save',cls:'primary',fn:()=>{closeDrawer();toast('Plan updated','ok');}}])},'Change plan'),
    t.status==='suspended'?el('button',{class:'btn primary',onclick:()=>toast(t.name+' reactivated','ok')},'Reactivate')
      :el('button',{class:'btn danger',onclick:()=>confirmDlg('Suspend '+t.name+'?','Members lose access until reactivated.','Suspend',()=>toast(t.name+' suspended'))},'Suspend'))),
    el('div',{class:'grid',style:'grid-template-columns:1fr 1fr;gap:16px;align-items:start'},
      el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Profile')),el('div',{class:'card-b'},
        el('dl',{class:'kv'},kv('Status',statusBadge(t.status)),kv('Plan',el('span',{class:'vchip'},t.plan)),kv('Members',String(t.members)),kv('Created',t.created),kv('Business type','Reinsurance'),kv('Contact',el('span',{class:'mono small'},'ops@'+t.name.toLowerCase().replace(/ /g,'-')+'.com'))))),
      el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Members (read-only)')),el('div',{style:'padding:0'},table([
        {label:'Name',cell:m=>m.name},{label:'Role',cell:m=>badge(m.role==='Org Admin'?'accent':'neutral',m.role)},{label:'Status',cell:m=>statusBadge(m.status)}
      ],MEMBERS.slice(0,3))))));}

/* ===== Approvals (super) ===== */
let apprTab='org';
function approvals(v){crumbs([{t:'Approvals'}]);
  const tabs=el('div',{class:'tabs'},
    el('button',{class:apprTab==='org'?'active':'',onclick:()=>{apprTab='org';approvals(v);}},`Org applications (${APPROVALS_ORG.length})`),
    el('button',{class:apprTab==='plan'?'active':'',onclick:()=>{apprTab='plan';approvals(v);}},`Plan-change requests (${APPROVALS_PLAN.length})`));
  let body;
  if(apprTab==='org'){
    body=table([
      {label:'Organization',cell:r=>el('strong',{},r.org)},
      {label:'Contact',cell:r=>el('span',{class:'mono small'},r.contact)},
      {label:'Requested tier',cell:r=>el('span',{class:'vchip'},r.tier)},
      {label:'Submitted',cell:r=>r.submitted},
      {label:'',cell:r=>el('div',{class:'row'},
        el('button',{class:'btn primary sm',onclick:()=>approveApp(r)},'Approve'),
        el('button',{class:'btn ghost sm',onclick:()=>rejectDrawer('Reject — '+r.org,'The applicant is notified with your note. This cannot be undone.',()=>toast('Application rejected'))},'Reject'))},
    ],APPROVALS_ORG);
  } else {
    body=table([
      {label:'Organization',cell:r=>el('strong',{},r.org)},
      {label:'Change',cell:r=>el('span',{},el('span',{class:'vchip'},r.from),' → ',el('span',{class:'vchip'},r.to))},
      {label:'Submitted',cell:r=>r.submitted},
      {label:'',cell:r=>el('div',{class:'row'},
        el('button',{class:'btn primary sm',onclick:()=>confirmDlg('Approve plan change?',`${r.org}: ${r.from} → ${r.to}. Entitlements re-provision immediately.`,'Approve',()=>toast('Plan change approved','ok'))},'Approve'),
        el('button',{class:'btn ghost sm',onclick:()=>rejectDrawer('Reject plan change — '+r.org,'The org is notified with your note; the plan is unchanged.',()=>toast('Plan change rejected'))},'Reject'))},
    ],APPROVALS_PLAN);
  }
  v.replaceChildren(head('Approval queue','Org applications and plan-change requests'),tabs,
    (APPROVALS_ORG.length||APPROVALS_PLAN.length)?body:el('div',{class:'card'},emptyState('✓','You\'re all caught up','New applications and requests will appear here.')));
}
function approveApp(r){openDrawer('Approve — '+r.org,el('div',{},
  el('dl',{class:'kv',style:'margin-bottom:16px'},kv('Organization',r.org),kv('Contact',el('span',{class:'mono small'},r.contact)),kv('Requested',el('span',{class:'vchip'},r.tier))),
  field('Assign plan',el('select',{class:'input'},PLANS.map(p=>el('option',{selected:p.name===r.tier?'true':null},p.name))),true),
  el('div',{class:'banner info'},el('span',{},'ℹ'),'Entitlements auto-provision on approval and the org admin receives a sign-in link.')),
  [{label:'Approve & assign plan',cls:'primary',fn:()=>{closeDrawer();toast(r.org+' approved · plan assigned','ok');}}]);}

/* ===== Governance (super) ===== */
function governance(v){crumbs([{t:'Governance'}]);
  v.replaceChildren(head('Dataset governance','Lifecycle, retention, and visibility across the catalog'),
    el('div',{},table([
      {label:'Dataset',cell:d=>el('a',{href:'#/catalog/dataset/'+d.id,style:'font-weight:500'},d.name)},
      {label:'Lifecycle',cell:d=>statusBadge(d.life)},
      {label:'Versions',num:true,cell:d=>parseInt(d.ver.slice(1))},
      {label:'Retention',cell:d=>({published:'36 mo',deprecated:'12 mo',archived:'6 mo · expiring',draft:'—'})[d.life]||'24 mo'},
      {label:'Visibility',cell:d=>d.life==='archived'?badge('neutral','Hidden'):badge('ok','Entitled orgs')},
      {label:'',cell:d=>kebab([
        {label:'Transition lifecycle',fn:()=>openDrawer('Transition — '+d.name,field('New status',el('select',{class:'input'},['Draft','Published','Deprecated','Archived'].map(s=>el('option',{},s)))),[{label:'Apply',cls:'primary',fn:()=>{closeDrawer();toast('Lifecycle updated','ok');}}])},
        {label:'Set retention',fn:()=>openDrawer('Retention — '+d.name,retentionForm(),[{label:'Save',cls:'primary',fn:()=>{closeDrawer();toast('Retention saved','ok');}}])},
        {label:'Archive',fn:()=>confirmDlg('Archive '+d.name+'?','Orgs currently using it lose access per retention policy.','Archive',()=>toast('Dataset archived'))}])},
    ],DATASETS)));}

/* ===== Ingestion (super) ===== */
function ingestion(v){crumbs([{t:'Developer',r:'#/super/ingestion'},{t:'Ingestion'}]);
  v.replaceChildren(head('Ingestion history','Push results from the ingestion client (Super Admin key)'),
    el('div',{},table([
      {label:'Dataset',cell:r=>r.ds},
      {label:'Version',cell:r=>el('span',{class:'vchip'},r.ver)},
      {label:'Status',cell:r=>r.status==='failed'?el('span',{class:'row',style:'gap:8px'},statusBadge('failed'),kebab([{label:'View error',fn:()=>confirmDlg('Validation error','',null)||showErr(r)}])):statusBadge('succeeded')},
      {label:'Pushed at',cell:r=>el('span',{class:'mono small'},r.at)},
      {label:'Size',num:true,cell:r=>r.size},
    ],INGESTION)),
    el('div',{class:'banner info',style:'margin-top:16px'},el('span',{},'ℹ'),'Datasets are pushed programmatically via the ingestion client using the platform API key — there is no upload screen by design.'));}
function showErr(r){const d=$('#dialog');$('#dlg-title').textContent='Ingestion failed — '+r.ds+' '+r.ver;$('#dlg-msg').textContent=r.err;$('#dlg-ok').style.display='none';d.showModal();$('#dlg-ok').onclick=null;}

/* ===== API keys ===== */
let keyState={org:false,platform:false};
function apiKey(scope){
  const v=$(`#views .view[data-view="${scope==='org'?'settings/api-key':'super/api-key'}"]`);
  const title=scope==='org'?'Org API key':'Platform API key';
  const desc=scope==='org'?'One shared key for programmatic dataset access across Northwind Re.':'Super Admin key used by the ingestion client to push datasets.';
  if(scope==='org') crumbs([{t:'Settings',r:'#/settings/profile'},{t:'API key'}]); else crumbs([{t:'Developer'},{t:'Platform key'}]);
  let body;
  if(!keyState[scope]){
    body=el('div',{class:'card'},emptyState('🔑','No API key yet','Generate a key to access datasets programmatically. The key is shown once.','Generate key',()=>{keyState[scope]=true;apiKey(scope);}));
  } else {
    body=el('div',{class:'card'},el('div',{class:'card-b'},
      el('div',{class:'row between',style:'margin-bottom:14px'},el('div',{},el('strong',{},'Active key'),el('div',{class:'mono small muted'},'twa_'+(scope==='org'?'org':'plat')+'_••••••••••••3f9a')),statusBadge('active')),
      el('dl',{class:'kv'},kv('Created','2026-05-30'),kv('Last used',scope==='org'?'2 h ago':'04:12 today'),kv('Usage','1,284 calls')),
      el('div',{class:'row',style:'margin-top:18px;gap:9px'},
        el('button',{class:'btn secondary',onclick:()=>confirmDlg('Rotate key?','The current key is invalidated and a new one is shown once.','Rotate key',()=>toast('Key rotated — copy the new one','ok'))},'Rotate key'),
        el('button',{class:'btn danger',onclick:()=>confirmDlg('Revoke this API key?','Any client using it will stop working immediately.','Revoke key',()=>{keyState[scope]=false;apiKey(scope);toast('Key revoked');})},'Revoke key'))));
  }
  v.replaceChildren(head(title,desc),body);
}

/* ===== Reports ===== */
function reports(platform){const v=$(`#views .view[data-view="${platform?'super/reports':'reports'}"]`);crumbs([{t:'Reports'}]);
  v.replaceChildren(head(platform?'Platform reports':'Reports',platform?'Platform-wide metrics':'Your usage over time',
    el('div',{class:'row'},el('select',{class:'input',style:'width:auto;height:36px'},el('option',{},'Last 30 days'),el('option',{},'Last 90 days')),
      el('button',{class:'btn secondary',onclick:()=>toast('Export started — CSV')},'⤓ Export CSV'))),
    el('div',{class:'tiles'},
      tile(platform?'Total downloads':'Downloads','12.4k','8%',true,'today',null,2),
      tile('API calls','48.2k','15%',true,'today',null,3),
      tile(platform?'Active orgs':'Active datasets',platform?'70':'24','',null,'today',null,1)),
    el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},'Downloads over time'),el('span',{class:'small muted'},'data as of today 09:00')),
      el('div',{class:'card-b'},barChart())));}
function barChart(){const wrap=el('div',{class:'row',style:'gap:8px;align-items:flex-end;height:180px'});const vals=[40,55,48,70,62,80,75,90,72,85,95,88];vals.forEach((x,i)=>wrap.append(el('div',{style:`flex:1;height:${x}%;background:var(--accent);opacity:${0.55+i*0.035};border-radius:5px 5px 0 0`,title:x*14+' downloads'})));return wrap;}

/* ===== Notifications ===== */
function notifications(v){crumbs([{t:'Notifications'}]);
  const items=ROLE==='super'?NOTIFS:NOTIFS.filter(n=>n.type==='info').concat([{t:'Your invite to Omar Haddad is pending',time:'1 d ago',type:'info'},{t:'Caribbean Daily Rainfall updated to v7',time:'2 d ago',type:'info'}]);
  v.replaceChildren(head('Notifications','Stay on top of approvals, invites, and alerts',
    el('button',{class:'btn secondary',onclick:()=>toast('All marked read')},'Mark all read')),
    el('div',{class:'tabs'},el('button',{class:'active'},'All'),el('button',{},'Unread'),el('button',{},'Approvals')),
    el('div',{class:'card'},el('div',{style:'padding:0'},items.length?items.map((n,i)=>el('div',{class:'row',style:'gap:12px;padding:14px 18px;border-bottom:1px solid var(--border);cursor:pointer',onclick:()=>n.type==='approval'&&ROLE==='super'?go('#/super/approvals'):null},
      el('span',{class:'badge '+(n.type==='error'?'danger':n.type==='approval'?'accent':'neutral'),style:'width:28px;height:28px;border-radius:8px;justify-content:center;padding:0'},n.type==='error'?'!':n.type==='approval'?'◷':'•'),
      el('div',{style:'flex:1'},el('div',{},n.t),el('div',{class:'muted small'},n.time)),
      i<2?el('span',{style:'width:8px;height:8px;border-radius:50%;background:var(--accent)'}):''))
      :[emptyState('✓','You\'re all caught up','Approvals, invites, and alerts will appear here.')])));
}

/* ===== Settings ===== */
function settings(section){
  const v=$(`#views .view[data-view="settings/${section}"]`);crumbs([{t:'Settings'},{t:section[0].toUpperCase()+section.slice(1)}]);
  const nav=el('div',{class:'card',style:'align-self:start'},el('div',{style:'padding:8px'},
    [['profile','Profile'],['password','Password'],['appearance','Appearance'],['notifications','Notifications'],
     ...(ROLE==='admin'?[['org','Organization'],['api-key','API key']]:[])].map(([k,l])=>
      el('a',{class:'nav-item'+(k===section?' active':''),href:k==='api-key'?'#/settings/api-key':'#/settings/'+k},l))));
  let panel;
  if(section==='profile') panel=card('Profile',el('div',{},field('Full name',el('input',{class:'input',value:$('#me-name').textContent})),field('Email',el('input',{class:'input',value:$('#me-email').textContent,disabled:'true'})),el('button',{class:'btn primary',onclick:()=>toast('Saved','ok')},'Save changes')));
  else if(section==='password') panel=card('Password',el('div',{},field('Current password',el('input',{class:'input',type:'password'})),field('New password',el('input',{class:'input',type:'password'})),field('Confirm new password',el('input',{class:'input',type:'password'})),el('button',{class:'btn primary',onclick:()=>toast('Password updated','ok')},'Update password')));
  else if(section==='appearance') panel=card('Appearance',el('div',{},
    field('Theme',el('div',{class:'seg'},el('button',{class:document.documentElement.dataset.theme==='light'?'active':'',onclick:()=>{setTheme('light');settings('appearance');}},'☀ Light'),el('button',{class:document.documentElement.dataset.theme==='dark'?'active':'',onclick:()=>{setTheme('dark');settings('appearance');}},'☾ Dark'),el('button',{onclick:()=>toast('Following system')},'⚙ System'))),
    field('Density',el('div',{class:'seg'},el('button',{class:'active'},'Comfortable'),el('button',{},'Compact')))));
  else if(section==='notifications') panel=card('Notification preferences',el('div',{},
    ['Org applications','Member invites','Subscription alerts','Ingestion failures'].map(e=>el('div',{class:'row between',style:'padding:11px 0;border-bottom:1px solid var(--border)'},el('span',{},e),el('label',{class:'row small',style:'gap:14px'},el('span',{class:'row',style:'gap:5px'},el('input',{type:'checkbox',checked:'true'}),'Email'),el('span',{class:'row',style:'gap:5px'},el('input',{type:'checkbox',checked:'true'}),'In-app'))))));
  else if(section==='org') panel=card('Organization',el('div',{},field('Org name',el('input',{class:'input',value:'Northwind Re'})),field('Business type',el('select',{class:'input'},el('option',{},'Reinsurance'),el('option',{},'Logistics'),el('option',{},'Energy'))),field('Primary contact',el('input',{class:'input',value:'ops@northwind-re.com'})),el('button',{class:'btn primary',onclick:()=>toast('Saved','ok')},'Save')));
  v.replaceChildren(head('Settings'),el('div',{style:'display:grid;grid-template-columns:200px 1fr;gap:20px;align-items:start'},nav,panel));
}
function card(title,body){return el('div',{class:'card'},el('div',{class:'card-h'},el('h2',{},title)),el('div',{class:'card-b'},body));}

/* ===== system pages ===== */
function sysPage(code){const v=$(`#views .view[data-view="${code}"]`);clearCrumbs();
  const msg=code==='403'?['⊘','Not authorized','You don\'t have access to this resource.']:['◌','Page not found','The page you\'re looking for doesn\'t exist.'];
  v.replaceChildren(el('div',{style:'min-height:60vh;display:grid;place-items:center'},emptyState(msg[0],msg[1],msg[2],'Back to dashboard',()=>go(ROLE_LANDING[ROLE]))));}

/* ---------------- helpers: field, drawer, dialog, toast ---------------- */
let _fid=0;
function field(label,input,req){
  const id='f'+(++_fid); if(input&&input.tagName){ if(!input.id)input.id=id; if(req){input.required=true;input.setAttribute('aria-required','true');} }
  const lbl=el('label',{for:(input&&input.id)||id},label,req?el('span',{class:'req'},' *'):'');
  const f=el('div',{class:'field'},lbl,input);
  if(req&&input&&input.tagName){ input.addEventListener('blur',()=>{ const empty=!String(input.value||'').trim(); f.classList.toggle('invalid',empty);
    let e=f.querySelector('.err'); if(empty){ if(!e){const eid='e'+(++_fid);e=el('div',{class:'err',id:eid,role:'alert'},'This field is required.');input.setAttribute('aria-describedby',eid);input.setAttribute('aria-invalid','true');f.append(e);} } else if(e){e.remove();input.removeAttribute('aria-invalid');} }); }
  return f;
}
function requiredValid(scope){ return $$('[required]',scope).every(i=> i.type==='checkbox'? i.checked : String(i.value||'').trim()!==''); }
function wireValidity(scope,btn){ if(!btn)return; const upd=()=>{btn.disabled=!requiredValid(scope);}; $$('[required]',scope).forEach(i=>{i.addEventListener('input',upd);i.addEventListener('change',upd);}); upd(); }
let _lastFocus=null;
function openDrawer(title,body,actions){
  _lastFocus=document.activeElement;
  $('#drawer-title').textContent=title;$('#drawer-body').replaceChildren(body);
  let primaryBtn=null;
  const btns=(actions||[]).map(a=>{const b=el('button',{class:'btn '+(a.cls||'secondary'),onclick:a.fn},a.label); if(a.cls==='primary'||a.cls==='danger')primaryBtn=b; return b;});
  $('#drawer-foot').replaceChildren(el('button',{class:'btn ghost',onclick:closeDrawer},'Cancel'),...btns);
  $('#scrim').classList.add('open');$('#drawer').classList.add('open');
  wireValidity($('#drawer-body'),primaryBtn);
  const first=$('#drawer-body input,#drawer-body select,#drawer-body textarea')||$('#drawer-foot .btn');
  if(first)setTimeout(()=>first.focus(),30);
}
function closeDrawer(){$('#scrim').classList.remove('open');$('#drawer').classList.remove('open');if(_lastFocus&&_lastFocus.focus)_lastFocus.focus();_lastFocus=null;}
function trapTab(e){ if(!$('#drawer').classList.contains('open')||e.key!=='Tab')return;
  const f=$$('#drawer input,#drawer select,#drawer textarea,#drawer button').filter(x=>!x.disabled&&x.offsetParent!==null); if(!f.length)return;
  const first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}
function rejectDrawer(title,intro,onConfirm){
  const note=el('textarea',{class:'input',placeholder:'Explain the decision — the applicant is notified.'});
  openDrawer(title,el('div',{},el('p',{class:'muted small',style:'margin:0 0 14px'},intro),field('Reason for rejection',note,true)),
    [{label:'Reject',cls:'danger',fn:()=>{closeDrawer();onConfirm(note.value);}}]);
  const btn=$('#drawer-foot .btn.danger'); const upd=()=>btn.disabled=note.value.trim().length<5; note.addEventListener('input',upd); upd();
}
function confirmDlg(title,msg,okLabel,fn){const d=$('#dialog');$('#dlg-title').textContent=title;$('#dlg-msg').textContent=msg;const ok=$('#dlg-ok');ok.style.display=okLabel?'':'none';ok.textContent=okLabel||'OK';ok.className='btn '+(/Delete|Revoke|Suspend|Archive|Deactivate|Reject/.test(okLabel||'')?'danger':'primary');ok.onclick=()=>{d.close();fn&&fn();};d.showModal();return true;}
function toast(msg,kind){const t=el('div',{class:'toast '+(kind||'')},el('span',{},kind==='err'?'⚠':kind==='ok'?'✓':'ℹ'),el('span',{},msg));$('#toasts').append(t);setTimeout(()=>t.remove(),4000);}
function togglePop(id){const p=$('#'+id);$$('.menu-pop.open').forEach(x=>x!==p&&x.classList.remove('open'));p.classList.toggle('open');
  if(id==='notif-pop'&&p.classList.contains('open')){$('#notif-mini').replaceChildren(...NOTIFS.slice(0,4).map(n=>el('a',{onclick:()=>{togglePop('notif-pop');go(ROLE==='super'&&n.type==='approval'?'#/super/approvals':'#/notifications');}},el('div',{},el('div',{class:'small'},n.t),el('div',{class:'small muted'},n.time)))));}}
document.addEventListener('click',e=>{if(!e.target.closest('.menu'))$$('.menu-pop.open').forEach(p=>p.classList.remove('open'));});
// keyboard: activate non-href links / role=button; Esc closes menus + drawer; Tab traps in drawer
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('a:not([href]),[role="button"]:not(button)')){e.preventDefault();e.target.click();return;}
  if(e.key==='Escape'){ const open=$$('.menu-pop.open'); if(open.length){open.forEach(p=>p.classList.remove('open'));return;} if($('#drawer').classList.contains('open')){closeDrawer();return;} }
  trapTab(e);
});
// make non-href links + custom role=button focusable (re-run after each render)
function a11yPass(){ $$('a:not([href])').forEach(a=>{if(!a.hasAttribute('tabindex'))a.tabIndex=0;}); }

/* ---------------- theme ---------------- */
function setTheme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem('twa-theme',t);}catch(e){}}
function toggleTheme(){setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');}

/* ---------------- auth flows (mock) ---------------- */
function signIn(){setRole(ROLE);go(ROLE_LANDING[ROLE]);}
function signOut(){togglePop('user-pop');go('#/signin');}
function checkRules(val){const r={len:val.length>=12,case:/[a-z]/.test(val)&&/[A-Z]/.test(val),num:/\d/.test(val),sym:/[^a-zA-Z0-9]/.test(val)};$$('#auth-app .view.active .rules .r').forEach(n=>{const k=n.dataset.k;n.classList.toggle('ok',r[k]);n.textContent=(r[k]?'✓':'○')+' '+n.textContent.slice(2);});}

/* ---- apply wizard ---- */
const APPLY_STEPS=[
  {t:'Organization',fields:()=>[field('Organization name',el('input',{class:'input',placeholder:'Northwind Re'}),true),field('Business type',el('select',{class:'input'},el('option',{},'Reinsurance'),el('option',{},'Logistics'),el('option',{},'Energy'),el('option',{},'Agriculture'),el('option',{},'Other')),true),field('Company size',el('select',{class:'input'},el('option',{},'1–50'),el('option',{},'51–200'),el('option',{},'201–1000'),el('option',{},'1000+')),true)]},
  {t:'Contact',fields:()=>[field('Contact name',el('input',{class:'input',placeholder:'Maria Alvarez'}),true),field('Work email',el('input',{class:'input',type:'email',placeholder:'ops@northwind-re.com'}),true)]},
  {t:'Intended use',fields:()=>[field('How will you use TWA datasets?',el('textarea',{class:'input',placeholder:'Catastrophe modeling for Caribbean reinsurance portfolios.'}),true)]},
  {t:'Plan tier',fields:()=>[field('Requested plan',el('select',{class:'input'},PLANS.map(p=>el('option',{},`${p.name} — ${p.users} users, ${p.downloads.toLocaleString()} downloads`))),true),el('div',{class:'banner info'},el('span',{},'ℹ'),'TWA assigns the final plan on approval — you can request a different tier later.')]},
  {t:'Review',fields:()=>[el('div',{class:'banner info'},el('span',{},'✓'),'Review your details, then submit. We\'ll email you when TWA reviews your application.')]},
];
let applyStep=0;
function renderApply(){applyStep=0;drawApply();}
function drawApply(){
  $('#apply-rail').replaceChildren(...APPLY_STEPS.map((s,i)=>el('div',{class:'s'+(i<=applyStep?' on':'')})));
  const s=APPLY_STEPS[applyStep];
  $('#apply-step').replaceChildren(el('h2',{style:'margin-bottom:16px'},`Step ${applyStep+1} of ${APPLY_STEPS.length} · ${s.t}`),...s.fields());
  $('#apply-back').style.visibility=applyStep===0?'hidden':'visible';
  $('#apply-next').textContent=applyStep===APPLY_STEPS.length-1?'Submit application':'Continue';
  wireValidity($('#apply-step'),$('#apply-next')); // disabled until this step's required fields are filled
  a11yPass();
}
function applyNav(dir){
  if(dir<0){applyStep=Math.max(0,applyStep-1);drawApply();return;}
  if(applyStep===APPLY_STEPS.length-1){go('#/apply/pending');return;}
  applyStep++;drawApply();
}

/* ---------------- boot ---------------- */
(function init(){
  try{const saved=localStorage.getItem('twa-theme');if(saved)document.documentElement.dataset.theme=saved;}catch(e){}
  $('#role-select').value=ROLE;
  renderNav();
  window.addEventListener('hashchange',route);
  if(!location.hash) location.hash='#/landing';
  route();
})();
window.go=go;window.setRole=setRole;window.toggleTheme=toggleTheme;window.signIn=signIn;window.signOut=signOut;
window.applyNav=applyNav;window.checkRules=checkRules;window.togglePop=togglePop;window.toast=toast;window.closeDrawer=closeDrawer;
