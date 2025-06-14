import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, InputNumber, DatePicker, Checkbox, Switch, Col, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useUpdate, useUpdateCoupon } from "../../../hooks/useUpdate";
import { useList } from "../../../hooks/useList";
import { useOneData } from "../../../hooks/useOne";

const EditCoupon = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams();
  const [discountType, setDiscountType] = useState('percentage');

  const { data: categoryData } = useList({ resource: "/categories/admin" });
  const { data: coupon } = useOneData({
    resource: "/coupons/admin/coupons",
    _id: id
  });

  const { mutate } = useUpdateCoupon({
    resource: "/coupons/admin/coupons",
    _id: id
  });

  const categoryOption = categoryData?.data.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

   const { data: userData } = useList({
      resource: "/users"
    });
  
    const userOption = userData?.data?.docs?.map((user: any) => ({
    label: user.email,
    value: user._id,
  })) || [];
    console.log("User:", userOption);

  // Dữ liệu cứng cho sản phẩm và user (không call API)
  const productOptions = [
    { label: "Sản phẩm 1", value: "prod1" },
    { label: "Sản phẩm 2", value: "prod2" },
    { label: "Sản phẩm 3", value: "prod3" },
  ];

 
  useEffect(() => {
    if (!coupon || !coupon.data) return;

    const c = coupon.data;

    form.setFieldsValue({
      ...c,
      startDate: c.startDate ? dayjs(c.startDate) : null,
      expiryDate: c.expiryDate ? dayjs(c.expiryDate) : null,
    });

    setDiscountType(c.discountType);
  }, [coupon, form]);

  const onFinish = (values) => {
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
console.log('dl',payload);

    mutate(payload, {
      onSuccess: () => {
        nav('/admin/listcoupon');
      }
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen mt-20">
      <h3 className="text-2xl font-semibold mb-1">CHỈNH SỬA MÃ GIẢM GIÁ</h3>
      <p className="text-sm text-gray-500 mb-6">Cập nhật thông tin mã giảm giá</p>
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
          <Input placeholder="Nhập mã giảm giá" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Loại giảm giá"
              name="discountType"
              rules={[{ required: true, message: "Vui lòng chọn loại giảm giá" }]}
            >
              <Select onChange={(value) => setDiscountType(value)}>
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
                className="w-full"
                addonAfter={discountType === 'percentage' ? "%" : "VND"}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea maxLength={500} rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Giới hạn lượt" name="usageLimit">
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Giới hạn mỗi người" name="perUserLimit">
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </Col>
        </Row>

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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Chi tiêu tối thiểu" name="minSpend">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chi tiêu tối đa" name="maxSpend">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Sản phẩm áp dụng" name="products">
          <Select mode="multiple" options={productOptions} />
        </Form.Item>

        <Form.Item label="Sản phẩm không áp dụng" name="excludedProducts">
          <Select mode="multiple" options={productOptions} />
        </Form.Item>

        <Form.Item label="Danh mục áp dụng" name="categories">
          <Select mode="multiple" options={categoryOption} />
        </Form.Item>

        <Form.Item label="Danh mục không áp dụng" name="excludedCategories">
          <Select mode="multiple" options={categoryOption} />
        </Form.Item>

        <Form.Item label="Giới hạn người dùng" name="userRestrictions">
           <Select mode="multiple" options={userOption} placeholder="Chọn user" />
        </Form.Item>

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

        <Form.Item>
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">Cập nhật</Button>
            <Button onClick={() => form.resetFields()}>Làm mới</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCoupon;
