import React from "react";

const Register = ({  isOpen, onClose, switchToLogin }: any ) => {
  if (!isOpen) return null;
  if (!switchToLogin) return null;
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
     
    }
    
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center z-50"
        onClick={handleOverlayClick}
      >
        <div className="flex flex-col lg:flex-row max-w-5xl h-[507px] mx-auto rounded-2xl shadow-lg overflow-hidden bg-white">
          <div className="w-[50%] text-white lg:w-1/2 p-8 flex flex-col justify-center pt-[15px]">
            <h2 className="text-3xl font-bold mb-4 text-[#01225a]">Welcome to NIKA</h2>
            <p className="mb-6 text-[16px] text-[#01225a]">
              Create an account to enjoy seamless shopping and exciting offers!
            </p>
            <img
              src="/images/bangiay1.png"
              alt="Shoe"
              className="w-[800px] mx-auto"
            />
          </div>

          <div className="lg:w-1/2 p-8 bg-white">
            <h3 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
              Create Your Account
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-[4px] focus:outline-1 focus:border-blue-700 outline-none text-[15px]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
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
                className="w-full bg-[#01225a] mt-[25px] !text-white py-2.5 rounded-[4px] font-semibold hover:bg-blue-800 cursor-pointer transition-all duration-200"
              >
                Register
              </button>
            </form>

            <p className="text-sm text-center mt-[25px] text-gray-600">
              Already have an account?{" "}
              <button 
                onClick={switchToLogin}
                className="text-blue-700 hover:underline cursor-pointer"
              >
                Log in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
