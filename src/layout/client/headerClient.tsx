import React, { useState } from 'react';
import { faMagnifyingGlass, faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BannerClient from './banner';

const HeaderClient = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div>
      <div className='header w-[85%] mx-auto h-[80px] bg-white flex items-center justify-around'>
        {/* Logo */}
        <section className='header-logo [&_img]:w-[200px] [&_img]:cursor-pointer'>
          <img src="logo.png" alt="logo" />
        </section>

        {/* Menu + Search */}
        <section className='header-menu flex items-center gap-5'>
          {/* Menu */}
          <nav className='flex gap-6 transition-all duration-300 [&_a]:text-[#0b1f4e]'>
            <a href="">Trang chủ</a>
            <a href="">Sản phẩm</a>
            <a href="">Tin tức</a>
            <a href="">Pages</a>
            <a href="">Liên hệ</a>
          </nav>

          {/* Search Section */}
          <div className='relative flex items-center ml-5'>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              className={`h-[35px] pr-10 pl-3 border border-[#0b1f4e] rounded text-black transition-all duration-300 outline-0 ${
                searchOpen ? 'w-[350px]' : 'w-0 px-0 border-0'
              }`}
              style={{ overflow: 'hidden' }}
            />
            {/* Icon luôn hiển thị */}
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute text-[18px] right-3 font-extrabold text-black cursor-pointer"
              onClick={() => setSearchOpen(prev => !prev)}
            />
          </div>
        </section>

        {/* Icons */}
        <section className='header-person flex gap-4'>
          <FontAwesomeIcon className='text-[18px]' icon={faUser} />
          <FontAwesomeIcon className='text-[18px] pl-[10px]' icon={faCartShopping} />
        </section>
      </div>
      <BannerClient />
    </div>
  );
};

export default HeaderClient;
