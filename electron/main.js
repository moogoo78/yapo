const { app, protocol, BrowserWindow, Menu } = require('electron')
import * as path from "path";
import * as url from "url";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 760,
    webPreferences: {
      nodeIntegration: true,
      //webSecurity: false,//});
      //contextIsolation: true, // https://github.com/electron/electron/issues/23506
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL(`http://localhost:4000`);
    mainWindow.webContents.openDevTools();
    //Menu.setApplicationMenu(null);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }
}

app.whenReady().then(() => {
  createWindow();
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
app.allowRendererProcessReuse = true;
