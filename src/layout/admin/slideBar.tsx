import {
  LayoutDashboard,
  Users,
  Package,
  Heart,
  ShoppingBag,
  ChevronUp,
  ChevronDown,
  ChartBarStacked,
  MessageCircleHeart,
  Images,
  ChartNoAxesCombined,
  LetterText,
  FileText,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import autoAnimate from "@formkit/auto-animate";

const AdminSidebar = () => {
    const categoryRef = useRef(null);
    const productRef = useRef(null);
    const cartRef = useRef(null);
    const commentRef = useRef(null);

    const [openCategory, setOpenCategory] = useState(false);
    const [openProducts, setOpenProducts] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openComment, setOpenComment] = useState(false);

    useEffect(() => {
        categoryRef.current && autoAnimate(categoryRef.current);
        productRef.current && autoAnimate(productRef.current);
        cartRef.current && autoAnimate(cartRef.current);
        commentRef.current && autoAnimate(commentRef.current);

    }, []);
    return (
        <div className="w-[18%] fixed top-0 left-0 bg-white h-screen border-r-[#E0E4ED] border-r overflow-y-auto [scrollbar-width:none]">
            <span className="logo w-full h-[80px] [&_img]:object-cover">
                <img
                className="ml-[0px] cursor-pointer mt-[10px]"
                src="/logo.png"
                alt=""
                />
            </span>
            <div className="w-full mx-auto min-h-screen bg-white shadow-lg pl-4 pt-6">
                <ul className="space-y-1.5">
                    <li>
                        <Link
                        to="/admin"
                        className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] bg-[#FEE2E2] text-red-500"
                        >
                        <LayoutDashboard
                            className="text-red-500 mr-[10px] group-hover:text-red-500 transition-all duration-300"
                            size={23}
                        />
                        Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                        to="/admin/vendors"
                        className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                        >
                        <Users
                            className="text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300"
                            size={23}
                        />
                        Vendors
                        </Link>
                    </li>
                    <li ref={categoryRef}>
                        <button
                            onClick={() => setOpenCategory(!openCategory)}
                            className="flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                        >
                            <span className="flex items-center">
                                <ChartBarStacked className="mr-[15px] text-[#555] group-hover:text-red-500 transition-all duration-300" />
                                Category
                            </span>
                            <span>{openCategory ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openCategory && (
                            <ul className="ml-10 p-2 space-y-1.5">
                                <li>
                                <Link
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    to="/admin/listcategory"
                                >
                                    Category List
                                </Link>
                                </li>
                                <li>
                                <Link
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    to="/admin/addcategory"
                                >
                                    Category Create
                                </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li ref={productRef}>
                        <button
                            onClick={() => setOpenProducts(!openProducts)}
                            className="flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                        >
                            <span className="flex items-center">
                                <Package className="mr-[15px] text-[#555] group-hover:text-red-500 transition-all duration-300" />
                                Products
                            </span>
                            <span>{openProducts ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openProducts && (
                            <ul className="ml-10 p-2 space-y-1.5">
                                <li>
                                    <Link
                                        className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                        to="/admin/listProduct"
                                    >
                                        Product List
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                        to="/admin/addProduct"
                                    >
                                        Product Create
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link
                        to="/dashboard/wishlist"
                        className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                        >
                            <Heart className="text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Wishlist
                        </Link>
                    </li>
                    <li ref={cartRef}>
                        <button
                            onClick={() => setOpenCart(!openCart)}
                            className="flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                        >
                            <span className="flex items-center">
                                <ShoppingBag className="mr-[15px] text-[#555] group-hover:text-red-500 transition-all duration-300" />
                                Cart
                            </span>
                            <span>{openCart ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openCart && (
                            <ul className="ml-10 p-2 space-y-1.5">
                                <li>
                                <Link
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    to="/dashboard/orders"
                                >
                                    Order List
                                </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li ref={commentRef}>
                        <button
                        onClick={() => setOpenComment(!openComment)}
                        className="flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                    >
                        <span className="flex items-center">
                            <MessageCircleHeart className="mr-[15px] text-[#555] group-hover:text-red-500 transition-all duration-300" />
                            Comment
                        </span>
                        <span>{openComment ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openComment && (
                            <ul className="ml-10 p-2 space-y-1.5">
                                <li>
                                <Link
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    to="/admin/comments"
                                >
                                    Comment List
                                </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link
                            to="/admin/listbanner"
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]">
                            <Images className="text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Banner
                        </Link>
                    </li>

                    {/* Statistics */}
                    <li>
                        <Link
                            to="/dashboard/statistics"
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                        >
                            <ChartNoAxesCombined className="text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Statistics
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/listCategoryBlog"
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                        >
                            <LetterText   className="text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Category Blog
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/listBlog"
                            className="flex items-center group gap-2 p-3.5 text-[#1E293B] font-semibold hover:text-red-500 hover:bg-[#FEE2E2] rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px]"
                        >
                            <FileText className="text-[#555] mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Blog
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;
