import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile';

export const copyText = (text: string) => {
  copy(text);
  Toast.success('复制成功', 1.5, undefined, false);
};
