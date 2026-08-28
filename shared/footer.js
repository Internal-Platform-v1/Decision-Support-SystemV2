/* DSS V2 Shared Footer JS — Feedback + Get Help */
(function(){
  "use strict";

  const state={rating:0,activeModal:null,lastFocus:null,closeTimer:null};
  const ratingLabels={1:"Needs improvement",2:"Could be better",3:"Good",4:"Very good",5:"Excellent"};

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function message(el,text,type){
    if(!el)return;
    el.textContent=text;
    el.className="dss-form-message is-visible "+(type==="success"?"is-success":"is-error");
  }
  function clearMessage(el){
    if(el){el.textContent="";el.className="dss-form-message";}
  }

  function pageContext(){
    const heading=$(".group-hero h1")||$("main h1");
    return {
      pageUrl:location.href,
      pagePath:location.pathname,
      pageTitle:document.title||"",
      guideTitle:heading?heading.textContent.trim():""
    };
  }

  function userContext(){
    const p=window.currentUserProfile||{};
    const u=window.currentUser||{};
    return {
      uid:p.uid||u.uid||null,
      email:p.email||u.email||null,
      displayName:p.displayName||u.displayName||null
    };
  }

  function updateHelpPage(){
    const el=$("#dssHelpPage");
    if(!el)return;
    const ctx=pageContext();
    el.textContent=ctx.guideTitle||ctx.pageTitle||"Current DSS page";
  }

  function resetFeedback(){
    const form=$("#dssFeedbackForm");
    if(form)form.reset();
    state.rating=0;
    $$(".dss-star").forEach(s=>{s.classList.remove("is-selected");s.setAttribute("aria-checked","false")});
    const label=$("#dssRatingLabel"); if(label)label.textContent="Select a rating";
    const count=$("#dssFeedbackCount"); if(count)count.textContent="0";
    clearMessage($("#dssFeedbackMessage"));
    const btn=$("#dssFeedbackSubmit"); if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Send Feedback'}
  }

  function resetHelp(){
    const form=$("#dssHelpForm");
    if(form)form.reset();
    const count=$("#dssHelpCount"); if(count)count.textContent="0";
    clearMessage($("#dssHelpMessage"));
    const btn=$("#dssHelpSubmit"); if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Send Help Request'}
    updateHelpPage();
  }

  function openModal(modal){
    if(!modal)return;
    if(state.closeTimer)clearTimeout(state.closeTimer);
    state.lastFocus=document.activeElement;
    state.activeModal=modal;
    document.body.classList.add("dss-modal-open");
    modal.hidden=false;
    modal.classList.remove("is-closing");
    requestAnimationFrame(()=>modal.classList.add("is-open"));
    setTimeout(()=>{const f=$("button,input,textarea,select",modal);if(f)f.focus()},70);
  }

  function closeModal(modal){
    if(!modal)return;
    modal.classList.remove("is-open");
    modal.classList.add("is-closing");
    state.closeTimer=setTimeout(()=>{
      modal.hidden=true;
      modal.classList.remove("is-closing");
      if(state.activeModal===modal)state.activeModal=null;
      if(!$(".dss-modal.is-open"))document.body.classList.remove("dss-modal-open");
      if(state.lastFocus&&document.contains(state.lastFocus))state.lastFocus.focus();
    },230);
  }

  function setRating(value){
    state.rating=Math.max(0,Math.min(5,Number(value)||0));
    $$(".dss-star").forEach(s=>{
      const n=Number(s.dataset.rating||0);
      s.classList.toggle("is-selected",n<=state.rating);
      s.setAttribute("aria-checked",n===state.rating?"true":"false");
    });
    const label=$("#dssRatingLabel");
    if(label)label.textContent=ratingLabels[state.rating]||"Select a rating";
  }

  function firestore(){
    if(typeof firebase==="undefined"||!firebase.firestore)return null;
    try{return firebase.firestore()}catch(e){console.error("DSS Footer: Firestore unavailable",e);return null}
  }

  async function sendFeedback(e){
    e.preventDefault();
    const msg=$("#dssFeedbackMessage"),btn=$("#dssFeedbackSubmit");
    const name=$("#dssFeedbackName")?.value.trim()||"";
    const comment=$("#dssFeedbackComment")?.value.trim()||"";

    if(!state.rating){message(msg,"Please select a rating first.","error");return}
    if(!comment){message(msg,"Please tell us a little about your experience.","error");$("#dssFeedbackComment")?.focus();return}

    const db=firestore();
    if(!db){message(msg,"Feedback could not be sent because the DSS connection is unavailable.","error");return}

    btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try{
      const u=userContext(),p=pageContext();
      await db.collection("feedback").add({
        type:"feedback",
        rating:state.rating,
        name:name||u.displayName||"Anonymous",
        comment,
        userId:u.uid,
        email:u.email,
        pageUrl:p.pageUrl,
        pagePath:p.pagePath,
        pageTitle:p.pageTitle,
        guideTitle:p.guideTitle,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      message(msg,"Thank you! Your feedback was sent successfully.","success");
      btn.innerHTML='<i class="fa-solid fa-check"></i> Sent';
      setTimeout(()=>closeModal($("#dssFeedbackModal")),900);
    }catch(err){
      console.error("DSS Footer: Feedback submission failed:",err);
      message(msg,"Unable to send feedback right now. Please try again.","error");
      btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Send Feedback';
    }
  }

  async function sendHelp(e){
    e.preventDefault();
    const msg=$("#dssHelpMessage"),btn=$("#dssHelpSubmit");
    const issueType=$("#dssHelpType")?.value||"";
    const details=$("#dssHelpDetails")?.value.trim()||"";

    if(!issueType){message(msg,"Please select what you need help with.","error");return}
    if(!details){message(msg,"Please describe the issue so it can be followed up.","error");$("#dssHelpDetails")?.focus();return}

    const db=firestore();
    if(!db){message(msg,"Help request could not be sent because the DSS connection is unavailable.","error");return}

    btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try{
      const u=userContext(),p=pageContext();
      await db.collection("help_requests").add({
        type:"help_request",
        issueType,
        details,
        userId:u.uid,
        email:u.email,
        name:u.displayName,
        pageUrl:p.pageUrl,
        pagePath:p.pagePath,
        pageTitle:p.pageTitle,
        guideTitle:p.guideTitle,
        status:"new",
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      message(msg,"Your help request was sent successfully.","success");
      btn.innerHTML='<i class="fa-solid fa-check"></i> Sent';
      setTimeout(()=>closeModal($("#dssHelpModal")),900);
    }catch(err){
      console.error("DSS Footer: Help request submission failed:",err);
      message(msg,"Unable to send the help request right now. Please try again.","error");
      btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Send Help Request';
    }
  }

  function clickHandler(e){
    const action=e.target.closest("[data-footer-action]");
    if(action){
      e.preventDefault();
      if(action.dataset.footerAction==="feedback"){resetFeedback();openModal($("#dssFeedbackModal"))}
      if(action.dataset.footerAction==="help"){resetHelp();openModal($("#dssHelpModal"))}
      return;
    }
    const close=e.target.closest("[data-close-modal]");
    if(close){
      const modal=close.closest(".dss-modal");
      if(modal)closeModal(modal);
      return;
    }
    const star=e.target.closest(".dss-star");
    if(star)setRating(star.dataset.rating);
  }

  function keyHandler(e){
    if(e.key==="Escape"&&state.activeModal){closeModal(state.activeModal);return}
    if(e.key!=="Tab"||!state.activeModal)return;
    const focusable=$$("button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[href],[tabindex]:not([tabindex='-1'])",state.activeModal);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }

  function inputHandler(e){
    if(e.target.id==="dssFeedbackComment")$("#dssFeedbackCount").textContent=e.target.value.length;
    if(e.target.id==="dssHelpDetails")$("#dssHelpCount").textContent=e.target.value.length;
  }

  function init(){
    document.addEventListener("click",clickHandler);
    document.addEventListener("keydown",keyHandler);
    document.addEventListener("input",inputHandler);

    const feedbackForm=$("#dssFeedbackForm");if(feedbackForm)feedbackForm.addEventListener("submit",sendFeedback);
    const helpForm=$("#dssHelpForm");if(helpForm)helpForm.addEventListener("submit",sendHelp);

    updateHelpPage();
    document.addEventListener("currentUserProfileLoaded",updateHelpPage);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
