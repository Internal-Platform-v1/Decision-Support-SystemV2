(function(){
  "use strict";

  const placeholder = document.getElementById("header-placeholder");
  if(!placeholder) return;

  const script = document.currentScript;
  const sharedBase = script
    ? new URL("./", script.src)
    : new URL("./", window.location.href);

  const headerUrl = new URL("header.html", sharedBase);
  const logoUrl = new URL("../assets/images/fedex-logo.png", sharedBase);

  function pageKey(){
    const p=location.pathname.toLowerCase();
    if(p.includes("ebs-response-template")) return "ebs";
    if(p.includes("fbc-comments-guide")) return "fbc";
    if(p.includes("links.html")) return "links";
    if(p.includes("case-directory") || p.includes("/cases/")) return "cases";
    return "home";
  }

  function setActive(){
    const key=pageKey();
    document.querySelectorAll(".nav-item[data-nav]").forEach(el=>{
      el.classList.toggle("active",el.dataset.nav===key);
    });
  }

  function closeCase(){
    const wrap=document.querySelector(".case-directory-wrap");
    if(!wrap) return;
    wrap.classList.remove("open");
    document.getElementById("caseDirectoryTrigger")?.setAttribute("aria-expanded","false");
    document.getElementById("caseDirectoryMenu")?.setAttribute("aria-hidden","true");
  }

  function toggleCase(){
    const wrap=document.querySelector(".case-directory-wrap");
    if(!wrap) return;
    const open=!wrap.classList.contains("open");
    wrap.classList.toggle("open",open);
    document.getElementById("caseDirectoryTrigger")?.setAttribute("aria-expanded",String(open));
    document.getElementById("caseDirectoryMenu")?.setAttribute("aria-hidden",String(!open));
  }

  function closeProfile(){
    const menu=document.getElementById("profileMenu");
    if(!menu) return;
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden","true");
    document.getElementById("profileBtn")?.setAttribute("aria-expanded","false");
    document.getElementById("profileChevron")?.setAttribute("aria-expanded","false");
  }

  function toggleProfile(){
    const menu=document.getElementById("profileMenu");
    if(!menu) return;
    const open=!menu.classList.contains("open");
    menu.classList.toggle("open",open);
    menu.setAttribute("aria-hidden",String(!open));
    document.getElementById("profileBtn")?.setAttribute("aria-expanded",String(open));
    document.getElementById("profileChevron")?.setAttribute("aria-expanded",String(open));
  }

  fetch(headerUrl.href,{cache:"no-cache"})
    .then(r=>{
      if(!r.ok) throw new Error("header.html returned "+r.status);
      return r.text();
    })
    .then(markup=>{
      placeholder.innerHTML=markup;

      const logo=document.getElementById("fedexHeaderLogo");
      if(logo) logo.src=logoUrl.href;

      setActive();

      document.getElementById("caseDirectoryTrigger")?.addEventListener("click",e=>{
        e.stopPropagation(); closeProfile(); toggleCase();
      });

      document.getElementById("profileBtn")?.addEventListener("click",e=>{
        e.stopPropagation(); closeCase(); toggleProfile();
      });

      document.getElementById("profileChevron")?.addEventListener("click",e=>{
        e.stopPropagation(); closeCase(); toggleProfile();
      });

      document.querySelectorAll("[data-case-directory]").forEach(a=>{
        a.addEventListener("click",e=>{
          if(a.getAttribute("href")==="#") e.preventDefault();
          closeCase();
          document.dispatchEvent(new CustomEvent("bdtools:case-directory",{
            detail:{type:a.dataset.caseDirectory,label:a.textContent.trim()}
          }));
        });
      });

      document.getElementById("globalSearch")?.addEventListener("keydown",e=>{
        if(e.key!=="Enter") return;
        const value=e.currentTarget.value.trim();
        if(typeof window.performSearch==="function") window.performSearch(value);
        else document.dispatchEvent(new CustomEvent("bdtools:search",{detail:{value}}));
      });

      document.getElementById("notificationBtn")?.addEventListener("click",()=>{
        document.dispatchEvent(new CustomEvent("bdtools:notifications"));
      });

      document.querySelectorAll("[data-profile-action]").forEach(btn=>{
        btn.addEventListener("click",()=>{
          const action=btn.dataset.profileAction;
          closeProfile();
          document.dispatchEvent(new CustomEvent("bdtools:profile-action",{
            detail:{action,label:btn.textContent.trim()}
          }));
        });
      });

      document.addEventListener("click",e=>{
        if(!e.target.closest(".case-directory-wrap")) closeCase();
        if(!e.target.closest(".header-actions")) closeProfile();
      });

      document.addEventListener("keydown",e=>{
        if(e.key==="Escape"){ closeCase(); closeProfile(); }
      });

      window.dispatchEvent(new Event("bdtools:header-ready"));
    })
    .catch(err=>{
      console.error("Shared header failed:",err);
      placeholder.innerHTML="";
    });
})();
