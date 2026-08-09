/* =========================================================
   BD TOOLS — SHARED HEADER
   shared/header.js

   Responsibilities:
   - Load header.html into #header-placeholder
   - Resolve shared assets from the shared folder
   - Highlight the current site section
   - Handle profile dropdown
   - Forward global-search requests to the page
   - Expose simple header events to individual pages
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

  function resolvePageSection(){
    const path = window.location.pathname.toLowerCase();

    if(
      path.endsWith("/index.html") &&
      !path.includes("/guides/") &&
      !path.includes("/tools/")
    ){
      return "home";
    }

    if(path.includes("/guides/")){
      return "guides";
    }

    if(path.includes("/case-directory/") || path.includes("/cases/")){
      return "cases";
    }

    if(path.includes("/tools/")){
      return "tools";
    }

    if(path.includes("/links/")){
      return "links";
    }

    return "";
  }

  function setActiveSection(section){
    document.querySelectorAll(".nav-item").forEach(function(item){
      item.classList.toggle(
        "active",
        item.dataset.section === section
      );
    });
  }

  function toggleProfile(force){
    const menu = document.getElementById("profileMenu");
    const btn = document.getElementById("profileBtn");
    const chevron = document.getElementById("profileChevron");

    if(!menu) return;

    const shouldOpen =
      typeof force === "boolean"
        ? force
        : !menu.classList.contains("open");

    menu.classList.toggle("open", shouldOpen);
    menu.setAttribute("aria-hidden", String(!shouldOpen));

    if(btn){
      btn.setAttribute("aria-expanded", String(shouldOpen));
    }

    if(chevron){
      chevron.setAttribute("aria-expanded", String(shouldOpen));
    }
  }

  function initializeHeader(){
    const logo = document.querySelector(".fedex-logo-image");

    if(logo){
      logo.src = new URL("../../assets/images/fedex-logo.png", sharedBase).href;
    }

    setActiveSection(resolvePageSection());

    const profileBtn = document.getElementById("profileBtn");
    const profileChevron = document.getElementById("profileChevron");
    const profileMenu = document.getElementById("profileMenu");

    if(profileBtn){
      profileBtn.addEventListener("click", function(event){
        event.stopPropagation();
        toggleProfile();
      });
    }

    if(profileChevron){
      profileChevron.addEventListener("click", function(event){
        event.stopPropagation();
        toggleProfile();
      });
    }

    document.addEventListener("click", function(event){
      if(!event.target.closest(".header-actions")){
        toggleProfile(false);
      }
    });

    document.addEventListener("keydown", function(event){
      if(event.key === "Escape"){
        toggleProfile(false);
      }
    });

    document.querySelectorAll(".nav-item").forEach(function(item){
      item.addEventListener("click", function(){
        const section = item.dataset.section || "";
        const label = item.textContent.trim();

        setActiveSection(section);

        document.dispatchEvent(new CustomEvent("bdtools:navigation", {
          detail:{
            nav:item.dataset.nav || "",
            section:section,
            label:label
          }
        }));
      });
    });

    const globalSearch = document.getElementById("globalSearch");

    if(globalSearch){
      globalSearch.addEventListener("keydown", function(event){
        if(event.key !== "Enter") return;

        const value = event.target.value.trim();

        if(typeof window.performSearch === "function"){
          window.performSearch(value);
        }else{
          document.dispatchEvent(new CustomEvent("bdtools:search", {
            detail:{value:value}
          }));
        }
      });
    }

    if(profileMenu){
      profileMenu.querySelectorAll("button[data-profile-action]").forEach(function(button){
        button.addEventListener("click", function(){
          const action = button.dataset.profileAction || "";

          toggleProfile(false);

          document.dispatchEvent(new CustomEvent("bdtools:profile-action", {
            detail:{
              action:action,
              label:button.textContent.trim()
            }
          }));
        });
      });
    }

    window.dispatchEvent(new Event("bdtools:header-ready"));
  }

  window.BDHeaderReady = fetch(headerUrl, {cache:"no-cache"})
    .then(function(response){
      if(!response.ok){
        throw new Error(
          "Unable to load shared/header.html (" + response.status + ")"
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
      console.error("BD Tools header error:", error);

      placeholder.innerHTML =
        '<div style="padding:15px;color:#b00020;font:12px Arial;">' +
        'Unable to load the shared header.' +
        '</div>';

      return false;
    });
})();
