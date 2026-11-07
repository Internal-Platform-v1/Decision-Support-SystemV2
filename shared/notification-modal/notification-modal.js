/* ============================================================
   SHARED NOTIFICATION MODAL SCRIPT
   ============================================================ */
(function () {
  "use strict";

  let previewModal = null;
  let updateModal = null;

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function init() {
    previewModal = document.getElementById("sharedNotifModal");
    updateModal = document.getElementById("dssUpdateModal");

    // --- 1. Setup Preview Modal ---
    if (previewModal) {
      previewModal.querySelectorAll("[data-notif-close]").forEach(el => {
        el.addEventListener("click", closePreview);
      });

      const actionBtn = document.getElementById("notifModalActionBtn");
      if (actionBtn) {
        actionBtn.addEventListener("click", function() {
          closePreview();
          openFullUpdates();
        });
      }
    }

    // --- 2. Setup Full Update Modal ---
    if (updateModal) {
      updateModal.querySelectorAll("[data-update-modal-close]").forEach(el => {
        el.addEventListener("click", closeFullUpdates);
      });
    }

    // --- 3. Global Escape Key ---
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (previewModal && !previewModal.hidden) closePreview();
        if (updateModal && !updateModal.hidden) closeFullUpdates();
      }
    });
  }

  // --- PREVIEW MODAL LOGIC ---
  function openPreview(data) {
    if (!previewModal) init();
    if (!previewModal) return;

    const title = document.getElementById("notifModalTitle");
    const message = document.getElementById("notifModalMessage");
    const eyebrow = document.getElementById("notifModalEyebrow");
    const badge = document.getElementById("notifModalBadge");
    const date = document.getElementById("notifModalDate");

    title.textContent = data.title || "Announcement";
    message.textContent = data.message || "";
    
    const priority = (data.priority || "normal").toLowerCase();
    previewModal.setAttribute("data-priority", priority);
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

    previewModal.hidden = false;
    requestAnimationFrame(() => previewModal.classList.add("is-open"));
    document.body.classList.add("dss-modal-open");
  }

  function closePreview() {
    if (!previewModal) return;
    previewModal.classList.remove("is-open");
    document.body.classList.remove("dss-modal-open");
    setTimeout(() => previewModal.hidden = true, 220);
  }

  // --- FULL UPDATES LIST LOGIC ---
  function openFullUpdates() {
    if (!updateModal) init();
    if (!updateModal) return;

    // Grab data saved by the banner script
    const slides = window.BDUpdateData || [];
    const container = document.getElementById("dssUpdateModalList");

    if (!slides.length) {
      container.innerHTML = `<div style="text-align:center; padding: 20px; color: #6d6e91;">No updates available at this time.</div>`;
    } else {
      // Build the accordion list
      container.innerHTML = slides.map(slide => {
        const { meta, content } = slide;
        const priority = (content.eyebrow || "Normal").toLowerCase();
        const dateStr = content.date || "Recently";
        
        return `
          <div class="update-feed-item" data-priority="${priority}">
            <div class="update-feed-header">
              <div class="update-feed-header-left">
                <div class="update-feed-meta">
                  <span class="update-feed-category">${esc(meta.label)}</span>
                  <span class="update-feed-date">${esc(dateStr)}</span>
                </div>
                <h3 class="update-feed-title">${esc(content.title)}</h3>
              </div>
              <div class="update-feed-toggle">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>
            <div class="update-feed-body">
              <div class="update-feed-content">
                <div class="update-feed-message">${esc(content.message)}</div>
                <button class="update-feed-action">
                  ${esc(content.button)} <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join("");

      // Bind click events to toggle the accordion
      container.querySelectorAll(".update-feed-header").forEach(header => {
        header.addEventListener("click", function() {
          const item = this.closest(".update-feed-item");
          item.classList.toggle("is-expanded");
        });
      });
    }

    updateModal.hidden = false;
    requestAnimationFrame(() => updateModal.classList.add("is-open"));
    document.body.classList.add("dss-modal-open");
  }

  function closeFullUpdates() {
    if (!updateModal) return;
    updateModal.classList.remove("is-open");
    document.body.classList.remove("dss-modal-open");
    setTimeout(() => updateModal.hidden = true, 220);
  }

  // Expose to global scope
  window.BDNotificationModal = { 
    open: openPreview, 
    close: closePreview, 
    openFullUpdates: openFullUpdates 
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
