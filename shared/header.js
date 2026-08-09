/* =========================================================
   BD TOOLS — SHARED HEADER JS
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

  function getCurrentSection(){
    const path = window.location.pathname.toLowerCase();

    if(
      path.includes("ebs-response-template") ||
      path.includes("fbc-comments-guide")
    ){
      return "tools";
    }

    if(path.includes("/guides/")){
      return "guides";
    }

    if(
      path.includes("case-directory") ||
      path.includes("/cases/")
    ){
      return "cases";
    }

    if(path.includes("links.html") || path.includes("/links/")){
      return "links";
    }

    return "home";
  }

  function setActiveSection(section){
    document.querySelectorAll("[data-section]").forEach(function(item){
      item.classList.toggle(
        "active",
        item.dataset.section === section
      );
    });
  }

  function closeProfile(){
    const menu = document.getElementById("profileMenu");
    const profileBtn = document.getElementById("profileBtn");
    const profileChevron = document.getElementById("profileChevron");

    if(!menu) return;

    menu.classList.remove("open");
    menu.setAttribute("aria-hidden","true");

    if(profileBtn){
      profileBtn.setAttribute("aria-expanded","false");
    }

    if(profileChevron){
      profileChevron.setAttribute("aria-expanded","false");
    }
  }

  function toggleProfile(){
    const menu = document.getElementById("profileMenu");
    const profileBtn = document.getElementById("profileBtn");
    const profileChevron = document.getElementById("profileChevron");

    if(!menu) return;

    const open = !menu.classList.contains("open");

    menu.classList.toggle("open",open);
    menu.setAttribute("aria-hidden",String(!open));

    if(profileBtn){
      profileBtn.setAttribute("aria-expanded",String(open));
    }

    if(profileChevron){
      profileChevron.setAttribute("aria-expanded",String(open));
    }
  }

  function closeCaseDirectory(){
    const dropdown = document.querySelector(".nav-dropdown");

    if(!dropdown) return;

    dropdown.classList.remove("open");

    const trigger = dropdown.querySelector(".dropdown-trigger");

    if(trigger){
      trigger.setAttribute("aria-expanded","false");
    }
  }

  function toggleCaseDirectory(){
    const dropdown = document.querySelector(".nav-dropdown");

    if(!dropdown) return;

    const open = !dropdown.classList.contains("open");

    dropdown.classList.toggle("open",open);

    const trigger = dropdown.querySelector(".dropdown-trigger");

    if(trigger){
      trigger.setAttribute("aria-expanded",String(open));
    }
  }

  function initializeHeader(){
    const logo = document.querySelector(".fedex-logo-image");

    if(logo){
      logo.src = new URL("../../assets/images/fedex-logo.png", sharedBase).href;
    }

    setActiveSection(getCurrentSection());

    const profileBtn = document.getElementById("profileBtn");
    const profileChevron = document.getElementById("profileChevron");
    const profileMenu = document.getElementById("profileMenu");
    const notificationBtn = document.getElementById("notificationBtn");

    /* Case Directory dropdown */
    const caseTrigger = document.querySelector(".dropdown-trigger");

    if(caseTrigger){
      caseTrigger.addEventListener("click",function(event){
        event.stopPropagation();
        closeProfile();
        toggleCaseDirectory();
      });
    }

    document.querySelectorAll("[data-case-directory]").forEach(function(link){
      link.addEventListener("click",function(event){
        /*
          The actual Legacy/Shine URLs can be assigned here once
          the final Case Directory routes are confirmed.
        */
        if(link.getAttribute("href") === "#"){
          event.preventDefault();
        }

        closeCaseDirectory();

        document.dispatchEvent(new CustomEvent("bdtools:case-directory",{
          detail:{
            type:link.dataset.caseDirectory,
            label:link.textContent.trim()
          }
        }));
      });
    });

    /* Profile menu */
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

    /* Close dropdowns when clicking outside */
    document.addEventListener("click",function(event){
      if(!event.target.closest(".nav-dropdown")){
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

    /* Navigation */
    document.querySelectorAll(".nav-link[data-nav]").forEach(function(item){
      item.addEventListener("click",function(){
        const section = item.dataset.section || "";
        const label = item.textContent.trim();

        if(item.classList.contains("dropdown-trigger")){
          return;
        }

        setActiveSection(section);

        document.dispatchEvent(new CustomEvent("bdtools:navigation",{
          detail:{
            nav:item.dataset.nav || "",
            section:section,
            label:label
          }
        }));
      });
    });

    /* Search */
    const globalSearch = document.getElementById("globalSearch");

    if(globalSearch){
      globalSearch.addEventListener("keydown",function(event){
        if(event.key !== "Enter") return;

        const value = event.target.value.trim();

        if(typeof window.performSearch === "function"){
          window.performSearch(value);
        }else{
          document.dispatchEvent(new CustomEvent("bdtools:search",{
            detail:{value:value}
          }));
        }
      });
    }

    /* Notifications */
    if(notificationBtn){
      notificationBtn.addEventListener("click",function(){
        document.dispatchEvent(new CustomEvent("bdtools:notifications"));
      });
    }

    /* Profile actions */
    if(profileMenu){
      profileMenu
        .querySelectorAll("[data-profile-action]")
        .forEach(function(button){
          button.addEventListener("click",function(){
            const action = button.dataset.profileAction || "";
            const label = button.textContent.trim();

            closeProfile();

            document.dispatchEvent(new CustomEvent("bdtools:profile-action",{
              detail:{
                action:action,
                label:label
              }
            }));
          });
        });
    }

    window.dispatchEvent(new Event("bdtools:header-ready"));
  }

  window.BDHeaderReady = fetch(headerUrl,{cache:"no-cache"})
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
        '<div style="padding:15px;color:#b00020;font:12px Arial;">' +
        'Unable to load the shared header.' +
        '</div>';

      return false;
    });
})();
