/* ============================================================
   SHARED NOTIFICATION MODAL SCRIPT
   ============================================================ */
(function () {
  "use strict";

  let modal = null;

  function init() {
    if (modal) return;
    
    // Create container and inject HTML
    const container = document.createElement("div");
    container.id = "notifModalContainer";
    document.body.appendChild(container);

    // Fetch the HTML (assuming it's loaded via include.js or you can fetch it)
    // For simplicity, we inject the HTML directly if the fetch fails or isn't used.
    container.innerHTML = `
      <div class="notif-modal" id="sharedNotifModal" hidden>
        <div class="notif-modal__backdrop" data-notif-close></div>
        <div class="notif-modal__panel" role="dialog" aria-modal="true">
          <header class="notif-modal__header">
            <div class="notif-modal__header-copy">
              <span class="notif-modal__eyebrow" id="notifModalEyebrow">SYSTEM UPDATE</span>
              <h2 class="notif-modal__title" id="notifModalTitle">Title</h2>
            </div>
            <button type="button" class="notif-modal__close" data-notif-close aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="notif-modal__body">
            <div class="notif-modal__meta">
              <span class="notif-modal__badge" id="notifModalBadge">📢 Announcements</span>
              <span class="notif-modal__date" id="notifModalDate">Date</span>
            </div>
            <p class="notif-modal__message" id="notifModalMessage">Message goes here.</p>
          </div>
          <footer class="notif-modal__footer">
            <button type="button" class="notif-modal__btn" id="notifModalActionBtn" data-notif-close>Close</button>
          </footer>
        </div>
      </div>
    `;

    modal = document.getElementById("sharedNotifModal");

    // Bind close events
    modal.querySelectorAll("[data-notif-close]").forEach(el => {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && !modal.hidden) close();
    });
  }

  function open(data) {
    if (!modal) init();

    // Update content
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

    // Map category labels
    const categories = {
      general: "📢 Announcements",
      whats_new: "✨ What's New?",
      reminders: "⚠ Important Reminders",
      issues: "🐞 Known Issues",
      guides: "📚 New Guides Added"
    };
    badge.textContent = categories[data.category] || "📢 Announcements";
    
    date.textContent = data.date || "Recently";

    // Show
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

  // Expose to global scope
  window.BDNotificationModal = { open, close };

  // Auto-init on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
