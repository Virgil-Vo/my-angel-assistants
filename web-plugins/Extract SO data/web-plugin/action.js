document.addEventListener('DOMContentLoaded', async () => {
    const icon = document.getElementById('icon');
    const message = document.getElementById('message');
    const sub = document.getElementById('sub');

    // Show loading state
    icon.textContent = '⏳';
    message.textContent = 'Exporting product data...';
    sub.textContent = '';

    // Register the listener FIRST!
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.exportResult === 'success') {
            icon.textContent = '✅';
            icon.className = 'icon success';
            message.textContent = 'Export successful!';
            message.className = 'message success';
            sub.textContent = 'Product data exported.';
        } else if (msg.exportResult === 'error') {
            icon.textContent = '❌';
            icon.className = 'icon error';
            message.textContent = 'Export failed!';
            message.className = 'message error';
            sub.textContent = 'Could not export product data.\n' + (msg.error || '');
        }
    });

    // THEN inject the script
    var [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    await chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: true},
        files: ['exportData.js']
    });
});
