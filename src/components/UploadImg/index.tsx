import React, { useImperativeHandle } from 'react';
import { Upload } from 'antd';
import type {
  UploadChangeParam,
  UploadFile,
  UploadFileStatus,
  UploadProps,
} from 'antd/lib/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import type { Set } from 'react-zmage';
import Zmage from 'react-zmage';

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>选择图片</div>
  </div>
);

export function getBase64(file: File | Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export interface UploadImgRef {
  upload: (allowStatus?: UploadFileStatus[]) => Promise<any>;
}

export interface UploadImgProps extends UploadProps {
  request: (data: UploadFile) => Promise<any>;
}

const Index = React.forwardRef<UploadImgRef | undefined, UploadImgProps>((props, ref) => {
  const maxCount = props.maxCount ?? 5;

  // ref
  useImperativeHandle(ref, () => ({
    upload: (allowStatus: UploadFileStatus[] = ['done']) => {
      return Promise.all(submitUpload(allowStatus));
    },
  }));

  // preview
  const handPreview = async (file: UploadFile) => {
    const list = props.fileList || [];
    const set = await Promise.all(
      list.map(async (item) => ({
        src: item.url ?? (await getBase64(item.originFileObj as File)),
        alt: item.fileName ?? '图片',
      })),
    );

    Zmage.browsing({
      set: set as Set[],
      defaultPage: list.findIndex((item) => item.uid === file.uid) || 0,
    });
  };

  // upload
  const submitUpload = (allowStatus: UploadFileStatus[] = ['done']) => {
    return (props?.fileList || [])
      .filter((item) => !item.status || allowStatus.includes(item.status as UploadFileStatus))
      .map((item) =>
        props
          .request(item)
          .then((res) => {
            return setRes({
              uid: item.uid,
              status: 'success',
              url: res.url,
              thumbUrl: res.url,
              response: res,
            } as UploadFile);
          })
          .catch((err) => {
            return setRes({
              uid: item.uid,
              status: 'error',
              error: new Error(err.message || '上传错误'),
            } as UploadFile);
          }),
      );
  };

  // set
  const setRes = (file: UploadFile) => {
    let res = {}; // fix Proxy
    const fileList: UploadFile[] =
      props.fileList?.map((item) => {
        if (item.uid === file.uid) {
          Object.assign(item, file);
          res = { ...item, ...file };
        }
        return item;
      }) || [];

    props?.onChange?.({ file, fileList } as UploadChangeParam);

    return res;
  };

  return (
    <Upload
      multiple
      maxCount={maxCount}
      accept="image/*"
      listType="picture-card"
      beforeUpload={() => false}
      fileList={props.fileList}
      onChange={props.onChange}
      onPreview={handPreview}
      {...props}
    >
      {(props.fileList?.length || 0) >= maxCount ? null : uploadButton}
    </Upload>
  );
});

export default Index;
