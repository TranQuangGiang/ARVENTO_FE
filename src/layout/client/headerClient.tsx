
import { useContext, useEffect, useState } from 'react';
import { faMagnifyingGlass, faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import Login from '../../components/client/auth/Login';
// import Register from '../../components/client/auth/Register';
import { AuthContexts } from '../../components/contexts/authContexts';
import { Badge } from 'antd';
import { useCart } from '../../components/contexts/cartContexts';
import Login from '../../components/client/auth/Login';
import Register from '../../components/client/auth/Register';
import { useList, useListClient } from '../../hooks/useList';
import axios from 'axios';


const HeaderClient = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const { user, logout } = useContext(AuthContexts);
  const [searchParams] = useSearchParams(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const nav = useNavigate();

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
  
  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/api/products/search?keyword=${value}`);
      const docs = res?.data?.data?.docs;
      setSuggestions(docs);
      console.log(res?.data);
      
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  }

  const formatPrice = (price: any) => {
    if (typeof price === 'object' && price?.$numberDecimal) {
      return Number(price.$numberDecimal).toLocaleString();
    }
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return 'Liên hệ';
  };

  return (
    <div className='fixed top-0 left-0 right-0 z-50 w-full bg-white h-[80px] shadow-md'>
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
              <span className="cursor-pointer text-[15px] text-[#0b1f4e]">Products</span>
              <ul className="absolute top-full left-0 z-20 min-w-[200px] mt-2 rounded-md bg-white shadow-lg invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                {category?.map((cat: any) => (
                  <li key={cat._id} className="px-4 py-2 hover:bg-gray-100 whitespace-nowrap">
                    <Link
                      to={`/products?category=${cat._id}`}
                      className="text-[#0b1f4e] block"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <a href="">Pages</a>
            <Link to={`/listBlogClient`}>Blog New</Link>
            <a href="">Contact</a>
          </nav>

          {/* Search Section */}
          <div className='relative flex items-center ml-5'>
            {/* Search Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSuggestions([]);       // Xóa gợi ý
                  setSearchTerm("");        // Xóa ô tìm kiếm
                  setSearchOpen(false); 
                  nav(`/searchProduct?keyword=${encodeURIComponent(searchTerm)}`);
                }
              }}
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
            {
              searchTerm && Array.isArray(suggestions) && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 bg-white rounded w-[350px] z-40 shadow-lg drop-shadow-xl ring-1 ring-gray-200">
                  <h3 className='font-bold font-sans text-[18px] text-gray-800 text-center mt-3.5 mb-2 up'>Kết quả tìm kiếm </h3>
                  {suggestions.map((product:any) => (
                    <Link to={`/detailProductClient/${product._id}`} key={product._id} className="flex items-center gap-2 p-3 hover:bg-gray-100">
                      <img src={product?.images?.[0].url} alt={product.name} className="w-12 h-12 object-cover" />
                      <div className="text-sm">
                        <p>{product.name}</p>
                        <span className='flex items-center gap-3'>
                          <p className="text-red-500 text-[15px]">{formatPrice(product.sale_price)}đ</p>
                          <del className='text-gray-500 text-[15px]'>{formatPrice(product.original_price)}đ</del>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            }
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