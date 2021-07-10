# electron-screenshoter

electron 截图插件

![types](https://img.shields.io/npm/types/typescript)
![electron](https://img.shields.io/badge/electron-%3E%3D3.0.0-green)
![platform](https://img.shields.io/badge/platform-Mac%20%7C%20Windows-orange)
![download](https://img.shields.io/npm/dt/electron-screenshoter)

## Usage

安装

```shell
yarn add electron-screenshoter
```

使用方式

### 主进程

```js
const { initMain, close } = require('electron-screenshoter');

app.on('ready', () => {
  const win = new BrowserWindow();
  initMain(win.webContents);

  // 新增快捷键取消截图
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
```

**注：传入 `intMain` 方法的参数为实际调用截图功能的渲染进程**

### 渲染进程

```js
const { screenshot } = require('electron-screenshoter');

screenshot().then(({ base64 }) => {
  console.log('截图 base64 地址: ', base64);
});
```

## Notice

windows 系统下使用 [nircmd][nircmd] 程序捕捉桌面帧，为保证一致性，插件已将该可执行文件集成至项目中，打包时需要在 `package.json` 中增加以下配置：

```json
{
  ...
  "build": {
    ...
    "asarUnpack": [
      "*.exe"
    ],
    ...
  }
  ...
}
```

详细参见：[electron-builder-doc: Overridable per Platform Options][electron-builder-doc]

[nircmd]: https://www.nirsoft.net/utils/nircmd.html
[electron-builder-doc]: https://www.electron.build/configuration/configuration#overridable-per-platform-options
