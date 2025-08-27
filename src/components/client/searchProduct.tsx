import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useList } from '../../hooks/useList';
import axios from 'axios';
import { Pagination } from 'antd';
import { useQuery } from '@tanstack/react-query';

const SearchProduct = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;
    
    const { data:allProductData, isLoading: isFetchingAll } = useQuery({
        queryKey: ['products', keyword],
        queryFn: async () => {
            let fetchedProducts:any = [];
            let page = 1;
            let hasNextPage = true;
            const limitPerPage = 15;

            while(hasNextPage) {
                try {
                    const res = await axios.get(`http://localhost:3000/api/products/search?keyword=${keyword}&page=${page}&limit=${limitPerPage}`);
                    const { data } = res?.data;

                    if (data && data.docs) {
                        fetchedProducts = [...fetchedProducts, ...data.docs];
                    }
                    if (data && data.hasNextPage) {
                        page = data.nextPage;
                    } else {
                        hasNextPage = false;
                    }
                } catch (error) {
                    console.error("Lỗi khi tải sản phẩm:", error);
                    hasNextPage = false;
                }
            }
            const activeProducts = fetchedProducts.filter((p: any) => p.isActive);
            return activeProducts;
        }
    })    

    const formatPrice = (price: any) => {
        if (typeof price === 'object' && price?.$numberDecimal) {
            return Number(price.$numberDecimal).toLocaleString();
        }
        if (typeof price === 'number') {
            return price.toLocaleString();
        }
        return 'Contact us';
    };
    
    const paginatedProducts = useMemo(() => {
        if (!allProductData) {
            return []; // Trả về mảng rỗng nếu chưa có dữ liệu
        }
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return allProductData.slice(startIndex, endIndex);

    }, [allProductData, currentPage, pageSize]); 

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth"});
    }
    return (
        <div className='w-full mt-0 bg-white'>
            <div className="w-[76%] mx-auto pt-10">
                <nav className="text-[14px] text-gray-600 mb-4">
                    <Link to="/" className="hover:text-black">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-black font-medium">Tìm kiếm</span>
                </nav>
                <div className='w-full [&_h4]:text-center [&_h4]:text-[25px] [&_h4]:font-sans [&_h4]:font-semibold'>
                    <h4>Tìm kiếm</h4>
                </div>
            </div>
            <div className='w-[76%] mx-auto'>
                <p className='text-[15px] font-sans flex items-center'>
                    Kết quả tìm kiếm cho: 
                    <strong className='ml-2'>"{keyword}"</strong>
                </p>
            </div>
            <div className='list-product w-[76%] mx-auto mt-6 mb-[40px] grid grid-cols-5 gap-6'>
                {paginatedProducts?.length > 0 ? (
                    paginatedProducts.map((product: any, index: any) => {
                        const imageIndex = index % 2 === 0 ? 0 : 5;
                        let imageUrl = "/default.png";
                        if (product.images && product.images.length > 0) {
                            if (product.images && product.images.length <= 5) {
                                imageUrl = product.images[0]?.url
                            } else {
                                imageUrl = product.images[imageIndex]?.url
                            }
                        }
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
                                                {formatPrice(product.original_price)}<sup>₫</sup>
                                            </p>
                                           
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
            <div className='max-w-[76%] mx-auto mt-10 mb-10 right-0 flex justify-end'>
                {
                    allProductData?.length > pageSize && (
                        <div className='text-center'>
                        <Pagination 
                            current={currentPage}
                            pageSize={pageSize}
                            total={allProductData?.length}
                            onChange={handlePageChange}
                        />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default SearchProduct;
