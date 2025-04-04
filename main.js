const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startServer } = require(path.join(__dirname, 'server.js'));

// Inicia o servidor Express
startServer();

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
});