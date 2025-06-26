import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  InputNumber,
  Select,
  Card,
} from "antd";
import {
  UploadOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useList } from "../../../hooks/useList";
import { useCreate } from "../../../hooks/useCreate";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const ATTRIBUTE_TYPES = ["color", "size"];

const AddProduct = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  
  {/** Lấy ra dnah mục sản phẩm */}
  const { data } = useList({
    resource: "/categories/admin"
  });

  const categoryOption = data?.data.map((cat:any) => ({
    label: cat.name,
    value: cat._id,
  }));
  console.log(categoryOption);
  
  {/** Thêm mới sản phẩm */}

  const { mutate:product } = useCreate<FormData>({
    resource: "/products"
  })
  const onFinish = async (values: any) => {
    if (!values.images || values.images.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }
    const formData = new FormData();
    formData.append('name', String(values.name));
    formData.append('product_code', String(values.product_code));
    formData.append('slug', String(values.slug));
    formData.append('description', content);
    formData.append('category_id', String(values.category_id));
    formData.append('original_price', String(values.original_price));
    formData.append('sale_price', String(values.sale_price));
  
    (values.tags || []).forEach((tag: string) => {
      formData.append('tags[]', tag);
    });


    //images
    values.images.forEach((file: any, index: number) => {
      if (file.originFileObj) {
        formData.append('images', file.originFileObj, file.name || `image_${index}`);
      }
    });

    const optionsToSend: any = {};
    ATTRIBUTE_TYPES.forEach((attr) => {
      const value = values.attributes?.[attr];
      if (value && Array.isArray(value)) {
        if (attr === "color") {
          optionsToSend[attr] = value.map((val: string) =>
            attr === "color"
              ? { name: val.trim(), hex: "#CCCCCC" }
              : val.trim()
          );;
        } else {
          optionsToSend[attr] = value;
        }
      }
    });
    formData.append("options", JSON.stringify(optionsToSend));
    setLoading(true);
    product(formData, {
      onSuccess: async (res:any) => {
        const productId = res?.data._id || res?.data?.data?._id;
        console.log("productId dùng để sinh biến thể:", productId);
        if (!productId) {
          message.error("Không lấy được productId");
          setLoading(false);
          return;
        }
        const token = localStorage.getItem("token") || "";
        try {
          await axios.post(`http://localhost:3000/api/variants/${productId}/variants/generate`, {
              options: optionsToSend,
              overwrite: true,
            }, 
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            }
          )
          nav('/admin/listProduct', { state: { shouldRefetch: true } });
        } catch (error) {
          console.error("Lỗi sinh biến thể:", error);
          message.error("Tạo sản phẩm thành công nhưng sinh biến thể thất bại");
          setLoading(false);
        }
      },
      onError: () => {
        setLoading(false);
        message.error("Tạo sản phẩm thất bại");
      }
    });
  };

  return (
    <div className="ml-10 mr-10 mt-[30px] shadow-md bg-white rounded-xl mb-[40px]">
      <div className="w-[96%] mx-auto flex justify-between pt-8">
        <span>
          <h3 className="text-2xl font-semibold mb-1">ADD NEW PRODUCT</h3>
          <p className="text-sm text-gray-500 mb-6">Fill in the product details</p>
        </span>
        <span>
          <Link to={`/admin/listProduct`}>
            <Button className='pr-[20px] text-[16px] font-sans' style={{height: 40, width: 150}} type='primary'><OrderedListOutlined />LIST PRODUCT</Button>
          </Link>
        </span>
      </div>
      <Form 
        layout="vertical" 
        form={form} onFinish={onFinish}
        style={{margin: 20}} className='m-2 [&_Input]:h-[40px]'
      >
        <Form.Item
          label="Product Name"
          name="name"
          className="font-semibold"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Product Code"
          name="product_code"
          className="font-semibold"
          rules={[{ required: true, message: "Please enter the product code" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          className="font-semibold"
          rules={[{ required: true, message: "Please enter the slug" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item className="font-semibold" label="Description" name="description" rules={[{required: true}]}>
          <CKEditor
            editor={ClassicEditor as any}
            data={content}
            onChange={(_, editor) => {
              const data = editor.getData();
              setContent(data);
              form.setFieldsValue({ description: data });
            }}
          >
            
          </CKEditor>
        </Form.Item>

        <Form.Item
          label="Category"
          name="category_id"
          className="font-semibold"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category" options={categoryOption}></Select>
        </Form.Item>

        <Form.Item
          label="Original_Price (VND)"
          name="original_price"
          className="font-semibold"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Sale_Price (VND)"
          name="sale_price"
          className="font-semibold"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Tags" name="tags" className="font-semibold">
          <Select mode="tags" style={{ width: "100%", height: 40 }} placeholder="Enter tags" />
        </Form.Item>

        <Form.Item
          label="Product Images"
          className="font-semibold"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Please upload product images" }]}
        >
          <Upload 
            beforeUpload={() => false} 
            listType="picture-card" 
            multiple>
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="Chọn thuộc tính" className="font-semibold">
          <Select
            mode="multiple"
            placeholder="Chọn thuộc tính"
            value={selectedAttributes}
            onChange={(values) => setSelectedAttributes(values)}
            options={ATTRIBUTE_TYPES.map(type => ({
              label: type.charAt(0).toUpperCase() + type.slice(1),
              value: type,
            }))}
          />
        </Form.Item>
        {ATTRIBUTE_TYPES.filter(attr => selectedAttributes.includes(attr)).map((type, index) => (
          <Card
            key={type}
            title={`Thuộc tính ${index + 1}: ${type === "color" ? "Color" : "Size"}`}
            className="shadow-sm border mt-4"
          > 
            <Form.Item
              name={["attributes", type]}
              label={`Values ${type === "color" ? "Color" : "Size"}`}
              rules={[{ required: true, message: `Hãy nhập giá trị cho ${type}` }]}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder={type === "color" ? "VD: Đỏ, Xanh, Trắng" : "VD: 38, 39, 40"}
              />
            </Form.Item>
          </Card>
        ))}
        <Form.Item>
          <div className="flex justify-end space-x-3 mb-6 mt-6">
            <Button 
              type="primary"  
              htmlType="submit"
              loading={loading}  
              style={{height: 40, width: 200}}
            >
              Save Product
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()}>
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
