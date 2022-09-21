'use strict'

import { app, Menu, protocol, BrowserWindow, dialog, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
import { autoUpdater } from "electron-updater"
import {Gitlab} from "@gitbeaker/node";
const util = require('util');
const { exec } = require('child_process');
const Store = require('electron-store');

// Set up store data
const store = new Store(
    {
      defaults: {
        'gitlab_token': false,
        'gitlab_host': 'https://gitlab.com',
        'gitlab_project_id': false,
        'gitlab_issue_id': false,
        'git_auto_commit': true,
        'git_auto_commit_message': 'Upgrade: resolved %s'
      }
    }
);

console.log(app.getPath('userData'), store.get('gitlab_issue_id'));

let win, vendorCheckDiffs,  selectedMagento2ProjectDir, gitlabApi;

if (store.get('gitlab_token') && store.get('gitlab_project_id') && store.get('gitlab_issue_id')) {
  gitlabApi = new Gitlab({
    host: store.get('gitlab_host'),
    token: store.get('gitlab_token'),
    rejectUnauthorized: (process.env.GITLAB_HOST === 'https://gitlab.com') // needed for self-hosted Gitlab instances
  });
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

ipcMain.on('openProjectDir', function () {
  openFileDialog()
})

ipcMain.on('run-git-commands', function (event, args) {
  if (store.get('git_auto_commit')) {
    exec('git add ' + args.file + ' && git commit -m "' + util.format(store.get('git_auto_commit_message'), ...args) + '"', {cwd: selectedMagento2ProjectDir.toString()});
  }
})

if (gitlabApi) {
  ipcMain.on('update-gitlab-issue', function (event, args) {
    gitlabApi.IssueNotes.all(store.get('gitlab_project_id'), store.get('gitlab_issue_id')).then((notes) => {
      let note = notes.filter(function (note) {
        if (typeof note === "undefined") {
          return false
        }
        if (typeof note.body === "undefined") {
          return false
        }
        return note.body.includes('Status') && note.body.includes('Type') && note.body.includes('Vendor file') && note.body.includes('Project file');
      });

      if (note.length > 0) {
        let noteId = note.shift().id;
        gitlabApi.IssueNotes.edit(store.get('gitlab_project_id'), store.get('gitlab_issue_id'), noteId, args.table);
      } else {
        gitlabApi.IssueNotes.create(store.get('gitlab_project_id'), store.get('gitlab_issue_id'), args.table);
      }
    });
  })
}


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      devTools: true
    },
    show: false,
  });

  win.maximize();
  win.show();

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key.toLowerCase() === 'arrowright') { // Next
      win.webContents.send('navigationBar', {
        action: 'next'
      })
      event.preventDefault()
    } else if (input.key.toLowerCase() === 'arrowleft') { // Previous
      win.webContents.send('navigationBar', {
        action: 'previous'
      })
      event.preventDefault()
    } else if (input.key.toLowerCase() === 'r') { // Resolved
      win.webContents.send('navigationBar', {
        action: 'resolved'
      })
      event.preventDefault()
    } else if (input.key.toLowerCase() === 's') { // Skipped
      win.webContents.send('navigationBar', {
        action: 'skipped'
      })
      event.preventDefault()
    } else if (input.key.toLowerCase() === 'n') { // Cannot fix
      win.webContents.send('navigationBar', {
        action: 'cannot-fix'
      })
      event.preventDefault()
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
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

function parseOutputTable(output) {
  return output.split("\n").filter(function (line) {
    // See https://github.com/AmpersandHQ/ampersand-magento2-upgrade-patch-helper/blob/master/src/Ampersand/PatchHelper/Helper/PatchOverrideValidator.php#L7
    return line.indexOf('Preference') > 0 || line.indexOf('Plugin') > 0 || line.indexOf('Override') > 0;
  }).map(function (line) {
    let result = line.split("|").map(function (item) { return item.trim(); }).splice(1);
    result.unshift('unresolved');
    return result;
  });
}

function parseVendorCheck(vendorCheck) {
  let diffs = vendorCheck.split(/(?=diff )/);
  return diffs.reduce(function (accumulator, diff) {
    let lines = diff.split("\n");
    let [changed, original] = lines[0].split(' ').reverse();

    // Find vendor/ file (as opposed to vendor_orig or similar)
    let vendorFilename = false;
    if (original.indexOf('vendor/') === 0) {
      vendorFilename = original;
    } else if (changed.indexOf('vendor/') === 0) {
      vendorFilename = changed;
    }

    accumulator[vendorFilename] = diff;
    return accumulator;
  }, {})
}

function openFileDialog() {
  const fs = require('fs');
  selectedMagento2ProjectDir = dialog.showOpenDialogSync({
    title: 'Select Magento 2 project directory',
    properties: [
        'openDirectory'
    ]
  })

  if (typeof selectedMagento2ProjectDir === 'undefined') {
    return;
  }

  const resultsFile = selectedMagento2ProjectDir + '/results.json';

  const vendorPatchFile = selectedMagento2ProjectDir + '/vendor.patch';
  if (!fs.existsSync(vendorPatchFile)) {
    dialog.showErrorBox('File not found', 'No vendor.patch diff file found in your Magento 2 project directory!');
  }

  const vendorCheckPatchFile = selectedMagento2ProjectDir + '/vendor_files_to_check.patch';
  if (!fs.existsSync(vendorCheckPatchFile)) {
    dialog.showErrorBox('File not found', 'No vendor_files_to_check.patch diff file found in your Magento 2 project directory!');
  }

  const outputFile = selectedMagento2ProjectDir + '/patch-helper-output.txt';
  if (!fs.existsSync(outputFile)) {
    dialog.showErrorBox('File not found', 'No patch-helper-output.txt overview file found in your Magento 2 project directory!');
  }

  const vendorDir = selectedMagento2ProjectDir + '/vendor';
  if (!fs.existsSync(vendorDir)) {
    dialog.showErrorBox('Directory not found', 'No vendor directory found in your Magento 2 project directory!');
  }

  const classMap = selectedMagento2ProjectDir + '/classmap.json';
  if (!fs.existsSync(classMap)) {
    dialog.showErrorBox('Classmap JSON not found', 'No classmap.json found! Please generate it: php -r "\\$classmap = require_once(\'vendor/composer/autoload_classmap.php\'); echo json_encode(\\$classmap);" > classmap.json.');
  }

  win.webContents.send('selectedMagento2ProjectDir', {dir: selectedMagento2ProjectDir});

  if (fs.existsSync(resultsFile)) {
    let resultsFileContents = fs.readFileSync(resultsFile).toString();
    win.webContents.send('overridesParsed', {
      contents: JSON.parse(resultsFileContents)
    })
  } else {
    let output = fs.readFileSync(outputFile).toString();
    if (output) {
      let overrides = parseOutputTable(output);
      win.webContents.send('overridesParsed', {
        contents: overrides
      })
      fs.writeFileSync(resultsFile, JSON.stringify(overrides))
    }
  }

  let vendorCheck = fs.readFileSync(vendorCheckPatchFile).toString();
  if (vendorCheck) {
    vendorCheckDiffs = parseVendorCheck(vendorCheck);
    win.webContents.send('vendorCheckDiffs', {
      contents: vendorCheckDiffs
    })
  }
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
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
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
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
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
