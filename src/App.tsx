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
import Dashboad from './components/admin/dashboad'
import './index.css';
import ListBanner from './components/admin/Baner/listBanner'
import AddBanner from './components/admin/Baner/addBanner'
import EditBanner from './components/admin/Baner/editBanner'
import ListCategory from './components/admin/category/listCategory'
import AddCategory from './components/admin/category/addCategory'
import EditCategory from './components/admin/category/editCategory'

function App() {
  const routes = useRoutes([
    {path: '/', element: < LayoutClient />, children: [
      {path: '', element: <ListProductClient />},
      {path: 'detail', element: <Deltai/>},
      {path: 'cart', element: <Cart/>},
      {path: 'register', element: <Register/>},
      {path: 'login', element: <Login/>}
    ]},
    {
      path: '/admin', element: <LayoutAdmin />, children: [
        {path: 'dashboads', element: <Dashboad />},
        {path: 'listbanner', element: <ListBanner />},
        {path: 'addbanner', element: <AddBanner />},
        {path: 'editbanner', element: <EditBanner />},
         {path: 'listcategory', element: <ListCategory />},
        {path: 'addcategory', element: <AddCategory />},
        {path: 'editcategory', element: <EditCategory />}
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
