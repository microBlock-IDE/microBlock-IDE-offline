const { app, BrowserWindow } = require('electron')
const path = require('path');
var ipcMain = require('electron').ipcMain;

app.allowRendererProcessReuse = false;

global.sharedObj = {
    argv: process.argv,
    dashboardWin: null
};

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, "microBlock-IDE/favicon.png")
    })
    win.loadFile("microBlock-IDE/index.html");
    win.maximize();

    // Open the DevTools.
    // win.webContents.openDevTools()

    win.on('close', () => {
        if (global.sharedObj.dashboardWin) {
            global.sharedObj.dashboardWin.close();
        }
    });
}

ipcMain.on("show-dashboard", (event) => {
    if (global.sharedObj.dashboardWin) {
        if (!global.sharedObj.dashboardWin.isDestroyed()) {
            global.sharedObj.dashboardWin.focus();
            return;
        }
    }

    global.sharedObj.dashboardWin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, "microBlock-IDE/favicon.png")
    });

    global.sharedObj.dashboardWin.loadFile("microBlock-IDE/dashboard/index.html");

    // global.sharedObj.dashboardWin.maximize();

    global.sharedObj.dashboardWin.on('close', () => {
        global.sharedObj.dashboardWin = null;
    });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.