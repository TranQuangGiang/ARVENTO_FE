import HeaderClient from './client/headerClient'
import { Outlet, useLocation } from 'react-router-dom'
import FooterClient from './client/footer'

const LayoutClient = () => {
  const location = useLocation();

  const hideLayout = location.pathname.startsWith('/resetPassword');
  const hideLayoutDetail = location.pathname.startsWith('/detailAuth');
  return (
    <main className='w-[100%] mx-auto bg-[#fff]'>
      { !hideLayout && !hideLayoutDetail && <HeaderClient />}  
      <div className={
        location.pathname.startsWith("/detailAuth")  ? '' : 'mt-[80px]'}>
        <Outlet/>
      </div>
      { !hideLayout && !hideLayoutDetail && <FooterClient />}
    </main>
  )
}

export default LayoutClient