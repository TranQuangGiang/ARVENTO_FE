import { useEffect, useMemo, useState } from 'react';
import { useList } from '../../hooks/useList';
import { Checkbox, Pagination, Spin } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { useOneData } from '../../hooks/useOne';

const priceFilters = [
  { id: 1, label: "Under 500,000₫", min: 0, max: 500000 },
  { id: 2, label: "500,000₫ - 1,000,000₫", min: 500000, max: 1000000 },
  { id: 3, label: "1,000,000₫ - 2,000,000₫", min: 1000000, max: 2000000 },
  { id: 4, label: "2,000,000₫ - 3,000,000₫", min: 2000000, max: 3000000 },
  { id: 5, label: "Over 3,000,000₫", min: 3000000, max: Infinity },
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
  const page = Number(searchParams.get("page")) || 1;
  const categoryId = searchParams.get('category') || undefined;

  const { data: categoryList, refetch, isLoading } = useList({
    resource: '/categories/client',
  });

  const { data: singleCategory } = useOneData({
    resource: `/categories/admin`,
    _id: categoryId,
  });
  console.log(singleCategory);
  

  const { data: productData, refetch: refetchProducts } = useList({
    resource: `/products`,
    config: {
      pagination: {
        current: page,
        pageSize: 12, // limit 12 per BE
      },
    },
  });

  const allProducts = productData?.data.docs || [];
  const totalProducts = productData?.data.totalDocs || 0;
  const categories = categoryList?.data || [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategories([categoryId]);
    }
  }, [categoryId]);

  const handleCategoryChange = (checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
  };

  const handlePriceChange = (checkedValues: string[]) => {
    setSelectedPrice(checkedValues);
  };

  const handleSizeChange = (checkedValues: string[]) => {
    setSelectedSize(checkedValues);
  };

  const formatPrice = (price: any) => {
    if (typeof price === 'object' && price?.$numberDecimal) {
      return Number(price.$numberDecimal).toLocaleString();
    }
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return 'Contact';
  };

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((product: any) => {
      const matchCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category_id);

      let matchPrice = true;
      if (selectedPrice.length > 0) {
        const price = Number(product.sale_price?.$numberDecimal || product.sale_price || 0);
        matchPrice = selectedPrice.some(id => {
          const range = priceFilters.find(p => p.id.toString() === id);
          return range && price >= range.min && price <= range.max;
        });
      }

      let matchSize = true;
      if (selectedSize.length > 0) {
        const selectedSizeValues = selectedSize.map(id => {
          const sizeObj = sizeFilters.find(s => s.id.toString() === id);
          return sizeObj?.value;
        }).filter(Boolean);

        const productSizes = product.options?.size || [];
        matchSize = selectedSizeValues.some(size => productSizes.includes(size));
      }

      return matchCategory && matchPrice && matchSize;
    });
  }, [allProducts, selectedCategories, selectedPrice, selectedSize]);

  return (
    <div className="w-full mt-0">
      <div className="w-[76%] mx-auto pt-4">
        <nav className="text-[14px] text-gray-600">
          <Link to="/" className="hover:text-black">Home</Link>
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
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Product Categories
            </div>

            {isLoading ? (
              <Spin />
            ) : (
              <Checkbox.Group
                value={selectedCategories}
                onChange={handleCategoryChange}
                options={categories.map((item: any) => ({
                  label: `${item.name}`,
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
            <div className='border-b border-b-gray-300 h-[35px]' style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Price Filter
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
            <div className='border-b border-b-gray-300 h-[35px]' style={{ fontWeight: 'bold', marginBottom: 8 }}>
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
          <div className='[&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:font-sans mb-4'>
            <h3>{singleCategory?.data.name}</h3>
          </div>

          <div className='list-product w-full grid grid-cols-4 gap-[26px]'>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
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
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 text-[16px]">
                No matching products found.
              </p>
            )}
            {totalProducts > 12 && (
              <div className='mt-8 text-center'>
                <Pagination
                  current={page}
                  pageSize={12}
                  total={totalProducts}
                  onChange={(newPage) => {
                    setSearchParams((params) => {
                      params.set("page", newPage.toString());
                      return params;
                    })
                  }}
                >

                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListProductCategory;
