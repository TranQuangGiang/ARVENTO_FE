import { LayoutDashboard, Users, Package, Heart, ShoppingBag, FileText, Clock, Settings, MessageCircle, File, ChevronUp, ChevronDown, ChartBarStacked, MessageCircleHeart, Images, ChartNoAxesCombined } from 'lucide-react';
import React from 'react'
import { useState } from "react";
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
    const [openCategory, setOpenCategory] = useState(false);
    const [openProducts, setOpenProducts] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openComment, setOpenComment] = useState(false);
     return (
        <div className='w-full bg-white h-screen border-r-[#E0E4ED] border-r overflow-y-auto 
            [scrollbar-width:none]'
        >
            <span className='logo w-full h-[80px] [&_img]:object-cover'>
                <img className='ml-[0px] cursor-pointer mt-[10px]' src="/logo.png" alt="" />
            </span>
            <div className="w-[100%] mx-auto min-h-screen bg-white shadow-lg pl-4 pt-6 ">   
                <ul className="space-y-1.5">    
                    <li>
                        <Link to={`/dashboard`}>
                        <a
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all font-sans text-[17px] leading-[1.6]
                                bg-[#FEE2E2] text-red-500
                            "
                            href="#"
                        >
                        <LayoutDashboard className='text-[#555] mr-[10px] text-red-500 group-hover:text-red-500 transition-all duration-300' size={23} /> Dashboard
                        </a>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/dashboard`}>
                        <a
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all font-sans text-[17px] leading-[1.6]"
                            href="#"
                        >
                        <Users className='text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300' size={23} /> Vendors
                        </a>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => setOpenCategory(!openCategory)}
                            className="flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all duration-300 font-sans text-[17px] leading-[1.6]"
                        >
                            <span className='flex items-center '><ChartBarStacked className='mr-[15px] text-[#555] group-hover:text-red-500 transition-all duration-300' /> Category</span>
                            <span>{openCategory ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openCategory && (
                            <ul className="ml-10 p-2 ">
                                <li>
                                    <Link to={`listProduct`}>
                                    <a
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    href="#"
                                    >
                                    Category List
                                    </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`listProduct`}>
                                    <a
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    href="#"
                                    >
                                    Category Create
                                    </a>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <button
                            onClick={() => setOpenProducts(!openProducts)}
                            className="flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all duration-300 font-sans text-[17px] leading-[1.6]"
                        >
                            <span className='flex items-center '><Package className='mr-[15px] text-[#555] group-hover:text-red-500 transition-all duration-300'  /> Products</span>
                            <span>{openProducts ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openProducts && (
                            <ul className="ml-10 p-2 ">
                                <li>
                                    <Link to={`listProduct`}>
                                    <a
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    href="#"
                                    >
                                    Product List
                                    </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`listProduct`}>
                                    <a
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    href="#"
                                    >
                                    Product Create
                                    </a>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>   
                    <li>
                        <Link to={`/dashboard`}>
                        <a
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all font-sans text-[17px] leading-[1.6]"
                            href="#"
                        >
                        <Heart className='text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300' size={23} /> Wishlist
                        </a>
                        </Link>
                    </li>                 
                    <li>
                        <button
                            onClick={() => setOpenCart(!openCart)}
                            className="flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all duration-300 font-sans text-[17px] leading-[1.6]"
                        >
                            <span className='flex items-center '><ShoppingBag className='mr-[15px] text-[#555] group-hover:text-red-500 transition-all duration-300'  /> Cart</span>
                            <span>{openCart ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openCart && (
                            <ul className="ml-10 mt-[0px] p-2">
                                <li>
                                    <Link to={`listProduct`}>
                                    <a
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    href="#"
                                    >
                                    Order List
                                    </a>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <button
                            onClick={() => setOpenComment(!openComment)}
                            className="flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all duration-300 font-sans text-[17px] leading-[1.6]"
                        >
                            <span className='flex items-center '><MessageCircleHeart className='mr-[15px] text-[#555] group-hover:text-red-500 transition-all duration-300'  /> Comment</span>
                            <span>{openComment ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openComment && (
                            <ul className="ml-10 mt-[0px] p-2">
                                <li>
                                    <Link to={`listProduct`}>
                                    <a
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    href="#"
                                    >
                                    Comment List
                                    </a>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li> 
                    <li>
                        <Link to={`/dashboard`}>
                        <a
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all font-sans text-[17px] leading-[1.6]"
                            href="#"
                        >
                        <Images className='text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300' size={23} /> Banner
                        </a>
                        </Link>
                    </li> 
                    <li>
                        <Link to={`/dashboard`}>
                        <a
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] rounded-tr-none rounded-br-none transition-all font-sans text-[17px] leading-[1.6]"
                            href="#"
                        >
                        <ChartNoAxesCombined className='text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300' size={23} /> Statistics
                        </a>
                        </Link>
                    </li> 
                </ul>
            </div>
        </div>
  )
}

export default AdminSidebar