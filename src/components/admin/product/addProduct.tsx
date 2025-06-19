import React, { useState } from "react";
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
  OrderedListOutlined,
} from "@ant-design/icons";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useList } from "../../../hooks/useList";
import { useCreate } from "../../../hooks/useCreate";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const { TextArea } = Input;
const SIZE_OPTIONS = [38, 39, 40, 41, 42, 43];

const AddProduct = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  
  {/** Lấy ra danh mục sản phẩm */}
  const { data } = useList({
    resource: "/categories/admin"
  });
  
  const colorOption = [
    {value: "black", label: "Black"},
    {value: "white", label: "White"},
  ]

  const categoryOption = data?.data.map((cat:any) => ({
    label: cat.name,
    value: cat._id,
  }));
  console.log(categoryOption);
  
  {/** Thêm mới sản phẩm */}

  const { mutate } = useCreate<FormData>({
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
        formData.append('images', file.originFileObj, file.name || `image_${index}.jpg`);
      }
    });

    // xử lý variant
    const parsedVariants = (values.variants || []).flatMap((variant: any, index: number) => {
      const sizes = variant.sizes || [];
      const stockBySize = variant.stockBySize || {};
      const fileList = variant.image;
      const imageFile = Array.isArray(fileList) ? fileList[0]?.originFileObj : null;
      
      if (!imageFile) {
        message.error(`Vui lòng upload ảnh cho biến thể ${index + 1}`);
        return [];
      }
      console.log(imageFile);
     

      return sizes.map((size: string | number) => ({
        color: variant.color,
        size: String(size),
        stock: Number(stockBySize[size] || 0),
        image: imageFile
      }));
    });
    parsedVariants.forEach((variant: any, index: number) => {
      if (variant.image) {
        formData.append('variantImages', variant.image, `variant_${index}.jpg`);
      }
    });
    const variantsToSend = parsedVariants.map(({ image, ...rest }:any) => rest);
    formData.append('variants', JSON.stringify(variantsToSend));
    setLoading(true);
    mutate(formData, {
      onSuccess: () => {
        nav('/admin/listProduct', { state: { shouldRefetch: true } });
      },
      onError: () => {
        setLoading(false);
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
          label="Product Code"
          name="product_code"
          rules={[{ required: true, message: "Please enter the product code" }]}
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
              form.setFieldsValue({ description: data });
            }}
          >
            
          </CKEditor>
        </Form.Item>

        <Form.Item
          label="Category"
          name="category_id"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category" options={categoryOption}></Select>
        </Form.Item>

        <Form.Item
          label="Original_Price (VND)"
          name="original_price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Sale_Price (VND)"
          name="sale_price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select mode="tags" style={{ width: "100%", height: 40 }} placeholder="Enter tags" />
        </Form.Item>

        <Form.Item
          label="Product Images"
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
                        <Select options={colorOption} placeholder="color"></Select>
                      </Form.Item>

                      <Form.Item
                        label="Variant Images"
                        name={[name, "image"]}
                        rules={[{ required: true, message: "Please upload variant images" }]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                      >
                        <Upload 
                          beforeUpload={() => false} 
                          listType="picture-card" 
                          maxCount={1} 
                          
                        >
                          <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
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
                            <Divider className=" mt-4 mb-2 " orientation="left">
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
          <div className="flex justify-end space-x-3 mb-6">
            <Button 
              type="primary"  
              htmlType="submit"
              loading={loading}  
              style={{height: 40}}
            >
              Save Product
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()} disabled={loading} style={{height: 40}}>
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
