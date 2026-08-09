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

    if(path.includes("/guides/")) return "guides";
    if(path.includes("/case-directory/") || path.includes("/cases/")) return "cases";
    if(path.includes("/tools/")) return "tools";
    if(path.includes("/links/")) return "links";

    return "home";
  }

  function setActiveSection(section){
    document.querySelectorAll(".nav-item").forEach(function(item){
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

    if(profileBtn) profileBtn.setAttribute("aria-expanded","false");
    if(profileChevron) profileChevron.setAttribute("aria-expanded","false");
  }

  function toggleProfile(){
    const menu = document.getElementById("profileMenu");
    const profileBtn = document.getElementById("profileBtn");
    const profileChevron = document.getElementById("profileChevron");

    if(!menu) return;

    const open = !menu.classList.contains("open");

    menu.classList.toggle("open",open);
    menu.setAttribute("aria-hidden",String(!open));

    if(profileBtn) profileBtn.setAttribute("aria-expanded",String(open));
    if(profileChevron) profileChevron.setAttribute("aria-expanded",String(open));
  }

  function initializeHeader(){
    const logo = document.querySelector(".fedex-logo-image");

    if(logo){
      logo.src = new URL("../../assets/images/fedex-logo.png", sharedBase).href;
    }

    setActiveSection(getCurrentSection());

    const profileBtn = document.getElementById("profileBtn");
    const profileChevron = document.getElementById("profileChevron");
    const notificationBtn = document.getElementById("notificationBtn");
    const profileMenu = document.getElementById("profileMenu");

    if(profileBtn){
      profileBtn.addEventListener("click",function(event){
        event.stopPropagation();
        toggleProfile();
      });
    }

    if(profileChevron){
      profileChevron.addEventListener("click",function(event){
        event.stopPropagation();
        toggleProfile();
      });
    }

    document.addEventListener("click",function(event){
      if(!event.target.closest(".header-actions")){
        closeProfile();
      }
    });

    document.addEventListener("keydown",function(event){
      if(event.key === "Escape"){
        closeProfile();
      }
    });

    document.querySelectorAll(".nav-item").forEach(function(item){
      item.addEventListener("click",function(){
        const section = item.dataset.section || "";
        const label = item.textContent.trim();

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

    if(notificationBtn){
      notificationBtn.addEventListener("click",function(){
        document.dispatchEvent(new CustomEvent("bdtools:notifications"));
      });
    }

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
