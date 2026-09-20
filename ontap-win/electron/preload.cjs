// preload.js
const { ipcRenderer } = require('electron');
const log = require('electron-log');

let appVersion = ''; 
try {
    appVersion = ipcRenderer.sendSync('get-app-version-sync');
} catch (e) {
    log.error('Failed to get app version synchronously', e);
}

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

    // --- App Info ---
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),

    // --- Update Functions ---
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (event, version) => callback(version)),
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (event, percent) => callback(percent)),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', () => callback()),
    onUpdateError: (callback) => ipcRenderer.on('update-error', (event, err) => callback(err)),
    downloadUpdate: (url) => ipcRenderer.send('download-update', url),
    installUpdate: () => ipcRenderer.send('install-update'),
};



window.addEventListener('error', (event) => {
    log.error('Renderer error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    log.error('Unhandled promise rejection:', event.reason);
});

log.info('Preload script loaded');
