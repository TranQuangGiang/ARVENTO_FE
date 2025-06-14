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
  console.log("Categories:", categoryOption);

  const { data: userData } = useList({
    resource: "/users"
  });

  const userOption = userData?.data?.docs?.map((user: any) => ({
    label: user.email,
    value: user._id,
  })) || [];
  console.log("Users:", userOption);

  const { data: productData } = useList({
    resource: "/products"
  });

  const productOption = productData?.data?.docs?.map((product: any) => ({
    label: product.name,
    value: product._id,
  })) || [];
  console.log("Products:", productOption);

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

    console.log("Submitted payload:", payload);

    mutate(payload, {
      onSuccess: (data) => {
        console.log("Coupon created successfully:", data);
        form.resetFields();
      },
      onError: (error) => {
        console.error("Error creating coupon:", error);
      }
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen mt-20">
      <h3 className="text-2xl font-semibold mb-1">ADD NEW COUPON</h3>
      <p className="text-sm text-gray-500 mb-6">Create a new discount coupon for customers</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label="Coupon Code"
          name="code"
          rules={[{ required: true, message: "Please enter the coupon code" }]}
        >
          <Input placeholder="Enter coupon code (e.g. SALE10)" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Discount Type"
              name="discountType"
              rules={[{ required: true, message: "Please select discount type" }]}
            >
              <Select
                placeholder="Select discount type"
                onChange={(value) => setDiscountType(value)}
              >
                <Select.Option value="percentage">Percentage (%)</Select.Option>
                <Select.Option value="fixed_amount">Fixed Amount</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Discount Value"
              name="discountValue"
              rules={[{ required: true, message: "Please enter discount value" }]}
            >
              <InputNumber
                min={0}
                placeholder="Enter discount value"
                className="w-full"
                addonAfter={discountType === 'percentage' ? "%" : "VND"}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter description (max 500 characters)" maxLength={500} rows={3} />
        </Form.Item>

        {/* Usage limits */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Usage Limit" name="usageLimit">
              <InputNumber min={1} placeholder="Usage limit" className="w-full" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Limit per User" name="perUserLimit">
              <InputNumber min={1} placeholder="Limit per user" className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        {/* Start & Expiry date */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Start Date" name="startDate">
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Expiry Date" name="expiryDate">
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        {/* Spend limits */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Minimum Spend" name="minSpend">
              <InputNumber min={0} placeholder="Minimum spend" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Maximum Spend" name="maxSpend">
              <InputNumber min={0} placeholder="Maximum spend" />
            </Form.Item>
          </Col>
        </Row>

        {/* Products & Categories */}
        <Form.Item label="Applicable Products" name="products">
          <Select mode="multiple" options={productOption} placeholder="Select products" />
        </Form.Item>

        <Form.Item label="Excluded Products" name="excludedProducts">
          <Select mode="multiple" options={productOption} placeholder="Select excluded products" />
        </Form.Item>

        <Form.Item label="Applicable Categories" name="categories">
          <Select mode="multiple" options={categoryOption} placeholder="Select categories" />
        </Form.Item>

        <Form.Item label="Excluded Categories" name="excludedCategories">
          <Select mode="multiple" options={categoryOption} placeholder="Select excluded categories" />
        </Form.Item>

        <Form.Item label="User Restrictions" name="userRestrictions">
          <Select mode="multiple" options={userOption} placeholder="Select users" />
        </Form.Item>

        {/* Switches */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="allowFreeShipping" valuePropName="checked">
              <Checkbox>Allow Free Shipping</Checkbox>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="excludeSaleItems" valuePropName="checked">
              <Checkbox>Exclude Sale Items</Checkbox>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="individualUse" valuePropName="checked">
              <Checkbox>Individual Use Only</Checkbox>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        {/* Buttons */}
        <Form.Item>
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">
              Create Coupon
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

export default AddCoupon;
