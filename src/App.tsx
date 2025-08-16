import './App.css'
import { useRoutes } from 'react-router-dom'
import LayoutClient from './layout/client'
import ScrollToTop from './components/ScrollToTop'
import Register from './components/client/auth/Register'
import Login from './components/client/auth/Login'
import Cart from './components/client/Cart'
import ListProductClient from './components/client/listProductClient'
import LayoutAdmin from './layout/admin'
import Dashboad from './components/admin/dashboard/dashboad'
import './index.css';
import ListBanner from './components/admin/banner/listBanner'
import AddBanner from './components/admin/banner/addBanner'
import EditBanner from './components/admin/banner/editBanner'
import ListCategory from './components/admin/category/listCategory'
import AddCategory from './components/admin/category/addCategory'
import EditCategory from './components/admin/category/editCategory'
import AddBlog from './components/admin/blog/addBlog'
import EditBlog from './components/admin/blog/editBlog'
import AddCategoryBlog from './components/admin/categoryBlog/addCategoryBlog'
import ListCategoryBlog from './components/admin/categoryBlog/listCategoryBlog'
import EditCategoryBlog from './components/admin/categoryBlog/updateCategoryBlog'
import ListBlog from './components/admin/blog/listBlog'
import DetailBlog from './components/admin/blog/detailBlog'
import ListProduct from './components/admin/product/listProduct'
import EditProduct from './components/admin/product/editProduct'
import ListUser from './components/admin/user/listUser'
import ListVariants from './components/admin/product/variants/listVariants'
import UpdateVariants from './components/admin/product/variants/updateVariants'
import DeltaiProductAdmin from './components/admin/product/detailProduct'
import AddProduct from './components/admin/product/addProduct'
import ListCoupon from './components/admin/coupon/listCoupon'
import AddCoupon from './components/admin/coupon/addCoupon'
import EditCoupon from './components/admin/coupon/editCoupon'
import DeltaiProduct from './components/client/Deltai'
import ResetPassword from './components/client/auth/ResetPassword'
import DetailAuth from './components/client/auth/DetailAuth/DetailAuth'
import HomeAuth from './components/client/auth/DetailAuth/layoutAuth/homeAuth'
import OrderHistory from './components/client/auth/DetailAuth/layoutAuth/OrderHistory'
import AccountInformation from './components/client/auth/DetailAuth/layoutAuth/accountInformation'
import DiscountCode from './components/client/auth/DetailAuth/layoutAuth/discountCode'
import Checkout from './components/client/checkout'
import Thanhtoan from './components/client/thanhtoan'

import ListReview from './components/admin/review/listReview'
import UpdateReview from './components/admin/review/editReview'

import GetUserOne from './components/admin/user/getOneUser'
import CreateUser from './components/admin/user/createUser'
import EditUser from './components/admin/user/editUser'
import UpdateAccount from './components/client/auth/DetailAuth/layoutAuth/updateAcconut'
import AddAddresses from './components/client/auth/DetailAuth/layoutAuth/addAddresses'
import ListFavorite from './components/admin/favorite/listFavorite'
import FavoriteUsers from './components/admin/favorite/chitietfavorite'
import ListOrder from './components/admin/order/listOrder'
import DetailOrder from './components/admin/order/detailOrder'
import UpdateAddresses from './components/client/auth/DetailAuth/layoutAuth/updateAddresses'
import AddAddressesClient from './components/client/addAddresses'
import DetailOrderClient from './components/client/auth/DetailAuth/layoutAuth/detailOrder'
import LoginAdmin from './components/admin/auth/loginAdmin'
import Thanhcong from './components/client/thanhcong'
import Wishlist from './components/client/auth/DetailAuth/layoutAuth/wishlist'
import ListBlogClient from './components/client/blog/listBlog'
import DetailBlogClient from './components/client/blog/detaiBlog'
import ListBlogCategory from './components/client/blog/listBlogCategory'
import ListProductCategory from './components/client/listProductCategory'
import AddColorAvarin from './components/admin/colorAvarin/AddColorAvarin'
import ListColorAvarin from './components/admin/colorAvarin/ListColorAvarin'
import UpdateColorAvarin from './components/admin/colorAvarin/UpdateColorAvarin'
import SearchProduct from './components/client/searchProduct'
import GioiThieu from './components/client/gioithieu'
import DieuKhoan from './components/client/dieukhoan'
import ChinhSach from './components/client/chinhsach'
import HuongDan from './components/client/huongdan'
import ChinhSachMuaHang from './components/client/chinhsachmh'
import DoiTra from './components/client/chinhsachdoitra'
import ChonSize from './components/client/chonsize'
import KhuyenMai from './components/client/khuyenmai'
import EmailVerificationNotice from './components/client/auth/VerifyEmail'
import ResendVerification from './components/client/auth/resendVerification'
import EmailVerificationSuccess from './components/client/auth/htEmailVerificationSuccess'
import Statistical from './components/admin/statistical/statical'
import RequestRefund from './components/admin/order/RequestRefund'



function App() {
  const routes = useRoutes([
    {path: '/', element: < LayoutClient />, children: [
      {path: '', element: <ListProductClient />},
      {path: 'detailProductClient/:id', element: <DeltaiProduct />},
      {path: 'cart', element: <Cart/>},
      {path: 'register', element: <Register/>},
      {path: 'login', element: <Login/>},
      {path: 'resetPassword', element: <ResetPassword/>},
      {path: 'verifyEmail', element: <EmailVerificationNotice/>},
      {path: 'resend-verification', element: <ResendVerification />},
      {path: 'EmailVerificationSuccess', element: <EmailVerificationSuccess />},
      {path: 'detailAuth', element: <DetailAuth/>, children: [
        {path: 'homeAuth', element: <HomeAuth />},
        {path: 'orderHistory', element: <OrderHistory />},
        {path: 'accountInformation', element: <AccountInformation />},
        {path: 'discountCode', element: <DiscountCode />},
        {path: 'updateAccount', element: <UpdateAccount />},
        {path: 'addAddresses', element: <AddAddresses />},
        {path: 'editAddresses/:id', element: <UpdateAddresses />},
        {path: 'detailOrder/:id', element: <DetailOrderClient />},
        {path: 'wishlistClient', element: <Wishlist />}
      ]},
      {path: 'checkout', element: <Checkout />},
      {path: 'thanhtoan', element: <Thanhtoan />},
      {path: 'addAddress', element: <AddAddressesClient />},
      {path: 'thanhcong', element: <Thanhcong />},
      {path: 'listBlogClient', element: <ListBlogClient />},
      {path: 'detailBlog/:slug', element: <DetailBlogClient />},
      {path: 'listBlog/category/:slug', element: <ListBlogCategory />},
      {path: 'products', element: <ListProductCategory />},
      {path: 'searchProduct', element: <SearchProduct />},
      {path: 'gioi-thieu-ve-arvento', element: <GioiThieu />},
      {path: 'ieu-khoan-su-dung-cua-arvento', element: <DieuKhoan />},
      {path: 'chinh-sach-bao-mat-cua-arvento', element: <ChinhSach />},
      {path: 'huong-dan-mua-hang-cua-arvento', element: <HuongDan />},
      {path: 'chinh-sach-mua-hang-arvento', element: <ChinhSachMuaHang />},
      {path: 'chinh-sach-doi-tra-arvaneto', element: <DoiTra />},
      {path: 'huong-dan-chon-size-giay-arvento', element: <ChonSize />},
      {path: 'chuong-trinh-khuyen-mai-arvento', element: <KhuyenMai />},
    ]},
    {
      path: '/admin', element: <LayoutAdmin />, children: [
        {path: 'loginAdmin', element: <LoginAdmin />},
        {path: '', element: <Dashboad />},
        {path: 'listbanner', element: <ListBanner />},
        {path: 'addbanner', element: <AddBanner />},
        {path: 'editbanner/:id', element: <EditBanner />},
        {path: 'listcategory', element: <ListCategory />},
        {path: 'addcategory', element: <AddCategory />},
        {path: 'editcategory/:id', element: <EditCategory />},
        {path: 'listBlog', element: <ListBlog/>},
        {path: 'addBlog', element: <AddBlog/>},
        {path: 'editBlog/:id', element: <EditBlog/>},
        {path: 'detailBlog/:id', element: <DetailBlog/>},
        {path: 'addCategoryBlog', element: <AddCategoryBlog />},
        {path: 'listCategoryBlog', element: <ListCategoryBlog />},
        {path: 'editCategoryBlog/:id', element: <EditCategoryBlog />},
        {path: 'listProduct', element: <ListProduct />},
        {path: 'addProduct', element: <AddProduct />},
        {path: 'editProduct/:id', element: <EditProduct />},
        {path: 'detailProductAdmin/:id', element: <DeltaiProductAdmin />},
        {path: 'listVariants/:id', element: <ListVariants />},
        {path: 'editVariants/:productId/:id', element: <UpdateVariants />},
        {path: 'listUsers', element: <ListUser />},
        {path: 'getUserOne/:id', element: <GetUserOne/>},
        {path: 'editUser/:id', element: <EditUser/>},
        {path: 'createUser', element: <CreateUser />},
        {path: 'listcoupon', element: <ListCoupon />},
        {path: 'addCoupon', element: <AddCoupon />},
        {path: 'editcoupon/:id', element: <EditCoupon />},
        // {path: 'listcolor', element: <ListColor />},
        // {path: 'addcolor', element: <AddColor />},
        // {path: 'editcolor', element: <EditColor />},
        {path: 'listreview', element: <ListReview />},
        {path: 'editreview/:id', element: <UpdateReview />},
        {path: 'listfavorite', element: <ListFavorite />},
        {path: 'favorites/:id/users', element: <FavoriteUsers />},
        {path: 'listorder', element: <ListOrder />},
        {path: 'orderDetail/:id', element: <DetailOrder />},
        {path: 'addcolor', element: <AddColorAvarin />},
        {path: 'listcolor', element: <ListColorAvarin />},
        {path: 'editcolor/:key', element: <UpdateColorAvarin />},
        {path: 'statistical', element: <Statistical />},
        {path: 'requestRefund', element: <RequestRefund />}
      ]
    }
  ])

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  )
}

export default App