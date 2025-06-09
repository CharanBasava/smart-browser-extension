// DOM Elements
const labelInput = document.getElementById('label');
const timeInput = document.getElementById('time');
const repeatSelect = document.getElementById('repeat');
const saveBtn = document.getElementById('saveAlert');
const alertList = document.getElementById('alertList');
const toast = document.getElementById('toast');

// Utility to show toast
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Format time to HH:MM AM/PM
function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = ((hour + 11) % 12 + 1);
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${suffix}`;
}

// Load alerts from chrome.storage
function loadAlerts() {
  chrome.storage.sync.get(['alerts'], ({ alerts = [] }) => {
    alertList.innerHTML = '';
    alerts.forEach((alert, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>
          ⏰ ${formatTime(alert.time)} - ${alert.label}
          ${alert.repeat !== 'none' ? `🔁 (${alert.repeat})` : ''}
        </span>
        <button title="Delete" onclick="deleteAlert(${index})">🗑️</button>
      `;
      alertList.appendChild(li);
    });
  });
}

// Save new alert
function saveAlert() {
  const label = labelInput.value.trim();
  const time = timeInput.value;
  const repeat = repeatSelect.value;

  if (!label || !time) {
    showToast('Label and time are required.');
    return;
  }

  const now = new Date();
  const [hh, mm] = time.split(':');
  const alertTime = new Date();
  alertTime.setHours(hh, mm, 0, 0);

  if (alertTime < now) {
    showToast('Alert time passed. Try again.');
    return;
  }

  const newAlert = { label, time, repeat };
  chrome.storage.sync.get(['alerts'], ({ alerts = [] }) => {
    alerts.push(newAlert);
    chrome.storage.sync.set({ alerts }, () => {
      chrome.runtime.sendMessage({ type: 'SET_ALERTS', alerts });
      showToast('Saved!');
      labelInput.value = '';
      timeInput.value = '';
      repeatSelect.value = 'none';
      loadAlerts();
    });
  });
}

// Delete alert by index
window.deleteAlert = function (index) {
  chrome.storage.sync.get(['alerts'], ({ alerts = [] }) => {
    alerts.splice(index, 1);
    chrome.storage.sync.set({ alerts }, () => {
      chrome.runtime.sendMessage({ type: 'SET_ALERTS', alerts });
      loadAlerts();
    });
  });
};

// Init
saveBtn.addEventListener('click', saveAlert);
document.addEventListener('DOMContentLoaded', loadAlerts);
