import { useEffect, useState } from 'react';
import { Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from '../contexts/cartContexts';
import { Link, useNavigate } from 'react-router-dom';
import { useList } from '../../hooks/useList';
import { Check } from 'lucide-react';

const Cart = () => {
  const {
    state: { cart, cartItemCount },
    fetchCart,
    updateCart,
    removeFromCart,
    removeVoucherFromCart,
    setSelectedVoucherCode,
    applyVoucherToCart,
  } = useCart();

  const navigate = useNavigate();
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [voucherError, setVoucherError] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const items = cart?.items || [];
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Number(cart?.subtotal || 0);
  
  

  useEffect(() => {
    if (!voucherApplied) {
      setFinalAmount(subtotal);
    }
  }, [subtotal, voucherApplied]);

  const { data: vouchers } = useList({ resource: '/coupons/admin/coupons' });

  const handleQuantityChange = (product_id: string, size: string, color: { name: string; hex: string }, sku: string, price: number, image: { url: string, alt: string, id: string, _id: string }, stock: number , quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product_id, size, color);
    } else {
      updateCart(product_id, size, color, sku, price, image , stock ,quantity);
    }
  };

  const handleRemove = async (product_id: string, size: string, color: { name: string; hex: string }) => {
    await removeFromCart(product_id, size, color);
  };

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        cart,
        finalAmount,
        discountAmount,
        appliedCoupon,
      },
    });
  };

  const handleApplyVoucher = async (code: string | null) => {
    message.destroy();
    if (!code) {
      setSelectedVoucher(null);
      setSelectedVoucherCode(null);
      removeVoucherFromCart();
      setDiscountAmount(0);
      setFinalAmount(subtotal);
      setAppliedCoupon(null);
      setVoucherApplied(false);
      setVoucherError(false);
      return;
    }

    try {
      setSelectedVoucher(code);
      setSelectedVoucherCode(code);
      const res = await applyVoucherToCart(code);
      const payload = res.data.data;

      if (payload?.isValid) {
        setDiscountAmount(payload.discountAmount || 0);
        setFinalAmount(payload.finalAmount || subtotal);
        setAppliedCoupon(payload.coupon || null);
        setVoucherApplied(true);
        setVoucherError(false);
        message.success("Voucher applied successfully");
      }
    } catch (error) {
      setVoucherError(true);
      setDiscountAmount(0);
      setFinalAmount(subtotal);
      setSelectedVoucher(null);
      setAppliedCoupon(null);
      setVoucherApplied(false);
    }
  };

  return (
    <div className="w-full bg-white text-gray-900 min-h-screen font-inter mb-16">
      <div className="w-full border-t border-t-gray-200 px-4 md:px-10 lg:px-[180px]">
        <h2 className="text-4xl font-bold text-gray-900 mt-16">🛒 YOUR CART</h2>
        <p className="text-[17px] ml-2 text-gray-700 mt-2">Total {cartItemCount} products added</p>
      </div>

      <div className="w-[78%] mt-6 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="ml-4.5 w-full lg:col-span-2 space-y-6">
          {items.map((item: any) => (
            <div key={item._id} className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm relative">
              <div className="w-full flex pt-3 pl-4 pb-3">
                <img
                  src={item.selected_variant?.image?.url || "/no-image.png"}
                  alt={item.product?.name}
                  className="w-[120px] h-[120px] mt-[18px] object-contain bg-slate-50"
                />
                <div className="flex-1 p-4">
                  <Link to={`/detailProductClient/${item.product?._id}`}>
                    <h3 className="text-[16px] cursor-pointer font-sans font-semibold">{item.product?.name}</h3>
                  </Link>
                  <p className="text-[15px] font-sans text-gray-600 mt-1">
                    SKU: {item.selected_variant?.sku || item.product?.name}
                  </p>
                  {item.selected_variant?.size && (
                    <p className="text-[14px] font-sans text-gray-600">Size: {item.selected_variant.size}</p>
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.selected_variant?.size, item.selected_variant?.color, item.selected_variant?.sku, item.selected_variant?.price, item.selected_variant?.image, item.selected_variant?.stock , item.quantity - 1)}
                      className="px-2.5 py-0.5 border rounded-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 h-8 leading-8 text-center bg-gray-100 rounded-md">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.selected_variant?.size, item.selected_variant?.color, item.selected_variant?.sku, item.selected_variant?.price, item.selected_variant?.image, item.selected_variant?.stock, item.quantity + 1)}
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
                    title="Are you sure you want to remove this item?"
                    onConfirm={() => handleRemove(item.product._id, item.selected_variant?.size, item.selected_variant?.color)}
                    okText="Remove"
                    cancelText="Cancel"
                  >
                    <DeleteOutlined
                      style={{ color: 'red' }}
                      className="text-red-600 text-lg cursor-pointer hover:scale-110 transition"
                    />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 ml-5 w-full rounded-lg shadow-md bg-slate-50 sticky top-8 h-fit">
          <h4 className="text-2xl font-sans font-bold mb-4">ORDER SUMMARY</h4>

          <div className="flex justify-between mb-2 text-[15px]">
            <span className="text-gray-700">Subtotal ({totalQuantity} items)</span>
            <span className="font-medium">{subtotal.toLocaleString()}₫</span>
          </div>

          <div className="flex justify-between mb-2 text-[15px]">
            <span className="text-gray-700">Shipping fee</span>
            <span className="font-medium text-green-600">Free</span>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowVouchers(!showVouchers)}
              className="text-[16px] font-semibold font-sans mb-2 flex items-center gap-2 text-left cursor-pointer"
            >
              🎁 Apply discount code
              <span className="text-sm text-blue-500">{showVouchers ? "(Hide)" : "(Show)"}</span>
            </button>

            {showVouchers && (
              <div className="space-y-2 mt-2">
                {vouchers?.data?.coupons?.map((voucher: any) => {
                  const isSelected = selectedVoucher === voucher.code;

                  return (
                    <div
                      key={voucher.code}
                      onClick={() => handleApplyVoucher(isSelected ? null : voucher.code)}
                      className={`relative border p-3 rounded-md cursor-pointer transition-all hover:border-blue-500 ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <p className="text-sm font-semibold text-blue-600">{voucher.code}</p>
                      <p className="text-sm text-gray-700">{voucher.description}</p>

                      {isSelected && !voucherError && (
                        <div className="absolute w-5 flex items-center justify-center bg-blue-600 h-5 rounded-full top-2 right-2 text-white text-xl">
                          <Check style={{ width: 16 }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {discountAmount > 0 && appliedCoupon && (
            <div className="mt-5 border-t pt-5 text-[15px] text-green-600">
              <div className="flex justify-between mb-1">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-{discountAmount.toLocaleString()}₫</span>
              </div>
              <div className="text-sm text-gray-600">
                ({appliedCoupon.discount_type === 'percentage' ? `Discount ${appliedCoupon.discount_value}%` : `Discount ${appliedCoupon.discount_value.toLocaleString()}₫`})
              </div>
            </div>
          )}

          <div className="flex pt-1 justify-between text-lg font-sans font-bold">
            <span>Total:</span>
            <span>{finalAmount.toLocaleString()}₫</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="w-full mt-8 mb-3.5 cursor-pointer text-white py-3 rounded-md bg-black hover:bg-gray-800 transition font-semibold font-sans"
          >
            CHECKOUT →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
