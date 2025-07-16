import React, { useEffect, useState } from "react";
import axios from "axios";

const DieuKhoan = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/client/ieu-khoan-su-dung-cua-arvento`);
        setPost(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-gray-500">
        Đang tải bài viết...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-red-500">
        Không tìm thấy bài viết.
      </div>
    );
  }

  return (
    <div className="mx-auto w-[90%] py-10 font-sans">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
        <h2 className="text-4xl font-semibold mb-6 text-center text-gray-800">
          {post.title}
        </h2>
        <div
  className="text-gray-700 text-[17px] leading-8 text-justify mb-8"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>


        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-start">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1 rounded-full shadow-sm hover:bg-blue-100 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DieuKhoan;
