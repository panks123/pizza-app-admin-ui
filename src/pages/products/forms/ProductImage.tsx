import { Form, Space, Typography, Upload, UploadProps, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductImage: React.FC<{initialImage: string | null}> = ({initialImage}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file: File) => {
      if (!["image/png", "image/webp", "image/jpeg"].includes(file.type)) {
        messageApi.error("Invalid image type! Use only png/jpeg/webp files.");
      }
      setImageUrl(URL.createObjectURL(file));
      return false;
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customImageValidator = (_: any, value: {file: File} | string) => {
    if(typeof value !== "string"){
        if (value && !["image/png", "image/webp", "image/jpeg"].includes(value.file.type)) {
          return Promise.reject(new Error("Invalid image type! Use only png/jpeg/webp files."));
        }
    }
    return Promise.resolve();
  };

  return (
    <Form.Item
      label=""
      name="image"
      rules={[
        {
          required: true,
          message: "Required field!",
        },
        {
            validator: customImageValidator
        }
      ]}
    >
      <Upload listType="picture-card" {...uploaderConfig} maxCount={1}>
        {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt="product" style={{ width: "100%" }} />
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload Image</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
