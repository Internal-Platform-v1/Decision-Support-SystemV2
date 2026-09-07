(function(){
  const q=s=>document.querySelector(s);
  function init(){
    const caseInput=q('#caseNumber'), queue=q('#queueType'), action=q('#actionTaken'), out=q('#generatedComment');
    if(!caseInput||!queue||!action||!out)return;
    function generate(){
      const c=caseInput.value.trim()||'[Case #]';
      const qu=queue.value||'[Queue Type]'; const ac=action.value||'[Action Taken]';
      out.value=`Case #${c}\nQueue: ${qu}\nAction Taken: ${ac}`;
      const s=q('#statusPill'); if(s)s.textContent='Generated';
    }
    [caseInput,queue,action].forEach(el=>el.addEventListener('input',generate));
    const copy=q('#copyComment'); if(copy)copy.addEventListener('click',()=>navigator.clipboard.writeText(out.value));
    generate();
  }
  document.addEventListener('DOMContentLoaded',init);
  window.openFbiModal=function(){const x=q('#fbiModal');if(x)x.style.display='flex';};
  window.openFbcTableModal=function(){const x=q('#fbcTableModal');if(x)x.style.display='flex';};
  window.closeModal=function(id){const x=q('#'+id);if(x)x.style.display='none';};
})();
