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
  Card,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useUpdateCoupon } from "../../../hooks/useUpdate";
import { useList } from "../../../hooks/useList";
import { useOneData } from "../../../hooks/useOne";
import { Link } from "react-router-dom";
import { OrderedListOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";

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

  const categoryOption = categoryData?.data.map((cat:any) => ({
    label: cat.name,
    value: cat._id,
  }));

  const { data: userData } = useList({ resource: "/users" });
  const userOption =
    userData?.data?.docs?.map((user:any) => ({
      label: user.email,
      value: user._id,
    })) || [];

  const { data: productData } = useList({ resource: "/products" });
  const productOption =
    productData?.data?.docs?.map((product:any) => ({
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

  const onFinish = (values:any) => {
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
    <div className="min-h-screen ml-6 mr-6 mt-10 px-6 bg-gray-50 mb-10">
      <Card className="max-w-6xl mx-auto shadow-xl rounded-xl">
        <div className="mb-8 flex items-center justify-between">
          <span>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Add New Coupon</h2>
            <p className="text-gray-500 text-sm">
              Fill out the form to create a discount coupon for your customers.
            </p>
           
          </span>
          <Link to="/admin/listcoupon">
            <Button type="primary"  icon={<OrderedListOutlined />} style={{ height: 40 }}>
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
            label="Coupon Code"
            name="code"
            rules={[{ required: true, message: "Enter coupon code" }]}
          >
            <Input style={{height: 40, width: 1100}} placeholder="e.g., SALE10" className="text-[15px]" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
            <Form.Item
              label="Discount Value"
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
              label="Discount Type"
              name="discountType"
              rules={[{ required: true }]}
            >
              <Select
                onChange={(val) => setDiscountType(val)}
                options={[
                  { label: "Percentage (%)", value: "percentage" },
                  { label: "Fixed Amount", value: "fixed_amount" },
                ]}
                className="text-[15px]"
                style={{ height: 40 }}
                placeholder="Select type"
              />
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description" className="md:col-span-2">
            <Input.TextArea placeholder="Short description..." rows={3} />
          </Form.Item>

          <Form.Item label="Usage Limit" name="usageLimit">
            <InputNumber 
              style={{
                width: "100%",
                height: 40
              }} className="w-full" min={1} size="large" />
          </Form.Item>

          <Form.Item label="Limit per User" name="perUserLimit">
            <InputNumber 
              style={{
                width: "100%",
                height: 40
              }} className="w-full" min={1} size="large" />
          </Form.Item>

          <Form.Item label="Start Date" name="startDate">
            <DatePicker className="w-full" size="large" />
          </Form.Item>

          <Form.Item label="Expiry Date" name="expiryDate">
            <DatePicker className="w-full" size="large" />
          </Form.Item>

          <Form.Item label="Minimum Spend" name="minSpend">
            <InputNumber 
              style={{
                width: "100%",
                height: 40
              }} className="w-full text-[15px]" min={0}  
            />
          </Form.Item>

          <Form.Item label="Maximum Spend" name="maxSpend">
            <InputNumber 
              style={{
                width: "100%",
                height: 40
              }}
              className="w-full text-[15px]" min={0} 
            />
          </Form.Item>

          <Form.Item
            label="Applicable Products"
            name="products"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={productOption}
              placeholder="Select applicable products"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Excluded Products"
            name="excludedProducts"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={productOption}
              placeholder="Select excluded products"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Applicable Categories"
            name="categories"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={categoryOption}
              placeholder="Select categories"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Excluded Categories"
            name="excludedCategories"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={categoryOption}
              placeholder="Select excluded categories"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="User Restrictions"
            name="userRestrictions"
            className="md:col-span-2"
          >
            <Select
              mode="multiple"
              options={userOption}
              placeholder="Limit coupon to specific users"
              size="large"
            />
          </Form.Item>

          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Form.Item name="allowFreeShipping" valuePropName="checked">
              <Checkbox>Allow Free Shipping</Checkbox>
            </Form.Item>
            <Form.Item name="excludeSaleItems" valuePropName="checked">
              <Checkbox>Exclude Sale Items</Checkbox>
            </Form.Item>
            <Form.Item name="individualUse" valuePropName="checked">
              <Checkbox>Individual Use Only</Checkbox>
            </Form.Item>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <Form.Item className="md:col-span-2 text-right">
            <Button 
              type="primary" 
              htmlType="submit" 
              className="rounded-xl mr-3"
              icon={<SaveOutlined />}
              // loading={loading}
              style={{height: 40}}
            >
              Update Coupon
            </Button>
            <Button 
              onClick={() => form.resetFields()} 
              htmlType="submit"
              className="rounded-xl"
              size="middle"
              danger
              style={{height: 40}}
              icon={<ReloadOutlined />}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditCoupon;
