# Smart Browser Alert

Smart Browser Alert is a **cross-device alert system** designed as both a **Chrome extension** and a **responsive web app**. It helps users set timed alerts that display fullscreen modal reminders on their current browsing tab or mobile browser, ensuring they never miss important meetings or events.

---

## Project Overview

The **Smart Browser Alert** project provides users with an intuitive interface to create, manage, and receive custom alerts. Alerts trigger a fullscreen overlay on desktop browsers via a Chrome extension or directly in mobile browsers through the web app, combining modern design aesthetics inspired by [21st.dev](https://21st.dev) with accessibility and ease of use.

This project aims to unify alert management across laptops, desktops, and mobile devices in a single codebase, leveraging Chrome extension APIs where available and web APIs elsewhere.

### Key Objectives:
- Enable users to create alerts with labels, time selection, and repeat options (None, Daily, Weekly).
- Provide a clean, modern, and responsive UI that adapts to desktop and mobile screen sizes.
- Deliver fullscreen, attention-grabbing alert modals that users can dismiss manually or auto-dismiss.
- Store alert data persistently using `chrome.storage.sync` on desktop and `localStorage` on mobile.
- Seamlessly switch between Chrome extension features and web app fallbacks based on device and environment.

---

## Features

- **Alert Setup Card:** Time picker (12-hour format), label input, repeat options, save button with validation.
- **Upcoming Alerts List:** Displays saved alerts with time, label, repeat icon, and delete option with smooth animations.
- **Fullscreen Alert Modal:** Bold, semi-transparent overlay triggered at alert time with tap/click dismissal.
- **Cross-Device Support:** Works as a Chrome extension on desktops and as a standalone responsive web app on mobile browsers.
- **Notifications and Vibration:** Optionally supports browser notifications and vibration for mobile alerts.
- **Clean UI Design:** Inspired by 21st.dev — minimalist, soft shadows, rounded corners, and mobile-friendly layouts.

---

## Technologies Used

- **JavaScript (ES6+)** – Main logic, alert scheduling, UI interactions.
- **HTML5 & CSS3** – Responsive layout and styling.
- **Chrome Extension APIs** – Storage, alarms, content script injection for desktop.
- **Web APIs:** `localStorage`, Notifications API, Fullscreen API, Vibration API.
- **Manifest V3** – Chrome extension configuration.

---

## Project Structure

```plaintext
smart-browser-alert/
├── manifest.json            # Chrome extension manifest file
├── popup.html               # Extension popup UI wrapper
├── background.js            # Background script for alarms and event handling
├── content.js               # Content script for fullscreen alert injection
├── index.html               # Standalone responsive web app UI
├── app.js                   # Unified JavaScript logic with environment detection
├── style.css                # Responsive styles with mobile-friendly design
├── assets/
│   └── icons/               # Extension and web app icons
```


---

## Screenshots

## Some ScreenShots for this Project:
### DATA
![Home page](alert-data.png) 

### ALERT
![Home page](alert-popup.png)  


---

## 🚀 How to Use Smart Browser Alert

### 🖥️ On Desktop (Chrome Browser)

1. Open **Google Chrome** on your computer.
2. Click the **three-dot menu (⋮)** in the top-right and select **Settings**.
3. Navigate to **Extensions** (or go to `chrome://extensions/` directly).
4. Enable **Developer Mode** (top-right toggle).
5. Click **"Load unpacked"**, and select the `smart-browser-alert/` folder.
6. After loading, click **"Details"** under the extension and enable **"Pin to Toolbar"**.
7. Click the extension icon to open the popup UI.
8. Enter your **alert label**, choose the **time**, set **repeat options**, and click **Save**.
9. At the scheduled time, a **fullscreen alert modal** will appear — even over YouTube or other tabs.

---




