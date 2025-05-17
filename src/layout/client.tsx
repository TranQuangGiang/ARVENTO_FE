import React from 'react'
import HeaderClient from './client/headerClient'
import { Outlet } from 'react-router-dom'
import FooterClient from './client/footer'

const LayoutClient = () => {
  return (
    <main className='w-[100%] mx-auto max-h-[3560px] bg-[#fff]'>
      <HeaderClient />
      <div className='w-full mt-[40px]'>
        <Outlet/>
      </div>
      <FooterClient />
    </main>
  )
}

export default LayoutClient