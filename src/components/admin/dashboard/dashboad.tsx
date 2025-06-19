import { HandCoins, ShoppingBag, UserLock } from 'lucide-react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
const Dashboad = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3}}
      >
        <motion.div
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 50}}
          transition={{duration: 0.5, ease: "easeOut"}}
        >
          <div className='w-[94%] pt-[20px] min-h-screen ml-[40px] transition-all duration-500 -translate-2.5'>
            <div className='w-[full] mx-auto flex mt-[40px] gap-[20px]'>
              <div className='relative w-[30%] h-[150px] bg-[#fff] border border-[#E0E4ED] rounded-[2px]'>
                <div className='w-[60px] absolute -top-[30px] right-[40px] h-[60px] bg-white border border-[#E0E4ED] rounded-[50%] flex items-center justify-center'>
                  <HandCoins className='text-[#09ad95]' size={30} />
                </div>
                <div className='content w-full mt-[50px] flex justify-around'>
                  <span>
                    <p className='text-[17px] font-sans text-gray-600 font-medium'>Total Sells</p>
                    <h3 className='mt-[15px] text-[20px] font-semibold'>$654.66k</h3>
                  </span>
                  <span>   
                    <p className='text-[17px] font-sans text-[#09ad95] font-medium'>+16.24 %</p>
                    <p className='mt-[20px] cursor-pointer transition-all duration-300 hover:text-red-500 text-[12px] border-b pb-0.5'>View net earnings</p>
                  </span>
                </div>  
              </div>
              <div className='relative w-[30%] h-[150px] bg-[#fff] border border-[#E0E4ED] rounded-[2px]'>
                <div className='w-[60px] absolute -top-[30px] right-[40px] h-[60px] bg-white border border-[#E0E4ED] rounded-[50%] flex items-center justify-center'>
                  <ShoppingBag  className='text-[#ff677b]' size={30} />
                </div>
                <div className='content w-full mt-[50px] flex justify-around'>
                  <span>
                    <p className='text-[17px] font-sans text-gray-600 font-medium'>Total Orders</p>
                    <h3 className='mt-[15px] text-[20px] font-semibold'>$854.66k</h3>
                  </span>
                  <span>   
                    <p className='text-[17px] font-sans text-[#ff677b] font-medium'>+80.24 %</p>
                    <p className='mt-[20px] cursor-pointer transition-all duration-300 hover:text-red-500 text-[12px] border-b pb-0.5'>View net earnings</p>
                  </span>
                </div>  
              </div>
              <div className='relative w-[30%] h-[150px] bg-[#fff] border border-[#E0E4ED] rounded-[2px]'>
                <div className='w-[60px] absolute -top-[30px] right-[40px] h-[60px] bg-white border border-[#E0E4ED] rounded-[50%] flex items-center justify-center'>
                  <UserLock  className='text-[#6176fe]' size={30} />
                </div>
                <div className='content w-full mt-[50px] flex justify-around'>
                  <span>
                    <p className='text-[17px] font-sans text-gray-600 font-medium'>Daily Visitors</p>
                    <h3 className='mt-[15px] text-[20px] font-semibold'>$987.21M</h3>
                  </span>
                  <span>   
                    <p className='text-[17px] font-sans text-[#6176fe] font-medium'>+80.00 %</p>
                    <p className='mt-[20px] cursor-pointer transition-all duration-300 hover:text-red-500 text-[12px] border-b pb-0.5'>See details</p>
                  </span>
                </div>  
              </div>
              <div className='relative w-[30%] h-[150px] bg-[#fff] border border-[#E0E4ED] rounded-[2px]'>
                <div className='w-[60px] absolute -top-[30px] right-[40px] h-[60px] bg-white border border-[#E0E4ED] rounded-[50%] flex items-center justify-center'>
                  <UserLock  className='text-yellow-400' size={30} />
                </div>
                <div className='content w-full mt-[50px] flex justify-around'>
                  <span>
                    <p className='text-[17px] font-sans text-gray-600 font-medium'>Daily Visitors</p>
                    <h3 className='mt-[15px] text-[20px] font-semibold'>$654.66k</h3>
                  </span>
                  <span>   
                    <p className='text-[17px] font-sans text-yellow-400 font-medium'>+16.24 %</p>
                    <p className='mt-[20px] cursor-pointer transition-all duration-300 hover:text-red-500 text-[12px] border-b pb-0.5'>See details</p>
                  </span>
                </div>  
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    
  )
}

export default Dashboad