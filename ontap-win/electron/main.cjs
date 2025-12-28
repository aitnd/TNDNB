const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const log = require('electron-log');

// Cấu hình log
log.transports.file.level = 'info';
log.info('App starting...');
const isDev = process.env.ELECTRON_MODE === 'true';

// Chỉ load autoUpdater khi không phải dev mode
let autoUpdater = null;
if (!isDev) {
    try {
        autoUpdater = require('electron-updater').autoUpdater;
        autoUpdater.logger = log;
        autoUpdater.autoDownload = true;
        autoUpdater.autoInstallOnAppQuit = true;
    } catch (e) {
        log.error('Failed to load autoUpdater:', e);
    }
}

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
            preload: path.join(__dirname, 'preload.cjs'),
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
        const indexPath = path.join(__dirname, '../dist/index.html');
        log.info('Loading file:', indexPath);
        mainWindow.loadFile(indexPath).catch(err => {
            log.error('Failed to load index.html:', err);
        });
    }

    // Mở DevTools mặc định để kiểm tra lỗi trắng màn hình - Đã tắt sau khi ổn định
    // mainWindow.webContents.openDevTools(); 

    // Thêm phím tắt F12 để bật/tắt DevTools - Đã vô hiệu hóa theo yêu cầu
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

    ipcMain.handle('get-resources-path', () => {
        return process.resourcesPath;
    });

    // --- AUTO UPDATE HANDLERS ---
    ipcMain.on('download-update', (event, url) => {
        console.log('Download update requested');
        // Sử dụng checkForUpdates (autoDownload đã được bật trong config)
        if (autoUpdater) {
            autoUpdater.checkForUpdates().catch(err => {
                log.error('Check for updates failed:', err);
                mainWindow.webContents.send('update-error', err.message || 'Không thể kiểm tra cập nhật');
            });
        }
    });


    ipcMain.on('install-update', () => {
        if (autoUpdater) autoUpdater.quitAndInstall();
    });

    if (autoUpdater) {
        autoUpdater.on('download-progress', (progressObj) => {
            mainWindow.webContents.send('update-progress', progressObj.percent);
            log.info(`Download progress: ${progressObj.percent}%`);
        });

        autoUpdater.on('update-downloaded', (info) => {
            log.info('Update downloaded:', info.version);
            mainWindow.webContents.send('update-downloaded');
            // Hiện thông báo cho người dùng
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Cập nhật sẵn sàng',
                message: `Phiên bản ${info.version} đã được tải xuống. Nhấn "Khởi động lại" để cài đặt.`,
                buttons: ['Khởi động lại', 'Để sau']
            }).then((result) => {
                if (result.response === 0) {
                    autoUpdater.quitAndInstall();
                }
            });
        });

        autoUpdater.on('error', (err) => {
            log.error('AutoUpdater error:', err);
            mainWindow.webContents.send('update-error', err.message);
        });

        autoUpdater.on('update-available', (info) => {
            log.info('Update available:', info.version);
            mainWindow.webContents.send('update-available', info.version);
        });
    }

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

    // Tự động kiểm tra update sau 3 giây (để app load xong trước)
    if (autoUpdater) {
        setTimeout(() => {
            log.info('Checking for updates...');
            autoUpdater.checkForUpdates().catch(err => {
                log.error('Check for updates failed:', err);
            });
        }, 3000);
    }

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
