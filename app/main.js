const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const {ipcMain} = require('electron')
const path = require('path')
module.paths.push(path.resolve('node_modules'))
module.paths.push(path.resolve('../node_modules'))
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'resources', 'app', 'node_modules'))
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'resources', 'app.asar', 'node_modules'))
const xmltojson = require('xml2js').Parser()

const url = require('url')
const fs = require('fs')

// Keep a global reference of the windows objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let fileWindow

function openMainWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1024, height: 600})

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    if(fileWindow)
        fileWindow.close()

    // Open the DevTools. todo: comment this line on releases
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    if(fs.existsSync('config.json')){
        let config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))
        if(config.hasOwnProperty('library'))
            console.log('create library window')
        openMainWindow()
    }
    openMainWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        openMainWindow()
    }
})

function openFileWindow(filePath){
    let musicFile = fs.readFileSync('examples/teste.xml', 'utf-8')
    xmltojson.parseString(musicFile, function(err, musicjson){
        // Create the browser window.
        fileWindow = new BrowserWindow({width: 1024, height: 600})
        fileWindow.musicjson = musicjson

        fileWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'score_stuff/index.html'),
            protocol: 'file:',
            slashes: true
        }))
        mainWindow.close()

        // Open the DevTools. todo: comment this line on releases
        // fileWindow.webContents.openDevTools()

        fileWindow.on('closed', function () {
            fileWindow = null
        })
        ipcMain.removeAllListeners('read-file')
        ipcMain.on('read-file', (event, arg) => {
            event.sender.send('read-file-reply', musicjson)
        })
    })

}


// message events to windows
// reference examples: https://github.com/electron/electron/blob/master/docs/api/ipc-main.md
ipcMain.on('open-file', function(ev, arg){
    openFileWindow(arg)
})

ipcMain.on('open-main-window', function(ev, arg){
    console.log("hello")
    openMainWindow()
})
