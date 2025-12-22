// preload.js
const { ipcRenderer } = require('electron');

let appVersion = '3.8.7'; // Fallback

ipcRenderer.invoke('get-app-version').then(v => {
    appVersion = v;
    if (window.electron) {
        window.electron.appVersion = v;
    }
});

window.electron = {
    isElectron: true,
    appVersion: appVersion,
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),

    // --- Update Functions ---
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (event, percent) => callback(percent)),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', () => callback()),
    onUpdateError: (callback) => ipcRenderer.on('update-error', (event, err) => callback(err)),
    downloadUpdate: (url) => ipcRenderer.send('download-update', url),
    installUpdate: () => ipcRenderer.send('install-update'),
};

console.log('Preload script loaded');
