import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useList, useListClient } from '../../hooks/useList';
import BannerClient from '../../layout/client/banner';

const ListProductClient = () => {
  const location = useLocation();

  const { data: allProductData, isFetching: isFetchingAll } = useListClient({
    resource: '/products',
  });

  const { data: categoryProductData, isFetching: isFetchingCategory } = useListClient({
    resource: '/products?category_id=6843e798c4fb85b25844b4a2',
  });

  const products = allProductData?.data?.docs || [];
  console.log(products);
  
  const categoryProducts = categoryProductData?.data?.docs || [];
  
  const formatPrice = (price:any) => {
    if (typeof price === 'object' && price?.$numberDecimal) {
      return Number(price.$numberDecimal).toLocaleString();
    }
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return 'Liên hệ';
  };

  const newestProducts = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);
  
    
  const { data:categorys, refetch } = useList({
    resource: `/categories/client`
  }) ;
  const category = categorys?.data; 

  const { data:PostCLient } = useList({
    resource: `/posts/client`
  });
  const posts = PostCLient?.data?.docs || [];
  
  // lấy ra 2 bài viết mới nhất 
  const latesPost = posts.slice(0, 2);
  console.log(PostCLient);
  
  return (
    <main>
      <div className=' w-[100%]'>
        {location.pathname === "/" && <BannerClient />}
        <div className='list-product w-[74%] mx-auto mt-[100px] mb-[40px] flex items-center justify-center gap-[21px]'>
          {isFetchingAll && <p>Loading...</p>}
          {!isFetchingAll &&
            newestProducts.map((product) => (
              <Link to={`/detailProductClient/${product._id}`}>
                <div
                  key={product._id}
                  className='list-product-one overflow-hidden w-[220px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center cursor-pointer group'
                >
                  <div className='w-[200px] h-[160px] overflow-hidden flex items-center'>
                    <img
                      className='w-[220px] h-[230px] mt-0 transition-all duration-300 group-hover:scale-[1.1]'
                      src={product.images?.[0]?.url || "/default.png"}
                      alt={product.name}
                    />
                  </div>
                  <div className='content w-[80%] mt-[0px]'>
                    <h4 className='w-full text-[15px] font-semibold text-black'>{product.name}</h4>
                    <div className='pt-1.5 flex items-center'>
                      <p className='font-sans font-semibold text-[#0b1f4e] text-[14px]'>
                        {formatPrice(product.sale_price)}<sup>đ</sup>
                      </p>
                      <del className='text-[14px] ml-4 font-medium text-gray-400'>{formatPrice(product.original_price)}<sup>đ</sup></del>
                    </div>
                  </div>
                  <div className='mt-2 text-[13px] uppercase font-sans w-[80%] mx-auto border-b-1'>
                    <p className='text-[11px]'>Select options</p>
                  </div>
                </div>
              </Link>
            ))}

          <div className='w-[285px] relative h-[300px] bg-[#0b1f4e] flex flex-col gap-3'>
            <div className='pt-[35px] pl-[30px]'>
              <h3 className='text-[20px] text-white font-sans font-bold uppercase'>Hot Product.</h3>
              <p className='text-[13px] text-white w-[80%] gap-1'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </p>
              <button className='mt-[10px] w-[140px] h-[45px] text-[#fff] text-[14px] font-sans border border-[#fff] transition-all cursor-pointer duration-300 hover:bg-white hover:text-black uppercase'>
                See more <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
            <div className='w-[35%] absolute bottom-0 right-0 z-20'>
              <p className='w-[100%] h-[150px] bg-[#ff0000] clip-do'></p>
            </div>
          </div>
        </div>

        <div className=' grid grid-cols-6 gap-6'>
          {category?.map((item: any) => (
            <div
              key={item._id}
              className='flex flex-col items-center justify-center p-4 bg-[#f9f9f9] rounded-lg shadow hover:bg-[#f2f2f2] cursor-pointer transition'
            >
              <div className='w-[60px] h-[60px] rounded-full bg-[#ddd] flex items-center justify-center text-[24px] font-bold text-white bg-blue-500 mb-2'>
                {item.name?.charAt(0)}
              </div>
              <p className='text-[14px] text-center font-medium'>{item.name}</p>
            </div>
          ))}
        </div>

        <div className='banner w-full h-[350px] mt-[10px] mb-[60px] overflow-hidden'>
          <div className='w-[1800px] h-full relative overflow-hidden'>
            <img className='absolute object-cover w-[1800px] -top-[250px]' src="/healthy.jpg" alt="" />
            <div className='content w-[30%] absolute top-[55px] left-[290px]'>
              <h3 className='text-white font-sans font-bold text-[36px] leading-11 uppercase'>Makes Yourself Keep Sporty & Stylish</h3>
              <p className='text-white text-[14px] font-medium mt-[20px] font-sans'>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
              </p>
              <button className='text-white mt-[20px] w-[140px] uppercase font-sans text-[14px] h-[50px] border border-[#fff] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'>
                Show now
              </button>
            </div>
          </div>
        </div>

        <div className='list-product w-[74%] mx-auto mt-[120px] mb-[40px] flex items-center justify-center'>
          <div className='w-[265px] relative h-[340px] flex items-center justify-center bg-[#ef5d5d]'>
            <img className='w-full h-[340px] absolute right-0 top-0 bottom-0 clip-diagonal-2' src="/73.jpg" alt="" />
            <div className='w-[80%] h-[80%] bg-[#ededed]/80 absolute mx-auto z-30 [&_img]:w-[150px] flex flex-col items-center justify-center group'>
              <img className='transition-all duration-300 group-hover:scale-[1.1]' src="/img1.png" alt="" />
              <div className='content mt-0 w-[80%] mx-auto'>
                <h3 className='font-sans font-bold text-[19px] uppercase'>Nike - Xtrema 3 Edition</h3>
                <p className='text-[13px] mt-[10px] cursor-pointer font-light font-sans text-[#0b1f4e] uppercase'>
                  See more <FontAwesomeIcon className=' text-[12px] font-light' icon={faArrowRight} />
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col pl-[20px] relative'>
            <div className='flex items-center justify-between absolute -top-[10px]'>
              <h3 className='text-[22px] font-sans font-bold uppercase'>FILLO Special Edition</h3>
              <span className='ml-[10px] mr-[10px] w-[500px] h-[1px] border border-[#ededed]'></span>
              <p className='text-[13px] ml-[3px] cursor-pointer font-light font-sans text-black uppercase'>
                See more <FontAwesomeIcon className='font-light text-[12px]' icon={faArrowRight} />
              </p>
            </div>
            <div className='list-product w-[840px] flex items-center justify-between gap-[21px] mt-[40px]'>
              {isFetchingCategory && <p>Loading...</p>}
              {!isFetchingCategory &&
                categoryProducts.map((product:any) => (
                  <Link to={`/detailProductClient/${product._id}`}>
                    <div
                      key={product._id}
                      className='list-product-one overflow-hidden w-[220px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center cursor-pointer group'
                    >
                      <div className='w-[200px] h-[160px] overflow-hidden flex items-center'>
                        <img
                          className='w-[220px] h-[230px] mt-0 transition-all duration-300 group-hover:scale-[1.1]'
                          src={product.images?.[0]?.url || "/default.png"}
                          alt={product.name}
                        />
                      </div>
                      <div className='content w-[80%] mt-[0px]'>
                        <h4 className='w-full text-[15px] font-semibold text-black'>{product.name}</h4>
                        <div className='pt-1.5 flex items-center'>
                          <p className='font-sans font-semibold text-[#0b1f4e] text-[14px]'>
                            {formatPrice(product.sale_price)}<sup>đ</sup>
                          </p>
                          <del className='text-[14px] ml-4 font-medium text-gray-400'>{formatPrice(product.original_price)}<sup>đ</sup></del>
                        </div>
                      </div>
                      <div className='mt-2 text-[13px] uppercase font-sans w-[80%] mx-auto border-b-1'>
                        <p className='text-[11px]'>Select options</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className='w-[74%] mt-[80px] mx-auto mb-[120px] flex flex-col'>
          <div className='w-[100%] flex items-center justify-between mb-[25px]'>
            <h3 className='text-[25px] font-sans font-bold uppercase'>All Our Product</h3>
            <span className='w-[800px] h-[1px] border border-[#ededed]'></span>
            <p className='text-[15px] cursor-pointer font-light font-sans text-black uppercase'>
              See more <FontAwesomeIcon className='font-light' icon={faArrowRight} />
            </p>
          </div>
          <div className='list-product w-full grid grid-cols-4 gap-[26px]'>
            {isFetchingAll && <p>Loading...</p>}
            {!isFetchingAll &&
              products.map((product:any) => (
                <Link to={`/detailProductClient/${product._id}`}>
                  <div key={product._id} 
                    className='list-product-one w-[100%] h-[340px] bg-[#f2f2f2] overflow-hidden flex flex-col items-center justify-center cursor-pointer group'
                  >
                    <div className='w-[260px] h-[200px] overflow-hidden flex items-center'>
                        <img
                          className='w-[290px] h-[280px] mt-0 transition-all duration-300 group-hover:scale-[1.1]'
                          src={product.images?.[0]?.url || "/default.png"}
                          alt={product.name}
                        />
                    </div>
                    <div className='content w-[80%] mt-0'>
                      <h4 className='w-full text-[15px] font-semibold font-sans text-black uppercase'>{product.name}</h4>
                      <div className='pt-1.5 flex items-center'>
                        <p className='font-sans font-medium text-[#0b1f4e] text-[15px]'>
                          {formatPrice(product.sale_price)}<sup>đ</sup>
                        </p>
                        <del className='text-[15px] ml-6 font-sans font-medium text-gray-400'>{formatPrice(product.original_price)}<sup>đ</sup></del>
                      </div>
                    </div>
                    <div className='mb-4 mt-1.5 w-[80%] mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
                      <p className='mt-[5px]'>Select options</p>
                    </div>
                  </div>
                </Link>
              ))}
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
                      SHOP NOW
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
            <input type="text" className='w-[420px] h-[55px] bg-white text-gray-400 pl-[25px] outline-0' placeholder='Email'/>
            <button className='h-[56px] ml-[20px] text-white font-sans font-light w-[155px] bg-[#01225a] text-[15px]'><FontAwesomeIcon icon={faPaperPlane}/> Submit</button>
          </form>
        </div>
        </div>
    </main>
  );
};

export default ListProductClient;