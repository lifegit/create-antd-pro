import React from 'react';
import { history } from 'umi';
import { Button, Card, Result } from 'antd';

interface Options {
  title?: string;
  subTitle?: string;
}

const Index: React.FC<Options> = (props) => {
  const { title = '错误', subTitle = '获取信息错误！' } = props;

  return (
    <Card>
      <Result
        status="error"
        title={title}
        subTitle={subTitle}
        extra={[
          <Button key="primary" type="primary" onClick={() => history.goBack()}>
            返回
          </Button>,
        ]}
      />
    </Card>
  );
};

export default Index;
