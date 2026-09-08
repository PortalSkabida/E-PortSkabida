/**
 * E-Presensi SMK Bidayatul Hidayah - Interactive Script
 * Features: Real-time clock (WIB), Particle circuit canvas, Modals, 
 * QR scan simulator, Web Audio API sound effects, and Toast system.
 */

// ==========================================
// 1. WEB AUDIO API SYNTHESIZER (No external files needed)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.log('Audio not allowed yet', e);
    }
  }

  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.25);
      });
    } catch (e) {
      console.log('Audio not allowed yet', e);
    }
  }

  playScan() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.log('Audio not allowed', e);
    }
  }
}

const sfx = new SoundFX();

// ==========================================
// 2. REALTIME CLOCK & DATE (INDONESIAN)
// ==========================================
function updateClock() {
  const clockEl = document.getElementById('live-clock');
  const dateEl = document.getElementById('live-date');
  if (!clockEl || !dateEl) return;

  const now = new Date();
  
  // Format Time: HH:mm:ss WIB
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}:${seconds} WIB`;

  // Format Date Indonesian
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const dayName = days[now.getDay()];
  const dateNum = now.getDate();
  const monthName = months[now.getMonth()];
  const yearNum = now.getFullYear();

  dateEl.textContent = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
}

setInterval(updateClock, 1000);
updateClock();

// ==========================================
// 3. TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.innerHTML = '✓';
  if (type === 'info') iconSpan.innerHTML = 'ℹ';

  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ==========================================
// 4. MODAL CONTROLS (GURU & SISWA)
// ==========================================
const modalGuru = document.getElementById('modal-guru');
const modalSiswa = document.getElementById('modal-siswa');

const btnOpenGuru = document.getElementById('btn-open-guru');
const btnOpenSiswa = document.getElementById('btn-open-siswa');

const btnCloseGuru = document.getElementById('close-guru-btn');
const btnCloseSiswa = document.getElementById('close-siswa-btn');

function openModal(modal) {
  sfx.playClick();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  sfx.playClick();
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

btnOpenGuru?.addEventListener('click', () => {
  sfx.playClick();
});

btnOpenSiswa?.addEventListener('click', () => {
  sfx.playClick();
});

btnCloseGuru?.addEventListener('click', () => closeModal(modalGuru));
btnCloseSiswa?.addEventListener('click', () => closeModal(modalSiswa));

// Close on clicking backdrop
[modalGuru, modalSiswa].forEach(modal => {
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalGuru?.classList.contains('active')) closeModal(modalGuru);
    if (modalSiswa?.classList.contains('active')) closeModal(modalSiswa);
  }
});

// ==========================================
// 5. GURU ATTENDANCE FORM SUBMISSION
// ==========================================
const formGuru = document.getElementById('form-guru');
const btnSubmitGuru = document.getElementById('btn-submit-guru');

formGuru?.addEventListener('submit', (e) => {
  e.preventDefault();
  const select = document.getElementById('guru-select');
  const guruName = select.options[select.selectedIndex]?.text.split('(')[0].trim() || 'Bapak/Ibu Guru';
  const typeChecked = document.querySelector('input[name="guru-type"]:checked')?.value || 'masuk';
  const typeText = typeChecked === 'masuk' ? 'Presensi Masuk' : typeChecked === 'pulang' ? 'Presensi Pulang' : 'Tugas Luar';

  btnSubmitGuru.disabled = true;
  const originalText = btnSubmitGuru.innerHTML;
  btnSubmitGuru.innerHTML = `<span>Memverifikasi Wajah & Lokasi...</span>`;

  setTimeout(() => {
    btnSubmitGuru.disabled = false;
    btnSubmitGuru.innerHTML = originalText;
    closeModal(modalGuru);
    sfx.playSuccess();
    showToast(`✓ Sukses! ${typeText} ${guruName} berhasil dicatat.`);
  }, 1200);
});

// ==========================================
// 6. SISWA MODAL TABS & ACTIONS
// ==========================================
const tabScanBtn = document.getElementById('tab-scan-btn');
const tabManualBtn = document.getElementById('tab-manual-btn');
const tabScanContent = document.getElementById('tab-scan-content');
const tabManualContent = document.getElementById('tab-manual-content');

tabScanBtn?.addEventListener('click', () => {
  sfx.playClick();
  tabScanBtn.classList.add('active');
  tabManualBtn.classList.remove('active');
  tabScanContent.classList.remove('hidden');
  tabManualContent.classList.add('hidden');
});

tabManualBtn?.addEventListener('click', () => {
  sfx.playClick();
  tabManualBtn.classList.add('active');
  tabScanBtn.classList.remove('active');
  tabManualContent.classList.remove('hidden');
  tabScanContent.classList.add('hidden');
});

// Simulate Barcode / QR Scan
const btnSimulateQr = document.getElementById('btn-simulate-qr');
btnSimulateQr?.addEventListener('click', () => {
  sfx.playScan();
  btnSimulateQr.disabled = true;
  btnSimulateQr.innerHTML = `<span>Membaca Data Kartu Pelajar...</span>`;

  setTimeout(() => {
    sfx.playSuccess();
    btnSimulateQr.disabled = false;
    btnSimulateQr.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Simulasi Tempel / Scan Kartu Pelajar</span>
    `;
    closeModal(modalSiswa);
    showToast(`✓ Kartu Terbaca! Ahmad Raihan (NISN: 0087462819) - Kelas X RPL 1 [Hadir Tepat Waktu]`);
  }, 1000);
});

// Manual Siswa Submit
const formSiswaManual = document.getElementById('tab-manual-content');
formSiswaManual?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nama = document.getElementById('siswa-nama')?.value || 'Siswa';
  const kelas = document.getElementById('siswa-kelas')?.value || '';
  const status = document.querySelector('input[name="siswa-status"]:checked')?.value || 'hadir';

  closeModal(modalSiswa);
  sfx.playSuccess();
  showToast(`✓ Presensi Siswa: ${nama} (${kelas}) status: ${status.toUpperCase()} tersimpan.`);
});

// ==========================================
// 7. CANVAS BACKGROUND CIRCUIT PARTICLES
// ==========================================
function initCircuitParticles() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle list
  const particles = [];
  const count = 35;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * (width * 0.65), // concentrated towards left/tech side
      y: Math.random() * height,
      size: Math.random() * 2.2 + 1,
      speedX: (Math.random() - 0.2) * 0.6,
      speedY: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.4 ? 'rgba(52, 211, 153, ' : 'rgba(56, 189, 248, ',
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(52, 211, 153, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width * 0.65;
      if (p.x > width * 0.65) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.alpha += Math.sin(Date.now() * 0.003) * 0.005;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0.1, Math.min(0.8, p.alpha)) + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#34d399';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(render);
  }

  render();
}

initCircuitParticles();
