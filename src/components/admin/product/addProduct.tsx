import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  InputNumber,
  Select,
  Checkbox,
  Card,
  Divider,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useList } from "../../../hooks/useList";
import { useCreate } from "../../../hooks/useCreate";
import { useNavigate } from "react-router-dom";

const SIZE_OPTIONS = ["38", "39", "40", "41", "42", "43"];

const AddProduct = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const nav = useNavigate();
  

  
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

  const { mutate } = useCreate<FormData>({
    resource: "/products"
  })

  const onFinish = (values: any) => {
    if (!values.images || values.images.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }
    const formData = new FormData();
    formData.append('name', String(values.name));
    formData.append('slug', String(values.slug));
    formData.append('description', content);
    formData.append('category_id', String(values.category_id));
    formData.append('price', String(values.price));
    formData.append('stock', String(values.stock));
    (values.tags || []).forEach((tag: string) => {
      formData.append('tags[]', tag);
    });


    //images
    values.images.forEach((file: any) => {
      formData.append('images', file.originFileObj);
    });

    // xử lý variant
    const parsedVariants = (values.variants || []).flatMap((variant: any) => {
      const sizes = variant.sizes || [];
      const stockBySize = variant.stockBySize || {};
      return sizes.map((size: string | number) => ({
        color: variant.color,
        size,
        stock: Number(stockBySize[size] || 0),
      }));
    });
    formData.append('variants', JSON.stringify(parsedVariants));
    mutate(formData);
    nav('/admin/listProduct');
  };
  return (
    <div className="w-[90%] mx-auto mt-[30px] shadow-md bg-white rounded mb-[40px]">
      <div className="w-full pt-[20px]">
        <h3 className="pl-[20px] text-2xl font-semibold mb-1">ADD NEW PRODUCT</h3>
        <p className="pl-[20px] text-sm text-gray-500 mb-6">Fill in the product details</p>
        <hr className="border-t border-gray-300 mb-6 -mt-3" />
      </div>
      <Form 
        layout="vertical" 
        form={form} onFinish={onFinish}
        style={{margin: 20}} className='m-2 [&_Input]:h-[40px]'
      >
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Please enter the slug" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <CKEditor
            editor={ClassicEditor as any}
            data={content}
            onChange={(_, editor) => {
              const data = editor.getData();
              setContent(data);
              form.setFieldsValue({ description: data }); // 🔥 Cập nhật value cho Form
            }}
          >
            
          </CKEditor>
        </Form.Item>

        <Form.Item
          label="Category"
          name="category_id"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select style={{height: 40}} options={categoryOption}></Select>
        </Form.Item>

        <Form.Item
          label="Price (VND)"
          name="price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, type: "number", message: "Enter stock" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select mode="tags" style={{ width: "100%" }} placeholder="Enter tags" />
        </Form.Item>

        <Form.Item
          label="Product Images"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Please upload product images" }]}
        >
          <Upload beforeUpload={() => false} listType="picture-card" multiple>
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.List name="variants">
          {(fields, { add, remove }) => (
            <>
              <h4 className="font-medium text-base mb-2">Product Variants</h4>
              <div className="space-y-4">
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    title={`Variant ${key + 1}`}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    }
                    className="shadow-sm border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, "color"]}
                        label="Color"
                        rules={[{ required: true, message: "Enter color" }]}
                      >
                        <Input placeholder="Color" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "sizes"]}
                        label="Available Sizes"
                        rules={[{ required: true, message: "Select at least one size" }]}
                      >
                        <Checkbox.Group options={SIZE_OPTIONS} />
                      </Form.Item>
                    </div>

                    <Form.Item
                      shouldUpdate={(prev, curr) =>
                        prev.variants !== curr.variants
                      }
                      noStyle
                    >
                      {() => {
                        const currentSizes =
                          form.getFieldValue(["variants", name, "sizes"]) || [];
                        return currentSizes.length > 0 ? (
                          <>
                            <Divider className="mt-4 mb-2 " orientation="left">
                              Stock by Size
                            </Divider>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {currentSizes.map((size: string | number) => (
                                <Form.Item
                                  key={size}
                                  label={`Size ${size}`}
                                  name={[name, "stockBySize", size]}
                                  rules={[{ required: true, message: "Enter stock" }]}
                                >
                                  <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    placeholder="Stock"
                                  />
                                </Form.Item>
                              ))}
                            </div>
                          </>
                        ) : null;
                      }}
                    </Form.Item>
                  </Card>
                ))}
              </div>

              <Form.Item className="pt-3">
                <Button
                  style={{height: 40}}
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  block
                >
                  Add Variant
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <div className="flex justify-end space-x-3 mb-6">
            <Button type="primary" htmlType="submit" style={{height: 40}}>
              Save Product
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()} style={{height: 40}}>
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
