import { Storage } from '@plasmohq/storage';

import type { Page } from '~/types/Page';

const DEFAULT_RESTRICT_LIST: Page[] = [
  { name: 'TikTok', domain: 'tiktok.com' },
  { name: 'Instagram', domain: 'instagram.com' },
  { name: 'X', domain: 'x.com' },
  { name: 'Facebook', domain: 'facebook.com' },
  { name: 'Reddit', domain: 'reddit.com' },
  { name: 'Linkedin', domain: 'linkedin.com' },
];

chrome.runtime.onInstalled.addListener(async (event) => {
  if (event.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const storage = new Storage();
    await storage.set('restrict-list', DEFAULT_RESTRICT_LIST);
    await storage.set('waiting-time', 15);
    await storage.set('session-duration', 10);
    await storage.set('display-remaining', false);
  }
});

chrome.runtime.onMessage.addListener((req, sender, _) => {
  if (req.action === 'MUTE_TAB' && sender.tab?.id) {
    chrome.tabs.update(sender.tab.id, { muted: req.value });
  }
  if (req.action === 'CLOSE_TAB' && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});

export {};
