import urlUtil from 'url';
import path from 'path';
import { BrowserWindowConstructorOptions, remote, ipcRenderer } from 'electron';
import { ScreenshotTaker } from '../capturer';
import { isWindows, generateErrorMessage, isMac } from '../share/util';
import { ScreenshotEvent, CAPTURER_DATA } from '../share/constant';

const { BrowserWindow } = remote;
const clipRenderUrl = '../screenshot/index.html';

let win: Electron.BrowserWindow | null = null;
let taker: ScreenshotTaker | null = null;
let resolveFun: Function | null = null;
let rejectFun: Function | null = null;

/**
 * 创建操作弹窗
 *
 * @param url 窗口
 * @param options 窗口设置参数
 */
function createChildWin(url: string, options: BrowserWindowConstructorOptions) {
  const cWin = new BrowserWindow({
    alwaysOnTop: true,
    show: false,
    transparent: true,
    frame: false,
    movable: false,
    resizable: false,
    fullscreen: isWindows || undefined,
    enableLargerThanScreen: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true
    },
    ...options
  });

  cWin.loadURL(
    urlUtil.format({
      pathname: path.join(__dirname, url),
      protocol: 'file',
      slashes: true
    })
  );

  if (isMac) {
    cWin.setAlwaysOnTop(true, 'screen-saver');
    cWin.setVisibleOnAllWorkspaces(true);
    cWin.setFullScreenable(false);
    cWin.show();
    cWin.setVisibleOnAllWorkspaces(false);
  }

  return cWin;
}

function reset() {
  win?.close();
  taker?.clear();

  win = null;
  taker = null;
  resolveFun = null;
  rejectFun = null;
}

async function screenshot() {
  if (resolveFun && rejectFun) {
    return Promise.reject(new Error(generateErrorMessage('now is cutting!')));
  }

  return new Promise((resolve, reject) => {
    resolveFun = resolve;
    rejectFun = reject;

    try {
      if (!win || win.isDestroyed()) {
        taker = new ScreenshotTaker();
        taker
          .getScreenshot()
          .then((url) => {
            ipcRenderer.send(CAPTURER_DATA, url);
          })
          .catch(reject);

        win = createChildWin(clipRenderUrl, taker.bounds);
        win.on('closed', () => {
          win = null;
        });
        win.on('ready-to-show', () => {
          win?.show();
          win?.focus();
        });

        win.webContents.executeJavaScript(
          `;window.cut(${taker.bounds.width}, ${taker.bounds.height});`
        );
      }
    } catch (err) {
      reject(err);
      reset();
    }
  });
}

ipcRenderer.on(ScreenshotEvent.Success, (event, message) => {
  resolveFun && resolveFun(message);
  reset();
});

ipcRenderer.on(ScreenshotEvent.Close, () => {
  rejectFun && rejectFun(new Error(generateErrorMessage('quit cut')));
  reset();
});

ipcRenderer.on(ScreenshotEvent.Save, (event, message) => {
  resolveFun && resolveFun(message);
  reset();
});

export { screenshot };
