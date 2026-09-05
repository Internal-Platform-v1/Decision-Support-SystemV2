(function(){
"use strict";
const DATA_BASE=(document.querySelector('base')?.getAttribute('href')||'');
let fbc=[],ebs=[];
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const tokens=s=>new Set(norm(s).split(' ').filter(x=>x.length>2));
function score(a,b){let A=tokens(a),B=tokens(b),n=0; A.forEach(x=>{if(B.has(x))n++}); return n;}
function put(id,text){const e=document.getElementById(id); if(e){e.textContent=text||'No matching reference found.'; e.classList.toggle('empty',!text)}}
async function load(){try{[fbc,ebs]=await Promise.all([fetch(DATA_BASE+'assets/data/fbc-comments.json').then(r=>r.json()),fetch(DATA_BASE+'assets/data/ebs-responses.json').then(r=>r.json())])}catch(e){console.error('Reference loading failed',e)}}
function bestFbc(query){let best=null,bs=0; for(const r of fbc){let s=score(query,(r['Queue Type']||'')+' '+(r.Action||'')+' '+(r['Recommended Comment']||'')); if(s>bs){bs=s;best=r}} return bs?best:null}
function bestEbs(query){let best=null,bs=0; for(const r of ebs){let s=score(query,(r.Concern||'')+' '+(r.Description||'')+' '+(r.Type||'')); if(s>bs){bs=s;best=r}} return bs?best:null}
function corr(query){let q=norm(query); const rules=[['weight','YEAR'],['nmfc','NACC'],['description','EACC'],['handling unit','EHUN'],['service type','EPDC'],['reference number','EREF'],['accessorial','ACC'],['account code','ECD'],['terms','CAE'],['debtor','ECD'],['pricing','PRCE'],['class','NACC']]; for(const x of rules)if(q.includes(x[0]))return x[1]; return 'Review Correction Code Guide';}
window.addEventListener('guide-final-recommendation',async ev=>{await load(); const d=ev.detail||{}; const query=[d.recommendation||'',...(d.path||[]).map(x=>x.label||x.text||x)].join(' '); const f=bestFbc(query),e=bestEbs(query); put('suggestedComment',f&& (f['Recommended Comment']||f['2x4 Comment '])); put('suggestedCorrCode',corr(query)); put('suggestedEmail',e&&e['Response Template']);});
load();
})();