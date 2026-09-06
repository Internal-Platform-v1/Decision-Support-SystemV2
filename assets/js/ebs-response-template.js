
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDjaMdeh0Cgx00hzDyZOi54fDkR81wnxJU",
    authDomain: "bdgg-database.firebaseapp.com",
    projectId: "bdgg-database",
    storageBucket: "bdgg-database.appspot.com",
    messagingSenderId: "43574975434",
    appId: "1:43574975434:web:4c79e581267fdfcc6ccd33"
  });
}

window.auth = firebase.auth();
window.db = firebase.firestore();

/* =========================================================
   PAGE AUTH GUARD
   Prevents direct URL access to links.html without login
========================================================= */
window.auth.onAuthStateChanged(async function(user) {
  try {
    if (!user) {
      window.location.replace("index.html");
      return;
    }

    await user.reload();

    const refreshedUser = window.auth.currentUser;

    if (!refreshedUser || !refreshedUser.emailVerified) {
      window.location.replace("index.html");
      return;
    }

    /*
      Optional domain restriction.
      Leave this OFF if you have approved users using @iqor.com, @gmail.com,
      or other emails in Firebase Auth.

      To turn it on, uncomment this block:

      const email = refreshedUser.email.toLowerCase();
      const allowedDomain = email.endsWith("@fedexfreight.com");

      if (!allowedDomain) {
        window.location.replace("index.html");
        return;
      }
    */

    document.documentElement.classList.remove("page-protected");

  } catch (error) {
    console.error("Auth guard error:", error);
    window.location.replace("index.html");
  }
});


window.SITE_BASE = "";


let ebsPageInitialized = false;
let selectedRating = 0;
let commentsUnsubscribe = null;
let ratingStars = [];

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

function initEbsPage() {
  if (ebsPageInitialized) return;
  ebsPageInitialized = true;

  let DATA = [];

  const concernSelect = document.getElementById("concernSelect");
  const typeSelect = document.getElementById("typeSelect");
  const responseBox = document.getElementById("responseBox");
  const noteBox = document.getElementById("noteBox");
  const descBox = document.getElementById("descBox");
  const selectedConcernValue = document.getElementById("selectedConcernValue");
  const selectedTypeValue = document.getElementById("selectedTypeValue");
  const templateStatusValue = document.getElementById("templateStatusValue");
  const statusPill = document.getElementById("statusPill");
  const heroConcernCount = document.getElementById("heroConcernCount");
  const heroTypeCount = document.getElementById("heroTypeCount");

  function setStatus(label) {
    statusPill.textContent = label;
  }

  window.scrollToBuilder = function () {
    const target = document.getElementById("ebsBuilder");
    if (!target) return;

    const y = target.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  };

  function showToast(msg = "Copied!") {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
    }, 1400);
  }

  function stripWrappingQuotes(text) {
    if (!text) return "";
    if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("“") && text.endsWith("”"))) {
      return text.slice(1, -1);
    }
    return text;
  }

  function normalizeRows(rows) {
    let lastConcern = "";
    let lastDesc = "";

    return rows.map(r => {
      r.Concern = (r.Concern || "").trim();
      r.Description = (r.Description || "").trim();
      r.Type = (r.Type || "").trim();
      r["Response Template"] = r["Response Template"] || "";
      r.Note = (r.Note || "").trim();

      if (r.Concern) lastConcern = r.Concern;
      else r.Concern = lastConcern;

      if (r.Description) lastDesc = r.Description;
      else r.Description = lastDesc;

      return r;
    });
  }

  function formatEmailSpacing(text) {
    if (!text) return "";
    let t = text.replace(/\r\n/g, "\n");
    t = t.replace(/\n{2,}/g, "\n\n");
    t = t.replace(/([^\n])\n([^\n])/g, "$1\n\n$2");
    return t;
  }

  function populateConcernOptions(list) {
    const current = concernSelect.value;
    concernSelect.innerHTML = `<option value="">Select Concern</option>`;

    list.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      concernSelect.appendChild(opt);
    });

    if (current && list.includes(current)) concernSelect.value = current;
    heroConcernCount.textContent = list.length;
  }

  function updateHeroTypeCount() {
    const concern = concernSelect.value;
    if (!concern) {
      heroTypeCount.textContent = "—";
      return;
    }

    const count = [...new Set(
      DATA.filter(r => r.Concern === concern).map(r => r.Type).filter(Boolean)
    )].length;

    heroTypeCount.textContent = count;
  }

  function updateSnapshot() {
    selectedConcernValue.textContent = concernSelect.value || "—";
    selectedTypeValue.textContent = typeSelect.value || "—";
    updateHeroTypeCount();

    if (responseBox.value.trim()) {
      templateStatusValue.textContent = "Loaded";
      setStatus("Template Ready");
    } else if (concernSelect.value && typeSelect.value) {
      templateStatusValue.textContent = "No Match";
      setStatus("Review Selection");
    } else if (concernSelect.value) {
      templateStatusValue.textContent = "Waiting for Type";
      setStatus("Select Type");
    } else {
      templateStatusValue.textContent = "Waiting";
      setStatus("Ready");
    }
  }

  function updateEmailLinks() {
    const concern = concernSelect.value || "EBS Response";
    const type = typeSelect.value || "";
    const body = responseBox.value || "";
    const subject = encodeURIComponent(`${concern}${type ? " — " + type : ""}`);
    const encodedBody = encodeURIComponent(body);

    document.getElementById("outlookLink").href =
      `https://outlook.office.com/mail/deeplink/compose?subject=${subject}&body=${encodedBody}`;
  }

  function clearTemplateState() {
    responseBox.value = "";
    noteBox.style.display = "none";
    noteBox.textContent = "";
    updateEmailLinks();
    updateSnapshot();
  }

  fetch("assets/references/ebs-response.ods")
    .then(res => res.arrayBuffer())
    .then(buf => {
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        header: ["Concern", "Description", "Type", "Response Template", "Note"],
        range: 1
      });

      DATA = normalizeRows(raw);
      const fullConcernList = [...new Set(DATA.map(r => r.Concern).filter(Boolean))].sort();
      populateConcernOptions(fullConcernList);
      updateSnapshot();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load ebs-response.ods");
    });

  concernSelect.addEventListener("change", function () {
    const concern = this.value;

    typeSelect.innerHTML = `<option value="">Select Type</option>`;
    descBox.textContent = "Select a concern to view the description.";
    descBox.classList.add("empty");
    typeSelect.disabled = true;
    clearTemplateState();

    if (!concern) {
      updateSnapshot();
      return;
    }

    const rows = DATA.filter(r => r.Concern === concern);
    descBox.textContent = rows[0]?.Description || "No description available.";
    descBox.classList.remove("empty");

    const types = [...new Set(rows.map(r => r.Type).filter(Boolean))].sort();
    types.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      typeSelect.appendChild(opt);
    });

    typeSelect.disabled = false;
    updateSnapshot();
  });

  typeSelect.addEventListener("change", function () {
    const concern = concernSelect.value;
    const type = this.value;

    if (!concern || !type) {
      clearTemplateState();
      return;
    }

    const match = DATA.find(r => r.Concern === concern && r.Type === type);
    if (!match) {
      clearTemplateState();
      templateStatusValue.textContent = "No Match";
      setStatus("No Template Found");
      return;
    }

    responseBox.value = formatEmailSpacing(stripWrappingQuotes(match["Response Template"] || ""));

    if (match.Note) {
      noteBox.style.display = "block";
      noteBox.textContent = "Note: " + match.Note;
    } else {
      noteBox.style.display = "none";
      noteBox.textContent = "";
    }

    updateEmailLinks();
    updateSnapshot();
  });

  window.copyResponse = function () {
    const text = responseBox.value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => showToast("Response copied!"));
  };

  updateSnapshot();
  updateEmailLinks();
}

document.addEventListener("DOMContentLoaded", initEbsPage);
document.addEventListener("headerLoaded", () => {
  initRatingStars();
  initEbsPage();
});
