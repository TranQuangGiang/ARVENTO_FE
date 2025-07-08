import { useList } from '../../../hooks/useList';
import { useEffect } from 'react';
import { Star } from 'lucide-react';

const TopSellingProducts = () => {
  const { data: topProducts, refetch } = useList({
    resource: `/dashboard/products/top-selling?limit=5`
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="mt-[40px] w-[100%]">
      <h2 className="text-xl font-bold font-sans mb-4">🔥 Sản phẩm bán chạy</h2>
      <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
        {topProducts?.data?.length > 0 ? (
          topProducts.data.map((item:any, index:any) => (
            <div key={item._id} className="flex justify-between items-center py-3 border-b last:border-none">
              <div className="flex items-center gap-4">
                <img src={item?.image} alt={item?.name} className="w-[50px] h-[50px] object-cover rounded-md" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Đã bán: {item.totalSold} sản phẩm</p>
                </div>
              </div>
              <div className="flex items-center text-yellow-500 font-bold">
                <Star size={18} className="mr-1" /> #{index + 1}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Không có dữ liệu</p>
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;