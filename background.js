// Utility: Parse time string into next Date
function getNextOccurrence(timeStr, repeat) {
  const [hh, mm] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hh, mm, 0, 0);

  if (target <= now) {
    // If time already passed today
    if (repeat === 'daily') target.setDate(target.getDate() + 1);
    else if (repeat === 'weekly') target.setDate(target.getDate() + 7);
  }

  return target;
}

// Set all alarms from stored alerts
function setAllAlarms() {
  chrome.storage.sync.get(['alerts'], ({ alerts = [] }) => {
    chrome.alarms.clearAll(() => {
      alerts.forEach((alert, index) => {
        const triggerTime = getNextOccurrence(alert.time, alert.repeat);
        chrome.alarms.create(`alert_${index}`, {
          when: triggerTime.getTime(),
        });
      });
    });
  });
}

// Handle incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_ALERTS') {
    setAllAlarms();
  }
});

// Alarm triggered
chrome.alarms.onAlarm.addListener((alarm) => {
  const match = alarm.name.match(/alert_(\d+)/);
  if (!match) return;

  const index = parseInt(match[1]);
  chrome.storage.sync.get(['alerts'], ({ alerts = [] }) => {
    const alert = alerts[index];
    if (!alert) return;

    // Inject modal
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js'],
        });

        // Pass the label to content script
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'SHOW_ALERT',
          label: alert.label,
        });
      }
    });

    // Reschedule if repeating
    if (alert.repeat !== 'none') {
      const nextTrigger = getNextOccurrence(alert.time, alert.repeat);
      chrome.alarms.create(alarm.name, {
        when: nextTrigger.getTime(),
      });
    } else {
      // Remove one-time alert
      alerts.splice(index, 1);
      chrome.storage.sync.set({ alerts }, () => {
        chrome.runtime.sendMessage({ type: 'SET_ALERTS', alerts });
      });
    }
  });
});

// Initialize on install or reload
chrome.runtime.onInstalled.addListener(() => {
  setAllAlarms();
});
