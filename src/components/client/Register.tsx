import React from "react";

const Register = () => {
  return (
    <>
      <div className="w-full h-64 md:h-80 relative">
        <img
          src="/images/baner.jpg"
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">REGISTER</h1>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto my-10  rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-00 text-white lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Welcome to NIKA</h2>
          <p className="mb-6 text-lg text-blue-900">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-700 hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
