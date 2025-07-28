import React from 'react'
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const FooterClient = () => {
  return (
    <div className='w-full bg-[#01225a] h-[400px]'>
      <div className='w-[87%] mx-auto pt-[20px] flex justify-between'>
        <section className='footer-logo w-[310px] flex flex-col '>
          <img className='w-[200px]' src="/logo1.png" alt="logo" />
          <p className='w-[355px] pl-[26px] text-[15px] font-sans text-white'>
            ARVENTO is oriented to become the leading e-commerce platform for selling authentic shoes in Vietnam.
          </p>
          <span className='icon-footer mt-[20px] pl-[30px] flex gap-8'>
            <FontAwesomeIcon className='text-[20px] text-white hover:scale-[1.1] transition-all duration-300 cursor-pointer' icon={faFacebook} />
            <FontAwesomeIcon className='text-[20px] text-white hover:scale-[1.1] transition-all duration-300 cursor-pointer' icon={faTwitter} />
            <FontAwesomeIcon className='text-[20px] text-white hover:scale-[1.1] transition-all duration-300 cursor-pointer' icon={faInstagram} />
            <FontAwesomeIcon className='text-[20px] text-white hover:scale-[1.1] transition-all duration-300 cursor-pointer' icon={faLinkedin} />
          </span>
        </section>

        <section className=' mt-[15px] [&_ul]:mt-[10px] [&_h3]:text-white'>
          <h3 className='font-semibold text-[18px]'>About Us</h3>
          <ul className='[&_li]:pt-[10px] [&_li]:text-[14px] [&_li]:text-white'>
            <a href="/gioithieu">
              <li>Introduction</li>
            </a>
            <a href="/dieukhoan">
              <li>Terms of Use</li>
            </a>
            <a href="/chinhsach">
              <li>Privacy Policy</li>
            </a>
            <li>News</li>
          </ul>
        </section>

        <section className='mt-[15px] [&_ul]:mt-[10px] [&_h3]:text-white'>
          <h3 className='font-semibold text-[18px]'>Customer</h3>
          <ul className='[&_li]:text-white [&_li]:pt-[10px] [&_li]:text-[14px]'>
            <a href="/hdmh">
              <li>Shopping Guide</li>
            </a>
            <a href="/chinhsachmuahang">
              <li>Purchase Policy</li>
            </a>
            <a href="/chinhsachdoitra">
              <li>Return Policy</li>
            </a>
            <a href="/huongdanchonsize">
              <li>Size Guide</li>
            </a>
            <li>Loyal Customers</li>
            <a href="/khuyenmai">
              <li>Promotional Program</li>
            </a>
          </ul>
        </section>

        <section className='mt-[15px] [&_ul]:mt-[10px] [&_h3]:text-white'>
          <h3 className='font-semibold text-[18px]'>Contact</h3>
          <ul className='[&_li]:text-white [&_li]:pt-[10px] [&_li]:text-[14px]'>
            <li className='flex items-center'><FontAwesomeIcon className='font-semibold text-red-600 text-[15px] mr-[5px]' icon={faLocationDot} /> <address>102 Tran Phu, Ha Dong</address></li>
            <li><FontAwesomeIcon className='font-semibold text-red-600 text-[15px] mr-[5px]' icon={faPhone} /> <span>0348892533</span></li>
            <li><FontAwesomeIcon className='font-semibold text-red-600 text-[15px] mr-[5px]' icon={faEnvelope} /> <span>arvento@gmail.com</span></li>
          </ul>
        </section>
      </div>

      <div className='w-[86%] mx-auto border-t-[1px] border-[#fff] mt-[50px] flex items-center'>
        <section className='w-full h-[90px] flex items-center justify-between [&_p]:text-[15px] [&_p]:text-white [&_p]:font-sans'>
          <p>
            Sneaker Store Template Kit by Jegtheme
          </p>
          <p>
            Copyright © 2025. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  )
}

export default FooterClient
