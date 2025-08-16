import React, { useEffect, useState } from 'react';
import {
  Card, Descriptions, Tag, Button, Modal, message,
  Space, Upload, Typography, Divider, Row, Col,
  type UploadFile
} from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useOneData } from '../../../hooks/useOne';
import moment from 'moment';
import axios from 'axios';
import axiosInstance from '../../../utils/axiosInstance';

const { Title, Text } = Typography;

const statusLabels: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipping: "Đang giao hàng",
    delivered: "Đã giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    returning: "Đang trả hàng",
    returned: "Đã trả hàng",
}
const statusColors: Record<string, string> = {
  pending: "#faad14",
  confirmed: "#1677ff",
  processing: "#13c2c2",
  shipping: "#722ed1",
  delivered: "#2f54eb",
  completed: "#52c41a",
  cancelled: "#ff4d4f",
  returning: "#ffc53d",
  returned: "#d46b08",
};
const RefundRequestDetail = ({
  isOpen,
  onClose,
  selectedOrder,
  onApproved
}: any) => {
  const [loading, setLoading] = useState(false);
  const orderId = selectedOrder?._id;
  console.log((orderId));
  const { data: orderOne, refetch, isLoading } = useOneData({
    resource: `/orders`,
    _id: orderId,
    enabled: orderId,
    
  });

  useEffect(() => {
    if (isOpen && orderId) {
      refetch();
    }
  }, [isOpen, refetch, orderId]);
 
  const deliveredTimelines  = orderOne?.data?.timeline?.filter(
    (item: any) => item.status === "delivered" && item.note
  ) || [];
  console.log((deliveredTimelines));
  
  const secondDeliveredTimeline  = deliveredTimelines[1];
  const returnReason  = secondDeliveredTimeline?.note || "Không có lý do cụ thể"
  const returnRequestDate = secondDeliveredTimeline?.changedAt ? moment(secondDeliveredTimeline.changedAt).format("HH:mm:ss - DD/MM/YYYY")
  : "N/A";



  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[]}) => {
    setFileList(newFileList);
  };

  const handleRefund = () => {
    Modal.confirm({
      title: 'Xác nhận hoàn tiền',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />, // Màu vàng cho icon cảnh báo
      content: (
        <Text>
          Bạn có chắc chắn muốn hoàn **{orderOne?.data?.total.toLocaleString()} VNĐ** cho đơn hàng{' '}
          **{orderOne?.data._id}**?
          <br />
          <Text type="secondary" style={{ fontSize: '0.85em', marginTop: 8, display: 'block' }}>
            Hành động này không thể hoàn tác và sẽ cập nhật trạng thái đơn hàng.
          </Text>
        </Text>
      ),
      okText: 'Xác nhận đã nhận hàng và Hoàn tiền',
      cancelText: 'Hủy',
      okButtonProps: { danger: true, loading: loading },
      onOk: async () => {
        setLoading(true);
        try {
          const formData = new FormData();
          fileList.forEach(file => {
            if (file.originFileObj) {
              formData.append('images', file.originFileObj );
            }
          });
          

          const token = localStorage.getItem("token");

          const res = await axios.post(`http://localhost:3000/api/orders/${orderId}/confirm-return`, formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              }
            }
          )
          console.log("res: ", res.data);
          setLoading(false);
          message.success('Xác nhận đã nhận hoàn hàng và hoàn tiền thành công');

          if (onApproved) {
            await onApproved()
          }
          
          onClose();
        } catch (err:any) {
          setLoading(false);
          message.error('Hoàn tiền thất bại. Vui lòng thử lại.');
          console.error('Lỗi hoàn tiền:', err.response?.data || err.message);
        }
      },
    });
  };
  return (
    <Modal 
      open={isOpen}
      onCancel={onClose}
      width={900}
      footer={null}
      centered
    >
      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        title={
          <Row justify="space-between" align="middle" style={{ padding: '8px 0' }}>
            <Col>
              <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                Xác nhận đã nhận hoàn hàng và hoàn tiền cho đơn - <Text strong style={{ fontSize: 17, color: "blue"}}>{orderOne?.data?._id}</Text>
              </Title>
            </Col>
          </Row>
        }
        headStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row gutter={[24, 24]}> {/* Thêm gutter theo cả chiều ngang và dọc */}
          <Col xs={24} lg={12}>
            <Card
              type="inner"
              title={<Text strong>Thông tin Đơn hàng & Khách hàng</Text>}
              style={{ borderRadius: 8, height: '100%' }} // Đảm bảo chiều cao bằng nhau
              bodyStyle={{ padding: 16 }}
            >
              <Descriptions column={1} labelStyle={{ fontWeight: 'normal', color: '#595959' }}>
                <Descriptions.Item label="Mã đơn hàng">
                  <Text copyable>{orderOne?.data?._id}</Text> {/* Thêm copyable */}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày yêu cầu hoàn">
                  {returnRequestDate}
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  <Text strong>{orderOne?.data?.user?.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Text copyable>{orderOne?.data?.user?.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  <Text copyable>{orderOne?.data?.shipping_address?.phone}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              type="inner"
              title={<Text strong>Chi tiết Hoàn tiền</Text>}
              style={{ borderRadius: 8, height: '100%' }} // Đảm bảo chiều cao bằng nhau
              bodyStyle={{ padding: 16 }}
            >
              <Descriptions column={1} labelStyle={{ fontWeight: 'normal', color: '#595959' }}>
                <Descriptions.Item label="Lý do hoàn đơn">
                  <Text>{returnReason}</Text>
                </Descriptions.Item>
                <Descriptions.Item>
                  <Text>Số tiền hoàn: </Text>
                  <Text style={{fontWeight: 'bold', color: "red", fontSize: 18}} className='ml-2'>
                    {orderOne?.data?.total.toLocaleString()} VNĐ
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Divider style={{ margin: '32px 0' }} />

        {/* Thông tin Thanh toán Đơn hàng Gốc */}
        <Card
          type="inner"
          title={<Text strong>Thông tin Thanh toán Đơn hàng Gốc</Text>}
          style={{ borderRadius: 8 }}
          bodyStyle={{ padding: 16 }}
        >
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} labelStyle={{ fontWeight: 'normal', color: '#595959' }}>
            <Descriptions.Item label="Phương thức thanh toán">{orderOne?.data?.payment_method}</Descriptions.Item>
            <Descriptions.Item label="Ngày thanh toán">{new Date(orderOne?.data?.created_at).toLocaleString()}</Descriptions.Item>
            
            <Descriptions.Item label="Trạng thái đơn hàng">
              <Tag color={statusColors[orderOne?.data.status]} style={{ fontWeight: 500, textTransform: "capitalize" }}>{statusLabels[orderOne?.data?.status]?.toUpperCase()}</Tag> {/* Ví dụ */}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider style={{ margin: '32px 0' }} />

        {/* Upload Minh chứng Hoàn tiền */}
        <Card
          type="inner"
          title={<Text strong>Tải lên Minh chứng Hoàn tiền</Text>}
          style={{ borderRadius: 8 }}
          bodyStyle={{ padding: 16 }}
        > 
          <Upload
            beforeUpload={() => false}
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            maxCount={3} // Giới hạn số lượng file 
            name='images'
          >
            <Button
              icon={<UploadOutlined />}
              type="dashed"
            >
              Chọn ảnh minh chứng
            </Button>
          </Upload>
          
        </Card>

        {/* Nút hành động */}
        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <Button
            type="primary"
            danger
            size="large" // Nút lớn hơn
            icon={<ExclamationCircleOutlined />} // Thêm icon vào nút
            loading={loading}
            onClick={handleRefund}
            style={{ borderRadius: 8 }}
            disabled={fileList.length === 0}
          >
            Hoàn tiền & Gửi minh chứng
          </Button>
          
        </div>
      </Card>
    </Modal>
  );
};

export default RefundRequestDetail;