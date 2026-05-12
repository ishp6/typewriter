// ── Audio Engine ──────────────────────────────────────────────
const AudioContext = window.AudioContext || window.webkitAudioContext;
let actx = null;

function getAudio() {
  if (!actx) actx = new AudioContext();
  return actx;
}

function playClick(type) {
  try {
    const ac = getAudio();
    const buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      const t = i / ac.sampleRate;
      const decay = Math.exp(-t * (type === 'key' ? 80 : 40));
      d[i] = (Math.random() * 2 - 1) * decay * (type === 'key' ? 0.4 : 0.6);
      if (type === 'return') d[i] += Math.sin(2 * Math.PI * 440 * t) * decay * 0.2;
    }
    const src = ac.createBufferSource();
    const g = ac.createGain();
    g.gain.value = type === 'space' ? 0.3 : 0.5;
    src.buffer = buf;
    src.connect(g);
    g.connect(ac.destination);
    src.start();
  } catch (e) {}
}

function playDing() {
  try {
    const ac = getAudio();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.frequency.value = 880;
    osc.type = 'triangle';
    g.gain.setValueAtTime(0.4, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.6);
  } catch (e) {}
}

// ── State ─────────────────────────────────────────────────────
let text = '';
const COLS = 42;

// ── Display ───────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function updateDisplay() {
  const el = document.getElementById('typedText');
  const lines = text.split('\n');
  const currentLine = lines[lines.length - 1];
  const col = currentLine.length + 1;
  const lineCount = lines.length;

  // Render text with cursor
  let html = '';
  lines.forEach((line, i) => {
    html += escapeHtml(line);
    if (i < lines.length - 1) html += '\n';
  });
  el.innerHTML = html + '<span class="cursor-block"></span>';

  // Status bar
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  document.getElementById('charCount').textContent = `LINE ${lineCount} · COL ${col}`;
  document.getElementById('wordCount').textContent = `${words.length} WORDS`;

  // Carriage handle position
  const bar = document.getElementById('carriageBar');
  const barWidth = bar.offsetWidth - 38;
  const ratio = currentLine.length / COLS;
  document.getElementById('carriageHandle').style.left =
    Math.min(barWidth * ratio, barWidth) + 'px';

  // Auto-scroll paper
  const paper = document.getElementById('paperContainer');
  paper.scrollTop = paper.scrollHeight;

  // Spin ribbon spools briefly
  ['spool1', 'spool2'].forEach(id => {
    const s = document.getElementById(id);
    s.classList.add('spinning');
    clearTimeout(s._spinTimer);
    s._spinTimer = setTimeout(() => s.classList.remove('spinning'), 300);
  });
}

// ── Type a character ──────────────────────────────────────────
function typeChar(ch) {
  const lines = text.split('\n');
  const currentLine = lines[lines.length - 1];

  if (ch === 'BACK') {
    if (text.length > 0) {
      text = text.slice(0, -1);
      playClick('key');
    }
  } else if (ch === 'RETURN') {
    text += '\n';
    playDing();
    triggerDingFlash();
    playClick('return');
  } else if (ch === ' ') {
    if (currentLine.length >= COLS) {
      text += '\n';
      playDing();
      triggerDingFlash();
    } else {
      text += ' ';
    }
    playClick('space');
  } else {
    if (currentLine.length >= COLS) {
      text += '\n';
    }
    text += ch;
    playClick('key');
  }

  updateDisplay();
}

// ── Bell flash ────────────────────────────────────────────────
function triggerDingFlash() {
  const flash = document.getElementById('dingFlash');
  flash.classList.add('show');
  setTimeout(() => flash.classList.remove('show'), 500);
}

// ── Paper scroll via knobs ────────────────────────────────────
function scrollPaper(dir) {
  const paper = document.getElementById('paperContainer');
  paper.scrollTop += dir * 24;
  playClick('return');
}

// ── On-screen key clicks ──────────────────────────────────────
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('mousedown', e => {
    e.preventDefault();
    key.classList.add('pressed');
    typeChar(key.dataset.char);
  });
  key.addEventListener('mouseup', () => key.classList.remove('pressed'));
  key.addEventListener('mouseleave', () => key.classList.remove('pressed'));

  // Touch support
  key.addEventListener('touchstart', e => {
    e.preventDefault();
    key.classList.add('pressed');
    typeChar(key.dataset.char);
  }, { passive: false });
  key.addEventListener('touchend', () => key.classList.remove('pressed'));
});

// ── Physical keyboard ─────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey) return;

  let ch = null;
  if (e.key === 'Backspace')      ch = 'BACK';
  else if (e.key === 'Enter')     ch = 'RETURN';
  else if (e.key === ' ')         { e.preventDefault(); ch = ' '; }
  else if (e.key.length === 1)    ch = e.key.toUpperCase();

  if (!ch) return;

  // Animate the matching on-screen key
  const keyEl = document.querySelector(`.key[data-char="${ch}"]`);
  if (keyEl) {
    keyEl.classList.add('pressed');
    setTimeout(() => keyEl.classList.remove('pressed'), 100);
  }

  typeChar(ch);
});

// ── Init ──────────────────────────────────────────────────────
updateDisplay();
