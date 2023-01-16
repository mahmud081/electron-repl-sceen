const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ejse = require("ejs-electron");
const windowStateKeeper = require("electron-window-state");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
let mainWindow;

// initial screen
ejse.data("currentView", "main");

const createWindow = () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "renderer", "main.ejs"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  mainWindowState.manage(mainWindow);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// listen for page change event

ipcMain.handle("change-page", (e, pageName) => {
  ejse.data("currentView", pageName);
  mainWindow.loadFile(path.join(__dirname, "renderer", `${pageName}.ejs`));
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
