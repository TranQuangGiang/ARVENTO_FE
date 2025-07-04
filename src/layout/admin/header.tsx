import React from 'react';

import { Moon, ChevronDown,Search,Bell,Mail, UserRound, MessagesSquare, Power, Undo2 } from 'lucide-react';
import { Link } from 'react-router-dom';



const HeaderAdmin = () => {
  return (
    <div className="header w-[82%] h-[90px] fixed flex items-center justify-between bg-white border-b border-b-[#E0E4ED] px-10 z-50">
      {/* Search box */}
      <form className="relative w-[350px]">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-[45px] pl-4 pr-10 rounded-md border border-[#E0E4ED] bg-[#f3f4f7] text-gray-900 text-sm placeholder:text-gray-500 outline-0"
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
        <div className="relative group">
          <div className='flex items-center gap-3 cursor-pointer  px-3 py-2 rounded-md hover:bg-gray-100 transition'>
            <img
              src="/pic.png"
              alt="User Avatar"
              className="w-[40px] h-[40x] rounded-full object-cover border border-gray-300"
            />
            <span className="text-black font-medium text-[16px] flex items-center gap-2">
              Quang Giang
              <ChevronDown className="text-gray-400 text-sm" />
            </span>
          </div>
          <div className='w-[220px] z-50 absolute transition-all duration-300 -left-[135px] opacity-0 invisible top-[75px] shadow-lg group-hover:opacity-100 group-hover:visible group-hover:-translate-y-2.5 '>
            <div className="absolute top-[12px] right-6 -translate-x-1/2 z-0 -translate-y-full w-[26px] h-[26px] bg-white rotate-45 border border-gray-200"></div>
            <ul className='relative flex z-20 flex-col border bg-white border-[#E0E4ED] rounded-[6px] [&_a]:text-[17px] [&_a]:font-sans [&_a]:text-[#01225a] [&_a]:cursor-pointer [&_a]:pl-[10px]'>
              <li className='px-2 py-4 pl-[30px] border-b border-b-[#E0E4ED] font-semibold text-[20px] font-sans'>
                My Profile
              </li>
              <li>
                <span className='flex items-center pl-[25px] px-2 py-4 text-left '>
                  <span className='w-[35px] flex items-center justify-center h-[35px] bg-red-200 rounded-[50%]'>
                    <UserRound className='w-[20px] text-red-600' />
                  </span>
                  <a className='transition-all duration-300 hover:text-red-600'>My Profile</a>
                </span> 
              </li>
              <li>
                <span className='flex items-center pl-[25px] px-2 py-4 text-left'>
                  <span className='w-[35px] flex items-center justify-center h-[35px] bg-red-200 rounded-[50%]'>
                    <MessagesSquare  className='w-[20px] text-red-600' />
                  </span>
                  <a className='transition-all duration-300 hover:text-red-600'>Message</a>
                </span> 
              </li>
              <li>
                <span className='flex items-center pl-[25px] px-2 py-4 text-left'>
                  <span className='w-[35px] flex items-center justify-center h-[35px] bg-red-200 rounded-[50%]'>
                    <Power className='w-[20px] text-red-600' />
                  </span>
                  <a className='transition-all duration-300 hover:text-red-600'>Log Out</a>
                </span> 
              </li>
              <li>
                <Link
                  to="/"
                  className='flex items-center ml-[17px] gap-2 py-4 text-left transition-all duration-300 hover:text-red-600'
                >
                  <span className='w-[35px] flex items-center justify-center h-[35px] bg-red-200 rounded-[50%]'>
                    <Undo2 className='w-[20px] text-red-600' />
                  </span>
                  Back To Website
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
