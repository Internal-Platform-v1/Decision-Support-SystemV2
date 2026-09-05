
    // =========================================================
    // CORE DIRECTORY SCRIPT (UPDATED WITH INDEX-BASED MODAL)
    // =========================================================

    let caseDirectoryInitialized = false;
    let selectedRating = 0;
    let commentsUnsubscribe = null;
    let ratingStars = [];
    let currentCaseDetailView = localStorage.getItem("caseDetailView") || "default";

    // --- Rating stars (unchanged) ---
    function initRatingStars() {
      ratingStars = Array.from(document.querySelectorAll(".rating-star"));
      ratingStars.forEach(star => {
        star.addEventListener("click", () => {
          selectedRating = Number(star.dataset.value);
          ratingStars.forEach(s => {
            s.classList.toggle("selected", Number(s.dataset.value) <= selectedRating);
          });
        });
      });
    }

    // --- Modal helpers (unchanged) ---
    function openAnimatedModal(modal) {
      if (!modal) return;
      modal.style.display = "flex";
      modal.classList.remove("is-closing");
      requestAnimationFrame(() => {
        modal.classList.add("is-open");
      });
    }

    function closeAnimatedModal(modal, onClosed) {
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.classList.add("is-closing");
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("is-closing");
        if (typeof onClosed === "function") onClosed();
      }, 220);
    }

    function openComment() {
      const modal = document.getElementById("commentModal");
      openAnimatedModal(modal);
    }
    function closeComment() {
      const modal = document.getElementById("commentModal");
      closeAnimatedModal(modal);
    }
    function openHelp() {
      const modal = document.getElementById("helpModal");
      openAnimatedModal(modal);
    }
    function closeHelp() {
      const modal = document.getElementById("helpModal");
      closeAnimatedModal(modal);
    }
    function closeAllComments() {
      const modal = document.getElementById("allCommentsModal");
      closeAnimatedModal(modal, () => {
        if (commentsUnsubscribe) {
          commentsUnsubscribe();
          commentsUnsubscribe = null;
        }
      });
    }

    async function sendComment() {
      const name = document.getElementById("commentName")?.value.trim() || "";
      const comment = document.getElementById("commentText")?.value.trim() || "";
      const message = document.getElementById("feedbackMessage");
      if (!selectedRating) {
        if (message) {
          message.style.display = "block";
          message.style.color = "#ef4444";
          message.textContent = "Please select a star rating first.";
        } else {
          alert("Please select a star rating first.");
        }
        return;
      }
      try {
        const db = firebase.firestore();
        await db.collection("feedback").add({
          rating: selectedRating,
          name,
          comment,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        if (message) {
          message.style.display = "block";
          message.style.color = "#16a34a";
          message.textContent = "Thank you. Your feedback has been submitted.";
        }
        const nameInput = document.getElementById("commentName");
        const commentInput = document.getElementById("commentText");
        if (nameInput) nameInput.value = "";
        if (commentInput) commentInput.value = "";
        selectedRating = 0;
        ratingStars.forEach(s => s.classList.remove("selected"));
        setTimeout(() => {
          if (message) message.style.display = "none";
          closeComment();
        }, 1200);
      } catch (error) {
        console.error(error);
        if (message) {
          message.style.display = "block";
          message.style.color = "#ef4444";
          message.textContent = "Something went wrong while sending feedback.";
        } else {
          alert("Something went wrong while sending feedback.");
        }
      }
    }

    function showAllComments() {
      const commentModal = document.getElementById("commentModal");
      const modal = document.getElementById("allCommentsModal");
      const list = document.getElementById("commentsList");
      if (!modal || !list) return;
      list.innerHTML = "<p>Loading comments.</p>";
      if (commentsUnsubscribe) commentsUnsubscribe();
      const db = firebase.firestore();
      const loadComments = () => {
        openAnimatedModal(modal);
        commentsUnsubscribe = db.collection("feedback")
          .orderBy("createdAt", "desc")
          .onSnapshot(snapshot => {
            if (snapshot.empty) {
              list.innerHTML = "<p>No comments yet.</p>";
              return;
            }
            let html = "";
            snapshot.forEach(doc => {
              const item = doc.data();
              const stars = "★".repeat(item.rating || 0) + "☆".repeat(5 - (item.rating || 0));
              html += `
                <div class="comment-list-item">
                  <span class="stars">${stars}</span>
                  <strong>${item.name || "Anonymous"}</strong>
                  <p style="margin:6px 0 0;">${item.comment || "No comment provided."}</p>
                </div>
              `;
            });
            list.innerHTML = html;
          }, error => {
            console.error(error);
            list.innerHTML = "<p>Unable to load comments right now.</p>";
          });
      };
      if (commentModal && commentModal.style.display === "flex") {
        closeAnimatedModal(commentModal, loadComments);
      } else {
        loadComments();
      }
    }

    window.addEventListener("click", (e) => {
      const commentModal = document.getElementById("commentModal");
      const allCommentsModal = document.getElementById("allCommentsModal");
      const helpModal = document.getElementById("helpModal");
      if (e.target === commentModal) closeComment();
      if (e.target === allCommentsModal) closeAllComments();
      if (e.target === helpModal) closeHelp();
    });

    // --- View toggle (unchanged) ---
    function setCaseDetailView(view) {
      currentCaseDetailView = view;
      localStorage.setItem("caseDetailView", view);
      const modalContent = document.getElementById("caseDetailModalContent");
      const toggleBtn = document.getElementById("viewToggleBtn");
      if (!modalContent || !toggleBtn) return;
      if (view === "premium") {
        modalContent.classList.add("premium-mode");
        toggleBtn.classList.add("active");
        toggleBtn.innerHTML = '<i class="fa-solid fa-table-columns"></i>';
        toggleBtn.title = "Switch to default view";
      } else {
        modalContent.classList.remove("premium-mode");
        toggleBtn.classList.remove("active");
        toggleBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i>';
        toggleBtn.title = "Switch to premium view";
      }
    }

    function toggleView() {
      if (currentCaseDetailView === "default") {
        setCaseDetailView("premium");
      } else {
        setCaseDetailView("default");
      }
    }

    // =========================================================
    // FIXED: openCaseDetail now accepts a row object directly
    // =========================================================
    function openCaseDetail(row) {
      // row is the JavaScript object
      if (!row) return;

      const modal = document.getElementById("caseDetailModal");

      const queue = row["QUEUE/ Request"] || "";
      const concern = row["Concern"] || "";
      const action = row["ACTION"] || "";
      const email = row["Email Address"] || "";
      const assignment = row["Case Assignment/Email"] || "";

      document.getElementById("detailQueue").textContent = queue;
      document.getElementById("detailConcern").textContent = concern;
      document.getElementById("detailAction").textContent = action;
      document.getElementById("detailEmail").textContent = email;
      document.getElementById("detailAssignment").textContent = assignment;

      document.getElementById("premiumDetailQueue").textContent = queue;
      document.getElementById("premiumDetailConcern").textContent = concern;
      document.getElementById("premiumDetailAction").textContent = action;
      document.getElementById("premiumDetailEmail").textContent = email;
      document.getElementById("premiumDetailAssignment").textContent = assignment;

      if (document.fullscreenElement) {
    setCaseDetailView("premium");
} else {
    setCaseDetailView(currentCaseDetailView);
}

      modal.style.display = "flex";
      modal.classList.remove("is-closing");
      document.body.classList.add("modal-open");

      requestAnimationFrame(() => {
        modal.classList.add("is-open");
      });
    }

    function closeCaseDetail() {
      const modal = document.getElementById("caseDetailModal");
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.classList.add("is-closing");
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("is-closing");
        document.body.classList.remove("modal-open");
      }, 220);
    }

    window.addEventListener("click", (e) => {
      const caseDetailModal = document.getElementById("caseDetailModal");
      if (e.target === caseDetailModal) closeCaseDetail();
    });

    // =========================================================
    // CASE DIRECTORY INIT (UPDATED)
    // =========================================================
    function initCaseDirectoryPage() {
      if (caseDirectoryInitialized) return;
      caseDirectoryInitialized = true;

      const rowsEl = document.getElementById("rows");
      const searchInput = document.getElementById("directorySearch");
      const clearBtn = document.getElementById("clearSearchBtn");
      const emptyState = document.getElementById("emptyState");
      const heroCaseCount = document.getElementById("heroCaseCount");
      const heroQueueCount = document.getElementById("heroQueueCount");
      const heroMatchCount = document.getElementById("heroMatchCount");
      const totalRowsValue = document.getElementById("totalRowsValue");
      const uniqueQueuesValue = document.getElementById("uniqueQueuesValue");
      const visibleResultsValue = document.getElementById("visibleResultsValue");
      const statusPill = document.getElementById("statusPill");
      const tableWrap = document.getElementById("tableWrap");

      let CASES = [];

      function setStatus(label, icon = "fa-bolt") {
        statusPill.innerHTML = `<i class="fa-solid ${icon}"></i> ${label}`;
      }

      function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      function updateCounts(rows) {
        const uniqueQueues = [...new Set(CASES.map(r => (r["QUEUE/ Request"] || "").trim()).filter(Boolean))];
        heroCaseCount.textContent = CASES.length || "0";
        totalRowsValue.textContent = CASES.length || "0";
        heroQueueCount.textContent = uniqueQueues.length || "0";
        uniqueQueuesValue.textContent = uniqueQueues.length || "0";
        heroMatchCount.textContent = rows.length || "0";
        visibleResultsValue.textContent = rows.length || "0";

        if (!CASES.length) {
          setStatus("Waiting for Data", "fa-database");
        } else if (!rows.length) {
          setStatus("No Match Found", "fa-circle-exclamation");
        } else if ((searchInput.value || "").trim()) {
          setStatus("Filtered Results", "fa-filter");
        } else {
          setStatus("Directory Ready", "fa-circle-check");
        }
      }

      function highlightText(value, query) {
        if (!query) return value || "";
        const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
        return String(value || "").replace(regex, '<mark class="search-highlight">$1</mark>');
      }

      // =========================================================
      // RENDER TABLE – now uses data-original-index
      // =========================================================
      function renderTable(rows, query = "") {
        if (!rows.length) {
          rowsEl.innerHTML = "";
          emptyState.style.display = "block";
          updateCounts(rows);
          if (tableWrap) tableWrap.scrollTop = 0;
          return;
        }

        emptyState.style.display = "none";

        rowsEl.innerHTML = rows.map(r => {
          // Find the index of this row in the original CASES array
          const idx = CASES.indexOf(r);
          // If not found (should never happen), fallback to -1
          return `
            <tr>
              <td>
                <span class="queue-link" data-original-index="${idx}">
                  ${highlightText(r["QUEUE/ Request"], query)}
                  <i class="fa-solid fa-up-right-from-square"></i>
                </span>
              </td>
              <td style="white-space:pre-line">${highlightText(r["Concern"], query)}</td>
              <td style="white-space:pre-line">${highlightText(r["ACTION"], query)}</td>
              <td>${highlightText(r["Email Address"], query)}</td>
              <td><pre>${highlightText(r["Case Assignment/Email"], query)}</pre></td>
            </tr>
          `;
        }).join("");

        updateCounts(rows);

        // Scroll to top on search
        if (tableWrap && query && query.trim()) {
          tableWrap.scrollTop = 0;
        }
      }

      function sortMatches(query) {
        if (!query) return CASES;

        const startsWithQueue = [];
        const includesQueue = [];
        const otherMatches = [];

        CASES.forEach(r => {
          const queue = (r["QUEUE/ Request"] || "").toLowerCase().trim();
          const concern = (r["Concern"] || "").toLowerCase().trim();
          const action = (r["ACTION"] || "").toLowerCase().trim();
          const email = (r["Email Address"] || "").toLowerCase().trim();
          const assignment = (r["Case Assignment/Email"] || "").toLowerCase().trim();

          if (queue.startsWith(query)) {
            startsWithQueue.push(r);
          } else if (queue.includes(query)) {
            includesQueue.push(r);
          } else if (
            concern.includes(query) ||
            action.includes(query) ||
            email.includes(query) ||
            assignment.includes(query)
          ) {
            otherMatches.push(r);
          }
        });

        return [...startsWithQueue, ...includesQueue, ...otherMatches];
      }

      // --- Global functions for buttons ---
      window.scrollToDirectory = function() {
        const target = document.getElementById("directoryWorkspace");
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.scrollY - 20;
        window.scrollTo({ top: y, behavior: "smooth" });
      };

      window.clearDirectorySearch = function() {
        searchInput.value = "";
        clearBtn.style.display = "none";
        renderTable(CASES);
        searchInput.focus();
        if (tableWrap) tableWrap.scrollTop = 0;
      };

      window.focusDirectorySearch = function() {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        if (tableWrap) {
          setTimeout(() => { tableWrap.scrollTop = 0; }, 300);
        }
      };

      // --- Load Excel file ---
      fetch("assets/references/case-directory.xlsx")
        .then(res => res.arrayBuffer())
        .then(data => {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          CASES = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          renderTable(CASES);
        })
        .catch(err => {
          console.error("Failed to load XLSX:", err);
          rowsEl.innerHTML = "";
          emptyState.style.display = "block";
          emptyState.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size:28px; margin-bottom:10px; color:#ef4444;"></i>
            <div>Failed to load assets/references/case-directory.xlsx</div>
          `;
          updateCounts([]);
        });

      // --- Search input handler ---
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        clearBtn.style.display = query ? "block" : "none";

        if (!query) {
          renderTable(CASES);
          if (tableWrap) tableWrap.scrollTop = 0;
          return;
        }

        const filtered = sortMatches(query);
        renderTable(filtered, query);

        if (tableWrap) {
          tableWrap.scrollTop = 0;
        }

        // Ensure the directory section is visible
        const workspace = document.getElementById("directoryWorkspace");
        if (workspace) {
          const rect = workspace.getBoundingClientRect();
          if (rect.top < 0 || rect.bottom > window.innerHeight) {
            workspace.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });

      // =========================================================
      // CLICK DELEGATION – uses data-original-index
      // =========================================================
      rowsEl.addEventListener("click", (e) => {
        const link = e.target.closest(".queue-link");
        if (link) {
          const idx = parseInt(link.dataset.originalIndex, 10);
          if (!isNaN(idx) && idx >= 0 && idx < CASES.length) {
            openCaseDetail(CASES[idx]);
          } else {
            // Fallback: try the old data-row method (if present)
            const encoded = link.dataset.row;
            if (encoded) {
              try {
                const jsonStr = decodeURIComponent(encoded);
                const row = JSON.parse(jsonStr);
                openCaseDetail(row);
              } catch (err) {
                console.error("Fallback modal open failed:", err);
              }
            } else {
              console.warn("No data found for row", link);
            }
          }
        }
      });

      // Also scroll table to top when "Focus search" is clicked
      document.querySelector(".directory-search-btn")?.addEventListener("click", () => {
        if (tableWrap) {
          setTimeout(() => { tableWrap.scrollTop = 0; }, 200);
        }
      });
    }

    // --- Init on DOM ready ---
    document.addEventListener("DOMContentLoaded", initCaseDirectoryPage);
    document.addEventListener("headerLoaded", () => {
      initRatingStars();
      if (!caseDirectoryInitialized) {
        initCaseDirectoryPage();
      }
    });

    // ===== Full Screen Toggle =====
// ===== Full Screen Toggle =====
const fullscreenBtn = document.getElementById("fullscreenBtn");
const directoryCard = document.querySelector(".directory-main");
const caseModal = document.getElementById("caseDetailModal");


if (fullscreenBtn && directoryCard && caseModal) {

    const icon = fullscreenBtn.querySelector("i");
    const originalParent = caseModal.parentNode;

    fullscreenBtn.addEventListener("click", async () => {
        try {
            if (!document.fullscreenElement) {

                // Move modal into fullscreen container
                directoryCard.appendChild(caseModal);

                await directoryCard.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }
        } catch (err) {
            console.error("Fullscreen error:", err);
        }
    });

    document.addEventListener("fullscreenchange", () => {

        if (document.fullscreenElement) {

            icon.className = "fa-solid fa-compress";
            fullscreenBtn.title = "Exit Full Screen";

        } else {

            icon.className = "fa-solid fa-expand";
            fullscreenBtn.title = "View Full Screen";

            // Restore modal
            originalParent.appendChild(caseModal);

            // Restore user's preferred view
            setCaseDetailView(currentCaseDetailView);
        }

    });

}
  