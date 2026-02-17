chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.action === "MUTE_TAB" && sender.tab?.id) {
        chrome.tabs.update(sender.tab.id, {muted: req.value});
    }
    if (req.action === "CLOSE_TAB" && sender.tab?.id) {
        chrome.tabs.remove(sender.tab.id);
    }
})

export {}