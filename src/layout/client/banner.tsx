import React, { useEffect } from 'react'
import { faFeather, faShoePrints, faCircleCheck, faCartShopping,faAward,  faHandHoldingDollar  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useList } from '../../hooks/useList';

const BannerClient = () => {

    const { data:bannerClient, refetch } = useList({
        resource: `/banners`
    })
    const bannerData = bannerClient?.data || [];
    console.log(bannerData);
    useEffect(() => {
        refetch();
    }, []);

    const sortedBanners = [...bannerData].sort((a, b) => a?.position - b?.position);
    
    const mainBaner = sortedBanners[0];
    const newBalanceBanner = sortedBanners[3];
    const nikeBanner = sortedBanners[4];
    const adidasBanner = sortedBanners[5];
    return (
        <div className='banner w-full'>
            <section className="relative w-full h-[600px] overflow-hidden">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute w-full h-full object-cover z-0"
                >
                    <source src="/videomp4.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay màu xanh */}
                <div className="absolute w-full h-full bg-[#0b047f]/90 z-10" />

                {/* Nội dung chính */}
                <div className="relative z-20 w-[82%] mx-auto h-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 text-white">
                    {/* Bên trái */}
                    <div className="max-w-xl space-y-4 text-center lg:text-left py-12 lg:py-0">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">XTREMA 3</h1>
                        <h2 className="text-xl sm:text-2xl font-semibold">COMFY AND TRENDY</h2>
                        <p className="text-sm sm:text-base">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus,
                            luctus nec ullamcorper mattis, pulvinar dapibus leo.
                        </p>

                        {/* Giày phụ */}
                        <div className="flex justify-center lg:justify-start gap-4 pt-2">
                            <div className='w-14 h-14 sm:w-16 sm:h-16 group overflow-hidden'>
                                <img src="/img1.png" className="w-full h-full bg-white p-2 hover:scale-110 transition-all duration-300 cursor-pointer" />
                            </div>
                            <div className='w-14 h-14 sm:w-16 sm:h-16 group overflow-hidden'>
                                <img src="/img2.png" className="w-full h-full bg-white p-2 hover:scale-110 transition-all duration-300 cursor-pointer" />
                            </div>
                        </div>

                        {/* Nút */}
                        <div className="pt-4">
                            <button className="px-6 py-2 border border-white hover:bg-white hover:text-blue-900 transition font-semibold tracking-wide">
                                BUY NOW
                            </button>
                        </div>
                    </div>

                    {/* Bên phải - Hình giày */}
                    {
                        mainBaner && (
                            <div className="relative mt-6 lg:mt-0">
                                <img src={mainBaner?.image_url} alt="shoe" className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[580px] xl:w-[620px] z-50 relative mx-auto lg:mx-0" />

                                <div className="absolute top-[0px] left-[30px] sm:left-[60px] md:left-[75px] font-sans text-sm sm:text-base bg-[#a3a1d2] text-[#dbbd4b] font-bold px-3 sm:px-4 py-2 sm:py-3">
                                    <FontAwesomeIcon className='rotate-270' icon={faShoePrints}/> STRONG & TRENDY
                                </div>

                                <div className="absolute bottom-[70px] sm:bottom-[90px] right-[10px] sm:right-[20px] text-blue-900 font-bold font-sans px-3 sm:px-4.5 py-2 sm:py-3.5 shadow-md z-50 bg-gradient-to-r from-[#c9d2f1] via-[#fcefb4] to-[#f7a7a7] text-sm sm:text-base">
                                    <FontAwesomeIcon className='mr-[5px]' icon={faFeather}/> ZUPER LIGHTWEIGHT
                                </div>
                            </div>
                        )
                    }
                    
                </div>

                {/* Trang trí dưới */}
                <div className="w-full md:w-[55%] h-[600px] absolute right-0 top-0 z-10 hidden sm:block clip-diagonal">
                    <img src="/73.jpg" alt="" className='w-full h-full' />
                </div>
            </section>
            <section className='w-full h-[70px] bg-[#ededed]'>
                <div className='w-[60%] h-full mx-auto flex justify-between items-center [&_span]:flex [&_span]:items-center [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans [&_p]:ml-[10px] [&_p]:font-semibold'>
                    <span>
                        <FontAwesomeIcon className='text-[16px] text-[#0b1f4e]' icon={faCircleCheck}/> <p>Original Product</p>
                    </span>
                    <span>
                        <FontAwesomeIcon className='text-[16px] text-[#0b1f4e]' icon={faCartShopping}/> <p>Interesting promo & Deals</p>
                    </span>
                    <span>
                        <FontAwesomeIcon className='text-[16px] text-[#0b1f4e]' icon={faHandHoldingDollar}/> <p> days MOney-back Guarantee</p>
                    </span>
                    <span>
                        <FontAwesomeIcon className='text-[16px] text-[#0b1f4e]' icon={faAward}/> <p>expereinced Seller</p>
                    </span>
                </div>
            </section>
            <section className='w-[76%] mt-[80px] mx-auto flex items-center justify-between'>
                <div className='w-[52%] h-[270px]'>
                    {
                        newBalanceBanner && (
                            <div className='img w-full h-full relative'>
                                <img className='object-cover h-full w-full' src={newBalanceBanner?.image_url} alt="" />
                                <div className='absolute top-0 left-0 w-full h-full'>
                                    <img className='w-full h-full' src="/mo.png" alt="" />
                                </div>
                                <span className='absolute bottom-9 right-9'>
                                    <h3 className='text-white font-sans font-bold text-[25px] uppercase'> {newBalanceBanner?.title}.</h3>
                                    <a href={newBalanceBanner?.link}>
                                        <button className='border-1 w-[130px] h-[45px] border-white text-[13px] text-white font-medium font-sans uppercase mt-[10px] cursor-pointer'>Xem sản phẩm</button>
                                    </a>
                                    
                                </span>
                            </div>
                        )
                    }
                    
                </div>
                <div className='w-[22%] h-[270px]'>
                    {
                        nikeBanner && (
                            <div className='img w-full h-full relative'>
                                <img className='object-cover w-full h-full' src={nikeBanner?.image_url} alt="" />
                                <div className='absolute top-0 left-0 w-full h-full'>
                                    <img className='w-full h-full' src="/mo.png" alt="" />
                                </div>
                                <div className='w-[32%] absolute bottom-0 right-0 z-20'>
                                <p className='w-[100%] h-[150px] bg-[#ff0000] clip-do'></p>
                                </div>
                                <span className='absolute top-7 left-8'>
                                    <h3 className='text-white font-sans font-bold text-[25px] uppercase'>{nikeBanner?.title}</h3>
                                    <a href={nikeBanner?.link}>
                                        <button className='border-1 w-[130px] h-[45px] border-white text-[13px] text-white font-medium font-sans uppercase mt-[10px] cursor-pointer'>Xem sản phẩm</button>
                                    </a>
                                </span>
                            </div>
                        )
                    }
                    
                </div>
                <div className='w-[22%] h-[270px]'>
                    {
                        adidasBanner && (
                            <div className='img w-full h-full relative'>
                                <img className='object-cover h-full w-full' src={adidasBanner?.image_url} alt="" />
                                <div className='absolute top-0 left-0 w-full h-full'>
                                    <img className='w-full h-full' src="/mo.png" alt="" />
                                </div>
                                <div className='w-[32%] absolute bottom-0 right-0 z-20'>
                                    <p className='w-[100%] h-[150px] bg-[#ff0000] clip-do'></p> 
                                </div>
                                <span className='absolute top-7 left-8'>
                                    <h3 className='text-white font-sans font-bold text-[25px] uppercase'>{adidasBanner?.title}</h3>
                                    <a href={adidasBanner?.link}>
                                        <button className='border-1 w-[130px] h-[45px] border-white text-[13px] text-white font-medium font-sans uppercase mt-[10px] cursor-pointer'>Xem sản phẩm</button>
                                    </a>
                                </span>
                            </div>
                        )
                    }
                    
                </div>
            </section>
        </div>
        
    )
}

export default BannerClient
