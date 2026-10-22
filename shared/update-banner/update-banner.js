/* ============================================================
   DSS V2 — SHARED UPDATE BANNER LOADER

   Loads the banner markup, inserts it, and then fetches the
   admin-controlled content from Firestore to replace the
   placeholders.
   ============================================================ */
(function () {
  "use strict";

  const BANNER_FILE = "shared/update-banner.html";
  const BANNER_IMAGE = "assets/images/update-banner-truck.png";
  const COLLECTION = "announcements";
  const DOCUMENT_ID = "general";

  function getBasePrefix() {
    const path = window.location.pathname;
    const marker = "/guides/";
    const index = path.indexOf(marker);
    return index === -1 ? "" : "../../";
  }

  function setText(banner, selector, value) {
    if (!value) return;
    const el = banner.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setMessage(banner, value) {
    if (!value) return;
    const el = banner.querySelector(".dss-update-banner__message");
    if (!el) return;
    // Preserve line breaks
    el.innerHTML = String(value)
      .split("\n")
      .map(line => line.replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[ch])))
      .join("<br>");
  }

  async function applyFirestoreContent(banner) {
    // Guard: Firebase must be initialized
    if (!window.firebase || !firebase.apps || !firebase.apps.length) {
      console.info("[update-banner] Firebase not loaded — using default content.");
      return;
    }

    try {
      const db = window.db || firebase.firestore();
      const doc = await db.collection(COLLECTION).doc(DOCUMENT_ID).get();
      if (!doc.exists) {
        console.info("[update-banner] No announcement saved yet — using default content.");
        return;
      }

      const data = doc.data() || {};

      // Replace eyebrow
      if (data.eyebrow) {
        const eyebrowSpan = banner.querySelector(".dss-update-banner__eyebrow > span:last-child");
        if (eyebrowSpan) eyebrowSpan.textContent = data.eyebrow;
      }

      // Replace title
      setText(banner, ".dss-update-banner h2", data.title);

      // Replace date
      if (data.date) {
        const dateEl = banner.querySelector(".dss-update-banner__date");
        if (dateEl) {
          // Keep the calendar icon
          const icon = dateEl.querySelector("i");
          dateEl.textContent = "";
          if (icon) dateEl.appendChild(icon);
          dateEl.appendChild(document.createTextNode(" " + data.date));
        }
      }

      // Replace message body
      setMessage(banner, data.message);

      // Replace button text (keep the arrow)
      if (data.button) {
        const btn = banner.querySelector('[data-update-action="view-all"]');
        if (btn) {
          const arrow = btn.querySelector("span");
          btn.textContent = "";
          btn.appendChild(document.createTextNode(data.button + " "));
          if (arrow) btn.appendChild(arrow);
        }
      }

      console.log("[update-banner] Content applied from Firestore:", data.title);
    } catch (err) {
      console.warn("[update-banner] Firestore fetch failed — keeping default content:", err.code || err.message);
    }
  }

  async function loadUpdateBanner() {
    if (document.getElementById("dssUpdateBanner")) return;

    const header = document.getElementById("header-placeholder");
    if (!header) return;

    const prefix = getBasePrefix();
    const htmlUrl = prefix + BANNER_FILE;
    const imageUrl = prefix + BANNER_IMAGE;

    try {
      const response = await fetch(htmlUrl, { cache: "no-cache" });
      if (!response.ok) throw new Error("Unable to load update banner.");

      let markup = await response.text();
      markup = markup.replace("__UPDATE_BANNER_TRUCK__", imageUrl);

      const placeholder = document.getElementById("update-banner-placeholder");

      if (placeholder) {
        placeholder.innerHTML = markup;
      } else {
        header.insertAdjacentHTML("afterend", markup);
      }

      const banner = document.getElementById("dssUpdateBanner");
      if (!banner) return;

      // Wire up the View All Updates button
      const button = banner.querySelector('[data-update-action="view-all"]');
      if (button) {
        button.addEventListener("click", function () {
          const target = document.querySelector("[data-updates], #updates, .updates-page");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            window.dispatchEvent(new CustomEvent("dss:view-updates"));
          }
        });
      }

      // Wait for Firebase to be ready, then apply content
      // If Firebase isn't loaded yet, poll briefly
      let attempts = 0;
      const maxAttempts = 20; // ~2 seconds

      const tryApply = async () => {
        if (window.firebase && firebase.apps && firebase.apps.length) {
          await applyFirestoreContent(banner);
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(tryApply, 100);
        } else {
          console.info("[update-banner] Firebase did not initialize — using default content.");
        }
      };

      tryApply();

      // Listen for future changes so the site updates live
      if (window.firebase && firebase.apps && firebase.apps.length) {
        try {
          const db = window.db || firebase.firestore();
          db.collection(COLLECTION).doc(DOCUMENT_ID).onSnapshot(snap => {
            if (snap.exists) {
              applyFirestoreContent(banner);
            }
          });
        } catch (_) {}
      }
    } catch (error) {
      console.warn("DSS update banner could not be loaded:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadUpdateBanner);
  } else {
    loadUpdateBanner();
  }
})();
