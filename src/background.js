'use strict'

import { app, Menu, protocol, BrowserWindow, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
import { autoUpdater } from "electron-updater"
import {readFileSync} from "atomically";

// If you want to use Sentry for your error reporting, add your Sentry DSN configuration here.
// import * as Sentry from '@sentry/electron';
// Sentry.init({ dsn: 'your-dsn-url' });


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    show: false,
  });

  win.maximize();
  win.show();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')

    /**
     * We will fire the autoupdater to check for new updates and notify the
     * user. This only needs to happen when *NOT* in development mode.
     */
    autoUpdater.checkForUpdatesAndNotify()
  }

  win.on('closed', () => {
    win = null
  })
}

function openFileDialog() {
  const fs = require('fs');
  const selectedMagento2ProjectDir = dialog.showOpenDialogSync({
    title: 'Select Magento 2 project directory',
    // filters: [{
    //   name: 'Patch Files',
    //   extensions: ['patch']
    // }],
    properties: [
        'openDirectory'
    ]
  })

  if (typeof selectedMagento2ProjectDir === 'undefined') {
    return;
  }

  let vendorPatchFile = selectedMagento2ProjectDir + '/vendor.patch';
  if (!fs.existsSync(vendorPatchFile)) {
    dialog.showErrorBox('File not found', 'No vendor.patch diff file found in your Magento 2 project directory!');
  }

  let vendorCheckPatchFile = selectedMagento2ProjectDir + '/vendor_files_to_check.patch';
  if (!fs.existsSync(vendorCheckPatchFile)) {
    dialog.showErrorBox('File not found', 'No vendor_files_to_check.patch diff file found in your Magento 2 project directory!');
  }

  let outputFile = selectedMagento2ProjectDir + '/output.txt';
  if (!fs.existsSync(outputFile)) {
    dialog.showErrorBox('File not found', 'No output.txt overview file found in your Magento 2 project directory!');
  }

  let vendorDir = selectedMagento2ProjectDir + '/vendor';
  if (!fs.existsSync(vendorDir)) {
    dialog.showErrorBox('Directory not found', 'No vendor directory found in your Magento 2 project directory!');
  }

  // dialog.showMessageBoxSync({
  //   type: 'info',
  //   title: 'Files found!',
  //   message: 'Great! All required files are found; output.txt, vendor.patch, vendor_files_to_check.patch and the vendor directory'
  // })

  const output = fs.readFileSync(outputFile).toString();
  console.log(output);
}

function createMenu() {
  const menuTemplate = [
    { role: 'appMenu' },
    {
      label: '&File',
      submenu: [
        {
          label: '&Open Magento 2 project directory',
          accelerator: 'CommandOrControl+O',
          click: openFileDialog
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);
}

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
    createMenu()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  createMenu()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
