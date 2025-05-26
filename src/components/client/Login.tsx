import React from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const Login = ({ isOpen, onClose, switchToRegister }: any) => {
  if (!isOpen) return null;
  if (!switchToRegister) return null;
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className=" fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center z-50 transition-all duration-300"
      onClick={handleOverlayClick}
    >
      <div className="flex flex-col lg:flex-row max-w-5xl mx-auto rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Left */}
        <div className="w-[50%] p-8 flex flex-col pt-[90px]">
          <h2 className="text-3xl font-bold mb-4 text-[#01225a]">Welcome Back!</h2>
          <p className="mb-6 text-[16px] text-[#01225a]">
            Log in to continue shopping and enjoy exclusive benefits.
          </p>
          <img
            src="/images/bangiay1.png"
            alt="Shoe"
            className="w-[900px] mt-[10px] mx-auto hover:scale-[1.1] transition-all duration-300"
          />
        </div>

        {/* Right */}
        <div className="lg:w-1/2 p-8 bg-white">
          <h3 className="text-2xl font-semibold text-[#01225a] mb-6 text-center">
            Login to Your Account
          </h3>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            onClose(); // Đóng sau khi submit login
          }}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-[4px] focus:outline-1 focus:border-blue-700 outline-none text-[15px]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-[4px] focus:outline-1 focus:border-blue-700 outline-none text-[15px]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-[25px] bg-[#01225a] !text-white z-20 text-[15px] py-2.5 rounded-[4px] font-semibold hover:bg-blue-900 cursor-pointer transition"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Or continue with</span>
          </div>

          <div className="flex justify-center gap-4 [&_button]:cursor-pointer [&_button]:text-shadow-amber-50 [&_button]:text-white">
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
              <FaGoogle />
              Google
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <FaFacebookF />
              Facebook
            </button>
          </div>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <button 
              onClick={switchToRegister}
              className="text-blue-700 hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
