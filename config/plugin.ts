const { InjectManifest } = require('workbox-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

export default (config: any) => {
  // 替换 moment => dayjs
  config.plugin('antd-dayjs-webpack-plugin').use(AntdDayjsWebpackPlugin).end();

  // pwa - service-worker
  if (process.env.NODE_ENV === 'production') {
    config.plugin('workbox').use(InjectManifest, [
      {
        swSrc: '/src/pwa/service-worker.js',
        swDest: 'sw.js',
        exclude: [/\.map$/, /favicon\.ico$/, /^manifest.*\.js?$/],
      },
    ]);
  }

  // 打包优化 uglifyjs-webpack-plugin 配置
  if (process.env.NODE_ENV === 'production') {
    config.merge({
      plugin: {
        install: {
          plugin: require('uglifyjs-webpack-plugin'),
          args: [
            {
              sourceMap: false,
              uglifyOptions: {
                compress: {
                  // 删除所有的 `console` 语句
                  drop_console: true,
                },
                output: {
                  // 最紧凑的输出
                  beautify: true,
                  // 删除所有的注释
                  comments: true,
                },
              },
            },
          ],
        },
      },
    });
  }
};
