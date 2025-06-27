import {
    Card,
    Descriptions,
    Avatar,
    Tag,
    Button,
    Select,
    message,
} from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useOneData } from "../../../hooks/useOne";
import { motion } from "framer-motion";
import { useUpdateRole } from "../../../hooks/useUpdate"; // hook PATCH role
import { useState } from "react";

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: userData, refetch } = useOneData({
        resource: `/users`,
        _id: id,
    });

    const { mutateAsync: updateRoleUser } = useUpdateRole({
        resource: `/users/${id}/role`,
    });
    const user = userData?.data;
    const [updating, setUpdating] = useState(false);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString() + " " + date.toLocaleDateString();
    };

    const handleChangeRole = async (newRole: string) => {
        try {
            setUpdating(true);
            await updateRoleUser({ role: newRole });
            refetch();
        } catch (error) {
            message.error("Cập nhật thất bại");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 mt-5"
        >
            <Card
                className="rounded-2xl shadow-lg"
                bordered={false}
                bodyStyle={{ padding: 30 }}
            >
                <div className="flex items-start justify-between flex-wrap gap-6">
                {/* Left */}
                    <div className="flex-1 min-w-[300px]">
                        <h2 className="text-2xl font-semibold mb-5">👤 User Detail</h2>
                        <Descriptions
                            column={1}
                            bordered
                            size="middle"
                            labelStyle={{ fontWeight: 600, width: 160 }}
                        >
                            <Descriptions.Item label="ID">{user?._id}</Descriptions.Item>
                            <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{user?.phone || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Role">
                                <Select
                                value={user?.role}
                                style={{ width: 150, height: 40 }}
                                onChange={handleChangeRole}
                                loading={updating}
                                >
                                <Select.Option value="user">
                                    <Tag color="blue">User</Tag>
                                </Select.Option>
                                <Select.Option value="admin">
                                    <Tag color="gold">Admin</Tag>
                                </Select.Option>
                                </Select>
                            </Descriptions.Item>
                            <Descriptions.Item label="Province">
                                {user?.address?.[0]?.province || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="District (Quận/Huyện)">
                                {user?.address?.[0]?.district || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ward (Phường/Xã)">
                                {user?.address?.[0]?.ward || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Detail Address">
                                {user?.address?.[0]?.detail || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Created At">
                                {user?.created_at ? formatDate(user.created_at) : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Updated At">
                                {user?.updated_at ? formatDate(user.updated_at) : "N/A"}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                    {/* Right */}
                    <div className="flex flex-col items-center justify-start gap-4">
                        <Avatar size={100} icon={<UserOutlined />} />
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            className="mt-2"
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default UserDetail;
