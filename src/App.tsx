import { Children, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRoutes } from 'react-router-dom'
import LayoutClient from './layout/client'
import ScrollToTop from './components/ScrollToTop'
import Deltai from './layout/client/Deltai'
import Register from './layout/client/Register'
import Login from './layout/client/Login'
import Cart from './layout/client/Cart'

function App() {
  const routes = useRoutes([
    {path: '/', element: < LayoutClient />, children: [
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
