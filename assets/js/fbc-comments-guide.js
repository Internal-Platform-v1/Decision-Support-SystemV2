let fbcInitialized = false;

function showToast(message = 'Copied!') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 1400);
}

function scrollToBuilder() {
  const target = document.getElementById('fbcBuilder');
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.scrollY - 20;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

function updateReminderAttention() {
  const button = document.getElementById('viewRemindersBtn');
  if (!button) return;
  const acknowledged = sessionStorage.getItem('fbcReminderAcknowledged') === 'true';
  button.classList.toggle('reminder-attention', !acknowledged);
}

function syncReminderCheckbox() {
  const check = document.getElementById('reminderReadCheck');
  if (!check) return;
  check.checked = sessionStorage.getItem('fbcReminderAcknowledged') === 'true';
}

function initFbcCommentsPage() {
  if (fbcInitialized) return;
  fbcInitialized = true;

  const queueTypeSelect = document.getElementById('queueTypeSelect');
  const actionTakenSelect = document.getElementById('actionTakenSelect');
  const caseNumberInput = document.getElementById('caseNumberInput');
  const generatedCommentBox = document.getElementById('generatedCommentBox');
  const statusPill = document.getElementById('statusPill');
  const selectedQueueValue = document.getElementById('selectedQueueValue');
  const selectedActionValue = document.getElementById('selectedActionValue');
  const selectedCodeValue = document.getElementById('selectedCodeValue');
  const generatorStatusValue = document.getElementById('generatorStatusValue');
  const heroQueueCount = document.getElementById('heroQueueCount');
  const heroActionCount = document.getElementById('heroActionCount');

  let DATA = [];

  function setStatus(label) {
    statusPill.textContent = label;
  }

  function normalizeRows(rows) {
    return rows
      .map(row => ({
        queueType: String(row['Queue Type'] || '').trim(),
        action: String(row['Action'] || '').trim(),
        code: String(row['2x4 Comment '] || row['2x4 Comment'] || '').trim(),
        recommendedComment: String(row['Recommended Comment'] || '').trim()
      }))
      .filter(row => row.queueType && row.action);
  }

  function populateQueueTypes() {
    const queueTypes = [...new Set(DATA.map(item => item.queueType))].sort();
    queueTypeSelect.innerHTML = '<option value="">Select Queue Type</option>';
    queueTypes.forEach(queue => {
      const option = document.createElement('option');
      option.value = queue;
      option.textContent = queue;
      queueTypeSelect.appendChild(option);
    });
    heroQueueCount.textContent = queueTypes.length || '—';
  }

  function populateActions(queueType) {
    actionTakenSelect.innerHTML = '<option value="">Select Action Taken</option>';
    if (!queueType) {
      actionTakenSelect.disabled = true;
      heroActionCount.textContent = '—';
      return;
    }

    const actions = [...new Set(DATA.filter(item => item.queueType === queueType).map(item => item.action))].sort();
    actions.forEach(action => {
      const option = document.createElement('option');
      option.value = action;
      option.textContent = action;
      actionTakenSelect.appendChild(option);
    });

    actionTakenSelect.disabled = false;
    heroActionCount.textContent = actions.length || '—';
  }

  function getSelectedRow() {
    const queueType = queueTypeSelect.value;
    const action = actionTakenSelect.value;
    return DATA.find(item => item.queueType === queueType && item.action === action) || null;
  }

  function updateState() {
    const row = getSelectedRow();

    selectedQueueValue.textContent = queueTypeSelect.value || '—';
    selectedActionValue.textContent = actionTakenSelect.value || '—';
    selectedCodeValue.textContent = row?.code || '—';

    if (!queueTypeSelect.value) {
      generatorStatusValue.textContent = 'Waiting';
      setStatus('Ready');
      return;
    }

    if (!actionTakenSelect.value) {
      generatorStatusValue.textContent = 'Waiting for Action';
      setStatus('Select Action Taken');
      return;
    }

    if (!caseNumberInput.value.trim()) {
      generatorStatusValue.textContent = 'Waiting for Case #';
      setStatus('Enter Case #');
      return;
    }

    generatorStatusValue.textContent = generatedCommentBox.value.trim() ? 'Generated' : 'Ready to Generate';
    setStatus(generatedCommentBox.value.trim() ? 'Comment Ready' : 'Ready to Generate');
  }

  window.generateFbcComment = function () {
    if (sessionStorage.getItem('fbcReminderAcknowledged') !== 'true') {
      openReminderModal(true);
      return;
    }
    generateFbcCommentNow();
  };

  function generateFbcCommentNow() {
    const row = getSelectedRow();
    const caseNumber = caseNumberInput.value.trim();

    if (!queueTypeSelect.value || !actionTakenSelect.value || !caseNumber) {
      showToast('Complete Queue Type, Action Taken, and Case # first.');
      updateState();
      return;
    }

    if (!row) {
      showToast('No matching comment found.');
      generatorStatusValue.textContent = 'No Match';
      setStatus('No Match');
      return;
    }

    const code = row.code || 'VS-BLER';
    const recommendedComment = row.recommendedComment || '';
    generatedCommentBox.value = `${code}-${caseNumber}-${recommendedComment}`;
    generatorStatusValue.textContent = 'Generated';
    setStatus('Comment Ready');
    showToast('FBC comment generated!');
  };

  window.copyGeneratedComment = function () {
    const text = generatedCommentBox.value.trim();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => showToast('FBC comment copied!'));
  };

  window.clearFbcBuilder = function () {
    queueTypeSelect.value = '';
    actionTakenSelect.innerHTML = '<option value="">Select Action Taken</option>';
    actionTakenSelect.disabled = true;
    caseNumberInput.value = '';
    generatedCommentBox.value = '';
    selectedQueueValue.textContent = '—';
    selectedActionValue.textContent = '—';
    selectedCodeValue.textContent = '—';
    generatorStatusValue.textContent = 'Waiting';
    heroActionCount.textContent = '—';
    setStatus('Ready');
  };

  queueTypeSelect.addEventListener('change', () => {
    populateActions(queueTypeSelect.value);
    actionTakenSelect.value = '';
    generatedCommentBox.value = '';
    updateState();
  });

  actionTakenSelect.addEventListener('change', () => {
    generatedCommentBox.value = '';
    updateState();
  });
  caseNumberInput.addEventListener('input', () => {
    generatedCommentBox.value = '';
    updateState();
  });

  const workbookPaths = ['assets/references/FBC-comment.xlsx'];

  (async function loadWorkbook() {
    let buffer = null;
    for (const path of workbookPaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          buffer = await response.arrayBuffer();
          break;
        }
      } catch (error) {}
    }

    if (!buffer) {
      setStatus('Workbook Missing');
      generatorStatusValue.textContent = 'Workbook Missing';
      generatedCommentBox.value = 'Unable to load FBC-comment.xlsx. Make sure the workbook is saved in the same folder as this page.';
      return;
    }

    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    DATA = normalizeRows(rawRows);
    populateQueueTypes();
    generatorStatusValue.textContent = 'Ready';
    setStatus('Ready');
  })();
}

function getFbcFullscreenBounds() {
  const shell = document.querySelector('.app-shell');
  const header = document.getElementById('header-placeholder');
  const footer = document.getElementById('footer-placeholder');
  if (!shell) return null;

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

function syncFbcFullscreenBounds() {
  const workspace = document.getElementById('fbcBuilder');
  if (!workspace || !workspace.classList.contains('fbc-fullscreen')) return;

  const bounds = getFbcFullscreenBounds();
  if (!bounds) return;

  workspace.style.setProperty('--fbc-fullscreen-top', `${bounds.top}px`);
  workspace.style.setProperty('--fbc-fullscreen-bottom', `${bounds.bottom}px`);
  workspace.style.setProperty('--fbc-fullscreen-left', `${bounds.left}px`);
  workspace.style.setProperty('--fbc-fullscreen-width', `${bounds.width}px`);
}

function updateFbcFullscreenButton() {
  const button = document.getElementById('fbcFullscreenBtn');
  const workspace = document.getElementById('fbcBuilder');
  if (!button || !workspace) return;

  const active = workspace.classList.contains('fbc-fullscreen');
  button.classList.toggle('active', active);
  button.setAttribute('aria-pressed', active ? 'true' : 'false');
  button.innerHTML = active
    ? '<i class="fa-solid fa-compress"></i><span>Exit Full Screen</span>'
    : '<i class="fa-solid fa-expand"></i><span>Full Screen</span>';
  button.title = active
    ? 'Return FBC Comment Generator to the normal page layout'
    : 'Expand FBC Comment Generator to the page body';
}

function toggleFbcFullscreen() {
  const workspace = document.getElementById('fbcBuilder');
  if (!workspace) return;

  const entering = !workspace.classList.contains('fbc-fullscreen');

  if (entering) {
    const bounds = getFbcFullscreenBounds();
    if (bounds) {
      workspace.style.setProperty('--fbc-fullscreen-top', `${bounds.top}px`);
      workspace.style.setProperty('--fbc-fullscreen-bottom', `${bounds.bottom}px`);
      workspace.style.setProperty('--fbc-fullscreen-left', `${bounds.left}px`);
      workspace.style.setProperty('--fbc-fullscreen-width', `${bounds.width}px`);
    }

    workspace.classList.add('fbc-fullscreen');
    document.documentElement.classList.add('fbc-fullscreen-active');
    document.body.classList.add('fbc-fullscreen-active');

    updateFbcFullscreenButton();
    syncFbcFullscreenBounds();

    setTimeout(syncFbcFullscreenBounds, 50);
  } else {
    workspace.classList.remove('fbc-fullscreen');
    document.documentElement.classList.remove('fbc-fullscreen-active');
    document.body.classList.remove('fbc-fullscreen-active');

    workspace.style.removeProperty('--fbc-fullscreen-top');
    workspace.style.removeProperty('--fbc-fullscreen-bottom');
    workspace.style.removeProperty('--fbc-fullscreen-left');
    workspace.style.removeProperty('--fbc-fullscreen-width');

    updateFbcFullscreenButton();
  }
}

window.toggleFbcFullscreen = toggleFbcFullscreen;
window.addEventListener('resize', syncFbcFullscreenBounds);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const workspace = document.getElementById('fbcBuilder');
    if (workspace?.classList.contains('fbc-fullscreen')) {
      toggleFbcFullscreen();
    }
  }
});

document.addEventListener('headerLoaded', () => {
  updateReminderAttention();
  syncFbcFullscreenBounds();
  updateFbcFullscreenButton();
});

document.addEventListener('DOMContentLoaded', () => { initFbcCommentsPage(); updateReminderAttention(); });
document.addEventListener('headerLoaded', initFbcCommentsPage);


function openReminderModal(fromGenerate = false) {
  const modal = document.getElementById('reminderModal');
  if (!modal) return;
  syncReminderCheckbox();
  modal.dataset.fromGenerate = fromGenerate ? 'true' : 'false';
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeReminderModal() {
  const modal = document.getElementById('reminderModal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function acknowledgeReminder() {
  const check = document.getElementById('reminderReadCheck');
  if (!check || !check.checked) {
    showToast('Please confirm that you read the reminder.');
    return;
  }
  sessionStorage.setItem('fbcReminderAcknowledged', 'true');
  updateReminderAttention();
  const modal = document.getElementById('reminderModal');
  const continueToGenerate = modal && modal.dataset.fromGenerate === 'true';
  closeReminderModal();
  if (continueToGenerate) generateFbcComment();
}

document.addEventListener('change', event => {
  if (event.target && event.target.id === 'reminderReadCheck') {
    if (event.target.checked) {
      sessionStorage.setItem('fbcReminderAcknowledged', 'true');
    } else {
      sessionStorage.removeItem('fbcReminderAcknowledged');
    }
    updateReminderAttention();
  }
});

document.addEventListener('click', event => {
  const modal = document.getElementById('reminderModal');
  if (modal && event.target === modal) closeReminderModal();
});


let currentFbiStep = 0;
let fbiAutoPlayTimer = null;
function getFbiSteps(){return Array.from(document.querySelectorAll('#fbiModal .fbi-step'));}
function updateFbiProgress(){const steps=getFbiSteps(), total=steps.length||1, current=currentFbiStep+1; const t=document.getElementById('fbiStepCounter'), pct=document.getElementById('fbiProgressPercent'), fill=document.getElementById('fbiProgressFill'), prev=document.getElementById('fbiPrevBtn'), next=document.getElementById('fbiNextBtn'); if(t)t.textContent=`Step ${current} of ${total}`; if(pct)pct.textContent=`${Math.round(current/total*100)}% Complete`; if(fill)fill.style.width=`${current/total*100}%`; if(prev)prev.disabled=currentFbiStep===0; if(next)next.textContent=current===total?'Finish':'Next'; document.querySelectorAll('.fbi-dot').forEach((d,i)=>d.classList.toggle('active',i===currentFbiStep));}
function showFbiStep(i){const a=getFbiSteps();if(!a.length)return;currentFbiStep=Math.max(0,Math.min(i,a.length-1));a.forEach((x,n)=>x.classList.toggle('active',n===currentFbiStep));updateFbiProgress();}
function openFbiModal(){const m=document.getElementById('fbiModal');if(!m)return;m.classList.add('show');m.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');showFbiStep(0);}
function closeFbiModal(){const m=document.getElementById('fbiModal');if(!m)return;m.classList.remove('show');m.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');}
function nextFbiStep(){if(currentFbiStep>=getFbiSteps().length-1)closeFbiModal();else showFbiStep(currentFbiStep+1);}
function prevFbiStep(){showFbiStep(currentFbiStep-1);}
function goToFbiStep(i){showFbiStep(i);}
function zoomFbiImage(img){const m=document.getElementById('imageZoomModal'),z=document.getElementById('zoomedFbiImage');if(!m||!z)return;z.src=img.src;m.classList.add('show');}
function closeFbiZoom(){document.getElementById('imageZoomModal')?.classList.remove('show');}
