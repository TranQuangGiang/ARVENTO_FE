import { useEffect } from 'react';
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/cartContexts';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { state: { cart }, fetchCart, updateCart , removeFromCart } = useCart();

  console.log("Cart Data: ", cart);
  
  const items = cart?.items || [];
  
  
  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (
    product_id: string,
    size: string,
    color: string,
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
    color: string
  ) => {
    await removeFromCart(product_id, size, color);
  };


  const total = cart?.total || 0;
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  
  return (
    <div className="w-full bg-white text-gray-900 min-h-screen font-inter mb-16">
      <div className="w-full border-t border-t-gray-200 px-4 md:px-10 lg:px-[180px]">
        <h2 className="text-4xl font-bold text-gray-900 mt-16">🛒 GIỎ HÀNG CỦA BẠN</h2>
        <p className="text-[17px] ml-2 text-gray-700 mt-2">
          Tổng cộng {items.length} sản phẩm đã thêm
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
                    item.product?.variants?.find(
                      (v: any) =>
                        v.size === item.selected_variant.size &&
                        v.color === item.selected_variant.color
                    )?.image || '/no-image.png'
                  }
                  alt={item.product.name}
                  className="w-[120px] h-[120px] mt-[18px] object-contain bg-slate-50"
                />
                <div className="flex-1 p-4">
                  <Link to={`/detailProduct/${item.product?._id}`}>
                    <h3 className="text-[16px] cursor-pointer font-sans font-semibold">{item.product?.name}</h3>
                  </Link>
                  
                  <p className="text-[15px] font-sans text-gray-600 mt-1">
                    Mã hàng: {item.product?.product_code || item.product?.name}
                  </p>
                  {item.selected_variant?.size && (
                    <p className="text-[15px] font-sans text-gray-600">
                      Size: {item.selected_variant.size}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(
                        item.product.id,
                        item.selected_variant?.size,
                        item.selected_variant?.color,
                        item.quantity + 1
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
                        item.product.id,
                        item.selected_variant?.size,
                        item.selected_variant?.color,
                        item.quantity - 1
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
                        item.product.id,
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
          <div className="flex justify-between mb-2">
            <span className="text-[15px] font-sans">{totalQuantity} sản phẩm</span>
            <span className="text-[15px] font-sans">{total.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[15px] font-sans">Phí giao hàng</span>
            <span className="text-[15px] font-sans">Miễn phí</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-lg font-sans font-bold">
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
