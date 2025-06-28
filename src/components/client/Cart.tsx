import { useEffect, useState } from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/cartContexts';
import { Link } from 'react-router-dom';
import { useList } from '../../hooks/useList';
import { Check, CircleCheckBig } from 'lucide-react';

const Cart = () => {
  const { state: { cart }, fetchCart, updateCart , removeFromCart, removeVoucherFromCart, setSelectedVoucherCode, state: { cartItemCount } } = useCart();

  console.log("Cart Data: ", cart);
  
  const items = cart?.items || [];

  const { data:vouchers } = useList({
    resource: '/coupons/admin/coupons'
  });
  
  console.log(vouchers);
  
  
  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (
    product_id: string,
    size: string,
    color: { name: string; hex: string },
    quantity: number
  ) => {

   

    if (quantity <= 0 ) {
      removeFromCart(product_id, size, color);
    } else {
      updateCart(product_id, size, color, quantity);
    }

  };

  const handleRemove = async (
    product_id: string,
    size: string,
    color: { name: string; hex: string },
  ) => {
    
    await removeFromCart(product_id, size, color);
  };


  const total = cart?.total || 0;
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const { applyVoucherToCart } = useCart();

  return (
    <div className="w-full bg-white text-gray-900 min-h-screen font-inter mb-16">
      <div className="w-full border-t border-t-gray-200 px-4 md:px-10 lg:px-[180px]">
        <h2 className="text-4xl font-bold text-gray-900 mt-16">🛒 GIỎ HÀNG CỦA BẠN</h2>
        <p className="text-[17px] ml-2 text-gray-700 mt-2">
          Tổng cộng {cartItemCount} sản phẩm đã thêm
        </p>
      </div>

      <div className="w-[78%] mt-6 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Danh sách sản phẩm */}
        <div className="ml-4.5 w-full lg:col-span-2 space-y-6">
          {items.map((item: any) => (
            <div
              key={item._id}
              className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm relative"
            >
              <div className="w-full flex pt-3 pl-4 pb-3">
                <img
                  src={
                    item.selected_variant?.image.url || "/no-image.png"
                  }
                  alt={item.product?.name}
                  className="w-[120px] h-[120px] mt-[18px] object-contain bg-slate-50"
                />
                
                <div className="flex-1 p-4">
                  <Link to={`/detailProduct/${item.product?._id}`}>
                    <h3 className="text-[16px] cursor-pointer font-sans font-semibold">{item.product?.name}</h3>
                  </Link>
                  
                  <p className="text-[15px] font-sans text-gray-600 mt-1">
                    Mã hàng: {item.selected_variant?.sku || item.product?.name}
                  </p>
                  {item.selected_variant?.size && (
                    <p className="text-[14px] font-sans text-gray-600">
                      Size: {item.selected_variant.size}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(
                        item.product._id,
                        item.selected_variant?.size,
                        item.selected_variant?.color,
                        item.quantity - 1
                      )}
                      className="px-2 py-0.5 border rounded-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 h-8 leading-8 text-center bg-gray-100 rounded-md">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(
                        item.product._id,
                        item.selected_variant?.size,
                        item.selected_variant?.color,
                        item.quantity + 1
                      )}
                      className="px-2 py-0.5 border rounded-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col items-end justify-between">
                  <span className="text-[16px] font-bold font-sans">
                    {(item.total_price || item.quantity * item.unit_price).toLocaleString()}₫
                  </span>
                  <Popconfirm
                    title="Bạn có chắc muốn xoá sản phẩm này?"
                    onConfirm={() =>
                      handleRemove(
                        item.product._id,
                        item.selected_variant?.size,
                        item.selected_variant?.color
                      )
                    }
                    okText="Xoá"
                    cancelText="Huỷ"
                  >
                    <DeleteOutlined
                      style={{ color: "red" }}
                      className="text-red-600 text-lg cursor-pointer hover:scale-110 transition"
                    />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="p-6 ml-5 w-full rounded-lg shadow-md bg-slate-50 sticky top-8 h-fit">
          <h4 className="text-2xl font-sans font-bold mb-4">TÓM TẮT ĐƠN HÀNG</h4>
          {/* Tạm tính */}
          <div className="flex justify-between mb-2 text-[15px]">
            <span className="text-gray-700">Tạm tính ({totalQuantity} sản phẩm)</span>
            <span className="font-medium">{Number(cart?.subtotal || 0).toLocaleString()}₫</span>
          </div>

          {/* Phí giao hàng */}
          <div className="flex justify-between mb-2 text-[15px]">
            <span className="text-gray-700">Phí giao hàng</span>
            <span className="font-medium text-green-600">Miễn phí</span>
          </div>

          <div className="mt-6">
            <h4 className="text-[16px] font-semibold font-sans mb-2">🎁 Chọn mã giảm giá</h4>
            
            <div className="space-y-2">
            {vouchers?.data?.coupons?.map((voucher: any) => {
              const isSelected = cart?.applied_coupon?.code === voucher.code;

              return (
                <div
                  key={voucher._id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedVoucherCode(null);
                      removeVoucherFromCart(); // cần có trong context
                    } else {
                      setSelectedVoucherCode(voucher);
                      applyVoucherToCart(voucher.code);
                    }
                  }}
                  className={`relative border p-3 rounded-md cursor-pointer transition-all hover:border-blue-500 ${
                    isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-blue-600">{voucher.code}</p>
                  <p className="text-sm text-gray-700">{voucher.description}</p>

                  {isSelected && (
                    <div className="absolute w-5 flex items-center justify-center bg-blue-600 h-5 rounded-[50%] top-2 right-2 text-green-600 text-xl">
                      <Check style={{ color: "#fff", width: 16}} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
          {/* Giảm giá nếu có */}
          {cart?.applied_coupon && (
            <div className="mt-5 border-t pt-5 flex justify-between mb-2 text-[15px] text-green-600">
              <span className='text-[15px]'>
                Giảm giá ({cart.applied_coupon.code})
              </span>
              <span className='text-[15px]'>-{Number(cart.applied_coupon.discount_amount).toLocaleString()}₫</span>
            </div>
          )}
          <div className="flex pt-1 justify-between text-lg font-sans font-bold">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()}₫</span>
          </div>

          <button
            disabled={items.length === 0}
            className="w-full mt-8 mb-3.5 cursor-pointer text-white py-3 rounded-md bg-black hover:bg-gray-800 transition font-semibold font-sans"
          >
            THANH TOÁN →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
