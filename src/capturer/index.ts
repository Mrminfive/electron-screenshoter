import fs from 'fs';
import path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { remote, Display, Rectangle } from 'electron';
import {
  isWindows,
  isMac,
  generateErrorMessage,
  fixPathForAsar
} from '../share/util';

const { screen } = remote;

function waitProcess(process: ChildProcessWithoutNullStreams) {
  return new Promise((resolve, reject) => {
    process.on('exit', resolve);
    process.on('error', reject);
  });
}

export class ScreenshotTaker {
  public bounds: Rectangle;

  private _outputPath = '';

  private _currentScreen: Display;

  constructor() {
    this._currentScreen = this._getCurrentScreen();
    this.bounds = this._getBounds();
  }

  public async getScreenshot(): Promise<string> {
    const index = screen
      .getAllDisplays()
      .findIndex((s) => s.id === this._currentScreen.id);
    const fileName = `cap_${index}.png`;
    const destFolder = remote.app.getPath('userData');
    const outputPath = path.join(destFolder, fileName);
    this._outputPath = outputPath;

    await this._capture(outputPath, index);

    return outputPath;
  }

  public clear() {
    fs.unlinkSync(this._outputPath);
  }

  /**
   * 获取当前窗口
   */
  private _getCurrentScreen(): Display {
    const cursorPoint = screen.getCursorScreenPoint();
    return screen.getDisplayNearestPoint({
      x: cursorPoint.x,
      y: cursorPoint.y
    });
  }

  /**
   * 获取当前窗口规格
   */
  private _getBounds(): Rectangle {
    if (isWindows) {
      return this._getWindowsBounds();
    } else if (isMac) {
      return this._getMacBounds();
    } else {
      throw new Error(generateErrorMessage('current platform not supported'));
    }
  }

  private _getWindowsBounds(): Rectangle {
    const allDisplays = screen
      .getAllDisplays()
      .sort((a, b) =>
        a.bounds.x === b.bounds.x
          ? a.bounds.y - b.bounds.y
          : a.bounds.x - b.bounds.x
      );
    const lastDisplay = allDisplays[allDisplays.length - 1];
    return {
      x: 0,
      y: 0,
      width: lastDisplay.bounds.x + lastDisplay.bounds.width,
      height: lastDisplay.bounds.y + lastDisplay.bounds.height
    };
  }

  private _getMacBounds(): Rectangle {
    return this._currentScreen.bounds;
  }

  /**
   * 生成屏幕快照
   *
   * @param outputPath 屏幕快照保存路径
   * @param displayIndex 快照屏幕序号
   */
  private async _capture(outputPath: string, displayIndex: number) {
    if (isWindows) {
      await this._performWindowsCapture(outputPath);
    }

    if (isMac) {
      await this._performMacOSCapture(outputPath, displayIndex);
    }
  }

  private _performWindowsCapture(outputPath: string) {
    const process = spawn(fixPathForAsar(path.join(__dirname, 'nircmd.exe')), [
      'savescreenshotfull',
      outputPath
    ]);
    return waitProcess(process);
  }

  private _performMacOSCapture(outputPath: string, index: number) {
    index;

    const process = spawn('screencapture', [
      '-x',
      /**
       * 暂时去掉 -D 参数，避免版本不兼容情况
       */
      // '-D',
      // `${index + 1}`,
      outputPath
    ]);

    return waitProcess(process);
  }
}
