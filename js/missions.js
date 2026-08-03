
(function(){
'use strict';

function qs(id){return document.getElementById(id);}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));}

function renderList(items){return '<ul>'+items.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';}

function routeUrl(stops){
  const origin=stops[0][0], destination=stops[stops.length-1][0];
  const waypoints=stops.slice(1,-1).map(x=>x[0]).join('|');
  const p=new URLSearchParams({api:'1',origin,destination,waypoints,travelmode:'walking'});
  return 'https://www.google.com/maps/dir/?'+p.toString();
}

function render(data){
  document.title='JP26 · '+data.title;
  qs('missionHero').style.setProperty('--mission-image',`url("${data.image}")`);
  qs('missionKicker').textContent=`${data.city} · ${data.date}`;
  qs('missionTitle').textContent=data.title;
  qs('missionObjective').textContent=data.objective;
  qs('missionTags').innerHTML=[
    `⭐ ${data.score} JP26 Score`, `⏱ ${data.duration}`, `💴 ${data.budget}`, `🎟 ${data.reservation}`
  ].map(x=>`<span>${x}</span>`).join('');

  qs('missionMetrics').innerHTML=data.metrics.map(m=>`<div class="mission-metric"><small>${escapeHtml(m[0])}</small><strong>${escapeHtml(m[1])}</strong></div>`).join('');
  qs('missionTimeline').innerHTML=data.timeline.map(t=>`<div class="mission-time-card"><time>${escapeHtml(t[0])}</time><b>${escapeHtml(t[1])}</b></div>`).join('');

  qs('missionPriorities').innerHTML=`
    <article class="priority-card must"><h3>🔥 Imprescindibles</h3>${renderList(data.must)}</article>
    <article class="priority-card recommended"><h3>⭐ Recomendadas</h3>${renderList(data.recommended)}</article>
    <article class="priority-card optional"><h3>🙂 Si sobra tiempo</h3>${renderList(data.optional)}</article>
    <article class="priority-card skip"><h3>❌ Puedes saltarte</h3>${renderList(data.skip)}</article>`;

  qs('missionChecklist').innerHTML=data.checklist.map((x,i)=>`
    <label class="mission-check"><input type="checkbox" data-check="${data.id}:${i}"><span>${escapeHtml(x)}</span></label>`).join('');

  qs('missionBudget').innerHTML=data.budgetBreakdown.map(x=>`<div class="budget-row"><span>${escapeHtml(x[0])}</span><b>${escapeHtml(x[1])}</b></div>`).join('');
  qs('missionTips').innerHTML=data.tips.map(x=>`<div class="mission-tip">${escapeHtml(x)}</div>`).join('');

  qs('missionStops').innerHTML=data.stops.map((s,i)=>{
    const q=encodeURIComponent(s[0]+' Japan');
    return `<div class="mission-stop"><b>${i+1}. ${s[3]} ${escapeHtml(s[0])}</b><small>${escapeHtml(s[4])}</small><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${q}">Abrir punto</a></div>`;
  }).join('');
  qs('missionRouteBtn').href=routeUrl(data.stops);

  initializeStoredFields(data.id);
  initializeMap(data);
}

function initializeStoredFields(id){
  document.querySelectorAll('[data-check]').forEach(box=>{
    const key='jp26:mission-check:'+box.dataset.check;
    box.checked=localStorage.getItem(key)==='1';
    box.addEventListener('change',()=>localStorage.setItem(key,box.checked?'1':'0'));
  });

  const complete=qs('missionComplete');
  const completeKey='jp26:mission-complete:'+id;
  complete.checked=localStorage.getItem(completeKey)==='1';
  complete.addEventListener('change',()=>localStorage.setItem(completeKey,complete.checked?'1':'0'));

  document.querySelectorAll('[data-note]').forEach(field=>{
    const key='jp26:mission-note:'+id+':'+field.dataset.note;
    field.value=localStorage.getItem(key)||'';
    field.addEventListener('input',()=>localStorage.setItem(key,field.value));
  });
}

function ensureLeaflet(){
  if(window.L)return Promise.resolve(window.L);
  return new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';
    s.onload=()=>resolve(window.L);s.onerror=reject;document.head.appendChild(s);
  });
}

function initializeMap(data){
  ensureLeaflet().then(L=>{
    const map=L.map('missionMap',{scrollWheelZoom:false});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
    const coords=[];
    data.stops.forEach((s,i)=>{
      coords.push([s[1],s[2]]);
      L.marker([s[1],s[2]]).addTo(map).bindPopup(`<b>${i+1}. ${s[3]} ${escapeHtml(s[0])}</b><br>${escapeHtml(s[4])}`);
    });
    const line=L.polyline(coords,{color:'#ff3b4d',weight:5,opacity:.9,dashArray:'10 8'}).addTo(map);
    map.fitBounds(line.getBounds(),{padding:[35,35]});
    setTimeout(()=>map.invalidateSize(),350);
  }).catch(()=>{qs('missionMap').innerHTML='<div style="display:grid;place-items:center;height:100%;color:#a9b1c3">Mapa no disponible</div>';});
}

async function init(){
  const id=document.body.dataset.activity;
  try{
    const r=await fetch(`../data/activities/${id}.json`,{cache:'no-store'});
    if(!r.ok)throw new Error('data');
    render(await r.json());
  }catch(e){
    qs('missionTitle').textContent='No se pudo cargar la misión';
    qs('missionObjective').textContent='Abre esta página usando Live Server o GitHub Pages.';
  }
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
