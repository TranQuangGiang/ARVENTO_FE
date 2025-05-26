import React from 'react'
import HeaderAdmin from './admin/header'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './admin/slideBar'

const LayoutAdmin = () => {
  return (
    <main className='w-full min-h-screen flex '>
      {/* Sidebar chiếm 20% bên trái */}
      <div className='w-[18%]'>
        <AdminSidebar />
      </div>
      {/* Nội dung chính chiếm 80% bên phải, chia dọc: Header + Content */}
      <div className='w-[82%] flex flex-col'>
        <HeaderAdmin />
        <div className='w-[100%] bg-[#f5f7fa]'>
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default LayoutAdmin