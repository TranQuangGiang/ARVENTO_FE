import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useList } from '../../hooks/useList';

const SearchProduct = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');
    console.log(keyword);
    
    const { data } = useList({
        resource: `/products/search?keyword=${keyword}`
    });
    console.log(data);
    const productSearch = data?.data?.docs;

    const formatPrice = (price: any) => {
        if (typeof price === 'object' && price?.$numberDecimal) {
            return Number(price.$numberDecimal).toLocaleString();
        }
        if (typeof price === 'number') {
            return price.toLocaleString();
        }
        return 'Contact us';
    };

    return (
        <div className='w-full mt-0 bg-white'>
            <div className="w-[76%] mx-auto pt-10">
                <nav className="text-[14px] text-gray-600 mb-4">
                    <Link to="/" className="hover:text-black">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-black font-medium">Search</span>
                </nav>
                <div className='w-full [&_h4]:text-center [&_h4]:text-[25px] [&_h4]:font-sans [&_h4]:font-semibold'>
                    <h4>Search</h4>
                </div>
            </div>
            <div className='w-[76%] mx-auto'>
                <p className='text-[15px] font-sans flex items-center'>
                    Search results for 
                    <strong className='ml-2'>"{keyword}"</strong>
                </p>
            </div>
            <div className='list-product w-[76%] mx-auto mt-6 mb-[40px] grid grid-cols-5 gap-6'>
                {productSearch?.length > 0 ? (
                    productSearch.map((product: any, index: any) => {
                        const imageIndex = index % 2 === 0 ? 0 : 5;
                        const imageUrl = product.images?.[imageIndex]?.url || "/default.png";
                        return (
                            <Link to={`/detailProductClient/${product._id}`} key={product._id}>
                                <div className='list-product-one overflow-hidden w-[220px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center cursor-pointer group'>
                                    <div className='w-[200px] h-[160px] overflow-hidden flex items-center'>
                                        <img
                                            className='w-[220px] h-[220px] mt-0 transition-all duration-300 group-hover:scale-[1.1]'
                                            src={imageUrl}
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className='content w-[80%] mt-[0px]'>
                                        <h4 className='w-full text-[15px] font-semibold font-sans text-black leading-[18px] h-[38px] overflow-hidden line-clamp-2'>
                                            {product.name}
                                        </h4>
                                        <div className='pt-1.5 flex items-center'>
                                            <p className='font-sans font-semibold text-[#0b1f4e] text-[14px]'>
                                                {formatPrice(product.sale_price)}<sup>₫</sup>
                                            </p>
                                            <del className='text-[14px] ml-4 font-medium text-gray-400'>
                                                {formatPrice(product.original_price)}<sup>₫</sup>
                                            </del>
                                        </div>
                                    </div>
                                    <div className='mt-2 text-[13px] uppercase font-sans w-[80%] mx-auto border-b-1'>
                                        <p className='text-[11px]'>Select options</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <p className='text-gray-500 text-[15px] mt-4'>No matching products found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchProduct;
