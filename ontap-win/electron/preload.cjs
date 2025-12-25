// preload.js
const { ipcRenderer } = require('electron');

let appVersion = '3.8.7'; // Fallback

ipcRenderer.invoke('get-app-version').then(v => {
    appVersion = v;
    if (window.electron) {
        window.electron.appVersion = v;
    }
});

ipcRenderer.invoke('get-resources-path').then(p => {
    if (window.electron) {
        window.electron.resourcesPath = p;
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


window.addEventListener('error', (event) => {
    console.error('Renderer error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

console.log('Preload script loaded');
