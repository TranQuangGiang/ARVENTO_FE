import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { useList } from '../../../hooks/useList';

const ListBlogClient = () => {
  // Lấy danh mục
  const { data: categoryPostRes } = useList({
    resource: `/categoryPost/client`,
  });
  const categories = categoryPostRes?.data || [];

  // Lấy bài viết
  const { data: blogRes } = useList({
    resource: '/posts/client',
  });
  const posts = blogRes?.data?.docs || [];

  // Lấy bài viết mới nhất (nếu muốn lấy từ API: sắp xếp phía BE)
  const latestPosts = posts.slice(0, 5);

  return (
    <div className='w-full mt-0'>
      <div className="w-[76%] mx-auto pt-10 mb-[100px] flex gap-6 bg-white">
        {/* Sidebar */}
        <div className="w-[24%]">
          <div className="bg-white p-4 shadow-sm rounded-md mb-6">
            <h3 className="text-[18px] font-bold font-sans border-b border-gray-200 pb-2.5">Danh mục</h3>
            <ul className="mt-4 space-y-2 font-semibold text-[16px] font-sans">
              {categories.map((item: any) => (
                <li key={item._id}><Link to={`/listBlog/category/${item.slug}`}>{item.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 shadow-sm rounded-md">
            <h3 className="text-[18px] font-bold font-sans border-b border-gray-200 pb-2.5">Bài viết mới nhất</h3>
            <ul className="mt-4 space-y-4">
              {latestPosts.map((post: any) => (
                <li key={post._id} className="flex gap-3 cursor-pointer">
                  <img src={post.thumbnail} alt={post.title} className="w-[50px] h-[50px] object-cover rounded-sm " />
                  <div>
                    <p className="text-[14px] font-semibold leading-[18px] line-clamp-2">{post.title}</p>
                    <span className="text-[13px] text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blog content */}
        <div className="w-[76%]">
            <h2 className="text-[24px] font-bold mb-6">Tất cả bài viết</h2>
            <div className="grid grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Link to={`/detailBlog/${post.slug}`} key={post._id}>
                <div className="bg-white group cursor-pointer rounded shadow hover:shadow-md transition overflow-hidden relative">
                  {/* Thumbnail ảnh */}
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-[200px] object-cover rounded-t"
                  />

                  {/* Overlay màu đen mờ khi hover */}
                  <div className="absolute top-0 left-0 w-full h-[200px] bg-black opacity-0 group-hover:opacity-40 transition duration-400"></div>

                  {/* Nội dung bài viết */}
                  <div className="p-4">
                    <h3 className="text-[16px] font-bold leading-[20px] line-clamp-2">{post.title}</h3>
                    <p className="text-[14px] text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                    <div className="flex justify-between items-center mt-4 text-[13px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} /> {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <Link to={`/detailBlog/${post.slug}`} className="text-blue-600 hover:underline">Xem thêm »</Link>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListBlogClient;
