import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Checkbox,
  Switch,
  Col,
  Row,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useUpdateCoupon } from "../../../hooks/useUpdate";
import { useList } from "../../../hooks/useList";
import { useOneData } from "../../../hooks/useOne";

const EditCoupon = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams();
  const [discountType, setDiscountType] = useState("percentage");

  const { data: categoryData } = useList({ resource: "/categories/admin" });
  const { data: coupon } = useOneData({
    resource: "/coupons/admin/coupons",
    _id: id,
  });

  const { mutate } = useUpdateCoupon({
    resource: "/coupons/admin/coupons",
    _id: id,
  });

  const categoryOption = categoryData?.data.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  const { data: userData } = useList({ resource: "/users" });
  const userOption =
    userData?.data?.docs?.map((user) => ({
      label: user.email,
      value: user._id,
    })) || [];

  const { data: productData } = useList({ resource: "/products" });
  const productOption =
    productData?.data?.docs?.map((product) => ({
      label: product.name,
      value: product._id,
    })) || [];

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

    mutate(payload, {
      onSuccess: () => {
        nav("/admin/listcoupon");
      },
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen mt-20">
      <h3 className="text-2xl font-semibold mb-1">EDIT COUPON</h3>
      <p className="text-sm text-gray-500 mb-6">Update coupon details</p>
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
          <Input placeholder="Enter coupon code (e.g., SALE10)" />
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
                className="w-full"
                placeholder="Enter discount value"
                addonAfter={discountType === "percentage" ? "%" : "VND"}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Description" name="description">
          <Input.TextArea
            maxLength={500}
            rows={3}
            placeholder="Enter description (max 500 characters)"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Usage Limit" name="usageLimit">
              <InputNumber min={1} className="w-full" placeholder="Usage limit" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Per User Limit" name="perUserLimit">
              <InputNumber min={1} className="w-full" placeholder="Limit per user" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Start Date" name="startDate">
              <DatePicker className="w-full" placeholder="Select start date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Expiry Date" name="expiryDate">
              <DatePicker className="w-full" placeholder="Select expiry date" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Minimum Spend" name="minSpend">
              <InputNumber min={0} className="w-full" placeholder="Minimum spend" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Maximum Spend" name="maxSpend">
              <InputNumber min={0} className="w-full" placeholder="Maximum spend" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Applicable Products" name="products">
          <Select
            mode="multiple"
            options={productOption}
            placeholder="Select applicable products"
          />
        </Form.Item>

        <Form.Item label="Excluded Products" name="excludedProducts">
          <Select
            mode="multiple"
            options={productOption}
            placeholder="Select excluded products"
          />
        </Form.Item>

        <Form.Item label="Applicable Categories" name="categories">
          <Select
            mode="multiple"
            options={categoryOption}
            placeholder="Select applicable categories"
          />
        </Form.Item>

        <Form.Item label="Excluded Categories" name="excludedCategories">
          <Select
            mode="multiple"
            options={categoryOption}
            placeholder="Select excluded categories"
          />
        </Form.Item>

        <Form.Item label="User Restrictions" name="userRestrictions">
          <Select
            mode="multiple"
            options={userOption}
            placeholder="Select restricted users"
          />
        </Form.Item>

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

        <Form.Item>
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCoupon;
