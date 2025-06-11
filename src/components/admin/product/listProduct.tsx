import { useState } from "react";
import { Table, Input, Select, Button, Popconfirm, Image } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useList } from "../../../hooks/useList";
import dayjs from 'dayjs';
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

const ProductList = ({ rawData }:any) => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const { data } = useList({
    resource: "/products",
  });
  const products = Array.isArray(data) ? data : data?.data || [];
  
  // const products = Array.isArray(data) ? data : data?.data || [];
  // const categories = Array.from(
  //   new Set(products.map((p:any) => p.category_id?.name).filter(Boolean))
  // );

  // const filteredProducts = products.filter((product:any) => {
  //   const matchesSearch = product.name
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const matchesCategory = categoryFilter
  //     ? product.category_id?.name === categoryFilter
  //     : true;
  //   return matchesSearch && matchesCategory;
  // });

  const columns: ColumnsType<any> = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * itemsPerPage + index + 1,
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: ( srcImage: string ) => (
        <Image 
          src={srcImage[0]}
          width={104} height={104} alt="Product Image" 
        />
      ),
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      align: "center",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
      align: "center",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EyeOutlined />}
            className="mr-2"
            type="default" 
            style={{ backgroundColor: "#00CD00", color: "#fff", borderColor: "#52c41a" }}
            onClick={() => console.log("View:", record)}
          />
          <Button
            icon={<EditOutlined />}
            className="mr-2"
            type="primary"
            onClick={() => console.log("Edit:", record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => console.log("Delete:", record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];
  
  return (
    
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg border border-gray-200 mt-20 ">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span>Show</span>
            {/* <Select
              value={itemsPerPage}
              onChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
              style={{ width: 80 }}
            > */}
              {/* {[3, 5, 10].map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select> */}

            <div className="pl-5">
              <Select
                placeholder="Filter by Category"
                allowClear
                // value={categoryFilter}
                // onChange={(value) => {
                //   setCategoryFilter(value);
                //   setCurrentPage(1);
                // }}
                style={{ width: 180 }}
              >
                {/* {categories.map((cat:any) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))} */}
              </Select>
            </div>
          </div>

          <div className="flex space-x-4 items-center">
            <Input
              placeholder="Search products..."
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="w-64"
            />
            <Link to={`/admin/addProduct`}>
              <Button
                type="primary"
                icon={<FiPlus />}
                // onClick={() => navigate("/admin/addbanner")}
              >
                Add New
              </Button>
            </Link>
          </div>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={products?.data}
          // pagination={{
          //   current: currentPage,
          //   pageSize: itemsPerPage,
          //   total: filteredProducts.length,
          //   onChange: (page) => setCurrentPage(page),
          //   showSizeChanger: false,
          // }}
        />
      </div>
    </div>
  );
};

export default ProductList;
