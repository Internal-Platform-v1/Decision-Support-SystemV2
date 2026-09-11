window.SITE_BASE = "";

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

let linksPageInitialized = false;
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
  openAnimatedModal(document.getElementById("commentModal"));
}

function closeComment() {
  closeAnimatedModal(document.getElementById("commentModal"));
}

function openHelp() {
  openAnimatedModal(document.getElementById("helpModal"));
}

function closeHelp() {
  closeAnimatedModal(document.getElementById("helpModal"));
}

function closeAllComments() {
  closeAnimatedModal(document.getElementById("allCommentsModal"), () => {
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
    await window.db.collection("feedback").add({
      rating: selectedRating,
      name: name || "Anonymous",
      comment,
      page: "Tools & Links Hub",
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

  const loadComments = () => {
    openAnimatedModal(modal);

    commentsUnsubscribe = window.db.collection("feedback")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          list.innerHTML = "<p>No comments yet.</p>";
          return;
        }

        let html = "";

        snapshot.forEach(doc => {
          const item = doc.data();
          const rating = Number(item.rating || 0);
          const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

          html += `
            <div class="comment-list-item">
              <span class="stars">${stars}</span>
              <strong>${escapeHtml(item.name || "Anonymous")}</strong>
              <p style="margin:6px 0 0;">${escapeHtml(item.comment || "No comment provided.")}</p>
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

window.openComment = openComment;
window.closeComment = closeComment;
window.openHelp = openHelp;
window.closeHelp = closeHelp;
window.showAllComments = showAllComments;
window.closeAllComments = closeAllComments;
window.sendComment = sendComment;

window.addEventListener("click", (e) => {
  const commentModal = document.getElementById("commentModal");
  const allCommentsModal = document.getElementById("allCommentsModal");
  const helpModal = document.getElementById("helpModal");

  if (e.target === commentModal) closeComment();
  if (e.target === allCommentsModal) closeAllComments();
  if (e.target === helpModal) closeHelp();
});

const LINKS = [
  {
    name:"iSPI",
    url:"https://myapps.secure.fedex.com/SPI/",
    cat:"system",
    icon:"fa-network-wired",
    desc:"Main internal system access for supported FedEx tools.",
    keywords:["spi","ispi","main system","internal system"]
  },
  {
    name:"Web Imaging",
    url:"http://imaging.freight.fedex.com/Viewer/Home.aspx",
    cat:"tools",
    icon:"fa-image",
    desc:"View shipment documents and imaging records.",
    ispi:true,
    keywords:["web imaging","imaging","documents","viewer","shipment documents"]
  },
  {
    name:"Rules Tariff",
    url:"\\\\iqor.qor.com\\inf-fs\\Commercial\\3rdParty\\3P_C044\\Agent\\FedEx-PHL_Agents\\FedEx Back Office\\Training Materials\\FXF 100 Rules Tariff",
    cat:"system",
    icon:"fa-folder-open",
    desc:"Internal shared-drive access for FXF 100 Rules Tariff materials.",
    internal:true,
    keywords:["rules","tariff","fxf 100","rule"]
  },
  {
    name:"Service Center Locator",
    url:"http://c0013477.prod.cloud.fedex.com:9104/fxfIntranet/servlet/ServiceCenterInfo",
    cat:"tools",
    icon:"fa-location-dot",
    desc:"Locate service centers and related center information.",
    ispi:true,
    keywords:["service center","locator","center","sc","terminal"]
  },
  {
    name:"iSellLookup / Sales Locator",
    url:"https://hr-directory.prod.fedex.com/PeopleDirectory",
    cat:"directory",
    icon:"fa-users",
    desc:"Search people, sales contacts, and internal directory details.",
    ispi:true,
    keywords:["isell","sales","sales locator","people directory","directory"]
  },
  {
    name:"Freight Inspection Tool",
    url:"https://myapps-edc02.secure.fedex.com/FIT/search.xhtml",
    cat:"tools",
    icon:"fa-magnifying-glass-chart",
    desc:"Search and review freight inspection details.",
    ispi:true,
    keywords:["fit","freight inspection","inspection"]
  },
  {
    name:"Freight Accounts Helpful Tips",
    url:"https://myfedex.sharepoint.com/:x:/r/teams/FXFFreightTipsforworkingAccounts/_layouts/15/doc2.aspx?sourcedoc=%7B91EA14EE-37B0-4B89-B1A7-9E0A9559F8B8%7D&file=Freight%20Accounts.xlsx&action=default&mobileredirect=true&cid=d6574d9d-c430-4979-a771-bf7eb0b36e07",
    cat:"tools",
    icon:"fa-file-excel",
    desc:"Helpful Freight account handling tips in SharePoint/Excel.",
    keywords:["freight accounts","helpful tips","account tips","sharepoint","excel"]
  },
  {
    name:"EBS Hub",
    url:"https://ebshub.web.fedex.com/",
    cat:"system",
    icon:"fa-cubes",
    desc:"Main EBS Hub access point.",
    keywords:["ebs","hub","ebshub"]
  },
  {
    name:"RACF ID Lookup",
    url:"https://ebs-powerbi.web.fedex.com/reports/report/EBS/Public_Reports/RACF_Lookup",
    cat:"directory",
    icon:"fa-id-card",
    desc:"Look up RACF ID details through the EBS PowerBI report.",
    keywords:["racf","id lookup","lookup","powerbi"]
  },
  {
    name:"NOST Dashboard",
    url:"https://fxfspot.prod.cloud.fedex.com:8080/spotfire/ui/login?targetUrl=%2Fspotfire%2Fwp%2Fanalysis%3Ffile%3D%2FFXF%2FRQ_S%2526A%2FZ_Users%2FChase%2520King%2FAnalysisFiles%2FNOST%2Fnost_stops%26waid%3DfIhNCccNekutCUHReLoYa-2222546782V1bt%26wavid%3D0",
    cat:"dashboard",
    icon:"fa-chart-line",
    desc:"Spotfire dashboard for NOST-related review.",
    ispi:true,
    keywords:["nost","dashboard","spotfire"]
  },
  {
    name:"ECIS",
    url:"https://ecis.prod.cloud.fedex.com/ecis/",
    cat:"system",
    icon:"fa-database",
    desc:"ECIS internal system access.",
    ispi:true,
    keywords:["ecis"]
  },
  {
    name:"EDM 1.1",
    url:"https://shipment-portal-g.prod.cloud.fedex.com/",
    cat:"system",
    icon:"fa-truck-fast",
    desc:"Shipment portal access for EDM 1.1.",
    ispi:true,
    keywords:["edm","shipment portal","portal"]
  },
  {
    name:"ECAM",
    url:"https://myapps-atl01.secure.fedex.com/ecam/",
    cat:"system",
    icon:"fa-shield-halved",
    desc:"ECAM internal account management access.",
    ispi:true,
    keywords:["ecam"]
  }
];

let currentCategory = "all";
let selectedLink = LINKS[0];

function getFavs(){
  try{
    return JSON.parse(localStorage.getItem("linkHubFavs") || "[]");
  }catch{
    return [];
  }
}

function setFavs(favs){
  localStorage.setItem("linkHubFavs", JSON.stringify(favs));
}

function normalize(text){
  return String(text || "").toLowerCase().trim();
}

function scoreLink(item, query){
  const q = normalize(query)
    .replace(/\b(open|copy|find|show|search|go to|launch|preview|link|tool|please)\b/g,"")
    .trim();

  if(!q) return 1;

  const haystack = [
    item.name,
    item.cat,
    item.desc,
    item.ispi ? "ispi browser needs ispi" : "",
    ...(item.keywords || [])
  ].join(" ").toLowerCase();

  let score = 0;

  if(normalize(item.name).includes(q)) score += 100;
  if(haystack.includes(q)) score += 60;

  q.split(/\s+/).forEach(word => {
    if(word && haystack.includes(word)) score += 15;
  });

  return score;
}

function getFilteredLinks(){
  const input = document.getElementById("linkSearch");
  const query = input ? input.value : "";
  const favs = getFavs();

  return LINKS
    .map(item => ({...item, score:scoreLink(item, query)}))
    .filter(item => {
      const categoryMatch =
        currentCategory === "all" ||
        currentCategory === item.cat ||
        (currentCategory === "ispi" && item.ispi) ||
        (currentCategory === "favorites" && favs.includes(item.name));

      const queryMatch = !query.trim() || item.score > 0;
      return categoryMatch && queryMatch;
    })
    .sort((a,b) => b.score - a.score || a.name.localeCompare(b.name));
}

function renderLinks(){
  const grid = document.getElementById("linksGrid");
  if(!grid) return;

  const links = getFilteredLinks();
  const favs = getFavs();

  document.getElementById("heroLinkCount").textContent = LINKS.length;
  document.getElementById("heroFavoriteCount").textContent = favs.length;
  const resultLabel = links.length ? `${links.length} Result${links.length > 1 ? "s" : ""}` : "No Match";
  const resultStatus = document.getElementById("statusPill");
  if (resultStatus) resultStatus.textContent = resultLabel;
  const workspaceStatus = document.getElementById("linksWorkspaceStatus");
  if (workspaceStatus) workspaceStatus.textContent = links.length ? "Ready" : "No Match";

  grid.innerHTML = "";

  if(!links.length){
    selectedLink = null;
    grid.innerHTML = `<div class="no-results">No matching tools found.</div>`;
    renderPreview();
    updateSnapshot();
    return;
  }

  if(!selectedLink || !links.some(item => item.name === selectedLink.name)){
    selectedLink = LINKS.find(x => x.name === links[0].name) || links[0];
  }

  links.forEach(item => {
    const card = document.createElement("div");
    card.className = "link-card" + (selectedLink && selectedLink.name === item.name ? " active" : "");
    card.onclick = () => selectLink(item.name);

    card.innerHTML = `
      <div class="link-card-top">
        <div class="link-icon"><i class="fa-solid ${item.icon}"></i></div>
        <button class="favorite-star ${favs.includes(item.name) ? "active" : ""}" type="button" onclick="toggleFav('${escapeAttr(item.name)}', event)">
          <i class="fa-solid fa-star"></i>
        </button>
      </div>

      <h5>${escapeHtml(item.name)}</h5>
      <p>${escapeHtml(item.desc)}</p>

      <div class="link-badges">
        <span class="link-tag">${escapeHtml(item.cat)}</span>
        ${item.ispi ? `<span class="link-tag orange">iSPI</span>` : ""}
        ${item.internal ? `<span class="link-tag orange">Internal Path</span>` : ""}
      </div>
    `;

    grid.appendChild(card);
  });

  renderPreview();
  updateSnapshot();
}

function renderPreview(){
  const previewTitle = document.getElementById("previewTitle");
  const previewIcon = document.getElementById("previewIcon");
  const previewDesc = document.getElementById("previewDesc");
  const previewTags = document.getElementById("previewTags");
  const previewUrl = document.getElementById("previewUrl");
  const previewAiNote = document.getElementById("previewAiNote");
  const previewFrameWrap = document.getElementById("previewFrameWrap");

  if(!selectedLink){
    previewTitle.textContent = "Select a link";
    previewIcon.innerHTML = `<i class="fa-solid fa-link"></i>`;
    previewDesc.textContent = "Choose a tool from the list to preview details and actions.";
    previewTags.innerHTML = "";
    previewUrl.textContent = "No link selected.";
    previewAiNote.textContent = "AI recommendation will appear after you search or select a link.";
    previewFrameWrap.innerHTML = "";
    return;
  }

  const canFrame = selectedLink.url && !selectedLink.internal && selectedLink.url.startsWith("https://");

  previewTitle.textContent = selectedLink.name;
  previewIcon.innerHTML = `<i class="fa-solid ${selectedLink.icon}"></i>`;
  previewDesc.textContent = selectedLink.desc;
  previewUrl.textContent = selectedLink.url || "No link available.";

  previewTags.innerHTML = `
    <span class="link-tag">${escapeHtml(selectedLink.cat)}</span>
    ${selectedLink.ispi ? `<span class="link-tag orange">Use iSPI Browser</span>` : ""}
    ${selectedLink.internal ? `<span class="link-tag orange">Internal Path</span>` : ""}
  `;

  previewAiNote.innerHTML = selectedLink.internal
    ? "AI recommendation: This is an internal path. Copy it and open it through the company network."
    : selectedLink.ispi
      ? "AI recommendation: This tool may require iSPI Browser or internal network access."
      : "AI recommendation: This link can be opened directly if you have access.";

  previewFrameWrap.innerHTML = canFrame
    ? `
      <div class="preview-frame">
        <iframe src="${escapeAttr(selectedLink.url)}"></iframe>
      </div>
      <div class="frame-note">Preview may be blocked by some internal systems. If it does not load, use the Open button.</div>
    `
    : `
      <div class="frame-note">Live preview is not available for internal paths, non-HTTPS links, or systems that block embedded preview. Use Open or Copy instead.</div>
    `;
}

function updateSnapshot(){
  document.getElementById("selectedToolValue").textContent = selectedLink?.name || "—";
  document.getElementById("selectedCategoryValue").textContent = selectedLink?.cat || "—";
  const resultStatusValue = document.getElementById("resultStatusValue");
  if (resultStatusValue) resultStatusValue.textContent = selectedLink ? "Ready" : "No Match";
  const selectedResultStatusValue = document.getElementById("selectedResultStatusValue");
  if (selectedResultStatusValue) selectedResultStatusValue.textContent = selectedLink ? "Ready" : "No Match";
}

function updateAiSuggestion(best){
  const input = document.getElementById("linkSearch");
  const box = document.getElementById("aiSuggestion");
  if(!input || !box) return;

  const text = input.value.trim();

  if(!text){
    box.innerHTML = `AI tip: Search normally, or use action words like <strong>open</strong>, <strong>copy</strong>, <strong>find</strong>, and <strong>show</strong>.`;
    return;
  }

  if(best){
    box.innerHTML = `AI found: <strong>${escapeHtml(best.name)}</strong>. Press <strong>Run AI Action</strong> to follow your command.`;
  }else{
    box.innerHTML = `No matching tool found. Try a different keyword.`;
  }
}

function runAiCommand(){
  const input = document.getElementById("linkSearch");
  const query = normalize(input ? input.value : "");
  const matches = getFilteredLinks();

  if(!matches.length){
    showToast("No matching tool found");
    return;
  }

  const best = matches[0];
  selectedLink = LINKS.find(x => x.name === best.name);
  renderLinks();

  if(query.includes("copy")){
    copySelectedLink();
    return;
  }

  if(query.includes("open") || query.includes("launch") || query.includes("go to")){
    openSelectedLink();
    return;
  }

  showToast(`${best.name} selected`);
}

function selectLink(name){
  selectedLink = LINKS.find(x => x.name === name);
  renderLinks();
}

function openSelectedLink(){
  if(!selectedLink) return;

  if(selectedLink.internal){
    copyText(selectedLink.url);
    showToast("Internal path copied");
    alert("This is an internal shared-drive path. I copied it for you. Open it through the company network.");
    return;
  }

  window.open(selectedLink.url, "_blank");
}

function copySelectedLink(){
  if(!selectedLink?.url) return;
  copyText(selectedLink.url);
  showToast("Link copied!");
}

function copyText(text){
  if(!text) return;

  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
  }else{
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text){
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try{
    document.execCommand("copy");
  }catch(error){
    console.error(error);
  }

  document.body.removeChild(textarea);
}

function toggleFav(name, event){
  event.stopPropagation();

  let favs = getFavs();

  if(favs.includes(name)){
    favs = favs.filter(x => x !== name);
    showToast("Removed from favorites");
  }else{
    favs.push(name);
    showToast("Added to favorites");
  }

  setFavs(favs);
  renderLinks();
}

function filterCategory(cat, event){
  currentCategory = cat;

  document.querySelectorAll(".chip").forEach(btn => btn.classList.remove("active"));
  if(event?.currentTarget) event.currentTarget.classList.add("active");

  const matches = getFilteredLinks();
  if(matches.length) selectedLink = LINKS.find(x => x.name === matches[0].name);

  renderLinks();
}

function clearLinkSearch(){
  const input = document.getElementById("linkSearch");
  const btn = document.getElementById("clearSearchBtn");

  if(input) input.value = "";
  if(btn) btn.style.display = "none";

  selectedLink = LINKS[0];
  renderLinks();
  updateAiSuggestion(selectedLink);
}

function scrollToLinksBuilder(){
  const target = document.getElementById("linksBuilder");
  if(!target) return;

  const y = target.getBoundingClientRect().top + window.scrollY - 20;
  window.scrollTo({top:y, behavior:"smooth"});
}

function showToast(msg = "Copied!"){
  const toast = document.getElementById("toast");
  if(!toast) return;

  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 1400);
}

function escapeHtml(str){
  return String(str || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function escapeAttr(str){
  return escapeHtml(str).replaceAll("\\","\\\\");
}



const ONECLICK_SELECTED_KEY = "linkHubOneclickSelected";
const ONECLICK_MANUAL_KEY = "linkHubOneclickManual";
let oneclickCurrentTab = "all";

function getOneclickSelected(){
  try{
    return JSON.parse(localStorage.getItem(ONECLICK_SELECTED_KEY) || "[]");
  }catch{
    return [];
  }
}

function setOneclickSelected(items){
  localStorage.setItem(ONECLICK_SELECTED_KEY, JSON.stringify(items));
}

function getManualOneclickLinks(){
  try{
    return JSON.parse(localStorage.getItem(ONECLICK_MANUAL_KEY) || "[]");
  }catch{
    return [];
  }
}

function setManualOneclickLinks(items){
  localStorage.setItem(ONECLICK_MANUAL_KEY, JSON.stringify(items));
}

function getOneclickLibrary(){
  const manual = getManualOneclickLinks();

  const builtIn = LINKS.map(item => ({
    id:`built:${item.name}`,
    name:item.name,
    url:item.url,
    cat:item.cat,
    icon:item.icon || "fa-link",
    desc:item.desc || "",
    ispi:!!item.ispi,
    internal:!!item.internal,
    manual:false
  }));

  const custom = manual.map(item => ({
    ...item,
    id:item.id || `manual:${item.name}:${item.url}`,
    icon:item.icon || "fa-link",
    cat:"manual",
    manual:true
  }));

  return [...builtIn, ...custom];
}

function normalizeOneclickUrl(url){
  let value = String(url || "").trim();
  if(!value) return "";
  if(value.startsWith("\\\\")) return value;
  if(!/^https?:\/\//i.test(value)) value = "https://" + value;
  return value;
}

function isValidOneclickUrl(url){
  if(!url) return false;
  if(url.startsWith("\\\\")) return true;

  try{
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  }catch{
    return false;
  }
}

function openOneclickModal(){
  const modal = document.getElementById("oneclickModal");
  if(!modal) return;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  renderOneclickTabs();
  renderOneclickOptions();
  renderOneclickSelected();
}

function closeOneclickModal(){
  const modal = document.getElementById("oneclickModal");
  if(!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "";
}

function renderOneclickTabs(){
  const holder = document.getElementById("oneclickTabs");
  if(!holder) return;

  const tabs = [
    {id:"all", label:"All", icon:"fa-layer-group"},
    {id:"favorites", label:"Favorites", icon:"fa-star"},
    {id:"system", label:"System", icon:"fa-server"},
    {id:"tools", label:"Tools", icon:"fa-toolbox"},
    {id:"directory", label:"Directory", icon:"fa-address-book"},
    {id:"dashboard", label:"Dashboard", icon:"fa-chart-line"},
    {id:"ispi", label:"Needs iSPI", icon:"fa-globe"},
    {id:"manual", label:"Manual", icon:"fa-plus"}
  ];

  holder.innerHTML = tabs.map(tab => `
    <button
      class="oneclick-tab ${oneclickCurrentTab === tab.id ? "active" : ""}"
      type="button"
      onclick="setOneclickTab('${tab.id}')"
    >
      <i class="fa-solid ${tab.icon}"></i> ${tab.label}
    </button>
  `).join("");
}

function setOneclickTab(tab){
  oneclickCurrentTab = tab;
  renderOneclickTabs();
  renderOneclickOptions();
}

function getFilteredOneclickLibrary(){
  const search = normalize(document.getElementById("oneclickSearch")?.value || "");
  const favs = getFavs();
  const selected = getOneclickSelected();
  const selectedIds = selected.map(item => item.id);
  const library = getOneclickLibrary();

  return library.filter(item => {
    const tabMatch =
      oneclickCurrentTab === "all" ||
      oneclickCurrentTab === item.cat ||
      (oneclickCurrentTab === "favorites" && favs.includes(item.name)) ||
      (oneclickCurrentTab === "ispi" && item.ispi) ||
      (oneclickCurrentTab === "manual" && item.manual);

    const haystack = [
      item.name,
      item.cat,
      item.desc,
      item.url,
      item.ispi ? "ispi needs browser" : "",
      item.internal ? "internal path shared drive" : ""
    ].join(" ").toLowerCase();

    const searchMatch = !search || haystack.includes(search);
    return tabMatch && searchMatch;
  }).sort((a,b) => {
    const aSelected = selectedIds.includes(a.id) ? 1 : 0;
    const bSelected = selectedIds.includes(b.id) ? 1 : 0;
    return bSelected - aSelected || a.name.localeCompare(b.name);
  });
}

function renderOneclickOptions(){
  const holder = document.getElementById("oneclickOptions");
  if(!holder) return;

  const links = getFilteredOneclickLibrary();
  const selected = getOneclickSelected();
  const selectedIds = selected.map(item => item.id);

  if(!links.length){
    holder.innerHTML = `<div class="oneclick-empty">No links found for this filter.</div>`;
    return;
  }

  const grouped = links.reduce((acc, item) => {
    const group = item.manual
      ? "Manual Links"
      : item.cat === "system"
        ? "System"
        : item.cat === "tools"
          ? "Tools"
          : item.cat === "directory"
            ? "Directory"
            : item.cat === "dashboard"
              ? "Dashboard"
              : "Other Links";

    if(!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  holder.innerHTML = Object.keys(grouped).map(groupName => `
    <div class="oneclick-group">
      <h5 class="oneclick-group-title">
        <i class="fa-solid fa-folder-open"></i>
        ${escapeHtml(groupName)}
      </h5>

      <div class="oneclick-options">
        ${grouped[groupName].map(item => {
          const active = selectedIds.includes(item.id);

          return `
            <div class="oneclick-option ${item.manual ? "manual-option" : ""} ${active ? "active" : ""}" onclick="toggleOneclickLink('${escapeAttr(item.id)}')">
              <div class="oneclick-check">
                ${active ? `<i class="fa-solid fa-check"></i>` : ""}
              </div>

              <div class="oneclick-option-title">
                <strong>
                  <i class="fa-solid ${escapeAttr(item.icon)}"></i>
                  ${escapeHtml(item.name)}
                </strong>
                <span>${escapeHtml(item.desc || item.url)}</span>

                ${item.manual ? `
                  <button
                    class="oneclick-manual-delete-btn"
                    type="button"
                    title="Delete this manual link permanently"
                    onclick="deleteManualOneclickLink('${escapeAttr(item.id)}', event)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                ` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");
}

function renderOneclickSelected(){
  const holder = document.getElementById("oneclickSelectedList");
  if(!holder) return;

  const selected = getOneclickSelected();

  if(!selected.length){
    holder.innerHTML = `<div class="oneclick-empty">No Oneclick links added yet.</div>`;
    return;
  }

  holder.innerHTML = selected.map(item => `
    <div class="oneclick-selected-item">
      <div class="oneclick-selected-info">
        <strong>
          <i class="fa-solid ${escapeAttr(item.icon || "fa-link")}"></i>
          ${escapeHtml(item.name)}
        </strong>
        <span>${escapeHtml(item.url)}</span>
      </div>

      <div class="oneclick-selected-actions">
        ${item.manual ? `
          <button
            class="oneclick-delete-manual-btn"
            type="button"
            title="Delete manual link permanently"
            onclick="deleteManualOneclickLink('${escapeAttr(item.id)}', event)"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        ` : ""}

        <button
          class="oneclick-remove-btn"
          type="button"
          title="Remove from Oneclick list"
          onclick="removeOneclickLink('${escapeAttr(item.id)}')"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `).join("");
}

function toggleOneclickLink(id){
  const library = getOneclickLibrary();
  const item = library.find(link => link.id === id);
  if(!item) return;

  let selected = getOneclickSelected();
  const exists = selected.some(link => link.id === id);

  if(exists){
    selected = selected.filter(link => link.id !== id);
    showToast("Removed from Oneclick");
  }else{
    selected.push({
      id:item.id,
      name:item.name,
      url:item.url,
      cat:item.cat,
      icon:item.icon,
      internal:!!item.internal,
      ispi:!!item.ispi,
      manual:!!item.manual
    });
    showToast("Added to Oneclick");
  }

  setOneclickSelected(selected);
  renderOneclickOptions();
  renderOneclickSelected();
}

function removeOneclickLink(id){
  const selected = getOneclickSelected().filter(item => item.id !== id);
  setOneclickSelected(selected);
  renderOneclickOptions();
  renderOneclickSelected();
  showToast("Removed from Oneclick");
}

function deleteManualOneclickLink(id, event){
  if(event){
    event.stopPropagation();
  }

  const manualLinks = getManualOneclickLinks();
  const target = manualLinks.find(item => item.id === id);

  if(!target){
    showToast("Manual link not found");
    return;
  }

  if(!confirm(`Delete "${target.name}" permanently from this browser?`)){
    return;
  }

  const updatedManualLinks = manualLinks.filter(item => item.id !== id);
  setManualOneclickLinks(updatedManualLinks);

  const updatedSelectedLinks = getOneclickSelected().filter(item => item.id !== id);
  setOneclickSelected(updatedSelectedLinks);

  renderOneclickOptions();
  renderOneclickSelected();

  showToast("Manual link deleted");
}

function clearOneclickLinks(){
  if(!confirm("Clear all saved Oneclick links on this browser?")) return;
  setOneclickSelected([]);
  renderOneclickOptions();
  renderOneclickSelected();
  showToast("Oneclick cleared");
}

function addManualOneclickLink(){
  const nameInput = document.getElementById("manualOneclickName");
  const urlInput = document.getElementById("manualOneclickUrl");

  const name = String(nameInput?.value || "").trim();
  const url = normalizeOneclickUrl(urlInput?.value || "");

  if(!name){
    showToast("Enter a display name");
    return;
  }

  if(!isValidOneclickUrl(url)){
    showToast("Enter a valid link");
    return;
  }

  const manual = getManualOneclickLinks();
  const item = {
    id:`manual:${Date.now()}`,
    name,
    url,
    cat:"manual",
    icon:"fa-link",
    desc:"Manually added Oneclick link.",
    manual:true
  };

  manual.push(item);
  setManualOneclickLinks(manual);

  const selected = getOneclickSelected();
  selected.push(item);
  setOneclickSelected(selected);

  if(nameInput) nameInput.value = "";
  if(urlInput) urlInput.value = "";

  oneclickCurrentTab = "manual";
  renderOneclickTabs();
  renderOneclickOptions();
  renderOneclickSelected();
  showToast("Manual link added");
}


function openOneclickLinks(){
  const selected = getOneclickSelected();

  if(!selected.length){
    showToast("No Oneclick links selected");
    return;
  }

  const webLinks = [];
  const internalPaths = [];

  selected.forEach(item => {
    const url = String(item.url || "").trim();

    if(!url) return;

    if(item.internal || url.startsWith("\\\\")){
      internalPaths.push(`${item.name}: ${url}`);
      return;
    }

    webLinks.push({
      name:item.name,
      url:url
    });
  });

  if(!webLinks.length && !internalPaths.length){
    showToast("No valid Oneclick links found");
    return;
  }

  /*
    IMPORTANT:
    Browsers block multiple popups if they are delayed with setTimeout.
    This opens all blank tabs immediately from the same user click,
    then sends each tab to the correct URL.
  */
  const openedTabs = [];

  webLinks.forEach(item => {
    const newTab = window.open("about:blank", "_blank");

    if(newTab){
      openedTabs.push({
        tab:newTab,
        url:item.url,
        name:item.name
      });
    }
  });

  openedTabs.forEach(item => {
    try{
      item.tab.location.href = item.url;
    }catch(error){
      console.error("Unable to open:", item.name, error);
    }
  });

  if(internalPaths.length){
    copyText(internalPaths.join("\n"));

    alert(
      "Some Oneclick items are internal shared-drive paths. They were copied instead of opened:\n\n" +
      internalPaths.join("\n")
    );
  }

  if(openedTabs.length < webLinks.length){
    alert(
      "Your browser blocked some Oneclick tabs.\n\n" +
      "Please allow pop-ups for this site, then try again."
    );
  }

  if(webLinks.length && internalPaths.length){
    showToast(`Opening ${openedTabs.length} links. Internal paths copied.`);
  }else if(webLinks.length){
    showToast(`Opening ${openedTabs.length} Oneclick links`);
  }else{
    showToast("Internal paths copied");
  }
}


/* =========================================================
   LINKS HUB — PAGE-BODY FULL SCREEN
   Expands only the Links workspace area between the
   existing header and footer. The browser itself is NOT
   placed into Fullscreen API mode, so header/footer stay
   visible and do not move.
   ========================================================= */

function getLinksFullscreenBounds(){
  const shell = document.querySelector(".app-shell");
  const header = document.getElementById("header-placeholder");
  const footer = document.getElementById("footer-placeholder");

  if(!shell) return null;

  const shellRect = shell.getBoundingClientRect();
  const headerRect = header ? header.getBoundingClientRect() : null;
  const footerRect = footer ? footer.getBoundingClientRect() : null;

  const top = headerRect
    ? Math.max(shellRect.top, headerRect.bottom)
    : shellRect.top;

  const bottom = footerRect
    ? Math.min(shellRect.bottom, footerRect.top)
    : shellRect.bottom;

  return {
    top,
    bottom: Math.max(top, bottom),
    left: shellRect.left,
    width: shellRect.width
  };
}

function syncLinksFullscreenBounds(){
  const workspace = document.getElementById("directoryWorkspace");
  if(!workspace || !workspace.classList.contains("links-fullscreen")) return;

  const bounds = getLinksFullscreenBounds();
  if(!bounds) return;

  workspace.style.setProperty("--links-fullscreen-top", `${bounds.top}px`);
  workspace.style.setProperty("--links-fullscreen-bottom", `${bounds.bottom}px`);
  workspace.style.setProperty("--links-fullscreen-left", `${bounds.left}px`);
  workspace.style.setProperty("--links-fullscreen-width", `${bounds.width}px`);
}

function updateLinksFullscreenButton(){
  const button = document.getElementById("linksFullscreenBtn");
  if(!button) return;

  const workspace = document.getElementById("directoryWorkspace");
  const active = workspace?.classList.contains("links-fullscreen");

  button.classList.toggle("active", !!active);
  button.setAttribute("aria-pressed", active ? "true" : "false");

  button.innerHTML = active
    ? `<i class="fa-solid fa-compress"></i><span>Exit Full Screen</span>`
    : `<i class="fa-solid fa-expand"></i><span>Full Screen</span>`;

  button.title = active
    ? "Return Links Hub to the normal page layout"
    : "Expand Links Hub to the page body";
}

function toggleLinksFullscreen(){
  const workspace = document.getElementById("directoryWorkspace");
  if(!workspace) return;

  const entering = !workspace.classList.contains("links-fullscreen");

  if(entering){
    const bounds = getLinksFullscreenBounds();

    if(bounds){
      workspace.style.setProperty("--links-fullscreen-top", `${bounds.top}px`);
      workspace.style.setProperty("--links-fullscreen-bottom", `${bounds.bottom}px`);
      workspace.style.setProperty("--links-fullscreen-left", `${bounds.left}px`);
      workspace.style.setProperty("--links-fullscreen-width", `${bounds.width}px`);
    }

    workspace.classList.add("links-fullscreen");
    document.documentElement.classList.add("links-fullscreen-active");
    document.body.classList.add("links-fullscreen-active");

    updateLinksFullscreenButton();
    syncLinksFullscreenBounds();

    setTimeout(() => {
      syncLinksFullscreenBounds();
    }, 50);
  }else{
    workspace.classList.remove("links-fullscreen");
    document.documentElement.classList.remove("links-fullscreen-active");
    document.body.classList.remove("links-fullscreen-active");

    workspace.style.removeProperty("--links-fullscreen-top");
    workspace.style.removeProperty("--links-fullscreen-bottom");
    workspace.style.removeProperty("--links-fullscreen-left");
    workspace.style.removeProperty("--links-fullscreen-width");

    updateLinksFullscreenButton();
  }
}

window.toggleLinksFullscreen = toggleLinksFullscreen;

window.addEventListener("resize", syncLinksFullscreenBounds);

document.addEventListener("keydown", (event) => {
  if(event.key === "Escape"){
    const workspace = document.getElementById("directoryWorkspace");
    if(workspace?.classList.contains("links-fullscreen")){
      toggleLinksFullscreen();
    }
  }
});

document.addEventListener("headerLoaded", () => {
  syncLinksFullscreenBounds();
  updateLinksFullscreenButton();
});

function initLinksPage(){
  if(linksPageInitialized) return;
  linksPageInitialized = true;

  const input = document.getElementById("linkSearch");
  const clearBtn = document.getElementById("clearSearchBtn");

  if(input){
    input.addEventListener("input", () => {
      if(clearBtn) clearBtn.style.display = input.value.trim() ? "block" : "none";

      const matches = getFilteredLinks();
      if(matches.length) selectedLink = LINKS.find(x => x.name === matches[0].name);

      renderLinks();
      updateAiSuggestion(matches[0]);
    });
  }

  renderLinks();
  updateAiSuggestion(selectedLink);
}

window.runAiCommand = runAiCommand;
window.filterCategory = filterCategory;
window.openSelectedLink = openSelectedLink;
window.copySelectedLink = copySelectedLink;
window.toggleFav = toggleFav;
window.selectLink = selectLink;
window.clearLinkSearch = clearLinkSearch;
window.scrollToLinksBuilder = scrollToLinksBuilder;
window.openOneclickModal = openOneclickModal;
window.closeOneclickModal = closeOneclickModal;
window.setOneclickTab = setOneclickTab;
window.toggleOneclickLink = toggleOneclickLink;
window.removeOneclickLink = removeOneclickLink;
window.deleteManualOneclickLink = deleteManualOneclickLink;
window.clearOneclickLinks = clearOneclickLinks;
window.addManualOneclickLink = addManualOneclickLink;
window.openOneclickLinks = openOneclickLinks;

document.addEventListener("DOMContentLoaded", () => {
  initRatingStars();
  initLinksPage();

  const oneclickSearch = document.getElementById("oneclickSearch");
  if(oneclickSearch){
    oneclickSearch.addEventListener("input", renderOneclickOptions);
  }
});

document.addEventListener("headerLoaded", () => {
  initRatingStars();
  initLinksPage();
});

window.addEventListener("click", (e) => {
  const oneclickModal = document.getElementById("oneclickModal");
  if(e.target === oneclickModal){
    closeOneclickModal();
  }
});