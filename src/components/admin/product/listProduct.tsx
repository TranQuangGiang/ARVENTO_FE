import React, { useState } from "react";
import { Table, Input, Select, Button, Popconfirm, Image } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const products = [
  {
    _id: "664f1a83f1a4c8a42c123456",
    name: "White Men's Sneakers",
    image:
      "https://up.yimg.com/ib/th?id=OIP.YfJJ7n-O-U0BhP3Z_0JSiAHaHa&pid=Api&rs=1&c=1&qlt=95&w=121&h=121",
    price: 1299000,
    category_id: { name: "Men's Shoes" },
    tags: ["hot", "white", "men"],
  },
  {
    _id: "664f1a83f1a4c8a42c123457",
    name: "Women's High Heels",
    image:
      "https://up.yimg.com/ib/th?id=OIP.YfJJ7n-O-U0BhP3Z_0JSiAHaHa&pid=Api&rs=1&c=1&qlt=95&w=121&h=121",
    price: 1599000,
    category_id: { name: "Women's Shoes" },
    tags: ["sale", "high heels", "women"],
  },
];

// Extract unique categories for filter dropdown
const categories = Array.from(
  new Set(products.map((p) => p.category_id?.name).filter(Boolean))
);

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  // Filter products by search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category_id?.name === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img: string) => (
        <Image src={img} width={64} height={64} alt="Product Image" />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString()}₫`,
    },
    {
      title: "Category",
      dataIndex: ["category_id", "name"],
      key: "category",
      render: (name: string) => name || "Unknown",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => tags?.join(", ") || "None",
    },
    {
      title: "Actions",
      key: "action",
      align: "right" as const,
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EyeOutlined />}
            className="mr-2"
            onClick={() => console.log("View:", record)}
          />
          <Button
            icon={<EditOutlined />}
            className="mr-2"
            onClick={() => console.log("Edit:", record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => console.log("Delete:", record)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg border border-gray-200 mt-20 ">
        <div className="flex justify-between items-center mb-4 ">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            <Select
              value={itemsPerPage}
              onChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
              style={{ width: 80 }}
            >
              {[3, 5, 10].map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>

            <div className="pl-5">
              <Select
              placeholder="Filter by Category"
              allowClear
              value={categoryFilter}
              onChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
              style={{ width: 180 }}
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
            </div>
          </div>

          <div className="flex space-x-4 items-center">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="w-64"
            />
            <Button
              type="primary"
              icon={<FiPlus />}
              onClick={() => navigate("/admin/addbanner")}
            >
              Add New
            </Button>
          </div>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredProducts}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: filteredProducts.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
        />
      </div>
    </div>
  );
};

export default ProductList;
