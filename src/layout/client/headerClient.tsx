
import { useContext, useEffect, useState } from 'react';
import { faMagnifyingGlass, faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useSearchParams } from 'react-router-dom';
// import Login from '../../components/client/auth/Login';
// import Register from '../../components/client/auth/Register';
import { AuthContexts } from '../../components/contexts/authContexts';
import { Badge } from 'antd';
import { useCart } from '../../components/contexts/cartContexts';
import Login from '../../components/client/auth/Login';
import Register from '../../components/client/auth/Register';
import { useList, useListClient } from '../../hooks/useList';


const HeaderClient = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const { user, logout } = useContext(AuthContexts);
  const [searchParams] = useSearchParams(); 
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const modalParam = searchParams.get("modal");
    useEffect(() => {
    if (modalParam) {
      setShowModal(modalParam);
    }
  }, [modalParam]);

  const { state: { cartItemCount } } = useCart();
  const { data} = useListClient({
    resource: `/categories/client`
  })
  const category = data?.data;
  console.log(category);
  
  const fetchProductsByCategory = async (categoryId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/products?category_id=${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setProducts(data?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };
  return (
    <div className='fixed top-0 left-0 right-0 z-50 w-full bg-white h-[80px]'>
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
          <nav className='flex items-center gap-6 transition-all duration-300 [&_a]:text-[15px] [&_a]:text-[#0b1f4e]'>
            <a href="">Home</a>
            <div className="relative group">
              <a className="cursor-pointer text-[15px] text-[#0b1f4e]">Products</a>
              <ul className="absolute top-full left-0 z-20 min-w-[200px] mt-2 rounded-md bg-white shadow-lg invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                {category?.map((cat: any) => (
                  <li
                    key={cat._id}
                    className="relative px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                    onMouseEnter={() => {
                      setHoveredCategory(cat._id);
                      fetchProductsByCategory(cat._id);
                    }}
                    onMouseLeave={() => {
                      setHoveredCategory(null);
                      setProducts([]);
                    }}
                  >
                    <span className="text-[#0b1f4e] cursor-pointer text-[14px] block w-full">{cat.name}</span>

                    {/* Submenu con: sản phẩm */}
                    {hoveredCategory === cat._id && products.length > 0 && (
                      <ul className="absolute top-0 left-full min-w-[250px] bg-white rounded-md shadow-lg z-30 ml-1">
                        {products.map((product) => (
                          <li
                            key={product._id}
                            className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                          >
                            <Link
                              to={`/product/${product.slug}`}
                              className="text-[#0b1f4e] block"
                            >
                              {product.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
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
            <FontAwesomeIcon className='text-[19px] font-sans cursor-pointer' icon={faUser} />
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
                <Link to={`/admin`}>
                  <button
                    className='w-full block px-3 py-2 border-0 cursor-pointer hover:bg-gray-200 text-left'
                  >
                    Admin Access
                  </button>
                </Link>
              </div>
            )}
          </div>
          <Badge count={cartItemCount} offset={[-1, 1]} size="small">
            <Link to={`/cart`}>
              <FontAwesomeIcon className='text-[19px] pl-[10px] cursor-pointer text-blue-600' icon={faCartShopping} />
            </Link>
          </Badge>
        </section>
        <Login isOpen={showModal === "login"} onClose={() => setShowModal(null)} switchToRegister={() => setShowModal("register")} />
        <Register isOpen={showModal === "register"} onClose={() => setShowModal(null)} switchToLogin={() => setShowModal("login")} />
        
      </div>
    </div>
  );
};

export default HeaderClient;