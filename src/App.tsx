import { Children, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRoutes } from 'react-router-dom'
import LayoutClient from './layout/client'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const routes = useRoutes([
    {path: '/', element: < LayoutClient />, children: [

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
