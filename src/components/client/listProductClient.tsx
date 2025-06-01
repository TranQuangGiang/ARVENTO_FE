import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ListProductClient = () => {
  return (
    <main>
        <div className='list-product w-[74%] mx-auto mt-[100px] mb-[40px] flex items-center justify-center gap-[21px]'>
            <div className='list-product-one w-[220px] h-[300px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                <img  className='w-[120px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                <div className='content w-[75%] mt-[20px]'>
                    <h4 className='w-full text-[16px] font-semibold text-black'>Fillo – Xtrema 3 Retro</h4>
                    <p className='pt-[4px] font-sans font-semibold text-[#0b1f4e] text-[15px]'>20.00 $</p>
                </div>
                <div className='mt-[10px] text-[13px] uppercase font-sans w-[75%] mx-auto border-b-1 '>
                    <p>Select options</p>
                </div>
            </div>
            <div className='list-product-one w-[220px] h-[300px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                <img  className='w-[120px] transition-all duration-300 group-hover:scale-[1.1]' src="http://localhost:3000/uploads/banners/banner-1748707980630-312531873.jpg" alt="" />
                <div className='content w-[75%] mt-[20px]'>
                    <h4 className='w-full text-[16px] font-semibold text-black'>Fillo – Xtrema 3 Retro</h4>
                    <p className='pt-[4px] font-sans font-semibold text-[#0b1f4e] text-[15px]'>20.00 $</p>
                </div>
                <div className='mt-[10px] text-[13px] uppercase font-sans w-[75%] mx-auto border-b-1 '>
                    <p>Select options</p>
                </div>
            </div>
            <div className='list-product-one w-[220px] h-[300px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                <img  className='w-[120px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                <div className='content w-[75%] mt-[20px]'>
                    <h4 className='w-full text-[16px] font-semibold text-black'>Fillo – Xtrema 3 Retro</h4>
                    <p className='pt-[4px] font-sans font-semibold text-[#0b1f4e] text-[15px]'>20.00 $</p>
                </div>
                <div className='mt-[10px] text-[13px] uppercase font-sans w-[75%] mx-auto border-b-1 '>
                    <p>Select options</p>
                </div>
            </div>
            <div className='list-product-one w-[220px] h-[300px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                <img  className='w-[120px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                <div className='content w-[75%] mt-[20px]'>
                    <h4 className='w-full text-[16px] font-semibold text-black'>Fillo – Xtrema 3 Retro</h4>
                    <p className='pt-[4px] font-sans font-semibold text-[#0b1f4e] text-[15px]'>20.00 $</p>
                </div>
                <div className='mt-[10px] text-[13px] uppercase font-sans w-[75%] mx-auto border-b-1 '>
                    <p>Select options</p>
                </div>
            </div>
            <div className='w-[285px] relative h-[300px] bg-[#0b1f4e] flex flex-col gap-3'>
                <div className='pt-[35px] pl-[30px]'>
                    <h3 className='text-[20px] text-white font-sans font-bold uppercase'>Hot Product.</h3>
                    <p className='text-[13px] text-white w-[80%] gap-1'>Lorem ipsum dolor sit amet, 
                        consectetur adipiscing elit. 
                        Ut elit tellus, luctus nec 
                        ullamcorper mattis, pulvinar 
                        dapibus leo.
                    </p>
                    <button className='mt-[10px] w-[140px] h-[45px] text-[#fff] text-[14px] font-sans border border-[#fff] transition-all cursor-pointer duration-300 hover:bg-white hover:text-black uppercase'>See more <FontAwesomeIcon icon={faArrowRight}/></button>
                </div>
                <div className='w-[35%] absolute bottom-0 right-0 z-20'>
                    <p className='w-[100%] h-[150px] bg-[#ff0000] clip-do'></p>
                </div>
            </div>
        </div>
        <div className='list-danhmuc w-full mt-[70px] h-[100px] '>
            <ul className='flex h-full items-center w-[60%] mx-auto justify-between [&_li]:text-[28px] [&_li]:font-sans [&_li]:font-bold [&_li]:italic [&_li]:text-[#AAAAAA] group'>
                <li className='hover:text-black transition-all duration-300'>
                    <Link to={''}>NIKE</Link>
                </li>
                <li className='hover:text-black transition-all duration-300'>
                    <Link to={''}>ADIDAS</Link>
                </li>
                <li className='hover:text-black transition-all duration-300'>
                    <Link to={''}>PUMA</Link>
                </li>
                <li className='hover:text-black transition-all duration-300'>
                    <Link to={''}>ADHIDA</Link>
                </li>
            </ul>
        </div>
        <div className='banner w-full h-[350px] mt-[10px] mb-[60px] overflow-hidden'>
            <div className='w-[1800px] h-full relative overflow-hidden'>
                <img className='absolute object-cover w-[1800px] -top-[250px] ' src="/healthy.jpg" alt="" />
                <div className='content w-[30%]  absolute top-[55px] left-[290px]'>
                    <h3 className='text-white font-sans font-bold text-[36px] leading-11 uppercase'>Makes Yourself Keep SPorty & Stylish</h3>
                    <p className='text-white text-[14px] font-medium mt-[20px] font-sans'>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. 
                        Aenean commodo ligula eget dolor. Aenean massa. 
                        Cum sociis natoque penatibus et magnis dis 
                        parturient montes, nascetur ridiculus mus.
                    </p>
                    <button className='text-white mt-[20px] w-[140px] uppercase font-sans text-[14px] h-[50px] border border-[#fff] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'>Show now</button>
                </div>
            </div>
        </div>
        <div className='list-product w-[74%] mx-auto mt-[120px] mb-[40px] flex items-center justify-center'>
            <div className='w-[265px] relative h-[340px] flex items-center justify-center bg-[#ef5d5d] '>
                <img className='w-full h-[340px] absolute right-0 top-0 bottom-0 clip-diagonal-2' src="/73.jpg" alt="" />
                <div className='w-[80%] h-[80%] bg-[#ededed]/80 absolute mx-auto z-30 [&_img]:w-[150px] flex flex-col items-center justify-center group'>
                    <img className='transition-all duration-300 group-hover:scale-[1.1]' src="/img1.png" alt="" />
                    <div className='content mt-0 w-[80%] mx-auto'>
                        <h3 className='font-sans font-bold text-[19px] uppercase'>Fillo - Xtrema 3 Edition</h3>
                        <p className='text-[13px] mt-[10px] cursor-pointer font-light font-sans text-[#0b1f4e] uppercase'>See more <FontAwesomeIcon className=' text-[12px] font-light' icon={faArrowRight}/></p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col pl-[20px] relative'>
                <div className='flex items-center justify-between absolute -top-[10px]'>
                    <h3 className='text-[22px] font-sans font-bold uppercase'>FILLO Special Edition</h3>
                    <span className='ml-[10px] mr-[10px] w-[500px] h-[1px] border border-[#ededed]'></span>
                    <p className='text-[13px] ml-[3px] cursor-pointer font-light font-sans text-black uppercase'>See more <FontAwesomeIcon className='font-light text-[12px] ' icon={faArrowRight}/></p>
                </div>
                <div className='list-product w-[840px] flex items-center justify-between gap-[21px] mt-[40px]'>
                    <div className='list-product-one w-[220px] h-[300px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                        <img  className='w-[120px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                        <div className='content w-[75%] mt-[20px]'>
                            <h4 className='w-full text-[16px] font-semibold text-black'>Fillo – Xtrema 3 Retro</h4>
                            <p className='pt-[4px] font-sans font-semibold text-[#0b1f4e] text-[15px]'>20.00 $</p>
                        </div>
                        <div className='mt-[10px] text-[13px] uppercase font-sans w-[75%] mx-auto border-b-1 '>
                            <p>Select options</p>
                        </div>
                    </div>
                    <div className='list-product-one w-[220px] h-[300px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                        <img  className='w-[120px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                        <div className='content w-[75%] mt-[20px]'>
                            <h4 className='w-full text-[16px] font-semibold text-black'>Fillo – Xtrema 3 Retro</h4>
                            <p className='pt-[4px] font-sans font-semibold text-[#0b1f4e] text-[15px]'>20.00 $</p>
                        </div>
                        <div className='mt-[10px] text-[13px] uppercase font-sans w-[75%] mx-auto border-b-1 '>
                            <p>Select options</p>
                        </div>
                    </div>
                    <div className='list-product-one w-[220px] h-[300px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                        <img  className='w-[120px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                        <div className='content w-[75%] mt-[20px]'>
                            <h4 className='w-full text-[16px] font-semibold text-black'>Fillo – Xtrema 3 Retro</h4>
                            <p className='pt-[4px] font-sans font-semibold text-[#0b1f4e] text-[15px]'>20.00 $</p>
                        </div>
                        <div className='mt-[10px] text-[13px] uppercase font-sans w-[75%] mx-auto border-b-1 '>
                            <p>Select options</p>
                        </div>
                    </div>
                    <div className='list-product-one w-[220px] h-[300px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                        <img  className='w-[120px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                        <div className='content w-[75%] mt-[20px]'>
                            <h4 className='w-full text-[16px] font-semibold text-black'>Fillo – Xtrema 3 Retro</h4>
                            <p className='pt-[4px] font-sans font-semibold text-[#0b1f4e] text-[15px]'>20.00 $</p>
                        </div>
                        <div className='mt-[10px] text-[13px] uppercase font-sans w-[75%] mx-auto border-b-1 '>
                            <p>Select options</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-[74%] mt-[80px] mx-auto mb-[120px] flex flex-col'>
            <div className='w-[100%] flex items-center justify-between mb-[25px]'>
                <h3 className='text-[25px] font-sans font-bold uppercase'>All Our Product</h3>
                <span className='w-[800px] h-[1px] border border-[#ededed]'></span>
                <p className='text-[15px] cursor-pointer font-light font-sans text-black uppercase'>See more <FontAwesomeIcon className='font-light' icon={faArrowRight}/></p>
            </div>
            <div className='list-product w-full grid grid-cols-4 gap-[26px]'>
                <div className='list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                    <img  className='w-[180px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                    <div className='content w-[80%] pt-[10px]'>
                        <h4 className='w-full text-[15px] font-bold font-sans text-black uppercase'>Fillo – Xtrema 3 Retro</h4>
                        <p className='pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]'>20.00 $</p>
                    </div>
                    <div className='pt-[10px] w-[80%] mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                    </div>
                </div>
                <div className='list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                    <img  className='w-[180px] transition-all duration-300 group-hover:scale-[1.1]' src="/img1.png" alt="" />
                    <div className='content w-[80%] pt-[10px]'>
                        <h4 className='w-full text-[15px] font-bold font-sans text-black uppercase'>Fillo – Xtrema 3 Retro</h4>
                        <p className='pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]'>20.00 $</p>
                    </div>
                    <div className='pt-[10px] w-[80%]  mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                    </div>
                </div>
                <div className='list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                    <img  className='w-[180px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                    <div className='content w-[80%] pt-[10px]'>
                        <h4 className='w-full text-[15px] font-bold font-sans text-black uppercase'>Fillo – Xtrema 3 Retro</h4>
                        <p className='pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]'>20.00 $</p>
                    </div>
                    <div className='pt-[10px] w-[80%]  mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                    </div>
                </div>
                <div className='list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                    <img  className='w-[180px] transition-all duration-300 group-hover:scale-[1.1]' src="/img1.png" alt="" />
                    <div className='content w-[80%] pt-[10px]'>
                        <h4 className='w-full text-[15px] font-bold font-sans text-black uppercase'>Fillo – Xtrema 3 Retro</h4>
                        <p className='pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]'>20.00 $</p>
                    </div>
                    <div className='pt-[10px] w-[80%]  mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                    </div>
                </div>
                <div className='list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                    <img  className='w-[180px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                    <div className='content w-[80%] pt-[10px]'>
                        <h4 className='w-full text-[15px] font-bold font-sans text-black uppercase'>Fillo – Xtrema 3 Retro</h4>
                        <p className='pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]'>20.00 $</p>
                    </div>
                    <div className='pt-[10px] w-[80%]  mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                    </div>
                </div>
                <div className='list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                    <img  className='w-[180px] transition-all duration-300 group-hover:scale-[1.1]' src="/img1.png" alt="" />
                    <div className='content w-[80%] pt-[10px]'>
                        <h4 className='w-full text-[15px] font-bold font-sans text-black uppercase'>Fillo – Xtrema 3 Retro</h4>
                        <p className='pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]'>20.00 $</p>
                    </div>
                    <div className='pt-[10px] w-[80%]  mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                    </div>
                </div>
                <div className='list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                    <img  className='w-[180px] transition-all duration-300 group-hover:scale-[1.1]' src="/img2.png" alt="" />
                    <div className='content w-[80%] pt-[10px]'>
                        <h4 className='w-full text-[15px] font-bold font-sans text-black uppercase'>Fillo – Xtrema 3 Retro</h4>
                        <p className='pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]'>20.00 $</p>
                    </div>
                    <div className='pt-[10px] w-[80%]  mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                    </div>
                </div>
                <div className='list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group'>
                    <img  className='w-[180px] transition-all duration-300 group-hover:scale-[1.1]' src="/img1.png" alt="" />
                    <div className='content w-[80%] pt-[10px]'>
                        <h4 className='w-full text-[15px] font-bold font-sans text-black uppercase'>Fillo – Xtrema 3 Retro</h4>
                        <p className='pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]'>20.00 $</p>
                    </div>
                    <div className='pt-[10px] w-[80%]  mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='list-page w-[74%] mx-auto flex gap-[25px] mb-[120px]'>
            <div className='list-page-1 w-[50%] h-[320px] overflow-hidden relative group'>
                <img className='w-full absolute -top-[280px] transition-all duration-300 group-hover:scale-[1.1]' src="/nu.jpg" alt="" />
                <div className="className='w-full h-full absolute inset-0 bg-black/40"></div>
                <div className='content w-full h-full absolute flex flex-col justify-center items-end text-right top-[30px] right-7'>
                    <h3 className='text-white font-sans uppercase text-[24px] font-bold mb-4'>WOman SNEAKER sale.</h3>
                    <p className="text-white font-sans font-medium text-[14px] mb-5 max-w-[450px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                    </p>
                    <button className="text-white text-[15px] border border-white w-[150px] h-[50px] font-sans font-light hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                        SHOP NOW
                    </button>
                </div>
            </div>
            <div className='list-page-1 w-[50%] h-[320px] overflow-hidden relative group'>
                <img className='w-full transition-all duration-300 group-hover:scale-[1.1]' src="/nam.jpg" alt="" />
                <div className="className='w-full h-full absolute inset-0 bg-black/40"></div>
                <div className='content w-full h-full absolute flex flex-col text-left top-[30px] left-7'>
                    <h3 className='text-white font-sans uppercase text-[26px] font-bold mb-4'>15% Off SPORT SNEAKER.</h3>
                    <p className="text-white font-sans font-medium text-[15px] mb-5 max-w-[450px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                    </p>
                    <button className="text-white border text-[15px] border-white w-[150px] h-[50px] font-sans font-light hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                        SHOP NOW
                    </button>
                </div>
            </div>
        </div>
        <div className='w-full h-[380px] overflow-hidden relative'>
            <img className='w-full h-[960px] absolute -bottom-[300px]' src="/footer.jpg" alt="" />
            <div className='w-full h-full absolute inset-0 bg-black/70 flex flex-col items-center justify-center'>
                <h2 className='text-white font-bold font-sans text-[36px] uppercase w-[560px] text-center leading-9'>SIgn Up NEwsletter & Get 15% Off</h2>
                <form action="" className='flex items-center justify-center mt-[40px]'>
                    <input type="text" className='w-[420px] h-[55px] bg-white text-gray-400 pl-[25px] outline-0' placeholder='Email'/>
                    <button className='h-[56px] ml-[20px] text-white font-sans font-light w-[155px] bg-[#01225a] text-[15px]'><FontAwesomeIcon icon={faPaperPlane}/> Submit</button>
                </form>
            </div>
        </div>
    </main>
  )
}

export default ListProductClient