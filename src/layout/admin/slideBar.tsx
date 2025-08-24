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
  Tickets,
  LayoutGrid,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import autoAnimate from "@formkit/auto-animate";

const AdminSidebar = () => {
    const categoryRef = useRef(null);
    const productRef = useRef(null);
    const cartRef = useRef(null);
    const commentRef = useRef(null);
    const location = useLocation();
    const isPathMatch = (paths: string[]) =>
    paths.some(path => location.pathname.startsWith(path));
    
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
                            className={`flex items-center group gap-2 p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                location.pathname === '/admin'
                                ? 'bg-[#FEE2E2] text-red-500'
                                : 'text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]'
                            }`}
                        >
                        <LayoutDashboard
                            className=" group-hover:text-red-500 transition-all duration-300"
                            size={23}
                        />
                            Tổng quan
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/admin/listUsers`}
                            className={`flex items-center group gap-2 p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                               isPathMatch(['/admin/listUsers', "/admin/getUserOne", "/admin/editUser", "/admin/createUser"])
                                ? 'bg-[#FEE2E2] text-red-500'
                                : 'text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]'
                            }`}
                        >
                            <Users
                                className="mr-[10px] group-hover:text-red-500 transition-all duration-300"
                                size={23}
                            />
                            Người dùng
                        </Link>
                    </li>
                    <li ref={categoryRef}>
                        <button
                            onClick={() => setOpenCategory(!openCategory)}
                            className={`flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/listcategory", "/admin/addcategory", "/admin/editCategory"])
                                ? "bg-[#FEE2E2] text-red-500"
                                : "text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]"
                            }`}
                        >
                        <span className="flex items-center ">
                            <LayoutGrid
                                className={`mr-[15px] transition-all duration-300 ${
                                    isPathMatch(["/admin/listcategory", "/admin/addcategory", "/admin/editcategory/:id"])
                                    ? "text-red-500"
                                    : "group-hover:text-red-500"
                                }`}
                            />
                            Danh mục 
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
                                        Danh sách danh mục
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                        to="/admin/addcategory"
                                    >
                                        Thêm mới danh mục
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li ref={productRef}>
                        <button
                            onClick={() => setOpenProducts(!openProducts)}
                            className={`flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/listProduct", "/admin/addProduct", "/admin/editProduct/", "/admin/detailProductAdmin", "/admin/listVariants", "/admin/editVariants","/admin/listcolor","/admin/editcolor"])
                                ? "bg-[#FEE2E2] text-red-500"
                                : "text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]"
                            }`}
                        >
                            <span className="flex items-center">
                                <Package 
                                    className={`mr-[15px] transition-all duration-300 ${
                                        isPathMatch(["/admin/listProduct", "/admin/addProduct", "/admin/editProduct", "/admin/detailProductAdmin", "/admin/listVariants", "/admin/editVariants", "/admin/listcolor", "/admin/editcolor"])
                                        ? "text-red-500"
                                        : "group-hover:text-red-500"
                                    }`}
                                />
                                Sản phẩm
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
                                        Danh sách sản phẩm
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                        to="/admin/addProduct"
                                    >
                                        Thêm mới sản phẩm
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li ref={cartRef}>
                        <button
                            onClick={() => setOpenCart(!openCart)}
                            className={`flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/listorder", "/admin/orderDetail"])
                                ? "bg-[#FEE2E2] text-red-500"
                                : "text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]"
                            }`}
                        >
                            <span className="flex items-center">
                                <ShoppingBag className="mr-[15px] group-hover:text-red-500 transition-all duration-300" />
                                Đơn hàng
                            </span>
                            <span>{openCart ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openCart && (
                            <ul className="ml-10 p-2 space-y-1.5">
                                <li>
                                <Link
                                    className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                    to="/admin/listorder"
                                >
                                    Danh sách đơn hàng
                                </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li ref={commentRef}>
                        <button
                        onClick={() => setOpenComment(!openComment)}
                        className={`flex w-full items-center justify-between group gap-2 cursor-pointer p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/listreview", "/admin/reply", "/admin/detailReview"])
                                ? "bg-[#FEE2E2] text-red-500"
                                : "text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]"
                            }`}
                    >
                        <span className="flex items-center">
                            <MessageCircleHeart className="mr-[15px] group-hover:text-red-500 transition-all duration-300" />
                            Đánh giá
                        </span>
                        <span>{openComment ? <ChevronUp /> : <ChevronDown />}</span>
                        </button>
                        {openComment && (
                            <ul className="ml-10 p-2 space-y-1.5">
                                <li>
                                    <Link
                                        className="block p-1.5 text-gray-700 hover:text-red-500 transition-all"
                                        to="/admin/listreview"
                                    >
                                        Danh sách đánh giá
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link
                            to="/admin/listcoupon"
                            className={`flex items-center group gap-2 p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/listcoupon", "/admin/editCoupon", "/admin/addCoupon"])
                                ? 'bg-[#FEE2E2] text-red-500'
                                : 'text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]'
                            }`}       
                        >
                            <Tickets 
                                className={`mr-[15px] transition-all duration-300 ${
                                    isPathMatch(["/admin/listcoupon", "/admin/editCoupon", "/admin/addCoupon"])
                                    ? "text-red-500"
                                    : "group-hover:text-red-500"
                                }`}
                            />
                            Mã giảm giá
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/listbanner"
                            className={`flex items-center group gap-2 p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/listbanner", "/admin/addbanner", "/admin/editbanner"])
                                ? 'bg-[#FEE2E2] text-red-500'
                                : 'text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]'
                            }`}    
                        >
                            <Images className="mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Quản lý Banner
                        </Link>
                    </li>

                    {/* Statistics */}
                    <li>
                        <Link
                            to="/admin/statistical"
                            className={`flex items-center group gap-2 p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/statistical"])
                                ? 'bg-[#FEE2E2] text-red-500'
                                : 'text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]'
                            }`} 
                        >
                            <ChartNoAxesCombined className="mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Thống kê
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/listCategoryBlog"
                            className={`flex items-center group gap-2 p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/listCategoryBlog", "/admin/addCategoryBlog", "admin/editCategoryBlog"])
                                ? 'bg-[#FEE2E2] text-red-500'
                                : 'text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]'
                            }`}
                        >
                            <LetterText   className="mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Danh mục bài viết
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/listBlog"
                            className={`flex items-center group gap-2 p-3.5 font-semibold rounded-tl-[25px] rounded-bl-[25px] transition-all text-[17px] ${
                                isPathMatch(["/admin/listBlog", "/admin/addBlog", "/admin/editBlog"])
                                ? 'bg-[#FEE2E2] text-red-500'
                                : 'text-[#1E293B] hover:text-red-500 hover:bg-[#FEE2E2]'
                            }`}
                        >
                            <FileText className="mr-[10px] group-hover:text-red-500 transition-all duration-300" />
                            Bài viết
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar;
