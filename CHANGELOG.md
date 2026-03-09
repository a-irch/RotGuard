# Changelog

All notable changes to this project will be documented in this file.

## v1.1.0

### Features :

- **Remaining Time:** The remaining session time can now be displayed on restricted pages (can be toggled in the settings).
- **Daily Session Tracking:** Added the ability to track the number of sessions per day for each restricted service.
- **Daily Limits:** You can now set a maximum number of allowed sessions per day (customizable and toggleable in the settings).
- **Usage Statistics:** View your session history over the last 7 days through a new interactive chart directly in the extension popup.
- **Export Configuration:** Easily export your settings and restricted sites list, with an option to include or exclude your usage statistics.
- **Import Configuration:** Restore your settings by uploading a JSON backup file or by pasting the configuration directly into the editor.

### Fixes :

- Renamed the options title for the restricted sites list for better clarity.
- Completely disabled page scrolling, touch events, and keyboard navigation on the underlying website while the waiting popup is active.

### Change :

- **Architecture Refactoring (Custom Hooks):** Completely refactored the storage logic for better performance and maintainability:
  - Centralized restricted list management within the `useRestrictList` hook.
  - Centralized active session handling within the `useActiveSessions` hook.
  - Centralized global settings management within the `useSettings` hook.
- **Developer Experience:** Updated ESLint configuration with new ignore patterns for intentionally unused variables.

## v1.0.0

### Features :

- **Custom Blocklist:** Restrict specific distracting websites.
- **Intentional Delay:** Mandatory waiting time before accessing ressource.
- **Session Limits:** Custom session durations.
