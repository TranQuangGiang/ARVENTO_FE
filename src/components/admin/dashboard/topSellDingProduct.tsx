import React, { useEffect } from 'react';
import { useList } from '../../../hooks/useList';
import { Star, Tickets } from 'lucide-react';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { HeartFilled } from '@ant-design/icons';

const TopSellingProducts = () => {
  // top sản phẩm bán chạy
  const { data: topProducts, refetch:refetchTopProducts } = useList({
    resource: `/dashboard/best-sellers`
  });
  // top sản phẩm được yêu thích nhất
  const { data: topProductFavorites } = useList ({
    resource: `/favorites/admin/popular-products`
  });
  console.log(topProductFavorites);

  // top mã khuyến mãi được dùng nhiều nhất
  const { data:topConpon, refetch:refetchCoupon } = useList({
    resource: `/dashboard/coupons/top-discount-used`
  });
  console.log(topConpon);
  
  // top sản sắp hết hàng
  const { data:topUnsoldProducts, refetch:refetchUnsoldProducts} = useList({
    resource: `/dashboard/stock-warning`
  });
  console.log(topUnsoldProducts);
  

  useEffect(() => {
    refetchTopProducts();
    refetchCoupon();
    refetchUnsoldProducts();
  }, []);

  return (
    <div className="mt-10 w-full  "> 
      <div className="bg-white border  border-gray-200 rounded-xl p-6 shadow-lg"> 
        <Tabs defaultActiveKey='1'>
          <Tabs.TabPane tab="Top sản phẩm bán chạy" key="1">
            {topProducts?.data?.length > 0 ? (
              <div className="space-y-4"> 
                {topProducts.data.map((item: any, index: any) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-100 last:border-none
                              hover:bg-gray-50 transition-all duration-300 ease-in-out rounded-lg px-3 -mx-3 cursor-pointer" 
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {/* Image with fallback */}
                      <img
                        src={item?.image?.url || `https://placehold.co/50x50/e2e8f0/64748b?text=No+Image`}
                        alt={item?.name || "Product image"}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                        onError={(e: any) => { e.target.onerror = null; e.target.src = `https://placehold.co/50x50/e2e8f0/64748b?text=No+Image`; }} 
                      />
                      <div className="flex-grow">
                        <p className="font-bold font-sans text-[17px] text-gray-900 leading-tight">{item.name}</p> 
                        <p className="text-sm text-gray-600 mt-1">Lượt bán: <span className="font-medium">{item.quantity}</span> product</p> 
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center text-yellow-600 font-extrabold text-xl sm:text-[16px] bg-yellow-50 px-3 py-1 rounded-full shadow-sm">
                      <Star size={18} className="mr-1 fill-current text-yellow-500" /> 
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Không có dữ liệu sản phẩm bán chạy nhất.</p>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Top sản phẩm được yêu thích nhất" key="2"
          >
            {
              topProductFavorites?.data.length > 0 ? (
                <div className='space-y-4'>
                  {topProductFavorites.data.map((item: any, index: any) => (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-100 last:border-none
                              hover:bg-gray-50 transition-all duration-300 ease-in-out rounded-lg px-3 -mx-3 cursor-pointer" 
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Image with fallback */}
                        <img
                          src={item?.product?.images[0]?.url || `https://placehold.co/50x50/e2e8f0/64748b?text=No+Image`}
                          alt={item?.name || "Product image"}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                          onError={(e: any) => { e.target.onerror = null; e.target.src = `https://placehold.co/50x50/e2e8f0/64748b?text=No+Image`; }} 
                        />
                        <div className="flex-grow">
                          <p className="font-bold font-sans text-[17px] text-gray-900 leading-tight">{item?.product.name}</p> 
                          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5"><HeartFilled className='mt-0.5' style={{color: "red", fontSize: 16, }} /> <span className="font-medium">{item.count}</span> </p> 
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center text-yellow-600 font-extrabold text-xl sm:text-[16px] bg-yellow-50 px-3 py-1 rounded-full shadow-sm">
                        <Star size={18} className="mr-1 fill-current text-yellow-500" /> 
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Không có dữ liệu sản phẩm yêu thích.</p>
              )}
          </Tabs.TabPane>
          <TabPane tab="Sản phẩm sắp hết hàng" key="3">
            {topUnsoldProducts?.data?.length > 0 ? (
              <div className="space-y-4"> 
                {topUnsoldProducts.data.map((item: any, index: any) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-100 last:border-none
                              hover:bg-gray-50 transition-all duration-300 ease-in-out rounded-lg px-3 -mx-3 cursor-pointer" 
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {/* Image with fallback */}
                      <img
                        src={item?.images?.[0]?.url || `https://placehold.co/50x50/e2e8f0/64748b?text=No+Image`}
                        alt={item?.name || "Product image"}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                        onError={(e: any) => { e.target.onerror = null; e.target.src = `https://placehold.co/50x50/e2e8f0/64748b?text=No+Image`; }} 
                      />
                      <div className="flex-grow">
                        <p className="font-bold font-sans text-[17px] text-gray-900 leading-tight">{item.name}</p> 
                        <p className="text-sm text-gray-600 mt-1">Số lượng tồn: <span className="font-medium">{item.stock}</span> sản phẩm</p> 
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex items-center text-yellow-600 font-extrabold text-xl sm:text-[16px] bg-yellow-50 px-3 py-1 rounded-full shadow-sm">
                      <Star size={18} className="mr-1 fill-current text-yellow-500" /> 
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Không có dữ liệu sản phẩm sắp hết hàng.</p>
            )}
          </TabPane>
          <TabPane tab="Danh sách mã giảm giá được sử dụng nhiều nhất" key="4">
            {
             topConpon?.data.length > 0 ? (
              <div className='space-y-4'>
              {topConpon.data.map((item: any, index: any) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-100 last:border-none
                          hover:bg-gray-50 transition-all duration-300 ease-in-out rounded-lg px-3 -mx-3 cursor-pointer" 
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className='icon'>
                      <Tickets />
                    </div>
                    {/* Image with fallback */}
                    <div className="flex-grow">
                      <p className="font-bold font-sans text-[17px] text-gray-900 leading-tight">{item?.code}</p> 
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5">Số lần sử dụng: <span className="font-medium">{item.count}</span> </p> 
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center text-yellow-600 font-extrabold text-xl sm:text-[16px] bg-yellow-50 px-3 py-1 rounded-full shadow-sm">
                    <Star size={18} className="mr-1 fill-current text-yellow-500" /> 
                    #{index + 1}
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Không có mã khuyến mại nào khả dụng.</p>
            ) 
          }
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default TopSellingProducts;
