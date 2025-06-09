let alertAudio = null;
let alertTimeout = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SHOW_ALERT') {
    showFullscreenAlert(message.label);
  }
});

function showFullscreenAlert(label) {
  if (document.getElementById('smart-alert-overlay')) return;

  // 🔊 Load and play alert sound
  const audioUrl = chrome.runtime.getURL('assets/sound/wake-up.mp3');
  alertAudio = new Audio(audioUrl);
  alertAudio.loop = true;
  alertAudio.play().catch((err) => console.warn("Audio autoplay error:", err));

  // ⏸️ Pause all playing videos (e.g., YouTube)
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    try {
      video.pause();
    } catch (e) {
      console.warn('Video pause failed:', e);
    }
  });

  // 🛑 Create fullscreen overlay
  const overlay = document.createElement('div');
  overlay.id = 'smart-alert-overlay';
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      font-family: 'Segoe UI', sans-serif;
      text-align: center;
    ">
      <div style="
        background: rgba(255,255,255,0.1);
        padding: 3rem 4rem;
        border-radius: 1rem;
        box-shadow: 0 0 30px rgba(0,0,0,0.2);
        backdrop-filter: blur(10px);
      ">
        <h1 style="font-size: 4rem; margin-bottom: 1rem;">🚨 Hey! Time for:</h1>
        <p style="font-size: 3rem; font-weight: bold;">${label}</p>
        <p style="margin-top: 2rem; font-size: 1.2rem;">Click anywhere to dismiss</p>
      </div>
    </div>
  `;

  // 🧹 Remove overlay and stop audio on click
  overlay.addEventListener('click', () => {
    dismissAlert();
  });

  document.body.appendChild(overlay);

  // ⏱️ Auto-dismiss after 30 seconds
  alertTimeout = setTimeout(() => {
    dismissAlert();
  }, 30000);
}

function dismissAlert() {
  const overlay = document.getElementById('smart-alert-overlay');
  if (overlay) overlay.remove();

  if (alertAudio) {
    alertAudio.pause();
    alertAudio.currentTime = 0;
    alertAudio = null;
  }

  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
}
