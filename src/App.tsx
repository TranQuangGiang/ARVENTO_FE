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
import SlideAdmin from './components/admin/slide'
import './index.css';
import AddSlide from './components/admin/addSlide'
import EditSlide from './components/admin/editSlide'

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
        {path: 'slide', element: <SlideAdmin />},
        {path: 'addslide', element: <AddSlide />},
        {path: 'editslide', element: <EditSlide />}
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
