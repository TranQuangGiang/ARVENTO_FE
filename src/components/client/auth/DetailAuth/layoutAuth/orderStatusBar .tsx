import { CarOutlined, CheckCircleOutlined, CheckSquareOutlined, ClockCircleOutlined, CloseCircleOutlined, HomeOutlined, RollbackOutlined, SyncOutlined, UndoOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import React from 'react'

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipping"
  | "delivered"
  | "completed"
  | "cancelled"
  | "returning"
  | "returned";

const statusColorMap: Record<
    OrderStatus,
    { text: string; color: string; icon: JSX.Element }
> = {
    pending: { text: "Pending", color: "orange", icon: <ClockCircleOutlined /> },
    confirmed: { text: "Confirmed", color: "geekblue", icon: <CheckCircleOutlined /> },
    processing: { text: "Processing", color: "cyan", icon: <SyncOutlined /> },
    shipping: { text: "Shipping", color: "purple", icon: <CarOutlined /> },
    delivered: { text: "Delivered", color: "blue", icon: <HomeOutlined /> },
    completed: { text: "Completed", color: "green", icon: <CheckSquareOutlined /> },
    cancelled: { text: "Cancelled", color: "red", icon: <CloseCircleOutlined /> },
    returning: { text: "Returning", color: "gold", icon: <RollbackOutlined />},
    returned: { text: "Returned", color: "volcano", icon: <UndoOutlined /> },
    
};

interface OrderStatusBarProps {
  currentStatus: OrderStatus;
}
const OrderStatusBar: React.FC<OrderStatusBarProps>  = ({ currentStatus }:any) => {
    
    const orderedKeys:OrderStatus[] = [
        "pending",
        "confirmed",
        "processing",
        "shipping",
        "delivered",
        "completed",
        "returning",
        "returned",
        "cancelled"
    ];

    const currentIndex = orderedKeys.indexOf(currentStatus);
    return (
        <div className='bg-white p-4 text-sm rounded-lg shadow-sm'>
            <Steps
                current={currentIndex >= 0 ? currentIndex: 0}
                labelPlacement='vertical'
                items={orderedKeys.map((key) => ({
                    title: statusColorMap[key].text,
                    icon: statusColorMap[key].icon
                }))}
                style={{fontSize: 14}}
            />   
        </div>
    )
}

export default OrderStatusBar 