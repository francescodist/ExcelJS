//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const fs = require('fs');
var path = require('path');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800, height: 600,
        icon: path.join(__dirname, 'assets/icons/icon.ico'),
        title: "Check Deleghe",
    })

    // and load the index.html of the app.
    win.loadFile('dist/ExcelJS/index.html')

    // Open the DevTools.
    //win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('create-folder', (event, arg) => {
    if (arg) {
        fs.mkdir(arg, () => {
            event.returnValue = arg;
        });
    } else {
        event.returnValue = false;
    }
});

ipcMain.on('write-file', (event, arg) => {
    fs.writeFileSync(arg[1] + "/" + arg[2] + ".xlsx", arg[0], {encoding: 'binary'});
    event.returnValue = 'ok';
});

ipcMain.on('done-loading', (event, arg) => {
    dialog.showMessageBox({
        message: 'Creazione file completata correttamente!',
        buttons: ['OK']
    });
    event.returnValue = arg;
});

ipcMain.on('double-files', (event, arg) => {
    dialog.showMessageBox({
        message: 'Ci sono dei file duplicati, come si desidera procedere?',
        buttons: ['Elimina Duplicati', 'Mantieni Duplicati', 'Annulla'],
        defaultId: 0
    }, response => {
        event.returnValue = response;
    })
});