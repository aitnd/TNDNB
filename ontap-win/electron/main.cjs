const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = process.env.ELECTRON_MODE === 'true';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// --- AUTO LAUNCH ON WINDOWS ---
function setupAutoLaunch() {
    if (process.platform === 'win32') {
        const loginSettings = app.getLoginItemSettings();
        if (!loginSettings.openAtLogin) {
            app.setLoginItemSettings({
                openAtLogin: true,
                path: app.getPath('exe')
            });
            console.log('Auto-launch enabled on first run/install');
        }
    }
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
        icon: path.join(__dirname, '../public/assets/img/logo1.ico')
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
    // mainWindow.webContents.openDevTools(); // Mở DevTools để kiểm tra lỗi

    // Thêm phím tắt F12 để bật/tắt DevTools
    /*
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F12' && input.type === 'keyDown') {
            mainWindow.webContents.toggleDevTools();
        }
    });

    ipcMain.on('toggle-devtools', () => {
        mainWindow.webContents.toggleDevTools();
    });
    */

    // --- IPC FOR AUTO LAUNCH ---
    ipcMain.handle('get-auto-launch', () => {
        return app.getLoginItemSettings().openAtLogin;
    });

    ipcMain.handle('set-auto-launch', (event, value) => {
        app.setLoginItemSettings({
            openAtLogin: value,
            path: app.getPath('exe')
        });
        return app.getLoginItemSettings().openAtLogin;
    });

    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });

    // --- AUTO UPDATE HANDLERS ---
    ipcMain.on('download-update', (event, url) => {
        console.log('Download update requested from:', url);
        // If url is provided, we can try to set it, but electron-updater 
        // usually expects a directory with yml files.
        // For now, let's just trigger the check.
        autoUpdater.checkForUpdatesAndDownload();
    });

    ipcMain.on('install-update', () => {
        autoUpdater.quitAndInstall();
    });

    autoUpdater.on('download-progress', (progressObj) => {
        mainWindow.webContents.send('update-progress', progressObj.percent);
    });

    autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update-downloaded');
    });

    autoUpdater.on('error', (err) => {
        mainWindow.webContents.send('update-error', err.message);
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
    setupAutoLaunch();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
