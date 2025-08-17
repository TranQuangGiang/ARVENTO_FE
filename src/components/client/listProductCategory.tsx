import { useEffect, useMemo, useState } from 'react';
import { useList } from '../../hooks/useList';
import { Checkbox, Pagination, Spin } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { useOneData } from '../../hooks/useOne';
import axios from 'axios';

const priceFilters = [
  { id: 1, label: "Dưới 500,000₫", min: 0, max: 500000 },
  { id: 2, label: "500,000₫ - 1,000,000₫", min: 500000, max: 1000000 },
  { id: 3, label: "1,000,000₫ - 2,000,000₫", min: 1000000, max: 2000000 },
  { id: 4, label: "2,000,000₫ - 3,000,000₫", min: 2000000, max: 3000000 },
  { id: 5, label: "Trên 3,000,000₫", min: 3000000, max: Infinity },
];

const sizeFilters = [
  { id: 1, label: "38", value: "38" },
  { id: 2, label: "39", value: "39" },
  { id: 3, label: "40", value: "40" },
  { id: 4, label: "41", value: "41" },
  { id: 5, label: "42", value: "42" },
];

const ListProductCategory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategoryId = searchParams.get('category') || undefined;
  console.log("categoryID:", initialCategoryId);
  

  const [allProducts, setAllProducts] = useState([]);
  const [isFetchingAll, setIsFetchingAll] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategoryId ? [initialCategoryId] : []);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const { data: categoryList, refetch, isLoading } = useList({
    resource: '/categories/client',
  });

  const { data: singleCategory } = useOneData({
    resource: `/categories/admin`,
    _id: initialCategoryId,
  });
  
  
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsFetchingAll(true);
      let fetchedProducts:any = [];
      let page = 1;
      let hasNextPage = true;
      const limitPerPage = 50;

      while (hasNextPage) {
        try {
          const res = await axios.get(`http://localhost:3000/api/products?page=${page}&limit=${limitPerPage}`);
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
      
      setAllProducts(fetchedProducts);
      setIsFetchingAll(false)
    }
    fetchAllProducts();
  }, []); 

  const filteredProducts  = useMemo(() => {
    if (!allProducts) return [];

    return allProducts.filter((product: any) => {
      const matchCategory  = selectedCategories.length === 0 || selectedCategories.includes(product.category_id);

      let matchPrice = true;
      if (selectedPrice.length > 0) {
        const price = Number(product.original_price?.$numberDecimal || product.original_price || 0);
        matchPrice = selectedPrice.some(id => {
          const range = priceFilters.find(p => p.id.toString() === id);
          return range && price >= range.min && price <= range.max;
        });
      }

      let matchSize = true;
      if (selectedSize.length > 0) {
        const productSizes = product.options?.size || [];
        const selectedSizeValues = selectedSize.map(id => {
          const sizeObj = sizeFilters.find(s => s.id.toString() === id);
          return sizeObj?.value;
        }).filter(Boolean);
        matchSize = selectedSizeValues.some(sizeValue => productSizes.includes(sizeValue));
      }

      return matchCategory && matchPrice && matchSize;
    })
  }, [allProducts, selectedCategories, selectedPrice, selectedSize])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, pageSize]);
  
  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
    setCurrentPage(1);
  };

  const handlePriceChange = (checkedValues: string[]) => {
    setSelectedPrice(checkedValues);
    setCurrentPage(1);
  };

  const handleSizeChange = (checkedValues: string[]) => {
    setSelectedSize(checkedValues);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth"});
  }

  const formatPrice = (price: any) => {
    if (typeof price === 'object' && price?.$numberDecimal) {
      return Number(price.$numberDecimal).toLocaleString();
    }
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return 'Contact';
  };

  return (
    <div className="w-full mt-0">
      <div className="w-[76%] mx-auto pt-4">
        <nav className="text-[14px] text-gray-600">
          <Link to="/" className="hover:text-black">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{singleCategory?.data.name}</span>
        </nav>
      </div>

      <div className="w-[76%] mx-auto pt-6 mb-[100px] flex gap-6 bg-white">
        {/* Filters */}
        <div className="w-[20%]">
          <div
            style={{
              border: '1px solid #eee',
              padding: '16px',
              borderRadius: 8,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Danh mục sản phẩm
            </div>

            {isLoading ? (
              <Spin />
            ) : (
              <Checkbox.Group
                value={selectedCategories}
                onChange={handleCategoryChange}
                options={(categoryList?.data || []).map((item: any) => ({
                  label: item.name,
                  value: item._id.toString(),
                }))}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              />
            )}
          </div>

          <div
            className='mt-4'
            style={{
              border: '1px solid #eee',
              padding: '16px',
              borderRadius: 8,
            }}
          >
            <div className='border-b border-b-gray-300 h-[35px]' style={{ fontWeight: 600, marginBottom: 8 }}>
              Lọc theo giá
            </div>

            {isLoading ? (
              <Spin />
            ) : (
              <Checkbox.Group
                value={selectedPrice}
                onChange={handlePriceChange}
                options={priceFilters.map((item: any) => ({
                  label: `${item.label}`,
                  value: item.id.toString(),
                }))}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              />
            )}
          </div>

          <div
            className='mt-4'
            style={{
              border: '1px solid #eee',
              padding: '16px',
              borderRadius: 8,
            }}
          >
            <div className='border-b border-b-gray-300 h-[35px]' style={{ fontWeight: 600, marginBottom: 8 }}>
              Size
            </div>

            {isLoading ? (
              <Spin />
            ) : (
              <Checkbox.Group
                value={selectedSize}
                onChange={handleSizeChange}
                options={sizeFilters.map((item: any) => ({
                  label: `${item.label}`,
                  value: item.id.toString(),
                }))}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              />
            )}
          </div>
        </div>

        {/* Product List */}
        <div className='w-[80%] mx-auto'>
          <div className='[&_h3]:text-[18px] [&_h3]:font-bold mb-4'>
            <h3>{singleCategory?.data.name}</h3>
          </div>

          <div className='list-product w-full grid grid-cols-4 gap-[26px]'>
            {paginatedProducts && paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: any) => (
                <Link to={`/detailProductClient/${product._id}`} key={product._id}>
                  <div className='list-product-one overflow-hidden w-[220px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center cursor-pointer group'>
                    <div className='w-[200px] h-[160px] overflow-hidden flex items-center'>
                      <img
                        className='w-[220px] h-[230px] mt-0 transition-all duration-300 group-hover:scale-[1.1]'
                        src={product.images?.[0]?.url || "/default.png"}
                        alt={product.name}
                      />
                    </div>
                    <div className='content w-[80%] mt-[0px]'>
                      <h4 className='w-full text-[15px] font-semibold font-sans text-[black] leading-[18px] h-[38px] overflow-hidden line-clamp-2'>
                        {product.name}
                      </h4>
                      <div className='pt-1.5 flex items-center'>
                        <p className=' font-semibold text-[#0b1f4e] text-[14px]'>
                          {formatPrice(product.original_price)}<sup>₫</sup>
                        </p>
                       
                      </div>
                    </div>
                    <div className='mt-2 text-[13px] uppercase w-[80%] mx-auto border-b-1'>
                      <p>Select options</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 text-[16px]">
                No matching products found.
              </p>
            )}
          </div>
          <div className='w-full mt-10 right-0 flex justify-end'>
            {
              filteredProducts.length > pageSize && (
                <div className='text-center'>
                  <Pagination 
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredProducts.length}
                    onChange={handlePageChange}
                  />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListProductCategory;
