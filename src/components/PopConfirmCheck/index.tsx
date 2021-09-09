import React from 'react';
import { Popconfirm } from 'antd';

const Index: React.FC<{
  text: string;
  onConfirm: (e?: React.MouseEvent<HTMLElement>) => void;
}> = (props) => (
  <Popconfirm
    title={`确定要${props.text}?`}
    onConfirm={props.onConfirm}
    okText="确定"
    cancelText="取消"
  >
    <a>{props.text}</a>
  </Popconfirm>
);

export default Index;
