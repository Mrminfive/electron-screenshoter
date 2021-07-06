/* eslint-disable no-console */
import path from 'path';
import { spawn } from 'child_process';
import { watch, RollupOptions } from 'rollup';
import configs from '../rollup.config';

let examplePid: number;

let waitTimer: number;

const configStatus: Record<string, boolean> = {};

const hasError = () => Object.values(configStatus).includes(false);

function startElectron() {
  const exampleProcess = spawn(
    'electron',
    ['--enable-logging', path.resolve(__dirname, '../__example__/main.js')],
    {
      stdio: [null, process.stdout, process.stderr]
    }
  );

  process.once('exit', () => {
    try {
      process.kill(examplePid);
    } catch (err) {
      console.error('[electron-screenshot]: 退出 electron 进程失败', err);
    }
  });

  examplePid = exampleProcess.pid;

  return exampleProcess.pid;
}

function restartElectron() {
  process.kill(examplePid);

  const nowTime = Date.now();
  waitTimer = nowTime;

  setTimeout(() => {
    if (waitTimer === nowTime) {
      startElectron();
    }
  }, 300);
}

function startExample() {
  if (hasError()) return;

  if (examplePid != null) {
    restartElectron();
  } else {
    startElectron();
  }
}

async function rollupBuild(options: RollupOptions[]) {
  const watcher = watch(options);

  watcher.on('event', (event) => {
    switch (event.code) {
      case 'END':
        startExample();
        break;
      case 'ERROR':
        console.error(event.error);
        break;
      default:
        return false;
    }
  });
}

function start() {
  console.log(`---- 开启 dev 模式 ----`);
  rollupBuild(configs);
}

start();
