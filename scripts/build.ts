/* eslint-disable no-console */
import path from 'path';
import { rollup, OutputOptions } from 'rollup';
import configs from '../rollup.config';

const log = (filePath: string) => console.log(`[✅]：${filePath}`);

async function start() {
  console.log('开始编译：');

  const bundles = await Promise.all(configs.map((config) => rollup(config)));

  await Promise.all(
    bundles.map((bundle, index) => {
      const outputConfig = configs[index].output as OutputOptions;

      return bundle.write(outputConfig).then((asset) => {
        asset.output.forEach((file) => {
          if (file.type === 'chunk') {
            log(outputConfig.file!);
          } else {
            log(path.join('dist', file.fileName));
          }
        });
      });
    })
  );

  console.log('编译完成！');
}

start();
