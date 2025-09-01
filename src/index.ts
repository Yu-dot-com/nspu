import {
  app,
  BrowserWindow,
  Notification,
  dialog,
  ipcMain,
  session,
  Tray,
  nativeImage,
  Menu,
} from "electron";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

console.log("Main process starting...");

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

function getIconPath(filename: string) {
  if (app.isPackaged) {
    // In production, icons are in the resources folder
    return path.join(process.resourcesPath, filename);
  } else {
    // In development, load from public folder at project root
     return path.join(__dirname, "..", "public", filename);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    icon: getIconPath("icon.png"),
    webPreferences: {
      preload:  MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox:false
    },
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
        `default-src 'self' data:; 
         script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com;
         connect-src 'self' https://hjgbaakpsgllnjgkjmmh.supabase.co https://play.google.com https://content.googleapis.com;
         style-src 'self' 'unsafe-inline' https://www.gstatic.com;
         img-src 'self' data: https://hjgbaakpsgllnjgkjmmh.supabase.co https://ssl.gstatic.com;
         frame-src 'self' https://docs.google.com https://docs.googleusercontent.com https://view.officeapps.live.com https://drive.google.com https://content.googleapis.com;`
      ],
      },
    });
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

function showNotification(title: string, body: string, icon: string) {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  } else {
    console.warn("Notifications are not supported on this platform");
    return true;
  }
}

app.whenReady().then(() => {
  createWindow();
  app.setAsDefaultProtocolClient("myapp");
  // App name for macOS menu bar
  app.setName("yuyu");

  // Hide dock icon on macOS
  // if (process.platform === "darwin") {
  //   app.dock.hide();
  // }

  //   const iconpath = getIconPath("yuuu.png");
  //   console.log("Tray icon path:", iconpath);
  // console.log("Icon file exists:", fs.existsSync(iconpath));

  const iconPath = getIconPath("nspu-fotor-bg-remover-20250820204839.png");
let icon = nativeImage.createFromPath(iconPath);
icon = icon.resize({ width: 23, height: 23 });
tray = new Tray(icon);

  tray.setToolTip("Test tray icon");
  tray.on("click", () => {
    console.log("Tray clicked");
  });

  tray.setToolTip("NSPU File management");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (mainWindow?.isVisible()) {
      mainWindow?.hide();
    } else {
      mainWindow?.show();
    }
  });
});

app.on("window-all-closed", () => {
  // Do nothing so app stays alive with tray icon
});

app.on("activate", () => {
  mainWindow?.show();
});

app.on("open-url", (event, url) => {
  event.preventDefault();
  if (mainWindow) mainWindow.webContents.send("deep-link", url);
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (event, argv) => {
    const url = argv.find((arg) => arg.startsWith("myapp://"));
    if (url && mainWindow) mainWindow.webContents.send("deep-link", url);
  });
}

// IPC handlers
ipcMain.handle("dialog:openFile", async () => {
  if (!mainWindow) throw new Error("Main window not available");
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "All Files", extensions: ["*"] }],
  });
  return result.filePaths;
});

ipcMain.handle("read-file", async (_event, filePath: string) => {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error("File does not exist: " + filePath);
  }
  const buffer = fs.readFileSync(filePath);
  return buffer;
});

ipcMain.handle("notify", (_event, data: { title: string; body: string }) => {
  console.log("Notify Data", data);

  const options: Electron.NotificationConstructorOptions = {
    title: data.title,
    body: data.body,
  };

  new Notification(options).show();
  return true;
});
console.log("Main process really startied...");
