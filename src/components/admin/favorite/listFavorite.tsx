import { useState, useEffect } from "react";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Input, Select, Table, message } from "antd";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useList } from "../../../hooks/useList";
import { useDelete } from "../../../hooks/useDelete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const getToken = () => localStorage.getItem("accessToken");

const ListFavorite = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [countMap, setCountMap] = useState<Record<string, number>>({});
  const [isCounting, setIsCounting] = useState(false);
  const [localFavorites, setLocalFavorites] = useState<any[]>([]);

  const {
    data: favorites,
    refetch: refetchFavorites,
  } = useList({ resource: "/favorites/admin/popular-products" });

  const deleteFavorite = useDelete({ resource: "/favorites" });

  useEffect(() => {
    if (Array.isArray(favorites?.data)) {
      setLocalFavorites(favorites.data);

      const fetchCounts = async () => {
        try {
          const token = getToken();
          if (!token) return;

          setIsCounting(true);

          const results = await Promise.all(
            favorites.data.map((fav: any) => {
              const productId = fav?.product_id?._id;
              if (!productId) return { id: "unknown", count: 0 };

              return axios
                .get(`/favorites/admin/products/${productId}/favorites-count`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => ({ id: productId, count: res.data.count }))
                .catch(() => ({ id: productId, count: 0 }));
            })
          );

          const map: Record<string, number> = {};
          results.forEach(({ id, count }) => {
            map[id] = count;
          });

          setCountMap(map);
          setIsCounting(false);
        } catch (err) {
          console.error("Lỗi khi lấy lượt yêu thích:", err);
          setIsCounting(false);
        }
      };

      fetchCounts();
    }
  }, [favorites]);

  const filteredFavorites = localFavorites.filter((fav: any) =>
    (fav?.product_id?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();

const handleViewDetail = (productId: string) => {
  // Điều hướng sang trang danh sách user yêu thích
  navigate(`/admin/favorites/${productId}/users`);
};


  const columns = [
  {
    title: "STT",
    dataIndex: "stt",
    render: (_: any, __: any, index: number) => (currentPage - 1) * itemsPerPage + index + 1,
  },
  {
    title: "Product Name",
    dataIndex: "product",
    render: (product: any) => product?.name || "Unknown",
  },
  {
    title: "Product ID",
    dataIndex: "product",
    render: (product: any) => product?._id || "N/A",
  },
  {
    title: "Images",
    dataIndex: "product",
    render: (product: any) =>
      product?.images?.[0]?.url ? (
        <img
          src={product.images[0].url}
          alt={product.name}
          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
        />
      ) : (
        "No Image"
      ),
  },
  {
    title: "Favorites",
    dataIndex: "count",
    render: (count: number) => count ?? 0,
  },
  {
  title: "Action",
  align: "right",
  render: (_: any, record: any) => (
    <Button
      icon={<EyeOutlined />}
      className="hover:!border-blue-500 hover:!text-blue-500"
      onClick={() => handleViewDetail(record.product._id)}
    >
      Xem chi tiết
    </Button>
  ),
}


];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="pl-6 pr-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow mt-10">
              <h2 className="text-[22px] flex items-center font-bold text-gray-800 mb-5">
                <Heart className="pr-2" style={{ width: 30 }} /> Danh sách yêu thích
              </h2>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500">Hiển thị</span>
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
                </div>
                <Input
                  placeholder="Tìm theo tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  className="w-64"
                />
              </div>
              <Table
                dataSource={filteredFavorites}
                columns={columns}
                rowKey={(record) => record._id}
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: filteredFavorites.length,
                  onChange: setCurrentPage,
                  showSizeChanger: false,
                }}
                bordered
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ListFavorite;
