import React from 'react';
import { useList } from '../../../hooks/useList';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { useOneData } from '../../../hooks/useOne';

const DetailBlogClient = () => {
  const { slug } = useParams();

  // Lấy danh sách danh mục bài viết
  const { data: categoryPostRes } = useList({
    resource: `/categoryPost/client`,
  });
  const categories = categoryPostRes?.data || [];

  // Lấy danh sách bài viết (để lấy bài mới nhất)
  const { data: blogRes } = useList({
    resource: '/posts/client',
  });
  const posts = blogRes?.data?.docs || [];
  const latestPosts = posts.slice(0, 5);

  // Lấy chi tiết bài viết theo slug
  const { data: postOne } = useList({
    resource: `/posts/client/${slug}`,
  });
  const post = postOne?.data;

  return (
    <div className="w-full mt-0 ">
        <div className="w-[76%] mx-auto pt-10">
            <nav className="text-[14px] text-gray-600 mb-6">
                <Link to="/" className="hover:text-black">Trang chủ</Link>
                <span className="mx-2">/</span>
                <span className="text-black font-medium">{post?.title}</span>
            </nav>
        </div>
        <div className="w-[76%] mx-auto mb-[100px] flex gap-6 bg-white">
            {/* Sidebar */}
            <div className="w-[24%]">
                <div className="bg-white p-4 shadow-sm rounded-md mb-6">
                    <h3 className="text-[18px] font-bold font-sans border-b pb-2">Danh mục</h3>
                    <ul className="mt-4 space-y-2 font-semibold text-[16px] font-sans">
                    {categories.map((item: any) => (
                        <li key={item._id}>
                        <Link to={`/listBlog/category/${item.slug}`}>{item.name}</Link>
                        </li>
                    ))}
                    </ul>
                </div>

                <div className="bg-white p-4 shadow-sm rounded-md">
                    <h3 className="text-[18px] font-semibold font-sans border-b pb-2">Bài viết mới nhất</h3>
                    <ul className="mt-4 space-y-4">
                        {latestPosts.map((post: any) => (
                            <Link to={`/detailBlog/${post.slug}`} className='flex gap-3'>
                            <li key={post._id} className="flex gap-3 cursor-pointer">
                            <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-[50px] h-[50px] object-cover rounded-sm"
                            />
                            <div>
                                <p className="text-[14px] font-semibold leading-[18px] line-clamp-2">{post.title}</p>
                                <span className="text-[13px] text-gray-500">
                                {new Date(post.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            </li>
                            </Link>
                            
                        ))}
                    </ul>
                </div>
                </div>

                {/* Blog content */}
                <div className="w-[76%] bg-white shadow-md p-8 rounded-md">
                {post ? (
                    <>
                    {/* Tiêu đề & mô tả */}
                    <h1 className="text-[26px] font-bold leading-9 mb-4">{post.title}</h1>
                    <p className="text-[16px] text-gray-600 italic mb-4">{post.excerpt}</p>
                    <p className="text-[14px] text-gray-500 flex items-center gap-2 mb-6">
                        <CalendarDays size={16} /> {new Date(post.created_at).toLocaleDateString()}
                    </p>

                    {/* Nội dung bài viết */}
                    <div
                        className="max-w-none [&_img]:mx-auto [&_img]:w-[430px] [&_img]:h-[500px] [&_img]:pt-5 [&_img]:pb-5"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    </>
                ) : (
                    <p className="text-gray-500">Đang tải bài viết...</p>
                )}
                </div>
                
            </div>

        </div>
        
  );
};

export default DetailBlogClient;
