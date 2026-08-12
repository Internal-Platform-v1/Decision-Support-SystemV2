/* ============================================================
   CURRENT USER NAME
   ============================================================ */

function updateDashboardUserName(profile) {

    const nameElement =
        document.getElementById("currentUserName");

    if (!nameElement) {
        return;
    }

    const displayName =
        profile?.displayName ||
        window.currentUserProfile?.displayName;

if (displayName) {

    const firstName =
        displayName.trim().split(/\s+/)[0];

    nameElement.textContent =
        firstName;

}

}


/*
 * Header.js fires this after the current user's
 * approved_users profile has been loaded.
 */
document.addEventListener(
    "currentUserProfileLoaded",
    function (event) {

        updateDashboardUserName(
            event.detail
        );

    }
);


/*
 * Also check whether the profile has already
 * been loaded before this script runs.
 */
document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboardUserName(
            window.currentUserProfile
        );

    }
);

/* =========================================================
   BD TOOLS — MAIN DASHBOARD JS
   ========================================================= */

"use strict";

const guides = [
  {
    name:"BD — General Guide",
    tag:"Billing Dispute",
    color:"purple"
  },
  {
    name:"Rate & Volume Quote (R&V)",
    tag:"Pricing",
    color:"orange"
  },
  {
    name:"Weight Update per BOL Guide",
    tag:"Billing Dispute",
    color:"green"
  },
  {
    name:"Reference Number Guide",
    tag:"Billing Dispute",
    color:"purple"
  },
  {
    name:"Fuel Guide",
    tag:"Pricing",
    color:"orange"
  }
];

const recent = [
  ["BD — General Guide","10 mins ago"],
  ["Rate & Volume Quote (R&V)","1 hour ago"],
  ["Weight Update per BOL Guide","2 hours ago"],
  ["Fuel Guide","yesterday"],
  ["Surcharge Guides","yesterday"]
];

const mostUsedList = document.getElementById("mostUsedList");
const recentList = document.getElementById("recentList");
const toast = document.getElementById("toast");

function showToast(message){
  if(!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(function(){
    toast.classList.remove("show");
  },1800);
}

function renderLists(){
  if(mostUsedList){
    mostUsedList.innerHTML = guides.map(function(g,i){
      return `
        <div class="list-row clickable" data-name="${g.name}">
          <span class="rank ${g.color}">
            ${String(i+1).padStart(2,"0")}
          </span>

          <span class="row-name">${g.name}</span>

          <span class="tag ${g.color === "orange" ? "orange" : ""}">
            ${g.tag}
          </span>

          <button
            class="star"
            type="button"
            aria-label="Favorite ${g.name}"
            data-fav="${i}"
          >☆</button>
        </div>
      `;
    }).join("");
  }

  if(recentList){
    recentList.innerHTML = recent.map(function(r){
      return `
        <div class="list-row clickable" data-name="${r[0]}">
          <span class="recent-icon">
            <span class="document-icon"></span>
          </span>

          <span class="row-name">${r[0]}</span>

          <span class="recent-time">${r[1]}</span>

          <span class="row-chevron">›</span>
        </div>
      `;
    }).join("");
  }
}

renderLists();

function openGuide(name){
  /*
    Guide routing will be connected when the final
    GitHub guide folder structure is moved into place.
  */
  showToast(`Opening ${name}`);
  console.log("Guide selected:",name);
}

function openGuideLibrary(){
  showToast("Guide library opened");
}

window.openGuideLibrary = openGuideLibrary;

/* Quick Access cards */
document.querySelectorAll(".quick-card").forEach(function(card){

  function activate(){
    openGuide(card.dataset.guide);
  }

  card.addEventListener("click",function(event){
    if(event.target.closest(".arrow-btn")){
      event.stopPropagation();
    }

    activate();
  });

  card.addEventListener("keydown",function(event){
    if(event.key === "Enter" || event.key === " "){
      event.preventDefault();
      activate();
    }
  });

  const arrow = card.querySelector(".arrow-btn");

  if(arrow){
    arrow.addEventListener("click",function(event){
      event.stopPropagation();
      activate();
    });
  }
});

/* View All / panel actions */
document.querySelectorAll("[data-action]").forEach(function(button){
  button.addEventListener("click",function(){
    const action = button.dataset.action;

    if(action === "view-all" || action === "view-most" || action === "view-recent"){
      openGuideLibrary();
    }
  });
});

/* Footer is loaded asynchronously by footer.js. */
document.addEventListener("bdtools:explore-guides",function(){
  openGuideLibrary();
});

/* List rows + favorites */
document.addEventListener("click",function(event){

  const row = event.target.closest(".clickable");

  if(row && !event.target.closest(".star")){
    openGuide(row.dataset.name);
  }

  const fav = event.target.closest(".star");

  if(fav){
    fav.classList.toggle("active");

    fav.textContent =
      fav.classList.contains("active")
        ? "★"
        : "☆";

    showToast(
      fav.classList.contains("active")
        ? "Added to Favorites"
        : "Removed from Favorites"
    );
  }
});

/* Search */
function performSearch(value){
  const q = String(value || "").trim().toLowerCase();

  if(!q){
    showToast("Type a guide, tool, or topic to search");
    return;
  }

  const searchableItems = [
    ...guides.map(function(item){ return item.name; }),
    ...recent.map(function(item){ return item[0]; })
  ];

  const matches = searchableItems.filter(function(item){
    return item.toLowerCase().includes(q);
  });

  showToast(
    matches.length
      ? `${matches.length} result${matches.length > 1 ? "s" : ""} found`
      : "No matching guide found"
  );

  console.log("Search:",q,matches);
}

window.performSearch = performSearch;

const heroSearchBtn = document.getElementById("heroSearchBtn");
const heroSearch = document.getElementById("heroSearch");

if(heroSearchBtn && heroSearch){
  heroSearchBtn.addEventListener("click",function(){
    performSearch(heroSearch.value);
  });

  heroSearch.addEventListener("keydown",function(event){
    if(event.key === "Enter"){
      performSearch(event.target.value);
    }
  });
}

/* Shared header events */
document.addEventListener("bdtools:navigation",function(event){
  const detail = event.detail || {};
  const label = detail.label || "Navigation";

  /*
    Real links in the shared header handle navigation.
    This event is only kept for future dashboard-specific logic.
  */
  console.log("Navigation:",label,detail);
});

document.addEventListener("bdtools:profile-action",function(event){
  const detail = event.detail || {};
  const action = detail.action || "profile";

  showToast(`${action.charAt(0).toUpperCase() + action.slice(1)} selected`);
});

document.addEventListener("bdtools:notifications",function(){
  showToast("Notifications opened");
});

document.addEventListener("bdtools:case-directory",function(event){
  const detail = event.detail || {};

  showToast(
    `${detail.label || "Case Directory"} selected`
  );
});

document.addEventListener("bdtools:search",function(event){
  performSearch(
    event.detail
      ? event.detail.value
      : ""
  );
});
