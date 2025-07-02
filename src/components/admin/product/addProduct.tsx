import React, { useState } from "react";
import {
  Form, Input, Button, Upload, message, InputNumber, Select, Card, Tabs
} from "antd";
import {
  UploadOutlined, OrderedListOutlined, SaveOutlined, ReloadOutlined
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useList } from "../../../hooks/useList";
import { useCreate } from "../../../hooks/useCreate";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ATTRIBUTE_TYPES = ["color", "size"];

const AddProduct = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  const { data } = useList({ resource: "/categories/admin" });

  const categoryOption = data?.data.map((cat: any) => ({
    label: cat.name,
    value: cat._id,
  }));

  const { mutate: product } = useCreate<FormData>({ resource: "/products" });

  const onFinish = async (values: any) => {
    if (!values.images || values.images.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('product_code', values.product_code);
    formData.append('slug', values.slug);
    formData.append('description', content);
    formData.append('category_id', values.category_id);
    formData.append('original_price', values.original_price);
    formData.append('sale_price', values.sale_price);
    (values.tags || []).forEach((tag: string) => formData.append('tags[]', tag));

    values.images.forEach((file: any, index: number) => {
      if (file.originFileObj) {
        formData.append('images', file.originFileObj, file.name || `image_${index}`);
      }
    });

    const optionsToSend: any = {};
    ATTRIBUTE_TYPES.forEach(attr => {
      const value = values.attributes?.[attr];
      if (value && Array.isArray(value)) {
        optionsToSend[attr] = attr === "color"
          ? value.map((val: string) => ({ name: val.trim(), hex: "#CCCCCC" }))
          : value;
      }
    });

    formData.append("options", JSON.stringify(optionsToSend));
    setLoading(true);
    product(formData, {
      onSuccess: async (res: any) => {
        const productId = res?.data._id || res?.data?.data?._id;
        if (!productId) {
          message.error("Không lấy được productId");
          setLoading(false);
          return;
        }
        const token = localStorage.getItem("token") || "";
        try {
          await axios.post(
            `http://localhost:3000/api/variants/${productId}/variants/generate`,
            { options: optionsToSend, overwrite: true },
            { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
          );
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
    <div className="ml-6 mr-6 mt-6 mb-10 bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">🛍️ Thêm sản phẩm mới</h2>
          <p className="text-gray-500">Nhập thông tin chi tiết để đăng bán sản phẩm</p>
        </div>
        <Link to="/admin/listProduct">
          <Button type="default" icon={<OrderedListOutlined />} style={{ height: 40 }}>
            Danh sách sản phẩm
          </Button>
        </Link>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(changedValues, allValues) => {
          if ("name" in changedValues) {
            const rawName = changedValues.name || "";
            const generatedSlug = rawName
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9 ]/g, "")
              .trim()
              .replace(/\s+/g, "-");
            form.setFieldsValue({ slug: generatedSlug });
          }
        }}
      >
        <Tabs defaultActiveKey="1">
          {/* Tab 1: Thông tin */}
          <Tabs.TabPane tab="Product Information" key="1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                <Input className="h-[40px]" />
              </Form.Item>
              <Form.Item name="product_code" label="Mã sản phẩm" rules={[{ required: true }]}>
                <Input className="h-[40px]"  />
              </Form.Item>
              <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                <Input className="h-[40px]"  />
              </Form.Item>
              <Form.Item name="category_id" label="Danh mục" rules={[{ required: true }]}>
                <Select style={{height: 40}} className="h-[40px]"  placeholder="Chọn danh mục" options={categoryOption} />
              </Form.Item>
              <Form.Item name="original_price" label="Giá gốc (VND)" rules={[{ required: true }]}>
                <InputNumber style={{width: 560}} min={0} className="w-[full] h-[40px]" />
              </Form.Item>
              <Form.Item name="sale_price" label="Giá khuyến mãi (VND)" rules={[{ required: true }]}>
                <InputNumber style={{width: 560}} min={0} className="w-full h-[40px]" />
              </Form.Item>
              <Form.Item
                name="tags" 
                label="Tags"
              >
                <Select style={{height: 40, width: 1150, display: "flex", alignItems: "center"}} mode="tags" className="placeholder:flex placeholder:items-center" placeholder="VD: sneaker, thời trang" />
              </Form.Item>
            </div>
          </Tabs.TabPane>

          {/* Tab 2: Mô tả & Hình ảnh */}
          <Tabs.TabPane tab="Description and images" key="2">
            <Form.Item name="description" label="Mô tả sản phẩm" rules={[{ required: true }]}>
              <CKEditor
                editor={ClassicEditor as any}
                data={content}
                onChange={(_, editor) => {
                  const data = editor.getData();
                  setContent(data);
                  form.setFieldsValue({ description: data });
                }}
              />
            </Form.Item>
            <Form.Item
              name="images"
              label="Ảnh sản phẩm"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Vui lòng upload ảnh sản phẩm" }]}
            >
              <Upload beforeUpload={() => false} listType="picture-card" multiple>
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Tabs.TabPane>

          {/* Tab 3: Thuộc tính */}
          <Tabs.TabPane tab="Properties" key="3">
            <Form.Item label="Chọn thuộc tính">
              <Select
                mode="multiple"
                size="large"
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
                title={`Thuộc tính ${index + 1}: ${type === "color" ? "Màu sắc" : "Size"}`}
                className="shadow-sm border mt-4"
              >
                <Form.Item
                  name={["attributes", type]}
                  label={`Giá trị ${type === "color" ? "màu sắc" : "kích thước"}`}
                  rules={[{ required: true, message: `Nhập giá trị cho ${type}` }]}
                >
                  <Select className="w-full" mode="tags" placeholder={type === "color" ? "VD: Đỏ, Xanh" : "VD: 38, 39, 40"} />
                </Form.Item>
              </Card>
            ))}
          </Tabs.TabPane>
        </Tabs>

        <Form.Item>
          <div className="flex justify-end space-x-3 mt-10">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
              style={{height: 40}}
              className="h-[40px] w-[180px]"
            >
              Save Product
            </Button>
            <Button
              icon={<ReloadOutlined />}
              htmlType="button"
              onClick={() => form.resetFields()}
              disabled={loading}
              style={{height: 40}}
              className="h-[40px]"
              danger
            >
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
