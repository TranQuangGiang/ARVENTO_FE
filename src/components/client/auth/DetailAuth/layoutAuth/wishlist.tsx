import React from 'react'
import { useList } from '../../../../../hooks/useList'
import { Heart } from 'lucide-react';
import { useDelete } from '../../../../../hooks/useDelete';
import { Link } from 'react-router-dom';


const formatPrice = (price: any) => {
  if (!price) return '0';
  return Number(price?.$numberDecimal || price).toLocaleString('vi-VN');
};

const Wishlist = () => {
  const { data, refetch } = useList({
    resource: `/favorites`
  });
  console.log(data);
  
  const delWishlist = async (product_id:any) => {
    mutate(product_id);
  }
  const { mutate } = useDelete({
    resource: `/favorites`,
    onSuccess: refetch,
  });
  return (
    <div className='flex flex-wrap gap-4'>
      {data?.data?.map((item:any) => {
        const product = item.product_id;

        return (
          <Link to={`/detailProductClient/${product._id}`}>
            <div
              key={item._id}
              className='relative list-product-one overflow-hidden w-[220px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center rounded cursor-pointer group'
            >
              {/* Icon trái tim (yêu thích) */}
              <div className='absolute top-2 right-2 z-10'>
                <Heart size={20} onClick={() => delWishlist(product._id)} className='text-red-500 fill-red-500 transition-all duration-300 hover:text-white hover:fill-red-300' />
              </div>

              {/* Hình ảnh sản phẩm */}
              <div className='w-[200px] h-[160px] overflow-hidden flex items-center'>
                <img
                  className='w-[220px] h-[230px] mt-0 transition-all duration-300 group-hover:scale-[1.1]'
                  src={product?.images?.[0]?.url || '/default.png'}
                  alt={product?.name}
                />
              </div>

              {/* Nội dung sản phẩm */}
              <div className='content w-[80%] mt-[0px]'>
                <h4 className='w-full text-[15px] font-semibold text-black'>
                  {product?.name}
                </h4>
                <div className='pt-1.5 flex items-center'>
                  <p className='font-sans font-semibold text-[#0b1f4e] text-[14px]'>
                    {formatPrice(product.original_price)}
                    <sup>đ</sup>
                  </p>
                  <del className='text-[14px] ml-4 font-medium text-gray-400'>
                    {formatPrice(product.sale_price)}
                    <sup>đ</sup>
                  </del>
                </div>
              </div>

              {/* Chữ Select options */}
              <div className='mt-2 text-[13px] uppercase font-sans w-[80%] mx-auto border-b-1'>
                <p className='text-[11px]'>Select options</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )
}

export default Wishlist