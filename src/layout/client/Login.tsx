import React from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const Login = () => {
  return (
    <>
      <div className="w-full h-64 md:h-80 relative">
        <img
          src="/images/baner.jpg"
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">LOGIN</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto my-10  rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-00 text-white lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Welcome Back!</h2>
          <p className="mb-6 text-lg text-blue-900">
            Log in to continue shopping and enjoy exclusive benefits.
          </p>
          <img
            src="/images/bangiay1.png"
            alt="Shoe"
            className="w-[800px] mx-auto"
          />
        </div>

        <div className="lg:w-1/2 p-8 bg-white">
          <h3 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
            Login to Your Account
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
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
              Login
            </button>
          </form>

          <div className="my-6 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Or continue with</span>
          </div>

          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
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
            <a href="/register" className="text-blue-700 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
