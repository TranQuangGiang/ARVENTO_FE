import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const initialItems = [
  {
    id: 1,
    image: '/images/giay1.png',
    name: 'Xịt Bọt ION Làm Sạch Giày Mycare Foaming Cleaner 300ml',
    code: 'MYC103',
    size: null,
    quantity: 1,
    price: 99000,
  },
  {
    id: 2,
    image: '/images/giay2.png',
    name: 'Giày Nike Free RN NN Nam - Đen',
    code: 'MSN1109',
    size: 42,
    quantity: 1,
    price: 2490000,
  },
  {
    id: 3,
    image: '/images/giay3.png',
    name: 'Giày Nike Free RN NN Nam - Đen',
    code: 'MSN1109',
    size: 42,
    quantity: 1,
    price: 2490000,
  },
  {
    id: 4,
    image: '/images/giay3.png',
    name: 'Giày Nike Free RN NN Nam - Đen',
    code: 'MSN1109',
    size: 42,
    quantity: 1,
    price: 2490000,
  },
];

const Cart = () => {
  const [items, setItems] = useState(initialItems);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleQuantityChange = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const total = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalSelectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full bg-white text-gray-900 min-h-screen font-inter mb-16">
      <div className="w-full border-t border-t-gray-200  px-4 md:px-10 lg:px-[180px]">
        <h2 className="text-4xl font-bold text-gray-900 mt-16">🛒 GIỎ HÀNG CỦA BẠN</h2>
        <p className="text-[17px] ml-2 text-gray-700 mt-2">Tổng cộng {items.length} sản phẩm đã thêm</p>
      </div>
      <div className="w-[78%] mt-6 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Danh sách sản phẩm */}
        <div className="ml-4.5 w-full lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm relative">
              <input
                type="checkbox"
                className="absolute top-2 left-2 scale-125"
                checked={selectedIds.includes(item.id)}
                onChange={() => handleSelect(item.id)}
              />
              <div className='w-full flex pt-8 pl-4 pb-8'>
                <img src={item.image} alt={item.name} className="w-28 h-28 mt-[18px] object-contain bg-slate-50" />
                <div className="flex-1 p-4">
                  <h3 className="text-[16px] font-sans font-semibold">{item.name}</h3>
                  <p className="text-[15px] font-sans text-gray-600 mt-1">Mã hàng: {item.code}</p>
                  {item.size && <p className="text-[15px] font-sans text-gray-600">Size: {item.size}</p>}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="px-2 py-1 border rounded-md hover:bg-gray-100"
                    >-</button>
                    <span className="w-8 text-center bg-gray-100 rounded-md">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="px-2 py-1 border rounded-md hover:bg-gray-100"
                    >+</button>
                  </div>
                </div>
                <div className="p-4 flex flex-col items-end justify-between">
                  <span className="text-[16px] font-bold font-sans">{(item.price * item.quantity).toLocaleString()}₫</span>
                  <Popconfirm
                    title="Bạn có chắc muốn xoá sản phẩm này?"
                    onConfirm={() => handleRemove(item.id)}
                    okText="Xoá"
                    cancelText="Huỷ"
                  >
                    <DeleteOutlined style={{color: 'red'}} className="text-red-600 text-lg cursor-pointer hover:scale-110 transition" />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Tóm tắt đơn hàng */}
        <div className="p-6 ml-5 w-full rounded-lg shadow-md bg-slate-50 sticky top-8 h-fit">
          <h4 className="text-2xl font-sans font-bold mb-4">TÓM TẮT ĐƠN HÀNG</h4>
          <div className="flex justify-between mb-2">
            <span className='text-[15px] font-sans'>{totalSelectedCount} sản phẩm</span>
            <span className='text-[15px] font-sans'>{total.toLocaleString()}₫</span>
          </div >
          <div className="flex justify-between mb-2">
            <span className='text-[15px] font-sans'>Phí giao hàng</span>
            <span className='text-[15px] font-sans'>Miễn phí</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-lg font-sans font-bold">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()}₫</span>
          </div>

          <button
            disabled={selectedItems.length === 0}
            className="w-full mt-8 mb-3.5 cursor-pointer text-white py-3 rounded-md bg-black hover:bg-gray-800 transition font-semibold font-sans"
          >
            THANH TOÁN →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart