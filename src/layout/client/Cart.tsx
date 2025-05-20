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
    rewardPoints: 990,
    quantity: 1,
    price: 99000,
  },
  {
    id: 2,
    image: '/images/giay2.png',
    name: 'Giày Nike Free RN NN Nam - Đen',
    code: 'MSN1109',
    size: 42,
    rewardPoints: 24900,
    quantity: 1,
    price: 2490000,
  },
  {
    id: 3,
    image: '/images/giay3.png',
    name: 'Giày Nike Free RN NN Nam - Đen',
    code: 'MSN1109',
    size: 42,
    rewardPoints: 24900,
    quantity: 1,
    price: 2490000,
  },
  {
    id: 4,
    image: '/images/giay3.png',
    name: 'Giày Nike Free RN NN Nam - Đen',
    code: 'MSN1109',
    size: 42,
    rewardPoints: 24900,
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
    <div className="w-full mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">GIỎ HÀNG CỦA BẠN</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 overflow-x-auto rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === items.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3">Hình ảnh</th>
                <th className="p-3">Tên sản phẩm</th>
                <th className="p-3">Mã hàng</th>
                <th className="p-3">Số lượng</th>
                <th className="p-3">Đơn Giá</th>
                <th className="p-3">Tổng cộng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td className="p-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-contain"
                    />
                  </td>
                  <td className="p-3">
                    <p className="font-semibold">{item.name}</p>
                    {item.size && (
                      <p className="text-sm text-gray-500">Chọn size: {item.size}</p>
                    )}
                  </td>
                  <td className="p-3">{item.code}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="px-2 py-1 border rounded bg-white text-gray-800"
                      >
                        –
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-10 text-center rounded bg-blue-300 text-gray-800"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="px-2 py-1 border rounded bg-white text-gray-800"
                      >
                        +
                      </button>
                      <Popconfirm
                        title="Bạn có chắc muốn xoá?"
                        onConfirm={() => handleRemove(item.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          className="ml-2"
                        />
                      </Popconfirm>
                    </div>
                  </td>
                  <td className="p-3">{item.price.toLocaleString()}₫</td>
                  <td className="p-3">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:w-1/3 p-4 rounded shadow-sm bg-gray-50 h-fit">
          <div className="flex justify-between font-semibold text-gray-700">
            <span>Số lượng sản phẩm:</span>
            <span>{totalSelectedCount}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-1 text-gray-900">
            <span>Tổng:</span>
            <span>{total.toLocaleString()}₫</span>
          </div>
          <button
            disabled={selectedItems.length === 0}
            className="w-full mt-4 bg-blue-900 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            THANH TOÁN
          </button>

        </div>
      </div>
    </div>
  );
};

export default Cart;
