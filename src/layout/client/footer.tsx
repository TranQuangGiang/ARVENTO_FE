import React from 'react'
import { faFacebook, faTwitter, faInstagram, faLinkedin  } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';



const FooterClient = () => {
  return (
    <div className='w-full bg-[#01225a] h-[450px]'>
        <div className='w-[89%] mx-auto pt-[20px] flex justify-between'>
            <section className='footer-logo w-[410px] flex flex-col '>
                <img className='w-[200px]' src="/logo1.png" alt="" />
                <p className='w-[395px] pl-[30px] text-[15px] font-sans text-white'>
                    ARVENTO được định hướng trở thành hệ thống thương mại điện tử bán giày chính hãng hàng đầu Việt Nam.
                </p>
                <span className='icon-footer mt-[20px] pl-[30px] flex gap-8'>
                    <FontAwesomeIcon className='text-[20px] text-white' icon={faFacebook} />
                    <FontAwesomeIcon className='text-[20px] text-white' icon={faTwitter} />
                    <FontAwesomeIcon className='text-[20px] text-white' icon={faInstagram} />
                    <FontAwesomeIcon className='text-[20px] text-white' icon={faLinkedin} />
                </span>
            </section>
            <section className='mt-[15px] [&_ul]:mt-[10px]'>
                <h3 className='font-semibold text-[18px]'>Về chúng tôi</h3>
                <ul className='[&_li]:pt-[10px]'>
                    <li>Giới thiệu</li>
                    <li>Điều khoản sử dụng</li>
                    <li>Chính sách bảo mật</li>
                    <li>Tin tức</li>
                </ul>
            </section>
            <section className=''>
                <h3>Khách hàng</h3>
                <ul>
                    <li>Hướng dẫn mua hàng</li>
                    <li>Chính sách mua hàng</li>
                    <li>Chính sách đổi trả</li>
                    <li>Hướng dẫn chọn size</li>
                    <li>Khách hàng thân thiết</li>
                    <li>Chương trình khuyết mãi</li>
                </ul>
            </section>
            <section className=''>
                <h3>Liên hệ</h3>
                <ul>
                    <li><FontAwesomeIcon icon={faLocationDot}/> <address></address></li>
                    <li><FontAwesomeIcon icon={faPhone}/> <span></span></li>
                    <li><FontAwesomeIcon icon={faEnvelope}/> <span></span></li>
                </ul>
            </section>
        </div>
    </div>
  )
}

export default FooterClient