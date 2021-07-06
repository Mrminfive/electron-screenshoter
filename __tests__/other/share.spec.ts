import {
  isWindows,
  isMac,
  isPacked,
  fixPathForAsar,
  generateErrorMessage,
  dateFormat
} from '../../src/share/util';

describe('Test share/util', () => {
  test('isWindows', () => {
    expect(isWindows).toBe(process.platform === 'win32');
  });

  test('isMac', () => {
    expect(isMac).toBe(process.platform === 'darwin');
  });

  test('isPacked', () => {
    expect(isPacked).toBeFalsy();
  });

  test('fixPathForAsar', () => {
    if (isPacked) {
      expect(fixPathForAsar('file/dir/app.asar')).toEqual(
        'file/dir/app.asar.unpacked'
      );
    } else {
      expect(fixPathForAsar('file/dir/app.asar')).toEqual('file/dir/app.asar');
    }
  });

  test('generateErrorMessage', () => {
    const res = '[electron-screenshot]: test';
    expect(generateErrorMessage('test')).toEqual(res);
  });

  test('dateFormat', () => {
    const time1 = 1581933835985;
    const time2 = '2020-02-17';
    const time3 = new Date(time2);

    expect(dateFormat(time1)).toEqual('2020217_18355');
    expect(dateFormat(time2)).toEqual('2020217_800');
    expect(dateFormat(time3)).toEqual('2020217_800');
  });
});
