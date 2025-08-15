import { FileText, Heart, House, LogOut, Mail, MapPin, Receipt, RotateCcw, ScrollText, Settings, ShoppingBag, Tickets } from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useUserMe } from '../../../../hooks/useOne'
import { useEffect } from 'react'
import { Button } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'


const DetailAuth = () => {
    const location = useLocation();
    const nav = useNavigate();
    const { data:UserMe, refetch } = useUserMe({
        resource: `/users/me`
    })
    
    useEffect(() => {
        refetch(); // Call API again
    }, [location.pathname]);

    function maskEmail(email: string | undefined): string {
        if (!email) return "";

        const [localPart, domain] = email.split("@");
        const half = Math.floor(localPart.length / 2);
        const visible = localPart.slice(0, half);
        const masked = "*".repeat(localPart.length - half);
        return `${visible}${masked}@${domain}`;
    }
    return (
        <main className='w-full m-0 min-h-screen flex flex-col bg-[#e4e4e7]'>
            <div className='mt-[20px] w-[90%] mx-auto flex items-center gap-5 h-[140px] bg-white rounded-[15px]'>
                <div className='flex items-center gap-3.5 ml-8 w-1/3'>
                    <span className='w-[75px] h-[75px] flex flex-col items-center justify-center rounded-[50%] bg-gradient-to-b from-white to-blue-200'>
                        <img className='w-14 h-14' src="/tho.png" alt="" />
                    </span>
                    <span className='[&_h2]:font-bold [&_h2]:uppercase [&_h2]:font-sans [&_h2]:text-[18px]'>
                        <h2 className='uppercase'>{UserMe?.data.name}</h2>
                        <p className="text-[15px] font-sans text-gray-800">
                            {maskEmail(UserMe?.data.email)}
                        </p>
                        {!UserMe?.data?.verified ? (
                            <div style={{ marginTop: 8 }}>
                                <Button
                                type="primary"
                                size="small"
                                onClick={() => nav("/resend-verification")}
                                >
                                Xác thực tài khoản
                                </Button>
                                <span style={{ marginLeft: 8, fontSize: "14px", color: "red" }}>
                                    (Chưa xác thực)
                                </span>
                            </div>
                        ) : (
                            <span
                                className="flex items-center gap-2 bg-green-50 border border-green-400 text-green-700 text-[14px] px-2.5 py-0.5 rounded-full shadow-sm mt-1.5"
                            >
                                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "18px" }} />
                                Đã xác thực
                            </span>
                        )}
                    </span>
                </div>
                <div className='flex items-center flex-col h-full'>
                    <div className='flex items-center h-[65%]'>
                        <span className='border-[2px] rounded h-[85%] border-blue-500'></span>
                        <div className='flex items-center gap-3.5 ml-8'>
                            <span className='w-12 h-12 flex flex-col items-center justify-center rounded-[50%] bg-gradient-to-b from-white to-blue-200'>
                                <ShoppingBag className='text-blue-950' />
                            </span>
                            <span className='[&_h2]:font-bold [&_h2]:uppercase [&_h2]:font-sans [&_h2]:text-[18px]'>
                                <h2>0</h2>
                                <p className='text-[16px] font-sans text-gray-800'>Total orders purchased</p>
                            </span>
                        </div>
                        <span className='border-[2px] ml-14 rounded h-[85%] border-blue-500'></span>
                        <div className='flex items-center gap-3.5 ml-8'>
                            <span className='w-12 h-12 flex flex-col items-center justify-center rounded-[50%] bg-gradient-to-b from-white to-blue-200'>
                                <Receipt className='text-blue-950' />
                            </span>
                            <span className='[&_h2]:font-bold [&_h2]:uppercase [&_h2]:font-sans [&_h2]:text-[18px]'>
                                <h2>0 đ</h2>
                                <p className='text-[16px] font-sans text-gray-800'>Total accumulated money</p>
                            </span>
                        </div>
                    </div>
                    <div className='mt-1.5 ml-6 w-xl flex items-center h-8 rounded-[12px] bg-[#f4f4f7]'>
                        <span className='flex items-center pl-2'>
                            <ScrollText width={16} color='#000' />
                            <p className='text-[13px] ml-2 text-black font-sans'>Total money and number of orders are calculated from ARVENTO</p>
                        </span>
                    </div>
                </div>
            </div>
            <div className='w-[90%] mx-auto h-[80px] rounded-[15px] bg-white mt-4'>
                <nav className='w-[95%] mx-auto h-full flex items-center gap-12'>
                    <span className='flex items-center cursor-pointer'>
                        <span className='w-10 h-10 flex items-center justify-center rounded-[50%] bg-[#f7f7f8]'>
                            <Tickets style={{ width: 20, color: "#162456" }} />
                        </span>
                        <Link to={`/detailAuth/discountCode`}>
                            <p className='text-[15px] ml-3 text-blue-950'> My discount codes</p>
                        </Link>
                    </span>
                    <span className='flex items-center cursor-pointer'>
                        <span className='w-10 h-10 flex items-center justify-center rounded-[50%] bg-[#f7f7f8]'>
                            <ScrollText style={{ width: 20, color: "#162456" }} />
                        </span>
                        <Link to={`/detailAuth/orderHistory`}>
                            <p className='text-[15px] ml-3 text-blue-950'> Order History</p>
                        </Link>
                    </span>
                    <span className='flex items-center cursor-pointer'>
                        <span className='w-10 h-10 flex items-center justify-center rounded-[50%] bg-[#f7f7f8]'>
                            <MapPin style={{ width: 20, color: "#162456" }} />
                        </span>
                        <Link to={`/detailAuth/accountInformation`}>
                            <p className='text-[15px] ml-3 text-blue-950'> Address Book</p>
                        </Link>
                        
                    </span>
                </nav>

            </div>
            <div className='w-[90%] mx-auto mt-5 flex'>
                <nav className='slideBar w-1/4 min-h-screen bg-white rounded-[15px]'>
                    <ul className='[&_li]:cursor-pointer pt-4 flex flex-col'>
                        <li
                            className={`px-6 py-3.5 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center ${
                                location.pathname === "/detailAuth/homeAuth"
                                ? "bg-blue-200 text-blue-900"
                                : "hover:bg-blue-200 hover:text-blue-900"
                            }`}
                        >
                            <Link to="/detailAuth/homeAuth" className="flex items-center w-full">
                                <House className="mr-2.5" style={{ width: 20 }} />
                                Overview
                            </Link>
                        </li>

                        <li
                            className={`px-6 py-3.5 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center ${
                                location.pathname.startsWith("/detailAuth/orderHistory") ||
                                location.pathname.startsWith("/detailAuth/detailOrder")
                                ? "bg-blue-200 text-blue-900"
                                : "hover:bg-blue-200 hover:text-blue-900"
                            }`}
                            >
                            <Link to="/detailAuth/orderHistory" className="flex items-center w-full">
                                <ScrollText className="mr-2.5" style={{ width: 20 }} />
                                Order History
                            </Link>
                        </li>
                        <li
                            className={`px-6 py-3.5 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center ${
                                location.pathname === "/detailAuth/accountInformation"
                                ? "bg-blue-200 text-blue-900"
                                : "hover:bg-blue-200 hover:text-blue-900"
                            }`}
                        >
                            <Link to="/detailAuth/accountInformation" className="flex items-center w-full">
                                <Settings className="mr-2.5" style={{ width: 20 }} />
                                Account Information
                            </Link>
                        </li>

                        <li className="px-6 py-3.5 hover:bg-blue-200 hover:text-blue-900 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center">
                            <FileText className="mr-2.5" style={{ width: 20 }} />
                            Warranty Policy
                        </li>

                        <li
                            className={`px-6 py-3.5 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center ${
                                location.pathname === "/detailAuth/discountCode"
                                ? "bg-blue-200 text-blue-900"
                                : "hover:bg-blue-200 hover:text-blue-900"
                            }`}
                        >
                            <Link to="/detailAuth/discountCode" className="flex items-center w-full">
                                <Tickets className="mr-2.5" style={{ width: 20 }} />
                                My Promotions
                            </Link>
                        </li>

                        <Link to={`/detailAuth/wishlistClient`}>
                            <li className={`px-6 py-3.5 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center ${
                                        location.pathname === "/detailAuth/wishlistClient"
                                        ? "bg-blue-200 text-blue-900"
                                        : "hover:bg-blue-200 hover:text-blue-900"
                                    }`}>
                                <Heart className="mr-2.5" style={{ width: 20 }} />
                                Wishlist
                            </li>
                        </Link>    
                        <li className="px-6 py-3.5 hover:bg-blue-200 hover:text-blue-900 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center">
                            <Mail className="mr-2.5" style={{ width: 20 }} />
                            Feedback - Support
                        </li>

                        <li className="px-6 py-3.5 hover:bg-blue-200 hover:text-blue-900 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center">
                            <LogOut className="mr-2.5" style={{ width: 20 }} />
                            Logout
                        </li>
                        <Link to={`/`}>
                            <li className="px-6 py-3.5 hover:bg-blue-200 hover:text-blue-900 font-sans font-semibold text-[16.5px] transition-all duration-300 flex items-center">
                                <RotateCcw className="mr-2.5" style={{ width: 20 }} />
                                Return to website
                            </li>
                        </Link>
                    </ul>
                </nav>

                <div className='ml-3 w-3/4'>
                    <Outlet />
                </div>
            </div>
        </main>
    )
}
export default DetailAuth