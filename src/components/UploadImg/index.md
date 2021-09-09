## UploadImg 上传图片

取消内置上传，采用外部上传

```tsx
import React, { useRef, useState } from 'react';
import UploadImg, { UploadImgRef } from '@/components/UploadImg';
import { UploadFile } from 'antd/lib/upload/interface';
import { Button } from 'antd';

const AddByCategory: React.FC = () => {
  const ref = useRef<UploadImgRef>();
  const [uploadImg, setUploadImg] = useState<UploadFile[]>([]);

  const handRequest = (file: UploadFile) => {
    const formData = new FormData();
    formData.append('image', file.originFileObj as File);
    formData.append('type', 'article');
    return API.images.postImages.request(formData);
  };

  const handUpload = () => {
    ref.current
      ?.upload()
      .then((res) => {
        console.log('所有图片上传完毕，都成功!', res);
      })
      .catch((err) => {
        console.log('所有图片上传完毕，有失败!!', err);
      });
  };

  return (
    <>
      <UploadImg
        ref={ref}
        fileList={uploadImg}
        request={handRequest}
        onChange={(res) => setUploadImg(res.fileList)}
      />
      <Button onClick={handUpload}>上传</Button>
    </>
  );
};

export default AddByCategory;
```
