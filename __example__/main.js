const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');
const { initMain, close } = require('../dev/index');

app.on('ready', () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile(path.resolve(__dirname, './renderer.html'));
  win.webContents.openDevTools();
  initMain(win.webContents);

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: '编辑',
        submenu: [
          {
            accelerator: 'Esc',
            label: '取消截图',
            click: close
          }
        ]
      }
    ])
  );
});
