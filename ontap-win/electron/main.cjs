const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.ELECTRON_MODE === 'true';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false, // For easier IPC in this specific legacy app structure
            webSecurity: false // Often needed for local file access in simple apps, though less secure
        },
        icon: path.join(__dirname, '../public/assets/img/logo-app.ico')
    });

    // Remove menu bar
    mainWindow.setMenuBarVisibility(false);

    if (isDev) {
        // Try to load the URL with retries
        const loadDevUrl = () => {
            mainWindow.loadURL('http://127.0.0.1:5173').catch((err) => {
                console.log('Error loading URL, retrying in 1s...', err);
                setTimeout(loadDevUrl, 1000);
            });
        };
        loadDevUrl();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    // mainWindow.webContents.openDevTools(); // Disable auto-open

    ipcMain.on('toggle-devtools', () => {
        mainWindow.webContents.toggleDevTools();
    });

    // --- FIX FIREBASE REFERER ERROR ---
    // Electron (file:// or custom protocol) doesn't send Referer by default.
    // Firebase requires a valid Referer from the Authorized Domains list.
    // We inject 'http://localhost' which is allowed by default in Firebase.
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
        { urls: ['*://*.googleapis.com/*', '*://*.firebaseio.com/*', '*://*.firebaseapp.com/*'] },
        (details, callback) => {
            details.requestHeaders['Referer'] = 'http://localhost';
            details.requestHeaders['Origin'] = 'http://localhost';
            callback({ cancel: false, requestHeaders: details.requestHeaders });
        }
    );
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
