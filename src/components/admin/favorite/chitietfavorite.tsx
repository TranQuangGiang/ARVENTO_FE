import { Table, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useList } from "../../../hooks/useList";

const FavoriteUsers = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useList({
    resource: `/favorites/admin/products/${id}/favorited-by`,
  });

  const userList = Array.isArray(data?.data) ? data.data : [];

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: ["user_id", "name"],
      render: (name: string) => name || "Unknown",
    },
    {
      title: "Email",
      dataIndex: ["user_id", "email"],
      render: (email: string) => email || "N/A",
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow mt-10 mx-6">
      <h2 className="text-[22px] font-bold text-gray-800 mb-5">Danh sách người dùng đã yêu thích sản phẩm</h2>
      <Button onClick={() => navigate(-1)} className="mb-4">Quay lại</Button>
      <Table
        dataSource={userList}
        columns={columns}
        rowKey={(record) => record._id}
        loading={isLoading}
        bordered
      />
    </div>
  );
};

export default FavoriteUsers;
