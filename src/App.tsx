import './App.css'
import { useRoutes } from 'react-router-dom'
import LayoutClient from './layout/client'
import ScrollToTop from './components/ScrollToTop'
import Deltai from './components/client/Deltai'
import Register from './components/client/Register'
import Login from './components/client/Login'
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

import DeltaiProduct from './components/client/Deltai'
import ListUser from './components/admin/user/listUser'
import ListVariants from './components/admin/product/variants/listVariants'
import UpdateVariants from './components/admin/product/variants/updateVariants'
import DeltaiProductAdmin from './components/admin/product/detailProduct'
import AddProduct from './components/admin/product/addProduct'

function App() {
  const routes = useRoutes([
    {path: '/', element: < LayoutClient />, children: [
      {path: '', element: <ListProductClient />},
      {path: 'detailProductClient/:id', element: <DeltaiProduct />},
      {path: 'cart', element: <Cart/>},
      {path: 'register', element: <Register/>},
      {path: 'login', element: <Login/>}
    ]},
    {
      path: '/admin', element: <LayoutAdmin />, children: [
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
        {path: 'listVendors', element: <ListUser />},
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
