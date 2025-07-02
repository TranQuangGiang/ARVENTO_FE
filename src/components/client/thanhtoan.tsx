import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, message } from "antd";
import { useList } from "../../hooks/useList";
import { useCart } from "../contexts/cartContexts"; // ✅ Dùng context

const Thanhtoan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerInfo, shippingInfo } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTempMethod, setSelectedTempMethod] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [manualCoupon, setManualCoupon] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: vouchers } = useList({
    resource: "/coupons/admin/coupons",
  });

  const {
    state: { cart: cartContext },
    setSelectedVoucherCode,
    applyVoucherToCart,
    removeVoucherFromCart,
    clearCart,
    fetchCart: refetch,
  } = useCart();
  console.log(cartContext);
  

  const paymentMethods = [
    { id: "cod", label: "Thanh toán khi nhận hàng", icon: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png" },
    { id: "zalopay", label: "Zalo Pay", icon: "https://seeklogo.com/images/Z/zalopay-logo-643ADC36A4-seeklogo.com.png" },
    { id: "momo", label: "Ví MoMo", icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
  ];

  const handleConfirmMethod = () => {
    setSelectedMethod(selectedTempMethod);
    setIsModalOpen(false);
  };

  const handleConfirmCoupon = async (selectedCoupon:any) => {
    if (cartContext?.applied_coupon?.code === selectedCoupon.code) {
      setSelectedVoucherCode(null);
      await removeVoucherFromCart();
    } else {
      setSelectedVoucherCode(selectedCoupon.code);
      await applyVoucherToCart(selectedCoupon.code);
    }
    await refetch();
    setIsCouponModalOpen(false);
  };

  const handleManualCoupon = async () => {
    if (manualCoupon === cartContext?.applied_coupon?.code) {
      setSelectedVoucherCode(null);
      await removeVoucherFromCart();
    } else {
      setSelectedVoucherCode(manualCoupon);
      await applyVoucherToCart(manualCoupon);
    }
    await refetch();
  };

  const handlePayment = async () => {
  if (!selectedMethod) {
    message.error("Vui lòng chọn phương thức thanh toán");
    return;
  }

  try {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Bạn chưa đăng nhập hoặc token hết hạn");
      setIsLoading(false);
      return;
    }

    const orderItems = cartContext?.items.map((item:any) => ({
      product: item.product._id,
      selected_variant: item.selected_variant,
      price: item.unit_price,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      
    }));

    const orderRes = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: orderItems,
        total: cartContext?.total,
        subtotal: cartContext?.subtotal,
        discount_amount: cartContext?.subtotal && cartContext?.total
          ? Number(cartContext.subtotal) - Number(cartContext.total)
          : 0,
        address: {
          recipient: shippingInfo?.recipient,
          address: shippingInfo?.fullAddress,
          note: shippingInfo?.note || "",
        },
        shipping_address: shippingInfo?.id,
        note: shippingInfo?.note || "",
        payment_method: selectedMethod,
        coupon: cartContext?.applied_coupon?.code || null
      }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(orderData.message || "Tạo đơn hàng thất bại");

    let paymentEndpoint = "cod";
    if (["zalopay", "momo"].includes(selectedMethod)) {
      paymentEndpoint = selectedMethod;
    }
    const paymentRes = await fetch(`http://localhost:3000/api/payments/${paymentEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order: orderData.data._id,
        amount: cartContext?.total,
        note: shippingInfo?.note || "Test zalopay payments",
      }),
    });

    const paymentData = await paymentRes.json();
    if (!paymentRes.ok) throw new Error(paymentData.message || "Tạo thanh toán thất bại");

    if (paymentData.data?.paymentUrl) {
      window.location.href = paymentData.data.paymentUrl;
      console.log("paymentUrl", paymentData.data?.paymentUrl);
      await clearCart();
    } else {
      message.success("Đặt hàng và thanh toán thành công");
      await clearCart();
      navigate('/');
    }


  } catch (error:any) {
    message.error(error.message);
  } finally {
    setIsLoading(false);
  }
};
     



  const currentMethod = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <div className="w-full bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto space-y-6 text-sm">
        <div className="flex">
          <div className="flex-1 text-center py-2 border-b-2 border-gray-300 text-gray-500">1. THÔNG TIN</div>
          <div className="flex-1 text-center py-2 border-b-2 border-blue-950 font-semibold text-black">2. THANH TOÁN</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h3 className="font-medium">Danh sách sản phẩm</h3>
          {cartContext?.items?.map((product:any, index:any) => (
            <div key={product._id}>
              <div className="flex space-x-3">
                <img
                  src={product.selected_variant?.image?.url || "/no-image.png"}
                  alt={product.product?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.product?.name}</h3>
                  {product.selected_variant?.size && <p className="text-gray-600 text-xs">Size: {product.selected_variant.size}</p>}
                  {product.selected_variant?.color && <p className="text-gray-600 text-xs">Màu: {product.selected_variant.color.name}</p>}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-red-500 font-semibold">{product.unit_price.toLocaleString()}₫</span>
                    {product.original_price && (
                      <span className="line-through text-gray-400 text-xs">{product.original_price.toLocaleString()}₫</span>
                    )}
                  </div>
                </div>
                <div className="text-right font-medium text-sm">x {product.quantity}</div>
              </div>
              {index !== cartContext.items.length - 1 && <hr className="my-3 border-gray-200" />}
            </div>
          ))}
        </div>

        <h3 className="text-base font-medium text-gray-600">THÔNG TIN NHẬN HÀNG</h3>
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <div className="flex justify-between"><strong>Khách hàng:</strong><span>{customerInfo?.name}</span></div>
          <div className="flex justify-between"><strong>Email:</strong><span>{customerInfo?.email}</span></div>
          <div className="flex justify-between"><strong>SĐT người nhận:</strong><span>{customerInfo?.phone}</span></div>
          <div className="flex justify-between"><strong>Người nhận:</strong><span>{shippingInfo?.recipient}</span></div>
          <div className="flex justify-between"><strong>Địa chỉ:</strong><span>{shippingInfo?.fullAddress}</span></div>
          <div className="flex justify-between"><strong>Ghi chú:</strong><span>{shippingInfo?.note}</span></div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h3 className="font-medium">Chọn mã giảm giá (chỉ áp dụng 1 lần)</h3>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Nhập mã giảm giá..."
              value={manualCoupon}
              onChange={(e) => setManualCoupon(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
            <button
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={handleManualCoupon}
            >
              Áp dụng
            </button>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer pt-2" onClick={() => setIsCouponModalOpen(true)}>
            <img src="https://cdn-icons-png.flaticon.com/512/4315/4315609.png" alt="coupon" className="w-8 h-8" />
            <span className="text-black">
              {cartContext?.applied_coupon ? `${cartContext.applied_coupon.code}` : "Chọn mã giảm giá từ danh sách"}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h3 className="font-medium">THÔNG TIN THANH TOÁN</h3>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            {currentMethod ? (
              <>
                <img src={currentMethod.icon} alt={currentMethod.label} className="w-8 h-8" />
                <span className="text-black">{currentMethod.label}</span>
              </>
            ) : (
              <>
                <img src="https://cdn-icons-png.flaticon.com/512/1041/1041883.png" alt="payment" className="w-8 h-8" />
                <span className="text-red-500">Chọn phương thức thanh toán</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <div className="flex justify-between font-semibold text-base">
            <span>Tạm tính:</span>
            <span className="text-red-500">{cartContext?.subtotal?.toLocaleString()}₫</span>
          </div>
          {cartContext?.applied_coupon && cartContext.subtotal && cartContext.total && (
            <div className="flex justify-between font-semibold text-base text-green-600">
              <span>Giảm giá:</span>
              <span>
                -{(Number(cartContext.subtotal) - Number(cartContext.total)).toLocaleString()}₫
              </span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng:</span>
            <span className="text-red-500">{cartContext?.total?.toLocaleString()}₫</span>
          </div>
          <button
            className="w-full bg-blue-950 mt-4 mb-8 text-white py-2 cursor-pointer rounded text-base hover:bg-blue-900 disabled:opacity-60"
            onClick={handlePayment}
            disabled={!selectedMethod || isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>
      </div>

      <Modal
        title="Chọn phương thức thanh toán"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Hủy</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmMethod} disabled={!selectedTempMethod}>Xác nhận</Button>,
        ]}
      >
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedTempMethod(method.id)}
              className={`flex items-center space-x-3 p-2 border rounded cursor-pointer hover:border-blue-500 ${selectedTempMethod === method.id ? "border-blue-500" : "border-gray-200"}`}
            >
              <img src={method.icon} alt={method.label} className="w-8 h-8" />
              <span>{method.label}</span>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        title="Chọn mã giảm giá"
        open={isCouponModalOpen}
        onCancel={() => setIsCouponModalOpen(false)}
        footer={null}
      >
        <div className="space-y-3">
          {vouchers?.data?.coupons?.map((coupon:any) => (
            <div
              key={coupon._id}
              onClick={() => handleConfirmCoupon(coupon)}
              className="flex items-center space-x-3 p-2 border rounded cursor-pointer hover:border-blue-500"
            >
              <img src={coupon.image || "https://cdn-icons-png.flaticon.com/512/4315/4315609.png"} alt={coupon.code} className="w-8 h-8" />
              <span>{coupon.code} - {coupon.description}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Thanhtoan;
