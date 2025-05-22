import React from 'react'
import HeaderClient from './client/headerClient'
import { Outlet } from 'react-router-dom'
import FooterClient from './client/footer'

const LayoutClient = () => {
  return (
    <main className='w-[100%] mx-auto bg-[#fff]'>
      <HeaderClient />
      <div className=''>
        <Outlet/>
      </div>
      <FooterClient />
    </main>
  )
}

export default LayoutClient