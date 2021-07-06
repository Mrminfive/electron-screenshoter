export const isWindows = process.platform === 'win32';
export const isMac = process.platform === 'darwin';

export const isPacked =
  'electron' in process.versions &&
  !!process.mainModule &&
  process.mainModule.filename.includes('app.asar');

export function fixPathForAsar(path: string) {
  return isPacked ? path.replace('app.asar', 'app.asar.unpacked') : path;
}

export function generateErrorMessage(msg: string) {
  return `[electron-screenshot]: ${msg}`;
}

export function dateFormat(time: number | string | Date = Date.now()) {
  const date = new Date(time);
  return `${date.getFullYear()}${date.getMonth() +
    1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
}
