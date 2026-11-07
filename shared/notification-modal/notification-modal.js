/* ============================================================
   SHARED NOTIFICATION MODAL SCRIPT
   ============================================================ */
(function () {
  "use strict";

  let modal = null;

  function init() {
    if (modal) return;
    modal = document.getElementById("sharedNotifModal");
    if (!modal) return;

    // Bind close events (backdrop and X button)
    modal.querySelectorAll("[data-notif-close]").forEach(el => {
      el.addEventListener("click", close);
    });

    // Bind the "View All Updates" button
    const actionBtn = document.getElementById("notifModalActionBtn");
    if (actionBtn) {
      actionBtn.addEventListener("click", function() {
        close();
        
        // Look for the update banner and its modal on the page
        const banner = document.querySelector('.dss-update-banner');
        const viewAll = document.querySelector('[data-update-action="view-all"]');
        const updateModal = document.getElementById("dssUpdateModal");

        // 1. Try to trigger the banner's native click
        if (viewAll) {
          viewAll.click();
        }

        // 2. Force the modal open if the native click didn't work
        if (updateModal) {
          setTimeout(() => {
            if (updateModal.hidden) {
              updateModal.hidden = false;
              updateModal.classList.add("is-open");
              document.body.classList.add("dss-modal-open");
            }
          }, 150);
        } else if (banner) {
          // If banner exists but modal doesn't, scroll to banner
          banner.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          // 3. If we are on a page without the banner at all, redirect to index
          const currentPage = window.location.pathname.split("/").pop();
          if (currentPage !== "" && currentPage !== "index.html") {
            window.location.href = "index.html";
          }
        }
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && !modal.hidden) close();
    });
  }

  function open(data) {
    if (!modal) init();
    if (!modal) return;

    const title = document.getElementById("notifModalTitle");
    const message = document.getElementById("notifModalMessage");
    const eyebrow = document.getElementById("notifModalEyebrow");
    const badge = document.getElementById("notifModalBadge");
    const date = document.getElementById("notifModalDate");

    title.textContent = data.title || "Announcement";
    message.textContent = data.message || "";
    
    const priority = (data.priority || "normal").toLowerCase();
    modal.setAttribute("data-priority", priority);
    eyebrow.textContent = data.priority || "NORMAL";

    const categories = {
      general: "📢 Announcements",
      whats_new: "✨ What's New?",
      reminders: "⚠ Important Reminders",
      issues: "🐞 Known Issues",
      guides: "📚 New Guides Added"
    };
    badge.textContent = categories[data.category] || "📢 Announcements";
    date.textContent = data.date || "Recently";

    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
    });
    document.body.classList.add("dss-modal-open");
  }

  function close() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("dss-modal-open");
    setTimeout(() => {
      modal.hidden = true;
    }, 220);
  }

  window.BDNotificationModal = { open, close };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
