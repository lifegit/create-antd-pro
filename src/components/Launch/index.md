## Launch

支持各种意图，类似android的Action

### API

#### LaunchQQ

| 参数      | 说明                                      | 类型         | 必选 | 默认值 |
|----------|------------------------------------------|-------------|-------|-------|
| qq       | QQ           | string  | true | - |

#### LaunchUrl


| 参数      | 说明                                      | 类型         | 必选 | 默认值 |
|----------|------------------------------------------|-------------|-------|-------|
| url       | url           | string  | true | - |
| open      | 是否打开       | bool  | false | false |
| copy      | 是否复制       | bool  | false | false |


#### LaunchImg


| 参数      | 说明                                      | 类型         | 必选 | 默认值 |
|----------|------------------------------------------|-------------|-------|-------|
| src       | 图片列表           | string[]  | true | - |
| icon      | 图标       | React.ReactNode  | false | `<PictureOutlined/>` |

#### LaunchMobile


| 参数      | 说明                                      | 类型         | 必选 | 默认值 |
|----------|------------------------------------------|-------------|-------|-------|
| mobile       | 手机号           | string  | true | - |
| icon      | 图标       | React.ReactNode  | false | `<PhoneOutlined/>` |


### 代码演示

```tsx
import React from 'react';
import {LaunchQQ,LaunchUrl,LaunchImg,LaunchMobile} from './index'

export default () =>{
  
  return (
    <div>
      <div>
        <LaunchQQ qq={'597985317'}/>
      </div>
      <div>
        <LaunchUrl url={"https://baidu.com"} open={true} copy={true} />
      </div>
      <div>
        <LaunchImg src={['https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png','https://preview.pro.ant.design/favicon.ico']} />
      </div>
      <div>
        <LaunchMobile mobile={'13000000000'} />
      </div>
    </div>
    )
};
```
