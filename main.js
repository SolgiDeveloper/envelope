'use strict';

// Import parts of electron to use
const { app, ipcMain, BrowserWindow, Menu } = require('electron');
const path = require('path')
const url = require('url')
const {HANDLE_FETCH_DATA, FETCH_DATA_FROM_STORAGE, HANDLE_SAVE_DATA, SAVE_DATA_IN_STORAGE, REMOVE_DATA_FROM_STORAGE, HANDLE_REMOVE_DATA} = require("./utils/constants")
const storage = require("electron-json-storage")

//set env
// process.env.NODE_ENV = 'development'
process.env.NODE_ENV = 'production'
const isDev = process.env.NODE_ENV !== 'production'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let showPdfWindow;
let aboutWindow;
// A reference to the sendEnvelope array, full of JS/JSON objects. All mutations to the array are performed in the main.js app, but each mutation will trigger a rewrite to the user's storage for data persistence
let sendEnvelope;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

// Keep a reference to the default path to userData, which will act as the app's database. It may not be necessary to use this
const defaultDataPath = storage.getDefaultDataPath();
// On Mac: /Users/[username]/Library/Application Support/[app-name]/storage

function createWindow() {
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Simorgh',
    show: false,
    webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
    icon: __dirname + "/ClientApp/assets/icons/letter2.png"
  });
  mainWindow.on('closed', ()=> app.quit())
  mainWindow.maximize();
  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:4000',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.send("info", {msg: "hello from main process"})

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}
// ---------------------------------------------------

// Application boot up and boot down

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// --------------------------------------------------------------

// ipcMain methods are how we interact between the window and (this) main program

// Receives a FETCH_DATA_FROM_STORAGE from renderer
ipcMain.on(FETCH_DATA_FROM_STORAGE, (event, message) => {
  console.log("Main received: FETCH_DATA_FROM_STORAGE with message:", message)
  // Get the user's sendEnvelope from storage
  // For our purposes, message = sendEnvelope array
  storage.get(message, (error, data) => {
    // if the sendEnvelope key does not yet exist in storage, data returns an empty object, so we will declare receivedEnvelope to be an empty array
    sendEnvelope = JSON.stringify(data) === '{}' ? [] : data;
    if (error) {
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: false,
        message: "sendEnvelope not returned",
      })
    } else {
      // Send message back to window
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: true,
        message: sendEnvelope, // do something with the data
      })
    }
  })
})

// Receive a SAVE_DATA_IN_STORAGE call from renderer
ipcMain.on(SAVE_DATA_IN_STORAGE, (event, message) => {
  console.log("Main received: SAVE_DATA_IN_STORAGE")
  // update the sendEnvelope array.
  sendEnvelope.unshift(message)
  // Save sendEnvelope to storage
  storage.set("sendEnvelope", sendEnvelope, (error) => {
    if (error) {
      console.log("We errored! What was data?")
      mainWindow.send(HANDLE_SAVE_DATA, {
        success: false,
        message: "sendEnvelope not saved",
      })
    } else {
      // Send message back to window as 2nd arg "data"
      mainWindow.send(HANDLE_SAVE_DATA, {
        success: true,
        message: message,
      })
    }
  })
});

// Receive a REMOVE_DATA_FROM_STORAGE call from renderer
ipcMain.on(REMOVE_DATA_FROM_STORAGE, (event, id) => {
  console.log('Main Received: REMOVE_DATA_FROM_STORAGE')
  // Update the items to Track array.
  sendEnvelope = sendEnvelope.filter(item => item[1] !== id)
  // sendEnvelope =[]
  // Save receivedEnvelope to storage
  storage.set("sendEnvelope", sendEnvelope, (error) => {
    if (error) {
      console.log("We errored! What was data?")
      mainWindow.send(HANDLE_REMOVE_DATA, {
        success: false,
        message: "sendEnvelope not saved",
      })
    } else {
      // Send new updated array to window as 2nd arg "data"
      mainWindow.send(HANDLE_REMOVE_DATA, {
        success: true,
        message: sendEnvelope,
      })
    }
  })
})

ipcMain.on('pdf-file:send', (event, path)=>{
  showPdfWindow = new BrowserWindow({
    icon: __dirname + "/ClientApp/assets/icons/letter2.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  showPdfWindow.loadFile(path)
  showPdfWindow.setMenu(null)
})
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: 'About Simorgh office',
    width: 300,
    height: 350,
    resizable: false,
    icon: __dirname + "/ClientApp/assets/icons/letter2.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  aboutWindow.loadFile('./about.html')
  aboutWindow.on('closed', ()=> aboutWindow = null)
  aboutWindow.setMenu(null)
}
const menu = [
  {
        label: 'About',
        click:() => createAboutWindow()
  },
  {role: 'forcereload'},
  ...(isDev ? [
    {
      label: 'Developer',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {type: 'separator'},
        {role: 'toggledevtools'},
      ]
    }
  ] : [])
]
