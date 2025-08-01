import React from 'react'
import { useList } from '../../../../../hooks/useList'
import { Heart } from 'lucide-react';
import { useDelete } from '../../../../../hooks/useDelete';
import { Link } from 'react-router-dom';
import { AnimatePresence,motion } from 'framer-motion';
import { HeartFilled } from '@ant-design/icons';


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
      { 
        data?.data?.length > 0 ? (
          data?.data?.map((item:any) => {
            const product = item.product_id;

            return (
              <div
                key={item._id}
                className='relative list-product-one overflow-hidden w-[220px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center rounded cursor-pointer group'
              >
                {/* Icon trái tim (yêu thích) */}
                <AnimatePresence>
                  <motion.div
                    initial={{opacity: 0, scale: 0.5}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.5}}
                    transition={{type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.3, 1],
                      transition: {
                          duration: 0.7, // Tăng thời gian để hiệu ứng mượt hơn
                          ease: "easeInOut",
                          repeat: Infinity, // Lặp lại vô hạn
                          repeatType: "loop" // Lặp lại từ đầu mỗi lần
                      }
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-[10px] right-[10px] z-10"
                  >
                    <HeartFilled style={{color: "red", fontSize: 24, }} onClick={() => delWishlist(product._id)}  />
                  </motion.div>
                </AnimatePresence>
                
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
                   {Number(product.sale_price) > 0 ? (
                      <div>
                        <p className='font-sans font-semibold text-[#0b1f4e] text-[14px]'>
                          {formatPrice(product.sale_price)}
                          <sup>đ</sup>
                        </p>
                        <del className='text-[14px] ml-4 font-medium text-gray-400'>
                          {formatPrice(product.original_price)}
                          <sup>đ</sup>
                        </del>
                      </div>
                      
                    ): (
                      <div>
                        <p className='font-sans font-semibold text-[#0b1f4e] text-[14px]'>
                          {formatPrice(product.original_price)}
                          <sup>đ</sup>
                        </p>
                      </div>
                    )}
                    
                  </div>
                </div>

                {/* Chữ Select options */}
                <div className='mt-2 text-[13px] uppercase font-sans w-[80%] mx-auto border-b-1'>
                  <p className='text-[11px]'>Select options</p>
                </div>
              </div>
            );
          })
        ) : (
           <div className="w-full flex flex-col items-center justify-center rounded-[15px] pt-3 h-[250px] relative bg-white">
            <div className="absolute w-[300px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
            <span className="relative z-10 w-full flex flex-col items-center">
                <img className="w-[170px]" src="/cartD.png" alt="empty-address" />
            </span>
            <p className="mt-2 text-[13px] font-medium font-sans text-blue-950">
                Bạn chưa có sản phẩm yêu thích nào !
            </p>
          </div>
        )
      }
    </div>
  )
}

export default Wishlist