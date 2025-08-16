import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  InputNumber,
  Select,
  Tabs,
} from "antd";
import {
  UploadOutlined,
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useList } from "../../../hooks/useList";
import { useNavigate, useParams } from "react-router-dom";
import { useOneData } from "../../../hooks/useOne";
import { useUpdate } from "../../../hooks/useUpdate";
import { convertToFile } from "../../../hooks/useUrlToFile";


const EditProduct = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { data: product } = useOneData(
    { resource: "/products", _id: id }
  )
  useEffect(() => {
    if (!product || !product.data) return;
    const productData = product.data;
    
    const imageList = (productData.images || []).map((img: any, index: number) => ({
      uid: `${index}`,
      name: `image_${index}.jpeg`,
      status: "done",
      url: img.url,
    }));

    form.setFieldsValue({
      name: productData.name,
      slug: productData.slug,
      product_code: productData.product_code,
      description: productData.description,
      original_price: Number(productData.original_price?.$numberDecimal) ,
      sale_price: Number(productData.sale_price?.$numberDecimal) ,
      images: imageList,
      tags: productData.tags || [],
      category_id: productData.category_id || productData.category?._id || "",
    });

    setContent(productData.description);
      console.log("original_price:", productData.original_price);
      console.log("sale_price:", productData.sale_price);
    }, [product, form]);
  
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
  const { mutate } = useUpdate<FormData>({
    resource: "/products", _id: id
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
  
    (values.tags || []).forEach((tag: string) => {
      formData.append('tags[]', tag);
    });


    //images
    const imageFiles = await Promise.all(
      (values.images || []).map((file: any, idx: number) => convertToFile(file, idx))
    );
    imageFiles.forEach(file => {
      if (file) formData.append("images", file);
    })
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
    <div className="w-[95%] mx-auto mt-[30px] shadow-md bg-white rounded-xl mb-[40px]">
      <div className="w-full pt-[20px]">
        <h3 className="pl-[20px] text-2xl font-semibold mb-1">Cập nhập sản phẩm</h3>
        <p className="pl-[20px] text-sm text-gray-500 mb-6">Nhập thông tin cần sửa để cập nhập sản phẩm</p>
        <hr className="border-t border-gray-300 mb-6 -mt-3" />
      </div>
      <Form 
        layout="vertical" 
        form={form} 
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
        style={{margin: 20}} className='m-2 [&_Input]:h-[40px]'
      >
        <Tabs defaultActiveKey="1">
          {/* Tab 1 thông tin sản phẩm */}
          <Tabs.TabPane tab="Thông tin sản phẩm" key="1">
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6" 
              >
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[{ required: true, message: "Please enter the product name" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mã sản phẩm"
                  name="product_code"
                  rules={[{ required: true, message: "Please enter the product code" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Đường dẫn"
                  name="slug"
                  rules={[{ required: true, message: "Please enter the slug" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Danh mục"
                  name="category_id"
                  rules={[{ required: true, message: "Please select a category" }]}
                >
                  <Select style={{height: 40}} options={categoryOption}></Select>
                </Form.Item>

                <Form.Item
                  label="Giá gốc (VND)"
                  name="original_price"
                  className="font-semibold"
                  rules={[{ required: true, message: "Please enter the price" }]}
                >
                  <InputNumber<number>
                    min={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item label="Thẻ" name="tags">
                  <Select mode="tags" style={{ height: 40 }} placeholder="Enter tags" />
                </Form.Item>
              </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Mô tả & hình ảnh" key="2">
            <Form.Item label="Mô tả sản phẩm" name="description" rules={[{ required: true }]}>
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
              label="Ảnh sản phẩm"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Vui lòng upload ảnh sản phẩm" }]}
            >
              <Upload 
                beforeUpload={() => false} 
                listType="picture-card" 
                multiple>
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              </Upload>
            </Form.Item>
          </Tabs.TabPane>
        </Tabs>
        <Form.Item>
            <div className="flex justify-end space-x-3 mb-6 mt-10">
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{height: 40}}
                loading={loading}
              >
                Cập nhập
              </Button>
              <Button htmlType="button" onClick={() => form.resetFields()} style={{height: 40}}>
                Đặt lại
              </Button>
            </div>
          </Form.Item> 
      </Form>
    </div>
  );
};

export default EditProduct;
