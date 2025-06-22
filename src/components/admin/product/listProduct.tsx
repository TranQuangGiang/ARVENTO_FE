import { Link, useLocation } from "react-router-dom";
import { useList } from "../../../hooks/useList";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { useDelete } from "../../../hooks/useDelete";
import { useDebounce } from "use-debounce"; // npm install use-debounce
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from "react";
import { Button, Image, Input, Popconfirm, Select, Table } from "antd";
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { FiPlus } from "react-icons/fi";
const { Option } = Select;

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // debounce 500ms
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const location = useLocation();

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
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      align: "center"
    },
    {

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
    },
    {
      title: "Actions",
      key: "action",
      align: "right" as const,
      render: (_: any, record: any) => (
        <>
          <Link to={`/admin/detailProduct/${record.id}`}>
            <Button
              icon={<EyeOutlined />}
              className="mr-2"
              onClick={() => console.log("View:", record)}
              type="default" style={{ backgroundColor: "#00CD00", color: "#fff", borderColor: "#52c41a" }}
            />
          </Link>
          <Link to={`/admin/editProduct/${record._id}`}>
            <Button icon={<EditOutlined />} className="mr-2" type="primary" />
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => deleteProduct(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];
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
  );
};

export default ProductList;
