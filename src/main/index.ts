import { ipcMain, WebContents, BrowserWindow } from 'electron';
import { CAPTURER_DATA, ScreenshotEvent } from '../share/constant';
import { generateErrorMessage } from '../share/util';

let renderContent: WebContents | undefined;
let screenshotContent: WebContents | undefined;
let imgPath: string | undefined;

function reset() {
  screenshotContent = undefined;
  imgPath = undefined;
}

/**
 * 代理截图信号至调用窗口
 */
function proxyScreenshotEvents(winContent: WebContents) {
  const screenshotEvents = [
    ScreenshotEvent.Close,
    ScreenshotEvent.Ready,
    ScreenshotEvent.Save,
    ScreenshotEvent.Success
  ];

  screenshotEvents.forEach((eventName) => {
    ipcMain.on(eventName, (event, message) => {
      screenshotContent = event.sender;
      winContent.send(eventName, message);
    });
  });

  ipcMain.on(ScreenshotEvent.Ready, (event) => {
    if (imgPath != null) {
      event.sender.send(ScreenshotEvent.SetData, imgPath);
      reset();
    }
  });
}

export function initMain(winContent: WebContents) {
  renderContent = winContent;

  proxyScreenshotEvents(winContent);

  ipcMain.on(CAPTURER_DATA, (event, message: string) => {
    // 设置当前图片
    if (screenshotContent && !screenshotContent.isDestroyed()) {
      screenshotContent.send(ScreenshotEvent.SetData, message);
    } else {
      imgPath = message;
    }
  });
}

export function close() {
  if (renderContent) {
    renderContent.send(
      ScreenshotEvent.Close,
      BrowserWindow.getAllWindows().map((w) => w.id)
    );
  } else {
    // eslint-disable-next-line no-console
    console.warn(generateErrorMessage('请检查 ininMain 方法时候正确调用！'));
  }
}
