import React from "react";
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

const { TextArea } = Input;
const SIZE_OPTIONS = [38, 39, 40, 41, 42, 43];

const AddProduct = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    if (!values.images || values.images.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }
    message.success("Form data collected (not submitted to server).");
  };

  return (
    <div className="p-6 bg-white min-h-screen mt-20 w-full mx-auto">
      <h3 className="text-2xl font-semibold mb-1">ADD NEW PRODUCT</h3>
      <p className="text-sm text-gray-500 mb-6">Fill in the product details</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form layout="vertical" form={form} onFinish={onFinish}>
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
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category_id"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category">
            <Select.Option value="cat1">Category 1</Select.Option>
            <Select.Option value="cat2">Category 2</Select.Option>
            <Select.Option value="cat3">Category 3</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Price (VND)"
          name="price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: "Please enter the stock" }]}
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
                        name={[name, "image"]}
                        label="Image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) =>
                          Array.isArray(e) ? e : e?.fileList
                        }
                        rules={[{ required: true, message: "Please upload an image" }]}
                      >
                        <Upload beforeUpload={() => false} listType="picture">
                          <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
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
                            <Divider className="mt-4 mb-2" orientation="left">
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

              <Form.Item className="mt-4">
                <Button
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
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">
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
