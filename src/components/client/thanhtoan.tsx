import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, message } from "antd";
import { useList } from "../../hooks/useList";
import { useCart } from "../contexts/cartContexts"; // ✅ Using context

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerInfo, shippingInfo, shippingFee, subtotal, discount, total, appliedCoupon } = location.state || {};
  console.log("CustomerInfo :", customerInfo);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTempMethod, setSelectedTempMethod] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    state: { cart: cartContext },
    clearCart,
  } = useCart();
  console.log(cartContext);


  const paymentMethods = [
    { id: "cod", label: "Thanh toán khi nhận hàng", icon: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png" },
    { id: "zalopay", label: "Zalo Pay", icon: "https://seeklogo.com/images/Z/zalopay-logo-643ADC36A4-seeklogo.com.png" },
    { id: "momo", label: "MoMo ", icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
  ];

  const handleConfirmMethod = () => {
    setSelectedMethod(selectedTempMethod);
    setIsModalOpen(false);
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      message.error("Please select a payment method.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You are not logged in or your token has expired.");
        setIsLoading(false);
        return;
      }
      const orderItems = cartContext?.items.map((item: any) => ({
        product: item.product._id,
        selected_variant: item.selected_variant,
        price: item.unit_price,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,

      }));
      const totalWithShipping = total + (shippingFee || 0);
      const orderRes = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          total: totalWithShipping,
          subtotal: subtotal,
          applied_coupon: appliedCoupon
            ? {
              code: appliedCoupon.code,
              discount_amount: appliedCoupon.discount_amount,
              discount_type: appliedCoupon.discount_type,
            }
            : {},
          address: {
            recipient: shippingInfo?.recipient,
            address: shippingInfo?.fullAddress,
            note: shippingInfo?.note || "",
            
          },
          shipping_address: shippingInfo?.id,
          shipping_fee: shippingFee || 0,
          note: shippingInfo?.note || "",
          payment_method: selectedMethod,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Order creation failed.");

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
          amount: total,
          note: shippingInfo?.note || "Test zalopay payments",
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.message || "Payment creation failed.");

      if (paymentData.data?.paymentUrl) {
        window.location.href = paymentData.data.paymentUrl;
        console.log("paymentUrl", paymentData.data?.paymentUrl);
        await clearCart();
      } else {
        message.success("Đặt hàng thành công");
        await clearCart();
        const convertedItems = cartContext?.items.map((item) => ({
          product: item.product,
          selected_variant: item.selected_variant,
          quantity: item.quantity,
          price: item.unit_price,
          total_price: item.total_price,
        }));

        navigate('/thanhcong', {
          state: {
            order: {
              ...orderData.data,
              items: convertedItems,
              address: {
                ...orderData.data.address,
                recipient: shippingInfo?.recipient,
                phone: customerInfo?.phone || "Không có số điện thoại",
                address: shippingInfo?.fullAddress,
                note: shippingInfo?.note,
              },
              total: total,
              subtotal: cartContext?.subtotal,
            },
          },
        });

      }


    } catch (error: any) {
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
          <h3 className="font-medium">Sản phẩm trong đơn</h3>
          {cartContext?.items?.map((product: any, index: any) => (
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
                  {product.selected_variant?.color && <p className="text-gray-600 text-xs">Màu sắc: {product.selected_variant.color.name}</p>}
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

        <h3 className="text-base font-medium text-gray-600">TÓM TẮT ĐƠN HÀNG</h3>
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <div className="flex justify-between"><strong>Khách hàng:</strong><span>{customerInfo?.name}</span></div>
          <div className="flex justify-between"><strong>Email:</strong><span>{customerInfo?.email}</span></div>
          <div className="flex justify-between"><strong>Số điện thoại:</strong><span>{customerInfo?.phone}</span></div>
          <div className="flex justify-between"><strong>Người nhận:</strong><span>{shippingInfo?.recipient}</span></div>
          <div className="flex justify-between"><strong>Địa chỉ:</strong><span>{shippingInfo?.fullAddress}</span></div>
          <div className="flex justify-between"><strong>Ghi chú:</strong><span>{shippingInfo?.note}</span></div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h3 className="font-medium">THÔNG TIN THANH TOÁN</h3>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            {currentMethod ? (
              <>
                <img src={currentMethod.icon} alt={currentMethod.label} className="w-8 h-8" />
                <span className="text-blue-700">{currentMethod.label}</span>
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
            <span className="text-red-500">{subtotal?.toLocaleString()}₫</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between font-semibold text-base text-green-600">
              <span>Giảm giá:</span>
              <span>-{discount?.toLocaleString()}₫</span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-base">
            <span>Phí vận chuyển:</span>
            <span>{shippingFee?.toLocaleString()}₫</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng thanh toán:</span>
            <span className="text-red-500">{total?.toLocaleString()}₫</span>
          </div>
          <button
            className="w-full bg-blue-950 mt-4 mb-8 text-white py-2 cursor-pointer rounded text-base hover:bg-blue-900 disabled:opacity-60"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? "Tiến hành..." : "Tiến hành thanh toán"}
          </button>
        </div>
      </div>

      <Modal
        title="Chọn phương thức thanh toán"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Đóng</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmMethod} disabled={!selectedTempMethod}>Chọn</Button>,
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


    </div>
  );
};

export default Payment;