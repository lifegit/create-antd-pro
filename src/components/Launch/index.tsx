import { ReactNode } from 'react';
import { CopyOutlined, PhoneOutlined, PictureOutlined, QqOutlined } from '@ant-design/icons';
import { copyText } from './utils';
// import Zmage from 'react-zmage';
import styles from './index.less';

// QQ
export const LaunchQQ = (props: { qq: string }) => {
  if (!props.qq) return null;
  const url = navigator.userAgent.match(/AppleWebKit.*Mobile.*/)
    ? `mqqwpa://im/chat?chat_type=wpa&uin=${props.qq}`
    : `https://wpa.qq.com/msgrd?V=3&Uin=${props.qq}&Site=qq&Menu=yes`;

  return (
    <>
      {props.qq}
      <a className={styles.LaunchQQ} target="blank" href={url}>
        <QqOutlined />
      </a>
    </>
  );
};

interface LaunchUrlOptions {
  url: string;
  open?: boolean;
  copy?: boolean;
  children?: ReactNode;
}
// URL地址
export const LaunchUrl = (props: LaunchUrlOptions) => {
  if (!props.url) return null;

  return (
    <>
      {props.open && (
        <a className={styles.LaunchUrl} href={props.url} target="_blank">
          {props.children}
          {/* eslint-disable-next-line global-require */}
          <img src={require('./link.svg')} alt="open" style={{ width: 13, marginLeft: 5 }} />
        </a>
      )}
      {props.copy && (
        <a className={styles.LaunchUrl}>
          <CopyOutlined onClick={() => copyText(props.url)} />
        </a>
      )}
    </>
  );
};

interface LaunchImgOptions {
  src: string[];
  icon?: ReactNode;
}
// 图片
export const LaunchImg = (props: LaunchImgOptions) => {
  if (!props.src) return null;
  return (
    <a
      className={styles.LaunchImg}
      // onClick={() => Zmage.browsing({ set: props.src.map((item) => ({ src: item })) })}
    >
      {props.icon ?? <PictureOutlined />}
    </a>
  );
};

interface LaunchMobileOptions {
  mobile: string;
  icon?: ReactNode;
}
// 手机
export const LaunchMobile = (props: LaunchMobileOptions) => {
  if (!props.mobile) return null;
  return (
    <>
      {props.mobile}
      <a className={styles.LaunchMobile} target="blank" href={`tel:${props.mobile}`}>
        {props.icon ?? <PhoneOutlined />}
      </a>
    </>
  );
};
