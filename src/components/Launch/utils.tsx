import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile';

export const copyText = (text: string) => {
  copy(text);
  Toast.success('ε€εΆζε', 1.5, undefined, false);
};
