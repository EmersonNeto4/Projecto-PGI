const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>[...r.querySelectorAll(s)];

function initNavigation(){
  const nav=qs('.site-nav');
  const sticky=qs('.sticky-cta');
  const hamburger=qs('.hamburger');
  const mobile=qs('.mobile-menu');
  if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20));
  if(sticky) window.addEventListener('scroll',()=>sticky.classList.toggle('show',scrollY>620));
  if(hamburger&&mobile){
    hamburger.addEventListener('click',()=>mobile.classList.toggle('open'));
    qsa('a',mobile).forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')));
  }
}

function initReveals(){
  const items=qsa('.reveal');
  if(!items.length) return;
  const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);}
  }),{threshold:.12});
  items.forEach(el=>obs.observe(el));
}

const landingFeed=[
  ['14:02','Lembrete WhatsApp enviado a Maria Santos','AUTOMÁTICO'],
  ['14:04','Pagamento recuperado e reconciliado','RECUPERAÇÃO'],
  ['14:07','Fluxo de escalamento iniciado para Carlos Pereira','PROCESSAMENTO'],
  ['14:09','Risco de retenção detetado em Beatriz Lima','MONITORIZAÇÃO']
];

function renderLandingFeed(){
  const target=qs('#feedList');
  if(!target) return;
  target.innerHTML=landingFeed.map((f,i)=>`<div class="feed-item"><div class="feed-hour">${f[0]}</div><div class="feed-dot" style="background:${i===2?'#F5A623':i===3?'#E74C3C':'#27AE60'}"></div><div class="feed-text">${f[1]}</div><div class="feed-state">${f[2]}</div></div>`).join('');
}

function initLandingChart(){
  const canvas=qs('#recoveryChart');
  if(!canvas||!window.Chart) return;
  Chart.defaults.font.family='Inter';
  Chart.defaults.color='rgba(255,255,255,.5)';
  const ctx=canvas.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,260);
  grad.addColorStop(0,'rgba(245,166,35,.28)');
  grad.addColorStop(1,'rgba(245,166,35,0)');
  new Chart(ctx,{type:'line',data:{labels:['Jan','Fev','Mar','Abr','Mai','Jun'],datasets:[{data:[180,240,290,310,340,360],borderColor:'#F5A623',backgroundColor:grad,fill:true,tension:.42,borderWidth:3,pointRadius:4,pointBackgroundColor:'#F5A623'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(11,22,41,.96)',padding:12,displayColors:false,callbacks:{label:c=>'€'+c.parsed.y.toLocaleString('pt-PT')+' recuperados'}}},scales:{x:{grid:{color:'rgba(255,255,255,.05)'}},y:{min:0,max:500,grid:{color:'rgba(255,255,255,.05)'},ticks:{callback:v=>'€'+v}}},animation:{duration:1300,easing:'easeOutQuart'}}});
}

const members=[
  {name:'João Silva',init:'JS',state:'RECUPERAÇÃO',type:'green',meta:'Pagamento reconciliado automaticamente às 09:12',msg:'Olá João, obrigado por manteres a quota em dia. A tua sequência continua ativa no ClubPulse.'},
  {name:'Maria Santos',init:'MS',state:'PROCESSAMENTO',type:'amber',meta:'Lembrete WhatsApp enviado há 4 minutos',msg:'Olá Maria. A quota deste mês ainda está em aberto. Para manteres a tua sequência, regulariza aqui: clubpulse.pt/pagar'},
  {name:'Carlos Pereira',init:'CP',state:'ESCALAMENTO',type:'red',meta:'Incentivo de retenção ativo',msg:'Carlos, queremos que continues connosco. Regulariza agora com 20% de desconto no total em dívida: clubpulse.pt/pagar'},
  {name:'Ana Costa',init:'AC',state:'RECUPERAÇÃO',type:'green',meta:'Recompensa atualizada automaticamente',msg:'Parabéns Ana. O teu pagamento foi confirmado e o nível VIP continua ativo.'},
  {name:'Beatriz Lima',init:'BL',state:'MONITORIZAÇÃO',type:'red',meta:'Segundo lembrete agendado automaticamente',msg:'Beatriz, tens quotas em aberto. O ClubPulse reservou um incentivo de regularização por 30 dias.'}
];

const appFeed=[
  'Lembrete WhatsApp enviado',
  'Pagamento recuperado',
  'Fluxo de escalamento iniciado',
  'Risco de retenção detetado',
  'Entrega de mensagem confirmada'
];

function stateBadge(type,state){return `<span class="badge state-${type}">${state}</span>`}

function initDemoDashboard(){
  const list=qs('#memberList');
  const feed=qs('#feed');
  if(!list||!feed) return;
  list.innerHTML=members.map((m,i)=>`<button class="member" onclick="openDetail(${i})"><div class="avatar">${m.init}</div><div><div class="member-name">${m.name}</div><div class="member-meta">${m.meta}</div></div>${stateBadge(m.type,m.state)}</button>`).join('');
  renderAppFeed();
  setInterval(()=>{appFeed.unshift(['Motor analisou 25 sócios','Probabilidade de regularização atualizada','Webhook de pagamento recebido','Escalamento automático reavaliado'][Math.floor(Math.random()*4)]);renderAppFeed();},7000);
}

function renderAppFeed(){
  const feed=qs('#feed');
  if(!feed) return;
  const times=['14:02','14:04','14:07','14:09','14:11'];
  feed.innerHTML=appFeed.slice(0,5).map((f,i)=>`<div class="feed-item"><div class="feed-hour">${times[i]||'agora'}</div><div class="feed-dot" style="background:${i%3===2?'#E74C3C':i%3===1?'#F5A623':'#27AE60'}"></div><div class="feed-text">${f}</div><div class="feed-state">${i%3===2?'ESCALAMENTO':i%3===1?'PROCESSAMENTO':'AUTOMÁTICO'}</div></div>`).join('');
}

window.openDetail=function(i){
  const detail=qs('#detail');
  const m=members[i];
  if(!detail||!m) return;
  detail.classList.add('active');
  detail.scrollIntoView({behavior:'smooth',block:'start'});
  qs('#detailName').textContent=m.name;
  qs('#detailMeta').textContent=m.meta;
  qs('#phoneMsg').textContent=m.msg;
  qs('#timeline').innerHTML=['Pagamento em atraso detetado','Mensagem de recuperação gerada','WhatsApp/email entregue','Estado em monitorização ativa'].map((t,idx)=>`<div class="timeline-item"><div class="timeline-icon">${idx+1}</div><div><div class="member-name">${t}</div><div class="member-meta">${idx===3?'O sistema escala automaticamente se não houver resposta':'Executado automaticamente pelo ClubPulse'}</div></div></div>`).join('');
}
window.closeDetail=function(){const d=qs('#detail');if(d)d.classList.remove('active');}

const opsCatalog=[
  {text:'Lembrete WhatsApp enviado a Maria Santos',tag:'Comunicação',tagClass:'amber',dot:'amber',source:'WPP-API'},
  {text:'Pagamento confirmado · €40 reconciliados',tag:'Recuperado',tagClass:'green',dot:'green',source:'STRIPE'},
  {text:'Escalamento iniciado — Carlos Pereira',tag:'Escalamento',tagClass:'red',dot:'red',source:'CORE'},
  {text:'Risco de abandono detetado em Beatriz Lima',tag:'Monitorização',tagClass:'red',dot:'red',source:'AI-RISK'},
  {text:'Fluxo autónomo concluído — sequência 04',tag:'Concluído',tagClass:'green',dot:'green',source:'CORE'},
  {text:'Política de retenção aplicada a sócio VIP',tag:'Retenção',tagClass:'blue',dot:'blue',source:'RULES'},
  {text:'Webhook de pagamento processado em 612ms',tag:'Sistema',tagClass:'blue',dot:'blue',source:'EDGE'},
  {text:'Mensagem entregue · estado de leitura recebido',tag:'Entregue',tagClass:'green',dot:'green',source:'WPP-API'},
  {text:'Reavaliação automática de 25 sócios em curso',tag:'Processamento',tagClass:'amber',dot:'amber',source:'AI-RISK'},
  {text:'Reembolso agendado — caso de exceção tratado',tag:'Exceção',tagClass:'red',dot:'red',source:'CORE'}
];
function nowHM(offsetMin=0){const d=new Date(Date.now()-offsetMin*60000);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function renderOpsTimeline(events){
  const tl=qs('#opsTimeline');if(!tl)return;
  tl.innerHTML=events.map((e,i)=>`<div class="ops-event"><span></span><span class="ops-event-dot ${e.dot}${i===0?' live':''}"></span><span class="ops-event-time">${e.time}</span><span class="ops-event-text">${e.text}</span><span class="ops-event-tag ops-tag-${e.tagClass}">${e.tag}</span><span class="ops-event-source">${e.source}</span></div>`).join('');
}
function initOpsTimeline(){
  if(!qs('#opsTimeline'))return;
  const seed=[0,2,5,8,12,17].map((m,i)=>{const c=opsCatalog[i%opsCatalog.length];return{...c,time:nowHM(m)}});
  renderOpsTimeline(seed);
  let i=seed.length;let started=Date.now();
  const syncTargets=[qs('#opsSync'),qs('#sideSync')];
  setInterval(()=>{const s=Math.floor((Date.now()-started)/1000)%60+1;syncTargets.forEach(el=>{if(el)el.textContent='há '+s+'s'})},1000);
  setInterval(()=>{
    const next=opsCatalog[i%opsCatalog.length];i++;
    seed.unshift({...next,time:nowHM(0)});if(seed.length>7)seed.pop();
    started=Date.now();
    renderOpsTimeline(seed);
  },5200);
}

function initDemoCharts(){
  if(!window.Chart) return;
  const trend=qs('#trendChart');
  const states=qs('#stateChart');
  if(!trend||!states) return;
  Chart.defaults.font.family='Inter';
  Chart.defaults.color='rgba(255,255,255,.52)';
  const ctx=trend.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,260);
  grad.addColorStop(0,'rgba(245,166,35,.28)');
  grad.addColorStop(1,'rgba(245,166,35,0)');
  new Chart(ctx,{type:'line',data:{labels:['Jan','Fev','Mar','Abr','Mai','Jun'],datasets:[{data:[1200,1800,2600,4100,6200,8400],borderColor:'#F5A623',backgroundColor:grad,fill:true,tension:.42,borderWidth:3,pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,.05)'}},y:{grid:{color:'rgba(255,255,255,.05)'},ticks:{callback:v=>'€'+v/1000+'k'}}},animation:{duration:1300,easing:'easeOutQuart'}}});
  new Chart(states,{type:'doughnut',data:{labels:['Recuperados','Em processamento','Em escalamento'],datasets:[{data:[18,4,3],backgroundColor:['#27AE60','#F5A623','#E74C3C'],borderColor:'#101e35',borderWidth:5}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{position:'bottom',labels:{boxWidth:10,usePointStyle:true}}},animation:{duration:1200}}});
}

const produtos={
  recovery:['Recovery AI','Decisão autónoma para recuperação de quotas, escalamentos e incentivos de retenção.','Inteligência de Recuperação'],
  motor:['Motor de Automação','Gatilhos baseados no estado de pagamento, sem filas manuais nem envios repetitivos.','Motor Operacional'],
  analytics:['Analytics Preditivo','Previsão de risco, probabilidade de regularização e impacto financeiro antes da perda de receita.','Analytics Preditivo'],
  whatsapp:['Automação WhatsApp','Fluxos personalizados por WhatsApp/email com estados de entrega, resposta e escalamento.','Comunicações Automatizadas'],
  retencao:['Sistema de Retenção','Recompensas progressivas e incentivos acionados antes de o sócio abandonar o clube.','Retenção Inteligente']
};

function initProdutoPage(){
  if(!document.body.dataset.productPage) return;
  const key=new URLSearchParams(location.search).get('produto')||'recovery';
  const p=produtos[key]||produtos.recovery;
  qs('#productName').textContent=p[0];
  qs('#productDesc').textContent=p[1];
  qs('#mockTitle').textContent=p[2];
  qs('#visionTitle').textContent=p[0]+' no ecossistema ClubPulse.';
  qs('#visionCopy').textContent=p[1]+' Este módulo é apresentado como conceito em desenvolvimento para a arquitetura futura do produto.';
  document.title='ClubPulse — '+p[0];
}

document.addEventListener('DOMContentLoaded',()=>{
  initNavigation();
  initReveals();
  renderLandingFeed();
  initLandingChart();
  initDemoDashboard();
  initOpsTimeline();
  initDemoCharts();
  initProdutoPage();
});