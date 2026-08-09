/* =========================================================
   SHARED HEADER JS
   ========================================================= */

(function(){

  "use strict";

  const placeholder = document.getElementById("header-placeholder");

  if(!placeholder){
    console.warn("BD Tools: #header-placeholder was not found.");
    return;
  }

  /*
   * header.js lives in /shared/.
   * Therefore:
   *   shared/header.js
   *   shared/header.html
   *   assets/images/fedex-logo.png
   *
   * are all resolved from this file.
   */
  const scriptElement = document.currentScript;

  const sharedBase = scriptElement
    ? new URL("./", scriptElement.src)
    : new URL("./", window.location.href);

  const headerUrl = new URL("header.html", sharedBase);
  const logoUrl = new URL("../assets/images/fedex-logo.png", sharedBase);

  function getCurrentPage(){

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

    if(path.includes("case-directory") || path.includes("/cases/")){
      return "cases";
    }

    return "home";
  }

  function setActiveNavigation(){

    const currentPage = getCurrentPage();

    document.querySelectorAll(".header-nav-link[data-nav]").forEach(function(link){

      link.classList.toggle(
        "active",
        link.dataset.nav === currentPage
      );

    });

  }

  function closeCaseDirectory(){

    const dropdown = document.getElementById("caseDirectoryDropdown");
    const trigger = document.getElementById("caseDirectoryTrigger");
    const menu = document.getElementById("caseDirectoryMenu");

    if(!dropdown) return;

    dropdown.classList.remove("open");

    if(trigger){
      trigger.setAttribute("aria-expanded","false");
    }

    if(menu){
      menu.setAttribute("aria-hidden","true");
    }

  }

  function toggleCaseDirectory(){

    const dropdown = document.getElementById("caseDirectoryDropdown");
    const trigger = document.getElementById("caseDirectoryTrigger");
    const menu = document.getElementById("caseDirectoryMenu");

    if(!dropdown) return;

    const open = !dropdown.classList.contains("open");

    dropdown.classList.toggle("open",open);

    if(trigger){
      trigger.setAttribute("aria-expanded",String(open));
    }

    if(menu){
      menu.setAttribute("aria-hidden",String(!open));
    }

  }

  function closeProfile(){

    const menu = document.getElementById("headerProfileMenu");
    const button = document.getElementById("headerProfileButton");
    const chevron = document.getElementById("headerProfileChevron");

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

    const menu = document.getElementById("headerProfileMenu");
    const button = document.getElementById("headerProfileButton");
    const chevron = document.getElementById("headerProfileChevron");

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

    /* Resolve the logo from /shared/header.js */
    const logo = document.getElementById("fedexHeaderLogo");

    if(logo){
      logo.src = logoUrl.href;
    }

    setActiveNavigation();

    /* Case Directory */
    const caseTrigger = document.getElementById("caseDirectoryTrigger");

    if(caseTrigger){

      caseTrigger.addEventListener("click",function(event){

        event.stopPropagation();

        closeProfile();
        toggleCaseDirectory();

      });

    }

    document.querySelectorAll("[data-case-directory]").forEach(function(item){

      item.addEventListener("click",function(event){

        /*
         * The final Legacy / Shine URLs will be inserted
         * once their exact routes are confirmed.
         */
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

    /* Profile */
    const profileButton = document.getElementById("headerProfileButton");
    const profileChevron = document.getElementById("headerProfileChevron");

    if(profileButton){

      profileButton.addEventListener("click",function(event){

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

    /* Search */
    const search = document.getElementById("headerSearch");

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

    /* Notifications */
    const notificationButton =
      document.getElementById("headerNotificationButton");

    if(notificationButton){

      notificationButton.addEventListener("click",function(){

        document.dispatchEvent(
          new CustomEvent("bdtools:notifications")
        );

      });

    }

    /* Profile actions */
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

    /* Close menus outside */
    document.addEventListener("click",function(event){

      if(!event.target.closest("#caseDirectoryDropdown")){
        closeCaseDirectory();
      }

      if(!event.target.closest(".header-tools")){
        closeProfile();
      }

    });

    /* Escape */
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
      '<div class="header-load-error">' +
      'Unable to load the shared header.' +
      '</div>';

    return false;

  });

})();
