/* =========================================================
   SHARED HEADER JS — STAGE 1
   ========================================================= */

(function(){

  "use strict";

  const placeholder = document.getElementById("header-placeholder");

  if(!placeholder){
    console.warn("BD Tools: #header-placeholder was not found.");
    return;
  }

  const scriptElement = document.currentScript;
  const sharedBase = scriptElement
    ? new URL("./", scriptElement.src)
    : new URL("./", window.location.href);

  const headerUrl = new URL("header.html", sharedBase);

  /*
   * Supports the folder structure we are building:
   *
   * shared/header.js
   * assets/images/fedex-logo.png
   *
   * The logo is resolved from the actual header.js location,
   * so it does not depend on the current page URL.
   */
  const logoUrl = new URL("../assets/images/fedex-logo.png", sharedBase);

  function currentPage(){

    const path = window.location.pathname.toLowerCase();

    if(path.includes("ebs-response-template")){
      return "ebs";
    }

    if(path.includes("fbc-comments-guide")){
      return "fbc";
    }

    if(path.includes("links.html")){
      return "links";
    }

    if(
      path.includes("case-directory") ||
      path.includes("/cases/")
    ){
      return "cases";
    }

    return "home";
  }

  function setActiveNav(){

    const page = currentPage();

    document
      .querySelectorAll(".header-nav .nav-item[data-nav]")
      .forEach(function(item){

        item.classList.toggle(
          "active",
          item.dataset.nav === page
        );

      });

  }

  function closeCaseDirectory(){

    const wrap = document.getElementById("caseDirectoryDropdown");
    const trigger = document.getElementById("caseDirectoryTrigger");
    const menu = document.getElementById("caseDirectoryMenu");

    if(!wrap) return;

    wrap.classList.remove("open");

    if(trigger){
      trigger.setAttribute("aria-expanded","false");
    }

    if(menu){
      menu.setAttribute("aria-hidden","true");
    }

  }

  function toggleCaseDirectory(){

    const wrap = document.querySelector(".case-directory-wrap");
    const trigger = document.getElementById("caseDirectoryTrigger");
    const menu = document.getElementById("caseDirectoryMenu");

    if(!wrap) return;

    const open = !wrap.classList.contains("open");

    wrap.classList.toggle("open",open);

    if(trigger){
      trigger.setAttribute("aria-expanded",String(open));
    }

    if(menu){
      menu.setAttribute("aria-hidden",String(!open));
    }

  }

  function closeProfile(){

    const menu = document.getElementById("profileMenu");
    const button = document.getElementById("profileBtn");
    const chevron = document.getElementById("profileChevron");

    if(!menu) return;

    menu.classList.remove("open");
    menu.setAttribute("aria-hidden","true");

    if(button){
      button.setAttribute("aria-expanded","false");
    }

    if(chevron){
      chevron.setAttribute("aria-expanded","false");
    }

  }

  function toggleProfile(){

    const menu = document.getElementById("profileMenu");
    const button = document.getElementById("profileBtn");
    const chevron = document.getElementById("profileChevron");

    if(!menu) return;

    const open = !menu.classList.contains("open");

    menu.classList.toggle("open",open);
    menu.setAttribute("aria-hidden",String(!open));

    if(button){
      button.setAttribute("aria-expanded",String(open));
    }

    if(chevron){
      chevron.setAttribute("aria-expanded",String(open));
    }

  }

  function initializeHeader(){

    const logo = document.getElementById("fedexHeaderLogo");

    if(logo){
      logo.src = logoUrl.href;
    }

    setActiveNav();

    const caseTrigger =
      document.getElementById("caseDirectoryTrigger");

    if(caseTrigger){

      caseTrigger.addEventListener("click",function(event){

        event.stopPropagation();

        closeProfile();
        toggleCaseDirectory();

      });

    }

    document
      .querySelectorAll("[data-case-directory]")
      .forEach(function(item){

        item.addEventListener("click",function(event){

          if(item.getAttribute("href") === "#"){
            event.preventDefault();
          }

          closeCaseDirectory();

          document.dispatchEvent(
            new CustomEvent("bdtools:case-directory",{
              detail:{
                type:item.dataset.caseDirectory,
                label:item.textContent.trim()
              }
            })
          );

        });

      });

    const profileBtn =
      document.getElementById("profileBtn");

    const profileChevron =
      document.getElementById("profileChevron");

    if(profileBtn){

      profileBtn.addEventListener("click",function(event){

        event.stopPropagation();

        closeCaseDirectory();
        toggleProfile();

      });

    }

    if(profileChevron){

      profileChevron.addEventListener("click",function(event){

        event.stopPropagation();

        closeCaseDirectory();
        toggleProfile();

      });

    }

    const search =
      document.getElementById("globalSearch");

    if(search){

      search.addEventListener("keydown",function(event){

        if(event.key !== "Enter") return;

        const value = search.value.trim();

        if(typeof window.performSearch === "function"){

          window.performSearch(value);

        }else{

          document.dispatchEvent(
            new CustomEvent("bdtools:search",{
              detail:{value:value}
            })
          );

        }

      });

    }

    const notificationBtn =
      document.getElementById("notificationBtn");

    if(notificationBtn){

      notificationBtn.addEventListener("click",function(){

        document.dispatchEvent(
          new CustomEvent("bdtools:notifications")
        );

      });

    }

    document
      .querySelectorAll("[data-profile-action]")
      .forEach(function(button){

        button.addEventListener("click",function(){

          const action =
            button.dataset.profileAction || "";

          closeProfile();

          document.dispatchEvent(
            new CustomEvent("bdtools:profile-action",{
              detail:{
                action:action,
                label:button.textContent.trim()
              }
            })
          );

        });

      });

    document.addEventListener("click",function(event){

      if(!event.target.closest(".case-directory-wrap")){
        closeCaseDirectory();
      }

      if(!event.target.closest(".header-actions")){
        closeProfile();
      }

    });

    document.addEventListener("keydown",function(event){

      if(event.key === "Escape"){
        closeCaseDirectory();
        closeProfile();
      }

    });

    window.dispatchEvent(
      new Event("bdtools:header-ready")
    );

  }

  window.BDHeaderReady = fetch(
    headerUrl.href,
    {cache:"no-cache"}
  )
  .then(function(response){

    if(!response.ok){
      throw new Error(
        "Unable to load shared/header.html (" +
        response.status +
        ")"
      );
    }

    return response.text();

  })
  .then(function(markup){

    placeholder.innerHTML = markup;

    initializeHeader();

    return true;

  })
  .catch(function(error){

    console.error("BD Tools header error:",error);

    placeholder.innerHTML =
      '<div style="' +
      'padding:12px;' +
      'font:10px Arial,sans-serif;' +
      'color:#b00020;' +
      'background:#fff;' +
      '">Unable to load the shared header.</div>';

    return false;

  });

})();
