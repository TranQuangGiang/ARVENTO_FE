import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useList, useListClient } from '../../hooks/useList';
import BannerClient from '../../layout/client/banner';
import { useEffect, useState } from 'react'; // Import useState and useEffect
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const ListProductClient = () => {
  const location = useLocation();

  const { data: allProductData, isFetching: isFetchingAll } = useListClient({
    resource: '/products',
  });

  const { data: categoryProductData, isFetching: isFetchingCategory } = useListClient({
    resource: '/products?category_id=6843e798c4fb85b25844b4a2',
  });

  const products = allProductData?.data?.docs || [];
  const categoryProducts = categoryProductData?.data?.docs || [];

  // State để lưu trữ variants của từng sản phẩm
  const [productVariants, setProductVariants] = useState<{ [productId: string]: any[] }>({});

  // Fetch variants for each product
  useEffect(() => {
    const fetchVariants = async () => {
      const newProductVariants: { [productId: string]: any[] } = {};
      for (const product of [...products, ...categoryProducts]) {
        if (!productVariants[product._id]) { // Only fetch if not already fetched
          try {
            // Sử dụng useListClient để gọi API lấy variants
            const { data: variantsData } = await useListClient({
              resource: `/variants/products/${product._id}/variants`, // API để lấy variants của sản phẩm
            });
            newProductVariants[product._id] = variantsData?.data || [];
          } catch (error) {
            console.error(`Failed to fetch variants for product ${product._id}:`, error);
            newProductVariants[product._id] = []; // Set empty array on error
          }
        }
      }
      setProductVariants((prev) => ({ ...prev, ...newProductVariants }));
    };

    if (products.length > 0 || categoryProducts.length > 0) {
      fetchVariants();
    }
  }, [products, categoryProducts]); // Re-run when products or categoryProducts change

  const formatPrice = (price: any) => {
    if (typeof price === 'object' && price?.$numberDecimal) {
      return Number(price.$numberDecimal).toLocaleString();
    }
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return 'Liên hệ';
  };

  const getVariantPrices = (productId: string) => {
    const variants = productVariants[productId];
    if (!variants || variants.length === 0) {
      // Fallback to product's original_price if no variants or variants not yet loaded
      const product = [...products, ...categoryProducts].find(p => p._id === productId);
      if (product && product.original_price) {
        return {
          displayPrice: formatPrice(product.original_price),
          originalPrice: formatPrice(product.original_price)
        };
      }
      return { displayPrice: 'Liên hệ', originalPrice: 'Liên hệ' };
    }

    // Lấy giá của variant đầu tiên (hoặc variant bạn muốn hiển thị)
    const firstVariant = variants[0];
    const originalPrice = firstVariant.price;
    const salePrice = firstVariant.sale_price;

    // Áp dụng logic: nếu sale_price bằng 0 thì lấy price làm giá hiển thị
    const displayPrice = (salePrice === 0 || salePrice === undefined || salePrice === null) ? originalPrice : salePrice;

    return {
      displayPrice: formatPrice(displayPrice),
      originalPrice: formatPrice(originalPrice)
    };
  };


  const newestProducts = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12);

  const { data: categorys, refetch } = useList({
    resource: `/categories/client`
  });
  const category = categorys?.data;

  const { data: PostCLient, refetch: refetchPost } = useList({
    resource: `/posts/client`
  });
  const posts = PostCLient?.data?.docs || [];

  // lấy ra 2 bài viết mới nhất
  const latesPost = posts.slice(0, 2);

  return (
    <main>
      <div className=' w-[100%]'>
        {location.pathname === "/" && <BannerClient />}
        <div className='list-product max-w-[76%] mx-auto mt-[100px] mb-[80px] flex items-center justify-between'>
          {isFetchingAll && <p>Loading...</p>}
          {!isFetchingAll && (
            <div className='w-[calc(100%-275px)]'>
              <Swiper 
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween = {40}
                slidesPerView={4}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                loop={true} // lặp vô hạn
                breakpoints = {{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  }, 
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                }}
              >
                {newestProducts.map((product, index) => {
                  const imageIndex = index % 2 === 0 ? 0 : 5;
                  let imageUrl = "/default.png";
                  if (product.images && product.images.length > 0) {
                    if (product.images && product.images.length <= 5) {
                      imageUrl = product.images[0]?.url
                    } else {
                      imageUrl = product.images[imageIndex]?.url
                    }
                  }
                  const { displayPrice, originalPrice } = getVariantPrices(product._id);

                  return (
                    <SwiperSlide>
                      <Link to={`/detailProductClient/${product._id}`} key={product._id}>
                        <div className='list-product-one overflow-hidden w-[201px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center cursor-pointer group'>
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
                                {displayPrice}<sup>đ</sup>
                              </p>
                              {displayPrice !== originalPrice && ( // Chỉ hiển thị giá gốc nếu có sale
                                <del className='text-[14px] ml-4 font-medium text-gray-400'>
                                  {originalPrice}<sup>đ</sup>
                                </del>
                              )}
                            </div>
                          </div>
                          <div className='mt-2 text-[13px] uppercase font-sans w-[80%] mx-auto border-b-1'>
                            <p className='text-[11px]'>Select options</p>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide> 
                  )
                })}
              </Swiper>
            </div>
          )}
          <div className='w-[255px] relative h-[300px] bg-[#0b1f4e] flex flex-col gap-3'>
            <div className='pt-[35px] pl-[30px]'>
              <h3 className='text-[20px] text-white font-sans font-bold uppercase'>Sản phẩm mới.</h3>
              <p className='text-[13px] text-white w-[80%] gap-1 mt-2.5 mb-1.5'>
                Khám phá dòng sản phẩm đột phá, kết hợp công nghệ hiện đại và thiết kế tinh tế. Mang đến trải nghiệm hoàn toàn mới, giúp bạn giải quyết mọi vấn đề một cách hiệu quả.
              </p>
              <button className='mt-[10px] w-[140px] h-[45px] text-[#fff] text-[14px] font-sans border border-[#fff] transition-all cursor-pointer duration-300 hover:bg-white hover:text-black uppercase'>
                XEM THÊM <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
            <div className='w-[35%] absolute bottom-0 right-0 z-20'>
              <p className='w-[100%] h-[150px] bg-[#ff0000] clip-do'></p>
            </div>
          </div>
        </div>

        <div className="max-w-[76%] mx-auto my-10">
          <h2 className="text-xl font-semibold mb-6 uppercase text-gray-700">Danh mục sản phẩm</h2>
          <div className="w-full flex flex-wrap justify-between">
            {category?.map((item: any) => (
              <Link key={item._id} to={`/products?category=${item._id}`}>
                <div
                  className="flex w-[115px] h-[130px] flex-col bg-white shadow-md hover:shadow-xl items-center cursor-pointer group p-2 transition-all duration-300"
                >
                  <div className="w-16 h-16 overflow-hidden flex items-center justify-center mb-2">
                    <img
                      src={item.image?.url || "/default-category.png"}
                      alt={item.name}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <p className="text-center text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    {item.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="banner w-full h-[350px] mt-[100px] mb-[60px] overflow-hidden banner-shine relative">
          <div className="w-full h-full relative overflow-hidden">
            <img
              className="absolute object-cover w-full -top-[250px]"
              src="/healthy.jpg"
              alt=""
            />
            <div className="content w-[30%] absolute top-[55px] left-[290px]">
              <h3 className="text-white font-sans font-bold text-[36px] leading-11 uppercase">
                Giúp bạn luôn thể thao và phong cách
              </h3>
              <p className="text-white text-[14px] font-medium mt-[20px] font-sans">
                Tự tin thể hiện cá tính trong mọi hoạt động. Sản phẩm của chúng tôi không chỉ mang lại hiệu suất vượt trội mà còn giúp bạn luôn dẫn đầu xu hướng.
              </p>
              <Link to={``}>
                <button className="text-white mt-[20px] w-[140px] uppercase font-sans text-[14px] h-[50px] border border-[#fff] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                  MUA SẮM NGAY
                </button>
              </Link>
            </div>
          </div>
        </div>


        <div className='list-product max-w-[76%] mx-auto mt-[120px] mb-[40px] flex items-center justify-center'>
          <div className='w-[255px] relative h-[340px] flex items-center justify-center bg-[#ef5d5d]'>
            <img className='w-full h-[340px] absolute right-0 top-0 bottom-0 clip-diagonal-2' src="/73.jpg" alt="" />
            <div className='w-[80%] h-[80%] bg-[#ededed]/80 absolute mx-auto z-30 [&_img]:w-[150px] flex flex-col items-center justify-center group'>
              <img className='transition-all duration-300 group-hover:scale-[1.1]' src="/img1.png" alt="" />
              <div className='content mt-0 w-[80%] mx-auto'>
                <h3 className='font-sans font-bold text-[19px] uppercase'>Nike - Xtrema 3 Edition</h3>
                <p className='text-[13px] mt-[10px] cursor-pointer font-light font-sans text-[#0b1f4e] uppercase'>
                  Xem thêm <FontAwesomeIcon className=' text-[12px] font-light' icon={faArrowRight} />
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col ml-[20px] relative'>
            <div className='w-full flex items-center justify-between absolute -top-[10px]'>
              <h3 className='text-[22px] font-sans font-bold uppercase'>FILLO Special Edition</h3>
              <span className='ml-[10px] mr-[10px] w-[500px] h-[1px] border border-[#ededed]'></span>
              <p className='text-[13px] ml-[3px] cursor-pointer font-light font-sans text-black uppercase'>
                Xem thêm <FontAwesomeIcon className='font-light text-[12px]' icon={faArrowRight} />
              </p>
            </div>
            <div className='list-product flex items-center justify-between gap-[21px] mt-[40px]'>
              {isFetchingCategory && <p>Loading...</p>}
              {!isFetchingCategory &&
                categoryProducts.map((product: any, index: any) => {
                  const imageIndex = index % 2 === 0 ? 0 : 5;
                  let imageUrl = "/default.png";
                  if (product.images && product.images.length > 0) {
                    if (product.images && product.images.length <= 5 ) {
                      imageUrl = product.images[0]?.url
                    } else {
                      imageUrl = product.images[imageIndex]?.url
                    }
                  }
                  const { displayPrice, originalPrice } = getVariantPrices(product._id); // Lấy giá từ variants

                  return (
                    <Link to={`/detailProductClient/${product._id}`} key={product._id}>
                      <div className='list-product-one overflow-hidden w-[201px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center cursor-pointer group'>
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
                              {displayPrice}<sup>đ</sup>
                            </p>
                            {displayPrice !== originalPrice && (
                              <del className='text-[14px] ml-4 font-medium text-gray-400'>
                                {originalPrice}<sup>đ</sup>
                              </del>
                            )}
                          </div>
                        </div>
                        <div className='mt-2 text-[13px] uppercase font-sans w-[80%] mx-auto border-b-1'>
                          <p className='text-[11px]'>Select options</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>

        <div className='max-w-[75%] mt-[80px] mx-auto mb-[120px] flex flex-col'>
          <div className='w-[100%] flex items-center justify-between mb-[25px]'>
            <h3 className='text-[25px] font-sans font-bold uppercase'>Tất cả sản phẩm</h3>
            <span className='w-[800px] h-[1px] border border-[#ededed]'></span>
            <p className='text-[15px] cursor-pointer font-light font-sans text-black uppercase'>
              Xem thêm <FontAwesomeIcon className='font-light' icon={faArrowRight} />
            </p>
          </div>
          <div className='list-product w-full grid grid-cols-4 gap-[24px]'>
            {isFetchingAll && <p>Loading...</p>}
            {!isFetchingAll &&
              products.map((product: any, index: any) => {
                const imageIndex = index % 2 === 0 ? 0 : 5;
                let imageUrl = "/default.png";
                if (product.images && product.images.length > 0) {
                  if (product.images && product.images.length <=5 ) {
                    imageUrl = product.images[0]?.url
                  } else {
                    imageUrl = product.images[imageIndex]?.url
                  }
                } 
                const { displayPrice, originalPrice } = getVariantPrices(product._id); // Lấy giá từ variants

                return (
                  <Link to={`/detailProductClient/${product._id}`} key={product._id}>
                    <div className='list-product-one w-[100%] h-[330px] bg-[#f2f2f2] overflow-hidden flex flex-col items-center justify-center cursor-pointer group'>
                      <div className='w-[260px] h-[200px] overflow-hidden flex items-center'>
                        <img
                          className='w-[270px] max-h-[270px] mt-0 transition-all duration-300 group-hover:scale-[1.1]'
                          src={imageUrl}
                          alt={product.name}
                        />
                      </div>
                      <div className='content w-[80%] mt-0'>
                        <h4 className='w-full text-[15px] text-left font-semibold font-sans text-black leading-[18px] h-[38px] overflow-hidden line-clamp-2'>
                          {product.name}
                        </h4>
                        <div className='pt-1.5 flex items-center'>
                          <p className='font-sans text-left font-medium text-[#0b1f4e] text-[15px]'>
                            {displayPrice}<sup>đ</sup>
                          </p>
                          {displayPrice !== originalPrice && (
                            <del className='text-[15px] text-left ml-6 font-sans font-medium text-gray-400'>
                              {originalPrice}<sup>đ</sup>
                            </del>
                          )}
                        </div>
                      </div>
                      <div className='mb-4 mt-1 w-[80%] mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                        <p className='mt-[5px]'>Select options</p>
                      </div>
                    </div>
                  </Link>
                );
              })}

          </div>
        </div>
        <div className='list-page w-[74%] mx-auto flex gap-[25px] mb-[120px]'>
          {
            latesPost.map((post: any) => (
              <div className='list-page-1 w-[50%] h-[320px] overflow-hidden relative group'>
                <img className='w-full absolute transition-all duration-300 group-hover:scale-[1.1]' src={post.thumbnail} alt="" />
                <div className="className='w-full h-full absolute inset-0 bg-black/40"></div>
                <div className='content w-full h-full absolute flex flex-col justify-center items-end text-right top-[30px] right-7'>
                  <h3 className='text-white font-sans uppercase text-[22px] font-bold mb-4'>{post.title}</h3>
                  <p className="text-white font-sans font-medium text-[12px] mb-5 max-w-[450px]">
                    {post.excerpt}
                  </p>
                  <Link to={`/detailBlog/${post.slug}`}>
                    <button className="text-white text-[15px] border border-white w-[150px] h-[50px] font-sans font-light hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                      Xem ngay
                    </button>
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className='w-full h-[380px] overflow-hidden relative'>
        <img className='w-full h-[960px] absolute -bottom-[300px]' src="/footer.jpg" alt="" />
        <div className='w-full h-full absolute inset-0 bg-black/70 flex flex-col items-center justify-center'>
          <h2 className='text-white font-bold font-sans text-[36px] uppercase w-[560px] text-center leading-9'>SIgn Up NEwsletter & Get 15% Off</h2>
          <form action="" className='flex items-center justify-center mt-[40px]'>
            <input type="text" className='w-[420px] h-[55px] bg-white text-gray-400 pl-[25px] outline-0' placeholder='Email' />
            <button className='h-[56px] ml-[20px] text-white font-sans font-light w-[155px] bg-[#01225a] text-[15px]'><FontAwesomeIcon icon={faPaperPlane} /> Submit</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ListProductClient;