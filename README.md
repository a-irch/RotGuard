<p align="center">
  <img src="./assets/icon512.png" alt="RotGuard's Logo" width="80" />
</p>

<h1 align="center">RotGuard</h1>

<p align="center">
  <img style="padding-right: 6px" src="https://img.shields.io/badge/Plasmo-000000" />
  <img style="padding-right: 6px" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img style="padding-right: 6px" src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white" />
</p>

<h3 align="center">A browser extension to reduce social media overconsumption and boost your productivity!</h3>

## Overview

**RotGuard** is a browser extension designed to help you regain control over your digital habits.

Instead of blocking websites entirely (which often leads to frustration and instantly disabling the extension), RotGuard adds _intentional friction_ before accessing distracting content.

### How it works

1. The extension injects a blocking UI over the restricted websites.
2. The user must consciously confirm they want to access the site.
3. The user has to wait through a mandatory, custom delay.
4. After the delay, the content is unlocked for a limited "session". Once the time is up, the friction resets!

## Features

- **Custom Blocklist:** Restrict specific distracting websites.
- **Intentional Delay:** Mandatory waiting time before access to break bad habits.
- **Session Limits:** Custom session durations to keep your browsing in check.
- **Privacy First:** Runs locally in your browser. No tracking, no data collection.

## Installation

### From Firefox Add-ons Store

[![Get it on Firefox](https://img.shields.io/badge/Firefox-Get_RotGuard-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/rotguard/)

### On Chrome / Edge / Brave (Manual Installation)

#### Option A: The Easy Way (Recommended)

1. Go to the [Releases](../../releases) page of this repository.
2. Download the latest `chrome-mv3-prod.zip` file.
3. Extract the ZIP file into a folder on your computer.
4. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`).
5. Enable **Developer mode** (usually a toggle in the top right corner).
6. Click on **Load unpacked** and select the folder you just extracted.
7. You're good to go!

#### Option B: Build from source

1. Clone the repository :

   ```bash
   git clone https://github.com/a-irch/RotGuard.git
   cd RotGuard
   ```

2. Install dependencies :

   ```bash
   pnpm install
   ```

3. Build for production :

   ```bash
    pnpm build --zip
   ```

4. Load the production build :
   - Go to `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`)
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `build/chrome-mv3-prod` folder
