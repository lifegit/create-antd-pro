#### 脚手架搭建流程

##### 官方脚手架搭建
[初始化](https://pro.ant.design/zh-CN/docs/getting-started#%E5%88%9D%E5%A7%8B%E5%8C%96) `yarn create umi myapp`


##### 替换 Moment.js
[移除](https://ant.design/docs/react/replace-moment-cn#antd-dayjs-webpack-plugin) Moment.js, 使用 [Dayjs](https://dayjs.fenxianglu.cn/) 代替。
1. 处理依赖
> npm uninstall --save moment # 移除moment
> 
> npm install --save dayjs # 安装dayjs
> 
> npm install --save-dev antd-dayjs-webpack-plugin # 安装dayjs-plugin

2. 添加 plugin 到 umi
```ts
+- config/config.ts

const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
export default defineConfig({
  chainWebpack(config: any) {
    config.plugin('antd-dayjs-webpack-plugin').use(AntdDayjsWebpackPlugin);
  }
});
```

3. 使用 dayjs
```ts
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
```

##### 关闭[国际化](https://pro.ant.design/zh-CN/docs/i18n)
1. `config/config.ts` 内的 locale 字段不能删除，这会导致例时间组件语言为英文。
2. `config/config.ts` 内的 `layout.locale = false` ,关闭菜单的国际化。
3. 删除国际化
> npm run i18n-remove
> 
> rm -rf ./src/locales

4. 修改语言
```txs
+- src/pages/document.ejs

<html lang="en"> => <html lang="zh-CN">
```

##### 打包去掉输出
去除 `build` 后的 `console.log()` 命令
```ts
++ config/plugin.ts

export default (config: any) => {
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


+- config/config.ts

import webpackPlugin from './plugin';
export default defineConfig({
  chainWebpack: webpackPlugin
});
```


##### 设置网络请求
[方法](https://pro.ant.design/zh-CN/docs/request) ,添加函数。
```tsx
+- src/app.tsx

import React from "react";
import {notification} from "antd";
import {Token} from "@/utils/account";
import {RequestConfig, UseRequestProvider} from "@@/plugin-request/request";
import type { RequestOptionsInit, ResponseError } from 'umi-request';


/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname === loginPath) {
    return {
      settings: {},
    }
  }

  return  Promise.allSettled([
    queryCurrentUser().catch(()=> history.push(loginPath) )
  ]).then((res: any) => {
    return {
      currentUser: res[0]?.value,
      settings: {},
    };
  })
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = async (error: ResponseError) => {
  let notErr = {
    description: '您的网络发生异常，无法连接服务器',
    message: '网络异常',
  };

  const { response } = error;
  if (response && response.status) {
    const { status, statusText } = response;
    let messageText;

    try {
      messageText = await response
        .clone()
        .json()
        .then((res) => res.msg);
    } catch (e) {
      messageText = '数据格式错误';
    }
    const errorText = messageText || codeMessage[status] || statusText;

    notErr = {
      description: errorText,
      message: `请求错误 ${status}`,
    };
  }

  notification.error(notErr);
  // eslint-disable-next-line no-param-reassign
  error.message = notErr.description;
  throw error;
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  timeout: 10 * 1000,
  requestType: 'json',
  errorHandler,
  // prefix: 'http://192.168.3.30:8888',
  requestInterceptors: [
    (url: string, options: RequestOptionsInit) => {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      options.headers.Authorization = Token.Get();
      return { url, options };
    },
  ],
};

// https://umijs.org/zh-CN/docs/runtime-config#rootcontainerlastrootcontainer-args
export function rootContainer(container: React.ReactNode) {
  // fix: https://github.com/umijs/umi/issues/5747
  const Wrapper = ({ children, routes }: any) => (
    <UseRequestProvider
      value={{
        refreshOnWindowFocus: false,
      }}
    >
      {React.cloneElement(children, {
        ...children.props,
        routes,
      })}
    </UseRequestProvider>
  );

  return React.createElement(Wrapper, null, container);
}


+- src/pages/user/Login/index.tsx
-- 移除
const fetchUserInfo = async () => {
  const userInfo = await initialState?.fetchUserInfo?.();

  if (userInfo) {
    await setInitialState((s) => ({ ...s, currentUser: userInfo }));
  }
};

+- 修改
const handleSubmit = async (values: API.LoginParams) => {
  setSubmitting(true);

  login({ ...values, type })
    .then(res => {
      setUserLoginState(res);
      if (res.status === "error"){
        throw new Error("登录失败，请重试！")
      }
      message.success('登录成功！');
      Token.Set(`${res?.token_type} ${res?.token}`);
    })
    .then(() => {
      return Promise.all([
        currentUser() // 获取用户信息
      ])
        .then(async (result) => {
          const [account] = result;
          await setInitialState((s) => ({
            ...s,
            currentUser: account.data,
          }));
        })
    })
    .then(() => {
      if (!history) return;
      const { query } = history.location;
      const { redirect } = query as { redirect: string };
      history.push(redirect || '/');
    })
    .catch(() => {
      message.error('登录失败，请重试！');
    }).finally(()=>{
    setSubmitting(false);
  })
};
```


##### docker
++ /docker
++ /Dockerfile

##### 去除多余的依赖

1. dependencies => devDependencies
> npm install --save-dev react-dev-inspector

2. 移除多余依赖
> npm uninstall --save antd lodash omit.js react-helmet-async umi-serve @umijs/route-utils

3. 依赖升级版本,见 `package.json`

##### 添加其他代码
###### README
```
修改 README.md
```
###### utils
```ts
++ src/utils/utils.ts

// Drawer：根据屏幕宽获取column数量
export const getDrawerWidth = () => {
  const { width } = window.screen;
  return width <= 640 ? { width: width * 0.8, column: 1 } : { width: 640, column: 2 };
};

// Map 转 Array，适用于select等组件
export const mapToArrayLabel = <T extends { label: string; value: string }>(
  map: Map<string, string>,
) => {
  let list: T[] = [];
  map.forEach((label, value) => {
    list = list.concat({ label, value } as T);
  });

  return list;
};
```
###### baseClass
```ts
++ src/utils/baseClass.ts

// 与业务有关的枚举放到这里
```

###### Token
> npm install --save local-storage
```ts
++ src/utils/account.ts
import { get, set } from "local-storage";

export class BaseStorage<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  public Set(val: T) {
    set(this.key, val)
  }
  public Get(): T {
    return get<T>(this.key);
  }
}

const Token = new BaseStorage<string>('token');

export { Token };
```


##### 自定义组件
因组件里代码太多，这里不方便展示。
```ts
++ src/components/Launch
++ src/components/PopConfirmCheck
++ src/components/ResultCard
++ src/components/UploadImg
```


##### 业务项目
以下文件请根据业务自行修改。
```ts
+- config/config.ts - openAPI
+- config/config.ts - proxy, routes
+- public - icons
```
