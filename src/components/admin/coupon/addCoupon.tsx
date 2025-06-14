import React, { useState } from "react";
import { Form, Input, Button, Select, InputNumber, DatePicker, Checkbox, Switch, Col, Row } from "antd";
import { useList } from "../../../hooks/useList";
import { useCreate } from "../../../hooks/useCreate";

const { RangePicker } = DatePicker;

const AddCoupon = () => {
  const [form] = Form.useForm();
  const [discountType, setDiscountType] = useState('percentage');

  const { data: categoryData } = useList({
    resource: "/categories/admin"
  });

  const categoryOption = categoryData?.data.map((cat: any) => ({
    label: cat.name,
    value: cat._id,
  }));
  console.log("Danh mục:", categoryOption);

   const { data: userData } = useList({
    resource: "/users"
  });

  const userOption = userData?.data?.docs?.map((user: any) => ({
  label: user.email,
  value: user._id,
})) || [];
  console.log("User:", userOption);

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

  console.log("Dữ liệu gửi lên server:", payload);

  mutate(payload, {
    onSuccess: (data) => {
      console.log("Tạo mã giảm giá thành công:", data);
      form.resetFields(); 
    },
    onError: (error) => {
      console.error("Lỗi khi tạo mã giảm giá:", error);
    }
  });
};

  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen mt-20">
      <h3 className="text-2xl font-semibold mb-1">THÊM MÃ GIẢM GIÁ MỚI</h3>
      <p className="text-sm text-gray-500 mb-6">Tạo mã giảm giá mới cho khách hàng</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form
  form={form}
  layout="vertical"
  onFinish={onFinish}
  className="space-y-4"
>
  <Form.Item
    label="Mã giảm giá"
    name="code"
    rules={[{ required: true, message: "Vui lòng nhập mã giảm giá" }]}
  >
    <Input placeholder="Nhập mã giảm giá (VD: SALE10)" />
  </Form.Item>

  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        label="Loại giảm giá"
        name="discountType"
        rules={[{ required: true, message: "Vui lòng chọn loại giảm giá" }]}
      >
        <Select
          placeholder="Chọn loại giảm giá"
          onChange={(value) => setDiscountType(value)}
        >
          <Select.Option value="percentage">Phần trăm (%)</Select.Option>
          <Select.Option value="fixed_amount">Số tiền cố định</Select.Option>
        </Select>
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        label="Giá trị giảm"
        name="discountValue"
        rules={[{ required: true, message: "Vui lòng nhập giá trị giảm" }]}
      >
        <InputNumber
          min={0}
          placeholder="Nhập giá trị giảm"
          className="w-full"
          addonAfter={discountType === 'percentage' ? "%" : "VND"}
        />
      </Form.Item>
    </Col>
  </Row>

  <Form.Item label="Mô tả" name="description">
    <Input.TextArea placeholder="Nhập mô tả (tối đa 500 ký tự)" maxLength={500} rows={3} />
  </Form.Item>

  {/* Giới hạn lượt & mỗi người */}
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Giới hạn lượt sử dụng" name="usageLimit">
        <InputNumber min={1} placeholder="Giới hạn lượt" className="w-full" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label="Giới hạn mỗi người" name="perUserLimit">
        <InputNumber min={1} placeholder="Giới hạn mỗi người" className="w-full" />
      </Form.Item>
    </Col>
  </Row>

  {/* Ngày bắt đầu & hết hạn */}
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Ngày bắt đầu" name="startDate">
        <DatePicker className="w-full" />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label="Ngày hết hạn" name="expiryDate">
        <DatePicker className="w-full" />
      </Form.Item>
    </Col>
  </Row>

  {/* Chi tiêu tối thiểu & tối đa */}
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item label="Chi tiêu tối thiểu" name="minSpend">
        <InputNumber min={0} placeholder="Tối thiểu"/>
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item label="Chi tiêu tối đa" name="maxSpend">
        <InputNumber min={0} placeholder="Tối đa"/>
      </Form.Item>
    </Col>
  </Row>

  {/* Sản phẩm & Danh mục */}
  <Form.Item label="Sản phẩm áp dụng" name="products">
    <Select mode="multiple" options={[]} placeholder="Chọn sản phẩm" />
  </Form.Item>

  <Form.Item label="Sản phẩm không áp dụng" name="excludedProducts">
    <Select mode="multiple" options={[]} placeholder="Chọn sản phẩm" />
  </Form.Item>

  <Form.Item label="Danh mục áp dụng" name="categories">
    <Select mode="multiple" options={categoryOption} placeholder="Chọn danh mục" />
  </Form.Item>

  <Form.Item label="Danh mục không áp dụng" name="excludedCategories">
    <Select mode="multiple" options={categoryOption} placeholder="Chọn danh mục" />
  </Form.Item>

  <Form.Item label="Giới hạn người dùng" name="userRestrictions">
    <Select mode="multiple" options={userOption} placeholder="Chọn user" />
  </Form.Item>

  {/* Checkbox & Switch gọn gàng */}
  <Row gutter={16}>
    <Col span={6}>
      <Form.Item name="allowFreeShipping" valuePropName="checked">
        <Checkbox>Miễn phí vận chuyển</Checkbox>
      </Form.Item>
    </Col>
    <Col span={6}>
      <Form.Item name="excludeSaleItems" valuePropName="checked">
        <Checkbox>Loại trừ sản phẩm sale</Checkbox>
      </Form.Item>
    </Col>
    <Col span={6}>
      <Form.Item name="individualUse" valuePropName="checked">
        <Checkbox>Chỉ áp dụng riêng</Checkbox>
      </Form.Item>
    </Col>
    <Col span={6}>
      <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Col>
  </Row>

  {/* Buttons */}
  <Form.Item>
    <div className="flex justify-end space-x-3">
      <Button type="primary" htmlType="submit">
        Tạo mã giảm giá
      </Button>
      <Button htmlType="button" onClick={() => form.resetFields()}>
        Làm mới
      </Button>
    </div>
  </Form.Item>
</Form>
    </div>
  );
};

export default AddCoupon;
