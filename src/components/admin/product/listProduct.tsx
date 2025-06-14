<<<<<<< Updated upstream
import React, { useState } from "react";
=======
import { useEffect, useState, useMemo } from "react";
>>>>>>> Stashed changes
import { Table, Input, Select, Button, Popconfirm, Image } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import { FiPlus } from "react-icons/fi";
<<<<<<< Updated upstream
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
=======
import { Link, useLocation } from "react-router-dom";
import { useList } from "../../../hooks/useList";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { useDelete } from "../../../hooks/useDelete";
import { useDebounce } from "use-debounce"; // npm install use-debounce
import { motion, AnimatePresence } from 'framer-motion';
const { Option } = Select;

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // debounce 500ms
>>>>>>> Stashed changes
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const location = useLocation();

<<<<<<< Updated upstream
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
=======
  const { data: productData, refetch: refetchProducts, isFetching: isFetchingProducts } = useList({
    resource: "/products",
  });
  const products = Array.isArray(productData?.data?.docs) ? productData.data.docs : [];

  const { data: cateData } = useList({
    resource: "/categories/admin",
  });
  const categories = cateData?.data || [];

  useEffect(() => {
     if (location.state?.shouldRefetch) {
      refetchProducts();
      window.history.replaceState({}, document.title); 
    }
  }, [location.state]);

  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? product.category_id === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearchTerm, categoryFilter]);
  console.log(filteredProducts);
  

  // Xử lý delete product
  const { mutate: deleteProductMutate } = useDelete({
    resource: `/products`,
    onSuccess: () => {
      refetchProducts();
    },
  });
  const deleteProduct = (_id: any) => {
    deleteProductMutate(_id);
  };

  const categoryOption = categories.map((cat: any) => ({
    label: cat.name,
    value: cat._id,
  }));

  // Cấu hình bảng columns
  const columns: ColumnsType<any> = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => (currentPage - 1) * itemsPerPage + index + 1,
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (srcImage: string[]) => (
        <Image src={srcImage?.[0]} width={104} height={104} alt="Product Image" />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
      title: "Product code",
      dataIndex: "product_code",
      key: "product_code",
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
      align: "center",
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            onClick={() => console.log("View:", record)}
          />
          <Button
            icon={<EditOutlined />}
            className="mr-2"
            onClick={() => console.log("Edit:", record)}
          />
=======
            type="default"
            style={{ backgroundColor: "#00CD00", color: "#fff", borderColor: "#52c41a" }}
            onClick={() => console.log("View:", record)}
          />
          <Link to={`/admin/editProduct/${record._id}`}>
            <Button icon={<EditOutlined />} className="mr-2" type="primary" />
          </Link>
>>>>>>> Stashed changes
          <Popconfirm
            title="Are you sure you want to delete this product?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => deleteProduct(record._id)}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];
<<<<<<< Updated upstream

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
=======

  return (
    <AnimatePresence>
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3}}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="pl-6 pr-6 mt-0 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 mt-10">
              <h2 className="text-[22px] font-bold text-gray-800 mb-5">
                <AppstoreAddOutlined className="pr-2" /> Danh sách sản phẩm
              </h2>
              <div className="flex justify-between items-center mb-4">
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
                      options={categoryOption}
                    />
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
                  <Link to={`/admin/addProduct`}>
                    <Button type="primary" icon={<FiPlus />}>
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>

              <Table
                rowKey="_id"
                columns={columns}
                dataSource={filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: filteredProducts.length,
                  onChange: (page) => setCurrentPage(page),
                  showSizeChanger: false,
                }}
                loading={isFetchingProducts}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
>>>>>>> Stashed changes
  );
};

export default ProductList;
