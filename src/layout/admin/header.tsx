import React from 'react';
import { Moon, ChevronDown,Search  , MessageCircle, Bell, Mail } from 'lucide-react';

const HeaderAdmin = () => {
  return (
    <div className="header w-[82%] h-[90px] fixed flex items-center justify-between bg-white border-b border-b-[#E0E4ED] px-10 z-50">
      {/* Search box */}
      <form className="relative w-[350px]">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-[45px] pl-4 pr-10 rounded-md border border-blue-200 bg-[#f3f4f7] text-gray-900 text-sm placeholder:text-gray-500 outline-0"
        />
        <Search
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#01225a] text-[16px]"
        />
      </form>

      {/* Icons + Profile */}
      <div className="flex items-center gap-6">
        < Moon
          size={28}
          className=" text-gray-600 cursor-pointer hover:text-gray-500 transition"
        />
        <div className='relative'>
          <Mail
            size={28}
            className="text-[25px] text-gray-600 cursor-pointer hover:text-gray-500 transition"
          />
          <span className="absolute -top-1 -right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-500 border-2 border-white"></span>
          </span>
        </div>
        <Bell
          size={28}
          className="text-[25px] text-gray-600 cursor-pointer hover:text-gray-500 transition"
        />
        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 transition">
          <img
            src="/pic.png"
            alt="User Avatar"
            className="w-[35px] h-[35px] rounded-full object-cover border border-gray-300"
          />
          <span className="text-black font-medium text-sm flex items-center gap-2">
            Quang Giang
            <ChevronDown className="text-gray-400 text-sm" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
