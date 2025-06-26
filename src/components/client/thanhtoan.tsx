import React, { useState } from "react";
import { Modal, Button } from "antd";

const Thanhtoan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTempMethod, setSelectedTempMethod] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedTempCoupon, setSelectedTempCoupon] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [manualCoupon, setManualCoupon] = useState("");

  const shippingInfo = [
    { label: "Khách hàng", value: "Nguyễn Như Đức" },
    { label: "Số điện thoại", value: "0368437311" },
    { label: "Nhận hàng tại", value: "fgfg, Thị trấn Chúc Sơn, Huyện Chương Mỹ, Hà Nội" },
    { label: "Người nhận", value: "K - 0976567765" },
  ];

  const paymentMethods = [
    { id: "cod", label: "Thanh toán khi nhận hàng", icon: "https://cdn-icons-png.flaticon.com/512/1041/1041883.png" },
    { id: "qr", label: "Chuyển khoản ngân hàng qua mã QR", icon: "https://cdn-icons-png.flaticon.com/512/833/833472.png" },
    { id: "vnpay", label: "VNPAY", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/VNPAY_logo.svg/512px-VNPAY_logo.svg.png" },
    { id: "onepay", label: "Qua thẻ Visa/Master/JCB/Napas", icon: "https://seeklogo.com/images/O/onepay-logo-030f1cfa20seeklogo.com.png" },
    { id: "momo", label: "Ví MoMo", icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
  ];

 const coupons = [
  {
    id: "coupon1",
    label: "GIAM10CHO500K - Giảm 10% cho đơn hàng từ 500.000đ",
    icon: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
  },
  {
    id: "coupon2",
    label: "FREESHIPTOANQUOC - Miễn phí vận chuyển toàn quốc cho đơn từ 300.000đ",
    icon: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  },
  {
    id: "coupon3",
    label: "VNPAY200 - Giảm thêm 200.000đ khi thanh toán qua VNPAY (áp dụng đơn trên 1.000.000đ)",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/VNPAY_logo.svg/512px-VNPAY_logo.svg.png",
  },
  {
    id: "coupon4",
    label: "NEWUSER50K - Tặng ngay 50.000đ cho khách hàng mới (đơn tối thiểu 300.000đ)",
    icon: "https://cdn-icons-png.flaticon.com/512/846/846449.png",
  },
  {
    id: "coupon5",
    label: "FLASHSALE20 - Giảm 20% tối đa 150.000đ trong khung giờ Flash Sale",
    icon: "https://cdn-icons-png.flaticon.com/512/992/992700.png",
  },
];

  const handleConfirmMethod = () => {
    setSelectedMethod(selectedTempMethod);
    setIsModalOpen(false);
  };

  const handleConfirmCoupon = () => {
    setSelectedCoupon(selectedTempCoupon);
    setIsCouponModalOpen(false);
  };

  const currentMethod = paymentMethods.find((m) => m.id === selectedMethod);
  const currentCoupon = coupons.find((c) => c.id === selectedCoupon);

  return (
    <div className="w-full bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto space-y-6 text-sm">

        <div className="flex">
          <div className="flex-1 text-center py-2 border-b-2 border-gray-300 text-gray-500">1. THÔNG TIN</div>
          <div className="flex-1 text-center py-2 border-b-2 border-blue-950 font-semibold text-black">2. THANH TOÁN</div>
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
            <button className="bg-gray-200 px-4 py-2 rounded">Áp dụng</button>
          </div>
          <div 
            className="flex items-center space-x-3 cursor-pointer pt-2"
            onClick={() => setIsCouponModalOpen(true)}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/4315/4315609.png" alt="coupon" className="w-8 h-8" />
            <span className="text-black">
              {currentCoupon ? currentCoupon.label : "Chọn mã giảm giá từ danh sách"}
            </span>
          </div>

          <div className="space-y-3 text-sm pt-4">
            <div className="flex justify-between"><span>Số lượng sản phẩm</span><span>01</span></div>
            <div className="flex justify-between"><span>Tổng tiền hàng</span><span>1.590.000đ</span></div>
            <div className="flex justify-between"><span>Phí vận chuyển</span><span>Miễn phí</span></div>
            <div className="flex justify-between text-red-500"><span>Giảm giá trực tiếp</span><span>-1.113.000đ</span></div>
            <div className="flex justify-between font-semibold pt-2"><span>Tổng tiền</span><span className="text-red-500">467.000đ</span></div>
            <p className="text-gray-400 text-xs">Đã gồm VAT và được làm tròn</p>
          </div>
        </div>

        <h3 className="text-base font-medium text-gray-600">THÔNG TIN THANH TOÁN</h3>
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
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

        <h3 className="text-base font-medium text-gray-600">THÔNG TIN NHẬN HÀNG</h3>
        <div className="bg-white p-4 rounded-xl shadow space-y-5">
          <div className="space-y-3 text-sm">
            {shippingInfo.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-500">{item.label}:</span>
                <span className="text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <div className="flex justify-between font-semibold text-base">
            <span>Tổng tiền tạm tính:</span>
            <span className="text-red-500">467.000đ</span>
          </div>
          <button className="w-full bg-blue-950 text-white py-2 rounded-xl text-base hover:bg-blue-900">
            Thanh toán
          </button>
          <p className="text-center text-xs text-blue-600 cursor-pointer hover:underline">Kiểm tra danh sách sản phẩm (1)</p>
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
              className={`flex items-center space-x-3 p-2 border rounded cursor-pointer hover:border-blue-500 ${
                selectedTempMethod === method.id ? "border-blue-500" : "border-gray-200"
              }`}
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
        footer={[
          <Button key="cancel" onClick={() => setIsCouponModalOpen(false)}>Hủy</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmCoupon} disabled={!selectedTempCoupon}>Xác nhận</Button>,
        ]}
      >
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => setSelectedTempCoupon(coupon.id)}
              className={`flex items-center space-x-3 p-2 border rounded cursor-pointer hover:border-blue-500 ${
                selectedTempCoupon === coupon.id ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <img src={coupon.icon} alt={coupon.label} className="w-8 h-8" />
              <span>{coupon.label}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Thanhtoan;
