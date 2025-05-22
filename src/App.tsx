import { Children, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRoutes } from 'react-router-dom'
import LayoutClient from './layout/client'
import ScrollToTop from './components/ScrollToTop'
import Deltai from './components/client/Deltai'
import Register from './components/client/Register'
import Login from './components/client/Login'
import Cart from './components/client/Cart'
import ListProductClient from './components/client/listProductClient'

function App() {
  const routes = useRoutes([
    {path: '/', element: < LayoutClient />, children: [
      {path: '', element: <ListProductClient />},
      {path: 'deltai', element: <Deltai/>},
      {path: 'cart', element: <Cart/>},
      {path: 'register', element: <Register/>},
      {path: 'login', element: <Login/>}
    ]}
  ])

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  )
}

export default App
