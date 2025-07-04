import React, { useEffect, useRef } from 'react';
import HeaderAdmin from './admin/header';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from './admin/slideBar';
import { useList } from '../hooks/useList';
import { message, Spin } from 'antd';

const LayoutAdmin = () => {
  const location = useLocation();
  const nav = useNavigate();
  const token = localStorage.getItem('token');
  const isInAdmin = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/loginAdmin';

  const { data, isLoading, refetch } = useList({
    resource: '/users/me',
  });
  const user = data?.data;
  console.log("role: ", user?.role);
  useEffect(() => {
    if (token && !user && refetch) {
      refetch();
    }
  }, [token, user]);

  const messageShownRef = useRef(false);

  useEffect(() => {
    if (!isInAdmin || isLoading || messageShownRef.current) return;

    if (!token) {
      message.warning('Vui lòng đăng nhập để truy cập quản trị');
      messageShownRef.current = true;
      nav('/admin/loginAdmin');
      return;
    }

    if (token && !user) {
      message.warning('Phiên đăng nhập đã hết hạn');
      localStorage.removeItem('token');
      messageShownRef.current = true;
      nav('/admin/loginAdmin');
      return;
    }

    if (user && user.role !== 'admin') {
      message.error('Bạn không có quyền truy cập trang quản trị');
      messageShownRef.current = true;
      nav('/');
      return;
    }

    if (isLoginPage && user?.role === 'admin') {
      nav('/admin');
      return;
    }
  }, [location.pathname, token, user, isLoading]);



  if (isInAdmin && isLoading || ((token && !user))) {
    return <div className='w-full h-screen flex items-center justify-center'>
      <Spin spinning={isLoading}  className="text-center mt-20 h-screen flex items-center justify-center">Đang kiểm tra quyền truy cập...</Spin>
    </div>
  }

  if (isLoginPage) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-white">
        <Outlet />
      </main>
    );
  }

  // ✅ Layout admin cho admin đã đăng nhập
  if (isInAdmin && user?.role === 'admin') {
    return (
      <main className="w-full min-h-screen flex">
        <div className="w-[18%]">
          <AdminSidebar />
        </div>
        <div className="w-[82%] flex flex-col">
          <HeaderAdmin />
          <div className="w-full min-h-screen mt-[80px] bg-[#f5f7fa]">
            <Outlet />
          </div>
        </div>
      </main>
    );
  }

  // 🧹 Nếu không phải admin hoặc layout client
  return <Outlet />;
};

export default LayoutAdmin;
