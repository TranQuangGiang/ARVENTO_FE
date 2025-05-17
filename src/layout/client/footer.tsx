import React from 'react'
import { faFacebook, faTwitter, faInstagram, faLinkedin  } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';



const FooterClient = () => {
  return (
    <div className='w-full bg-[#01225a] h-[450px]'>
        <div className='w-[89%] mx-auto pt-[30px] flex justify-between'>
            <section className='footer-logo w-[410px] flex flex-col '>
                <img className='w-[200px]' src="/logo1.png" alt="" />
                <p className='w-[395px] pl-[30px] text-[15px] font-sans text-white'>
                    ARVENTO được định hướng trở thành hệ thống thương mại điện tử bán giày chính hãng hàng đầu Việt Nam.
                </p>
                <span className='icon-footer mt-[20px] pl-[30px] flex gap-8 group '>
                    <FontAwesomeIcon className='text-[20px] text-white transition-all duration-300 hover:scale-[1.1] cursor-pointer' icon={faFacebook} />
                    <FontAwesomeIcon className='text-[20px] text-white transition-all duration-300 hover:scale-[1.1] cursor-pointer' icon={faTwitter} />
                    <FontAwesomeIcon className='text-[20px] text-white transition-all duration-300 hover:scale-[1.1] cursor-pointer' icon={faInstagram} />
                    <FontAwesomeIcon className='text-[20px] text-white transition-all duration-300 hover:scale-[1.1] cursor-pointer' icon={faLinkedin} />
                </span>
            </section>
            <section className='mt-[15px] [&_ul]:mt-[10px]'>
                <h3 className='font-semibold text-[18px] text-white font-sans'>Về chúng tôi</h3>
                <ul className='[&_li]:pt-[10px] [&_li]:text-white [&_li]:font-sans [&_li]:text-[15px]'>
                    <li>Giới thiệu</li>
                    <li>Điều khoản sử dụng</li>
                    <li>Chính sách bảo mật</li>
                    <li>Tin tức</li>
                </ul>
            </section>
            <section className='mt-[15px] [&_ul]:mt-[10px]'>
                <h3 className='font-semibold text-[18px] text-white font-sans'>Khách hàng</h3>
                <ul className='[&_li]:pt-[10px] [&_li]:text-white [&_li]:font-sans [&_li]:text-[15px]'>
                    <li>Hướng dẫn mua hàng</li>
                    <li>Chính sách mua hàng</li>
                    <li>Chính sách đổi trả</li>
                    <li>Hướng dẫn chọn size</li>
                    <li>Khách hàng thân thiết</li>
                    <li>Chương trình khuyết mãi</li>
                </ul>
            </section>
            <section className='mt-[15px] [&_ul]:mt-[10px]'>
                <h3 className='font-semibold text-[18px] text-white font-sans'>Liên hệ</h3>
                <ul className='[&_li]:flex [&_li]:items-center [&_li]:text-white [&_li]:font-sans [&_li]:text-[15px] [&_li]:pt-[10px]'>
                    <li><FontAwesomeIcon className='pr-[5px] text-[15px]' icon={faLocationDot}/> <address>102 Trần Phú Hà Đông</address></li>
                    <li><FontAwesomeIcon className='pr-[5px] text-[15px]' icon={faPhone}/> <span>(+84) 0348892533</span></li>
                    <li><FontAwesomeIcon className='pr-[5px] text-[15px]' icon={faEnvelope}/> <span>arvento.vn@gmail.com</span></li>
                </ul>
            </section>
        </div>
    </div>
  )
}

export default FooterClient