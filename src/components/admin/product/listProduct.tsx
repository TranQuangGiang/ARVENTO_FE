import { Link, useLocation } from "react-router-dom";
import { useList } from "../../../hooks/useList";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { useDelete } from "../../../hooks/useDelete";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from "react";
import { Button, Image, Input, Popconfirm, Select, Table, message } from "antd";
import { AppstoreAddOutlined, BgColorsOutlined, DeleteOutlined, EditOutlined, EyeOutlined, SyncOutlined } from "@ant-design/icons";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
const { Option } = Select;

const ProductList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
    const location = useLocation();
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [isLoadingAll, setIsLoadingAll] = useState(true);

    const { data: cateData } = useList({
      resource: "/categories/admin",
    });
    const categories = cateData?.data || [];

    const fetchAllProducts = async () => {
      setIsLoadingAll(true);
      let fetchedProducts: any[] = [];
      let page = 1;
      const limit = 20;

      try {
        const token = localStorage.getItem("token");
        while (true) {
          console.log(`Đang gọi API trang: ${page}`);
          const res = await axios.get(`http://localhost:3000/api/products?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });

          const { docs } = res.data?.data || {};

          if (!docs || !Array.isArray(docs)) {
            console.warn("Dữ liệu trả về từ API không hợp lệ hoặc đã hết.");
            break;
          }

          fetchedProducts = [...fetchedProducts, ...docs];
          console.log(`Đã lấy được ${docs.length} sản phẩm từ trang ${page}. Tổng cộng: ${fetchedProducts.length}`);

          // Điều kiện dừng vòng lặp: nếu số sản phẩm của trang hiện tại ít hơn limit, tức là đã đến cuối danh sách.
          if (docs.length < limit) {
            console.log("Đã lấy đủ tất cả sản phẩm.");
            break;
          }

          page++;
        }
        setAllProducts(fetchedProducts);
        
      } catch (error) {
        console.error("Không thể lấy được tất cả các sản phẩm:", error);
        message.error("Lỗi khi tải dữ liệu sản phẩm.");
      } finally {
          setIsLoadingAll(false);
      }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (location.state?.shouldRefetch) {
            fetchAllProducts();
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const filteredProducts = useMemo(() => {
      const sortedProducts = [...allProducts].sort((a, b) => 
        dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()
      );
      return sortedProducts.filter((product: any) => {
        const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category_id === categoryFilter : true;
        return matchesSearch && matchesCategory;
      });
    }, [allProducts, debouncedSearchTerm, categoryFilter]);

    const { mutate: deleteProductMutate } = useDelete({
      resource: `/products`,
      onSuccess: () => {
        message.success("Xóa sản phẩm thành công!");
        fetchAllProducts();
      },
    });

    const deleteProduct = (_id: any) => {
      deleteProductMutate(_id);
    };

    const categoryOption = categories.map((cat: any) => ({
      label: cat.name,
      value: cat._id,
    }));

    const columns: ColumnsType<any> = [
        {
          title: "#",
          key: "index",
          render: (_: any, __: any, index: number) => (currentPage - 1) * itemsPerPage + index + 1,
          align: "center",
        },
        {
          title: "Ảnh",
          dataIndex: "images",
          key: "images",
          render: (_: any, record: any) => (
              <Image src={record.images?.[0]?.url} width={80} height={80} alt="Product Image" />
          ),
        },
        {
          title: "Tên sản phẩm",
          dataIndex: "name",
          key: "name",
          width: 250,
        },
        {
          title: "Đường dẫn",
          dataIndex: "slug",
          key: "slug",
          align: "center",
          width: 250,
        },
        {
          title: "Mã sản phẩm",
          dataIndex: "product_code",
          key: "product_code",
          align: "center",
        },
        {
          title: "Ngày tạo",
          dataIndex: "created_at",
          key: "created_at",
          render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
          align: "center",
        },
        {
          title: "Hành Động",
          key: "action",
          align: "right" as const,
          render: (_: any, record: any) => (
              <>
                  <Link to={`/admin/detailProductAdmin/${record._id}`}>
                      <Button
                          icon={<EyeOutlined />}
                          className="mr-1"
                          type="default"
                          style={{ backgroundColor: "#00CD00", color: "#fff", borderColor: "#52c41a" }}
                      />
                  </Link>
                  <Link to={`/admin/editProduct/${record._id}`}>
                      <Button icon={<EditOutlined />} className="mr-1" type="primary" />
                  </Link>
                  <Link to={`/admin/listVariants/${record._id}`}>
                      <Button className="mr-1" style={{ background: "#CC66FF", color: "#fff" }} icon={<BgColorsOutlined />} />
                  </Link>
                  <Popconfirm
                      title="Bạn có chắc chắn muốn xóa sản phẩm này ?"
                      okText="Xóa"
                      cancelText="Hủy"
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
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
                                    <span>Hiện</span>
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
                                            placeholder="Lọc theo danh mục"
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
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        allowClear
                                        className="w-64"
                                    />
                                    <div className="relative group">
                                        <Button className="px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 transition">
                                            Hành động
                                        </Button>
                                        <ul className="w-44 z-50 top-[45px] absolute transition-all duration-300 opacity-0 invisible shadow-lg group-hover:opacity-100 group-hover:visible group-hover:-translate-y-2.5">
                                            <li>
                                                <Link
                                                    to="/admin/listcolor"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                                >
                                                    Danh sách thuộc tính
                                                </Link>
                                            </li>
                                            <li>
                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                                    Nhập file
                                                </button>
                                            </li>
                                            <li>
                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                                    Xuất file
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <Link to={`/admin/addProduct`}>
                                        <Button type="primary" icon={<FiPlus />}>
                                            Thêm mới
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
                                    onChange: (page, pageSize) => {
                                        setCurrentPage(page);
                                        setItemsPerPage(pageSize);
                                    },
                                    showSizeChanger: true,
                                }}
                                loading={isLoadingAll}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductList;