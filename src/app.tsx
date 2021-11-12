import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import React from 'react';
import { notification } from 'antd';
import { Token } from '@/utils/account';
import { RequestConfig, UseRequestProvider } from '@@/plugin-request/request';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import isMoment from 'dayjs/esm/plugin/isMoment';

dayjs.locale('zh-cn');
// fix: https://github.com/ant-design/antd-dayjs-webpack-plugin/issues/66
dayjs.extend(isMoment as any);

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

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
    };
  }

  return Promise.allSettled([queryCurrentUser().catch(() => history.push(loginPath))]).then(
    (res: any) => {
      return {
        currentUser: res[0]?.value,
        settings: {},
      };
    },
  );
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

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
