import React from 'react'
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const FooterClient = () => {
  return (
    <div className='w-full bg-[#01225a] h-[400px]'>
      <div className='w-[87%] mx-auto pt-[20px] flex justify-between'>
        <section className='footer-logo w-[310px] flex flex-col '>
          <img className='w-[200px]' src="/logo1.png" alt="logo" />
          <p className='w-[365px] pl-[26px] text-[15px] font-sans text-white'>
            ARVENTO hướng tới mục tiêu trở thành nền tảng thương mại điện tử hàng đầu bán giày dép chính hãng tại Việt Nam.
          </p>
          <span className='icon-footer mt-[20px] pl-[30px] flex gap-8'>
            <FontAwesomeIcon className='text-[20px] text-white hover:scale-[1.1] transition-all duration-300 cursor-pointer' icon={faFacebook} />
            <FontAwesomeIcon className='text-[20px] text-white hover:scale-[1.1] transition-all duration-300 cursor-pointer' icon={faTwitter} />
            <FontAwesomeIcon className='text-[20px] text-white hover:scale-[1.1] transition-all duration-300 cursor-pointer' icon={faInstagram} />
            <FontAwesomeIcon className='text-[20px] text-white hover:scale-[1.1] transition-all duration-300 cursor-pointer' icon={faLinkedin} />
          </span>
        </section>

        <section className=' mt-[15px] [&_ul]:mt-[10px] [&_h3]:text-white'>
          <h3 className='font-semibold text-[18px]'>Về chúng tôi</h3>
          <ul className='[&_li]:pt-[10px] [&_li]:text-[14px] [&_li]:text-white'>
            <Link to={`/gioithieu`}>
              <li>Giới thiệu</li>
            </Link>
            <Link to={`/gioithieu`}>
              <li>Điều khoản</li>
            </Link>
            <Link to={`/gioithieu`}>
              <li>Chính sách</li>
            </Link>
            <Link to={`/gioithieu`}>
              <li>Tin tức</li>
            </Link>
          </ul>
        </section>

        <section className='mt-[15px] [&_ul]:mt-[10px] [&_h3]:text-white'>
          <h3 className='font-semibold text-[18px]'>Khách hàng</h3>
          <ul className='[&_li]:text-white [&_li]:pt-[10px] [&_li]:text-[14px]'>
            <Link to={`/gioithieu`}>
              <li>Hướng dẫn mua sắm</li>
            </Link>
            <Link to={`/gioithieu`}>
              <li>Chính sách mua hàng</li>
            </Link>
            <Link to={`/gioithieu`}>
              <li>Chính sách hoàn trả</li>
            </Link>
            <Link to={`/gioithieu`}>
              <li>Hướng dẫn chọn kích thước</li>
            </Link>
            <Link to={`/gioithieu`}>
              <li>Khách hàng thân thiết</li>
            </Link>
            <Link to={`/gioithieu`}>
              <li>Chương trình khuyến mại</li>
            </Link>
          </ul>
        </section>

        <section className='mt-[15px] [&_ul]:mt-[10px] [&_h3]:text-white'>
          <h3 className='font-semibold text-[18px]'>Địa chỉ liên hệ</h3>
          <ul className='[&_li]:text-white [&_li]:pt-[10px] [&_li]:text-[14px]'>
            <li className='flex items-center'><FontAwesomeIcon className='font-semibold text-red-600 text-[15px] mr-[5px]' icon={faLocationDot} /> <address>Đường Vạn Phúc, Làng Vạn Phúc, TP Hà Nội</address></li>
            <li><FontAwesomeIcon className='font-semibold text-red-600 text-[15px] mr-[5px]' icon={faPhone} /> <span>0961918362</span></li>
            <li><FontAwesomeIcon className='font-semibold text-red-600 text-[15px] mr-[5px]' icon={faEnvelope} /> <span>arvento@gmail.com</span></li>
          </ul>
        </section>
      </div>

      <div className='w-[86%] mx-auto border-t-[1px] border-[#fff] mt-[50px] flex items-center'>
        <section className='w-full h-[90px] flex items-center justify-between [&_p]:text-[15px] [&_p]:text-white [&_p]:font-sans'>
          <p>
            Bộ mẫu cửa hàng giày thể thao của Jegtheme
          </p>
          <p>
            Bản quyền © 2025. Bảo lưu mọi quyền.
          </p>
        </section>
      </div>
    </div>
  )
}

export default FooterClient
