import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, message, Input, Select, Table, Image } from "antd";
import { useDeleteBanner, useBannersAdmin, useUpdateBannerStatus } from "../../../hooks/listbanner";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import type { ColumnsType } from "antd/es/table";
import { Images } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const { Option } = Select;

const ListBanner = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { data: banners, refetch: refetchBanner, isLoading, isError, } = useBannersAdmin();
  const updateStatus = useUpdateBannerStatus();
  const deleteBanner = useDeleteBanner();
  const [hasShownSuccess, setHasShownSuccess] = useState(false);

  useEffect(() => {
    const successMessage = location.state?.successMessage;
    if (successMessage && !hasShownSuccess) {
      message.success(successMessage);
      setHasShownSuccess(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, hasShownSuccess]);

  // Refetch khi có cờ shouldRefetch
  useEffect(() => {
    if (location.state?.shouldRefetch) {
      refetchBanner();
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, refetchBanner]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading banners</div>;

  const filteredSlides = banners?.filter((slide: any) =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const columns: ColumnsType<any> = [
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      align: 'center',
      render: (text: boolean, record: any) => (
        <Switch
          checked={record.is_active}
          onChange={(checked) => handleToggleStatus(record._id, checked)}
        />
      ),
    },
    {
      title: 'ID',
      dataIndex: '_id',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Chủ đề',
      dataIndex: 'title',
    },
    {
      title: 'Liên kết',
      dataIndex: 'link',
    },
    {
      title: 'Ảnh',
      dataIndex: 'image_url',
      render: (url: string, record: any) => (
        <Image
          src={url}
          alt={record.title}
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: '50%', border: '2px solid #91d5ff' }}
        />
      ),
    },
    {
      title: 'Hành động',
      dataIndex: '_id',
      align: 'right',
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/editbanner/${record._id}`)}
            style={{ marginRight: 8 }}
            type="primary"
          />
           
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa ?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
            />
             
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleToggleStatus = (id: string, checked: boolean) => {
    updateStatus.mutate(
      { id, isActive: checked },
      {
        onSuccess: () => message.success('Cập nhật trạng thái thành công'),
        onError: () => message.error('Cập nhập trạng thái thất bại')
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteBanner.mutate(id, {
      onSuccess: () => message.success('Xóa thành công'),
      onError: () => message.error('Xóa thất bại')
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50}}
          animate={{ opacity: 1, y: 0}}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="pl-6 pr-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow mt-10">
              <h2 className="text-[22px] flex items-center font-bold text-gray-800 mb-5">
                <Images className="pr-2" style={{width: 35}} /> Danh sách banner
              </h2>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500">Hiện</span>
                  <Select
                    value={itemsPerPage}
                    onChange={(value) => {
                      setItemsPerPage(value);
                      setCurrentPage(1);
                    }}
                    style={{ width: 80 }}
                  >
                    {[3, 5, 10].map(num => (
                      <Option key={num} value={num}>{num}</Option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tìm kiếm..."
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
                    Thêm mới
                  </Button>
                </div>
              </div>
              <Table
                dataSource={filteredSlides}
                columns={columns}
                rowKey="_id"
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: filteredSlides.length,
                  onChange: setCurrentPage,
                  showSizeChanger: false
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

export default ListBanner;
