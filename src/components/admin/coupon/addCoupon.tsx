import React, { useMemo, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Checkbox,
  Switch,
  Card,
} from "antd";
import { useList } from "../../../hooks/useList";
import { useCreate } from "../../../hooks/useCreate";
import { Link, useNavigate } from "react-router-dom";
import { OrderedListOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const AddCoupon = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  
  // State để quản lý các lựa chọn
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string[]>([]);
  const [excludedProduct, setExcludedProduct] = useState<string[]>([]);

  // Lấy dữ liệu danh mục từ API
  const { data: categoryData } = useList({ resource: "/categories/admin" });
  const categoryOption = useMemo(() => {
    if (!categoryData) return [];
    return categoryData.data.map((cat: any) => ({
      label: cat.name,
      value: cat._id,
    }));
  }, [categoryData]);

  // Lọc danh sách danh mục áp dụng dựa trên danh mục không áp dụng
  const categoriesToApplyOptions = useMemo(() => {
    return categoryOption.filter(
      (option:any) => !excludedCategories.includes(option.value)
    );
  }, [categoryOption, excludedCategories]);

  // Lọc danh sách danh mục không áp dụng dựa trên danh mục áp dụng
  const excludedCategoriesOptions = useMemo(() => {
    return categoryOption.filter(
      (option:any) => !selectedCategories.includes(option.value)
    );
  }, [categoryOption, selectedCategories]);

  // Lấy dữ liệu người dùng từ API
  const { data: userData } = useList({ resource: "/users" });
  const userOption = useMemo(() => {
    if (!userData || !userData.data || !userData.data.docs) return [];
    return userData.data.docs.map((user: any) => ({
      label: user.email,
      value: user._id,
    }));
  }, [userData]);

  // Lấy dữ liệu sản phẩm từ API
  const { data: productData } = useList({ resource: "/products" });
  const productOption = useMemo(() => {
    if (!productData || !productData.data || !productData.data.docs) return [];
    return productData.data.docs.map((product: any) => ({
      label: product.name,
      value: product._id
    }));
  }, [productData]);

  // Lọc danh sách sản phẩm áp dụng dựa trên sản phẩm không áp dụng
  const productToApplyOptions = useMemo(() => {
    return productOption.filter(
      (option:any) => !excludedProduct.includes(option.value)
    );
  }, [productOption, excludedProduct]);

  // Lọc danh sách sản phẩm không áp dụng dựa trên sản phẩm áp dụng
  const excludedProductsOptions = useMemo(() => {
    return productOption.filter(
      (option:any) => !selectedProduct.includes(option.value)
    );
  }, [productOption, selectedProduct]);

  const { mutate } = useCreate({
    resource: "/coupons/admin/coupons",
  });

  const onFinish = (values: any) => {
    const payload = {
      code: values.code,
      discountType: values.discountType,
      discountValue: values.discountValue,
      description: values.description,
      usageLimit: values.usageLimit,
      perUserLimit: values.perUserLimit,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
      minSpend: values.minSpend,
      maxSpend: values.maxSpend,
      products: values.products || [],
      excludedProducts: values.excludedProducts || [],
      categories: values.categories || [],
      excludedCategories: values.excludedCategories || [],
      userRestrictions: values.userRestrictions || [],
      allowFreeShipping: values.allowFreeShipping || false,
      excludeSaleItems: values.excludeSaleItems || false,
      individualUse: values.individualUse || false,
      isActive: values.isActive || false,
    };

    mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        setLoading(true);
        nav('/admin/listcoupon');
      },
      onError: (err) => console.error(err),
    });
  };

  return (
    <div className="min-h-screen ml-6 mr-6 mt-10 px-6 bg-gray-50">
      <Card className="max-w-6xl mx-auto shadow-xl rounded-xl">
        <div className="mb-8 flex items-center justify-between">
          <span>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Thêm phiếu giảm giá mới</h2>
            <p className="text-gray-500 text-sm">
              Điền vào biểu mẫu để tạo phiếu giảm giá cho khách hàng của bạn.
            </p>
          </span>
          <Link to="/admin/listcoupon">
            <Button type="primary" icon={<OrderedListOutlined />} style={{ height: 40 }}>
              Danh sách khuyến mãi
            </Button>
          </Link>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Form.Item
            label="Mã giảm giá"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã code" }]}
          >
            <Input style={{ height: 40, width: 1100 }} placeholder="e.g., SALE10" className="text-[15px]" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
            <Form.Item
              label="Giá trị chiết khấu"
              name="discountValue"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%", height: 40 }}
                min={0}
                size="large"
                className="h-[40px]"
                addonAfter={discountType === "percentage" ? "%" : "VND"}
              />
            </Form.Item>

            <Form.Item
              label="Loại giảm giá"
              name="discountType"
              rules={[{ required: true }]}
            >
              <Select
                onChange={(val) => setDiscountType(val)}
                options={[
                  { label: "Phần trăm (%)", value: "percentage" },
                  { label: "Số tiền cố định", value: "fixed_amount" },
                ]}
                className="text-[15px]"
                style={{ height: 40 }}
                placeholder="Chọn loại giảm giá"
              />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả" name="description" className="md:col-span-2">
            <Input.TextArea placeholder="Short description..." rows={3} />
          </Form.Item>

          <Form.Item label="Giới hạn số người sử dụng" name="usageLimit">
            <InputNumber
              style={{ width: "100%", height: 40 }}
              className="w-full" min={1} size="large"
            />
          </Form.Item>

          <Form.Item label="Lượt dùng giới hạn mỗi người dùng" name="perUserLimit">
            <InputNumber
              style={{ width: "100%", height: 40 }}
              className="w-full" min={1} size="large"
            />
          </Form.Item>

          <Form.Item label="Ngày bắt đầu" name="startDate">
            <DatePicker className="w-full" size="large" />
          </Form.Item>

          <Form.Item label="Ngày kết thúc" name="expiryDate">
            <DatePicker className="w-full" size="large" />
          </Form.Item>

          <Form.Item label="Giá trị đơn hàng tối thiểu" name="minSpend">
            <InputNumber
              style={{ width: "100%", height: 40 }}
              className="w-full text-[15px]" min={0}
            />
          </Form.Item>

          <Form.Item label="Giá trị đơn hàng tối đa" name="maxSpend">
            <InputNumber
              style={{ width: "100%", height: 40 }}
              className="w-full text-[15px]" min={0}
            />
          </Form.Item>

          <Form.Item
            label="Sản phẩm được áp dụng"
            name="products"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={productToApplyOptions}
              placeholder="Chọn sản phẩm áp dụng"
              size="large"
              onChange={(value: string[]) => {
                form.setFieldsValue({ products: value });
                setSelectedProduct(value);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Sản phẩm không áp dụng"
            name="excludedProducts"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={excludedProductsOptions}
              placeholder="Chọn sản phẩm không áp dụng"
              size="large"
              onChange={(value: string[]) => {
                form.setFieldsValue({ excludedProducts: value });
                setExcludedProduct(value);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Danh mục áp dụng"
            name="categories"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={categoriesToApplyOptions}
              placeholder="Chon danh mục áp dụng"
              size="large"
              onChange={(value: string[]) => {
                form.setFieldsValue({ categories: value });
                setSelectedCategories(value);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Danh mục không áp dụng"
            name="excludedCategories"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={excludedCategoriesOptions}
              placeholder="Chọn danh mục không áp dụng"
              size="large"
              onChange={(value: string[]) => {
                form.setFieldsValue({ excludedCategories: value });
                setExcludedCategories(value);
              }}
            />
          </Form.Item>

          <Form.Item
            label="Người dùng được áp dụng"
            name="userRestrictions"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={userOption}
              placeholder="Giới hạn phiếu giảm giá cho người dùng cụ thể"
              size="large"
            />
          </Form.Item>

          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Form.Item name="allowFreeShipping" valuePropName="checked">
              <Checkbox>Cho phép miễn phí vận chuyển</Checkbox>
            </Form.Item>
            <Form.Item name="excludeSaleItems" valuePropName="checked">
              <Checkbox>Loại trừ các mặt hàng giảm giá</Checkbox>
            </Form.Item>
            <Form.Item name="individualUse" valuePropName="checked">
              <Checkbox>Chỉ sử dụng cá nhân</Checkbox>
            </Form.Item>
            <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <Form.Item className="md:col-span-2 text-right">
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-xl mr-3"
              icon={<SaveOutlined />}
              loading={loading}
              style={{ height: 40 }}
            >
              Thêm mới
            </Button>
            <Button
              onClick={() => form.resetFields()}
              htmlType="button"
              className="rounded-xl"
              size="middle"
              danger
              style={{ height: 40 }}
              icon={<ReloadOutlined />}
            >
              Đặt lại
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCoupon;