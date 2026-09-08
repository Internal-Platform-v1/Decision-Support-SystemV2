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

document.addEventListener('DOMContentLoaded', initFbcCommentsPage);
document.addEventListener('headerLoaded', initFbcCommentsPage);
