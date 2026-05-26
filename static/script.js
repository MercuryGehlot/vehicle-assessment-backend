/* ============================================================
   Vahan नेत्र — script.js
   Backend: FastAPI + YOLOv8  ·  POST /assess-damage/
   ============================================================ */

'use strict';

// ── STATE ──────────────────────────────────────────────────
var currentFile = null;
var lastResult  = null;
var isLoggedIn  = false;
var stepTimer   = null;
var toastTimer  = null;

function API() {
  return (document.getElementById('apiUrl').value || 'http://localhost:8000').replace(/\/+$/, '');
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initBoundingBoxes();
  initScrollReveal();
});

// ── BOUNDING BOXES (hero animation) ───────────────────────
function initBoundingBoxes() {
  setTimeout(function() {
    document.querySelectorAll('.bb').forEach(function(el, i) {
      setTimeout(function() { el.classList.add('show'); }, i * 700 + 900);
    });
  }, 400);
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('vi'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv').forEach(function(el) { io.observe(el); });
}

// ── DRAG & DROP ───────────────────────────────────────────
function dragOver(e) {
  e.preventDefault();
  document.getElementById('uploadZone').classList.add('drag');
}

function dragLeave() {
  document.getElementById('uploadZone').classList.remove('drag');
}

function dropFile(e) {
  e.preventDefault();
  dragLeave();
  var file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processFile(file);
  } else {
    showToast('Please drop an image file', '⚠️');
  }
}

function handleFile(e) {
  processFile(e.target.files[0]);
}

function processFile(file) {
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    showToast('File too large — max 10MB', '⚠️');
    return;
  }
  currentFile = file;
  var reader  = new FileReader();
  reader.onload = function(ev) {
    document.getElementById('previewImg').src         = ev.target.result;
    document.getElementById('uploadZone').style.display  = 'none';
    document.getElementById('previewWrap').style.display = 'block';
    document.getElementById('vehicleForm').style.display = 'block';
    setStatus('idle');
    showState('idle');
    showToast('Image loaded — click Analyze Damage', '📸');
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  currentFile = null;
  lastResult  = null;
  document.getElementById('uploadZone').style.display  = 'block';
  document.getElementById('previewWrap').style.display = 'none';
  document.getElementById('vehicleForm').style.display = 'none';
  document.getElementById('fileInput').value           = '';
  setStatus('idle');
  showState('idle');
}

// ── STATUS HELPERS ─────────────────────────────────────────
function setStatus(s) {
  var pip = document.getElementById('statusPip');
  var tag = document.getElementById('statusTag');
  pip.className = 'status-pip';
  tag.className = 'status-tag';
  if (s === 'idle') {
    pip.classList.add('pip-idle');
    tag.classList.add('st-idle');
    tag.textContent = 'Waiting';
  } else if (s === 'live') {
    pip.classList.add('pip-live');
    tag.classList.add('st-live');
    tag.textContent = 'Analyzing';
  } else if (s === 'done') {
    pip.classList.add('pip-done');
    tag.classList.add('st-done');
    tag.textContent = 'Complete';
  }
}

function showState(s) {
  document.getElementById('idleState').style.display    = s === 'idle'    ? 'block' : 'none';
  document.getElementById('loadState').style.display    = s === 'loading' ? 'block' : 'none';
  document.getElementById('resultsState').style.display = s === 'results' ? 'block' : 'none';
}

// ── LOADING STEP ANIMATION ─────────────────────────────────
function animateSteps() {
  var ids = ['ls1', 'ls2', 'ls3', 'ls4'];
  ids.forEach(function(id) { document.getElementById(id).className = 'ls-item'; });
  var i = 0;
  stepTimer = setInterval(function() {
    if (i > 0) document.getElementById(ids[i - 1]).classList.add('done');
    if (i < ids.length) {
      document.getElementById(ids[i]).classList.add('active');
      i++;
    } else {
      clearInterval(stepTimer);
    }
  }, 700);
}

function stopSteps() {
  clearInterval(stepTimer);
  document.querySelectorAll('.ls-item').forEach(function(el) {
    el.className = 'ls-item done';
  });
}

// ── ANALYZE ───────────────────────────────────────────────
async function analyzeImage() {
  if (!currentFile) {
    showToast('Please select an image first', '⚠️');
    return;
  }

  setStatus('live');
  showState('loading');
  animateSteps();

  var fd = new FormData();
  fd.append('file', currentFile, currentFile.name);

  try {
    var res = await fetch(API() + '/assess-damage/', {
      method: 'POST',
      body: fd
    });

    stopSteps();

    if (!res.ok) throw new Error('HTTP ' + res.status + ' — ' + res.statusText);

    var data = await res.json();
    lastResult = data;
    setTimeout(function() { renderResults(data); }, 400);

  } catch (err) {
    stopSteps();
    setStatus('idle');
    showState('idle');
    showToast(err.message + '. Try "Load Demo Result" to preview UI.', '❌');
  }
}

// ── RENDER RESULTS ─────────────────────────────────────────
function renderResults(data) {
  setStatus('done');
  showState('results');

  var findings = data.findings || [];
  var summary  = data.inspection_summary || {};
  var dsi      = parseFloat(summary.dsi_score || 0);
  var severity = summary.overall_severity || 'Unknown';
  var triage   = summary.triage_category  || 'N/A';
  var procImg  = data.processed_image_url || null;

  // ── damage findings list ──
  var list = document.getElementById('dmgList');
  list.innerHTML = '';

  if (!findings.length) {
    list.innerHTML = '<div style="text-align:center;padding:28px;color:var(--g4);font-size:14px">No damage detected — vehicle appears clean</div>';
  } else {
    findings.forEach(function(f, i) {
      var cls       = f.class || 'Damage';
      var conf      = f.confidence || 0;
      var pct       = Math.round(conf * 100);
      var isDent    = cls.toLowerCase().indexOf('dent')    !== -1;
      var isScratch = cls.toLowerCase().indexOf('scratch') !== -1;
      var col = isDent ? '#f59e0b' : isScratch ? '#ef4444' : '#1a6fdf';
      var bg  = isDent ? '#fef3c7' : isScratch ? '#fee2e2' : '#e8f1fd';
      var emoji = isDent ? '🔨' : isScratch ? '✕' : '⚠';
      var box = f.box || [0,0,0,0];
      var loc = 'Box: [' + box.map(function(v) { return Math.round(v); }).join(', ') + ']';

      var el = document.createElement('div');
      el.className = 'dmg-item';
      el.style.animationDelay = (i * 0.1) + 's';
      el.innerHTML =
        '<div class="dmg-icon-wrap" style="background:' + bg + '">' +
          '<span>' + emoji + '</span>' +
        '</div>' +
        '<div class="dmg-info">' +
          '<div class="dmg-name">' + cls + '</div>' +
          '<div class="dmg-loc">' + loc + '</div>' +
          '<div class="dmg-bar-bg">' +
            '<div class="dmg-bar" data-w="' + pct + '" style="background:' + col + '"></div>' +
          '</div>' +
        '</div>' +
        '<div class="dmg-pct" style="color:' + col + '">' + pct + '%</div>';
      list.appendChild(el);
    });

    setTimeout(function() {
      document.querySelectorAll('.dmg-bar').forEach(function(b) {
        b.style.width = b.dataset.w + '%';
      });
    }, 200);
  }

  // ── DSI box ──
  document.getElementById('dsiBox').style.display = 'block';
  document.getElementById('dsiVal').textContent   = dsi;

  var dsiColor = dsi < 40 ? 'var(--green)' : dsi < 70 ? 'var(--amber)' : 'var(--red)';
  var fill = document.getElementById('dsiFill');
  fill.style.background = dsiColor;
  setTimeout(function() { fill.style.width = Math.min(dsi, 100) + '%'; }, 300);

  document.getElementById('dsiMeta').textContent = 'Triage: ' + triage;

  var badge = document.getElementById('sevBadge');
  badge.textContent      = severity;
  badge.style.background = severity === 'High'     ? '#fee2e2' :
                           severity === 'Moderate' ? '#fef3c7' : 'var(--green-l)';
  badge.style.color      = severity === 'High'     ? '#991b1b' :
                           severity === 'Moderate' ? '#92400e' : 'var(--green)';

  // ── processed image ──
  if (procImg) {
    var url = procImg.indexOf('http') === 0
      ? procImg
      : API() + '/' + procImg.replace(/^\//, '');
    document.getElementById('procImg').src              = url;
    document.getElementById('procImgWrap').style.display = 'block';
  } else {
    document.getElementById('procImgWrap').style.display = 'none';
  }

  showToast('Analysis complete!', '🎯');
}

// ── DEMO DATA ─────────────────────────────────────────────
function loadDemoData() {
  lastResult = {
    inspection_summary: {
      dsi_score:        42.5,
      overall_severity: 'Moderate',
      triage_category:  'STRUCTURAL/FUNCTIONAL'
    },
    processed_image_url: null,
    findings: [
      { class: 'dent',    confidence: 0.94, box: [52,  110, 210, 270] },
      { class: 'dent',    confidence: 0.82, box: [195,  89, 330, 225] },
      { class: 'scratch', confidence: 0.81, box: [388, 155, 620, 305] }
    ]
  };
  document.getElementById('uploadZone').style.display  = 'none';
  document.getElementById('previewWrap').style.display = 'none';
  document.getElementById('vehicleForm').style.display = 'none';
  renderResults(lastResult);
  showToast('Demo data loaded — showing sample results', '🎭');
}

// ── TEST CONNECTION ────────────────────────────────────────
async function testConnection() {
  showToast('Testing backend connection...', '🔌');
  try {
    var res = await fetch(API() + '/', { signal: AbortSignal.timeout(5000) });
    if (res.ok) showToast('Backend connected', '🟢');
    else        showToast('Backend responded HTTP ' + res.status, '⚠️');
  } catch(e) {
    showToast('Cannot reach backend. Run: uvicorn app.main:app --reload', '❌');
  }
}

// ── DOWNLOAD JSON REPORT ──────────────────────────────────
function downloadReport() {
  if (!lastResult) { showToast('No results to download', '⚠️'); return; }

  var report = Object.assign({
    report_generated: new Date().toISOString(),
    vehicle: {
      make:  (document.getElementById('vMake')  || {}).value || '',
      model: (document.getElementById('vModel') || {}).value || '',
      year:  (document.getElementById('vYear')  || {}).value || '',
      plate: (document.getElementById('vPlate') || {}).value || ''
    }
  }, lastResult);

  var blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  var a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'vahan_netra_report_' + Date.now() + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('JSON report downloaded!', '⬇');
}

// ── OPEN AI REPORT GENERATOR ──────────────────────────────
function openAIReport() {
  if (!lastResult) {
    showToast('Run an analysis first to generate a report', '⚠️');
    return;
  }

  var payload = {
    assessment: lastResult,
    vehicle: {
      make:  (document.getElementById('vMake')  || {}).value || '',
      model: (document.getElementById('vModel') || {}).value || '',
      year:  (document.getElementById('vYear')  || {}).value || '',
      plate: (document.getElementById('vPlate') || {}).value || ''
    }
  };

  // Store in sessionStorage so report-generator.html auto-fills on load
  sessionStorage.setItem('vahanNetraResult', JSON.stringify(payload));
  window.open('report-generator.html', '_blank');
}

// ── MODAL ─────────────────────────────────────────────────
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// ── DEMO LOGIN ────────────────────────────────────────────
function loginDemo() {
  var email = document.getElementById('loginEmail').value.trim();
  var pass  = document.getElementById('loginPass').value;

  if (email === 'demo@vahannetra.ai' && pass === 'Demo@2025') {
    isLoggedIn = true;
    closeModal();

    document.getElementById('navAuth').innerHTML =
      '<div class="user-chip">' +
        '<div class="user-avatar">V</div>' +
        'Demo Inspector' +
        '<button onclick="logoutDemo()" style="background:none;border:none;cursor:pointer;color:var(--green);font-size:11px;margin-left:4px;font-family:var(--fn)">sign out</button>' +
      '</div>';

    showToast('Welcome, Demo Inspector!', '🎉');
    loadDemoData();
    setTimeout(function() {
      document.getElementById('analyze').scrollIntoView({ behavior: 'smooth' });
    }, 600);

  } else {
    showToast('Use: demo@vahannetra.ai / Demo@2025', '⚠️');
    ['loginEmail', 'loginPass'].forEach(function(id) {
      var el = document.getElementById(id);
      el.style.borderColor = 'var(--red)';
      setTimeout(function() { el.style.borderColor = ''; }, 2000);
    });
  }
}

function logoutDemo() {
  isLoggedIn = false;
  document.getElementById('navAuth').innerHTML =
    '<button class="demo-badge" onclick="openModal()">' +
      '<span class="demo-dot"></span>Demo Account' +
    '</button>';
  resetUpload();
  showToast('Signed out', '👋');
}

// ── COPY TO CLIPBOARD ─────────────────────────────────────
function copyText(text, msg) {
  navigator.clipboard.writeText(text)
    .then(function()  { showToast(msg, '📋'); })
    .catch(function() { showToast(msg, '📋'); });
}

// ── TOAST ─────────────────────────────────────────────────
function showToast(msg, icon) {
  icon = icon || '✅';
  clearTimeout(toastTimer);
  document.getElementById('toastMsg').textContent  = msg;
  document.getElementById('toastIcon').textContent = icon;
  var t = document.getElementById('toast');
  t.classList.add('show');
  toastTimer = setTimeout(function() { t.classList.remove('show'); }, 4200);
}