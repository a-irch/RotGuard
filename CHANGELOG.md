# Changelog

All notable changes to this project will be documented in this file.

## v1.1.0

### Features :

- **Remaining Time:** Remaining time can now be diplayed (disableable in settings).
- **Session Count:** Session count per day per service added.
- **Daily limit:** Option to limit the number of sessions per day (can be disabled and customized in settings).

### Fix :

- Option title for restricted list renamed.

### Change :

- **Customs Hooks: (read and write in storage)**
  - Access to restrict list is now centralise in the useRestrictList hook.
  - Access to active sessions is now centralise in the useActiveSessions hook.
  - Access to settings variable is now centralise in the useSettings hook.

## v1.0.0

### Features :

- **Custom Blocklist:** Restrict specific distracting websites.
- **Intentional Delay:** Mandatory waiting time before accessing ressource.
- **Session Limits:** Custom session durations.
