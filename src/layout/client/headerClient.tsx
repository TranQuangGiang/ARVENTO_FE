
import { useContext, useEffect, useState } from 'react';
import { faMagnifyingGlass, faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BannerClient from './banner';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Login from '../../components/client/auth/Login';
import Register from '../../components/client/auth/Register';
import { AuthContexts } from '../../components/contexts/authContexts';


const HeaderClient = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const [showModal, setShowModal] = useState<string | null>(null);
  const { user, logout } = useContext(AuthContexts);
  const [searchParams] = useSearchParams(); 
  const modalParam = searchParams.get("modal");
  useEffect(() => {
  if (modalParam) {
    setShowModal(modalParam);
  }
}, [modalParam]);
  return (
    <div>
      <div className='header w-[85%] mx-auto h-[80px] bg-white flex items-center justify-around'>
        {/* Logo */}
        <section className='header-logo [&_img]:w-[200px] [&_img]:cursor-pointer'>
          <Link to={'/'}>
            <img src="logo.png" alt="logo" />
          </Link>
        </section>

        {/* Menu + Search */}
        <section className='header-menu flex items-center gap-5'>
          {/* Menu */}
          <nav className='flex gap-6 transition-all duration-300 [&_a]:text-[15px] [&_a]:text-[#0b1f4e]'>
            <a href="">Home</a>
            <a href="">Products</a>
            <a href="">Pages</a>
            <a href="">Blog New</a>
            <a href="">Contact</a>
          </nav>

          {/* Search Section */}
          <div className='relative flex items-center ml-5'>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              className={`h-[35px] pr-10 pl-3 border border-[#0b1f4e] rounded text-black transition-all duration-300 outline-0 ${
                searchOpen ? 'w-[350px]' : 'w-0 px-0 border-0'
              }`}
              style={{ overflow: 'hidden' }}
            />
            {/* Icon luôn hiển thị */}
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute text-[18px] right-3 font-extrabold text-black cursor-pointer"
              onClick={() => setSearchOpen(prev => !prev)}
            />
          </div>
        </section>

        {/* Icons */}
        <section className='header-person flex gap-4'>
          <div className='group relative'>
            <FontAwesomeIcon className='text-[18px] cursor-pointer' icon={faUser} />
            { user ? (
              <div className={`bg-[#fff] absolute shadow-lg -right-[40px] min-w-[160px] top-[100%] z-30 flex flex-col
                [&_button]:text-[14px] [&_button]:text-[#01225a] rounded-md [&_a]:cursor-pointer
                p-2.5 transition-all duration-300
                ${showModal === null ? 'opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300' : 'opacity-0 invisible transition-all duration-300'}`}
              >
                <Link to={'/detailAuth/homeAuth'}>
                  <button
                    className='w-full block px-3 py-2 border-0 cursor-pointer hover:bg-gray-200 text-left'
                  >
                    My account
                  </button>
                </Link>
                <button 
                  onClick={logout}  
                  className='block px-3 py-2 cursor-pointer hover:bg-gray-200 text-left'
                >
                  Log Out
                </button>
                <Link to={`/admin`}>
                  <button
                    className='w-full block px-3 py-2 border-0 cursor-pointer hover:bg-gray-200 text-left'
                  >
                    Admin Access
                  </button>
                </Link>
              </div>
            ) : (
              <div className={`bg-[#fff] absolute shadow-lg -right-[40px] min-w-[160px] top-[100%] z-30 flex flex-col
                [&_button]:text-[14px] [&_button]:text-[#01225a] rounded-md [&_a]:cursor-pointer
                p-2.5 transition-all duration-300
                ${showModal === null ? 'opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300' : 'opacity-0 invisible transition-all duration-300'}`}
              >
                <button
                  onClick={() => setShowModal("login")}
                  className='block px-3 py-2 border-0 hover:bg-gray-200 text-left cursor-pointer'
                >
                Sign In
                </button>
                <button 
                  onClick={() => setShowModal("register")}  
                  className='block cursor-pointer px-3 py-2 hover:bg-gray-200 text-left'
                >
                  Register
                </button>
              </div>
            )}
          </div>
          <Link to={`/cart`}>
            <FontAwesomeIcon className='text-[18px] pl-[10px] cursor-pointer' icon={faCartShopping} />
          </Link>
        </section>
        <Login isOpen={showModal === "login"} onClose={() => setShowModal(null)} switchToRegister={() => setShowModal("register")} />
        <Register isOpen={showModal === "register"} onClose={() => setShowModal(null)} switchToLogin={() => setShowModal("login")} />
        
      </div>
       {location.pathname === "/" && <BannerClient />}
    </div>
  );
};

export default HeaderClient;
