import React, { useState } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from "antd";
const slides = [
  {
    id: 1,
    title: "Giày thể thao mùa hè",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Giày đi bộ",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Giày công sở nam",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Giày thể thao mùa hè",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Giày đi bộ",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Giày công sở nam",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
  }, {
    id: 7,
    title: "Giày thể thao mùa hè",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    title: "Giày đi bộ",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    title: "Giày công sở nam",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
  },
];

const ListBanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSlides = slides.filter((slide) =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSlides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSlides = filteredSlides.slice(startIndex, startIndex + itemsPerPage);

  const handleChangePage = (page:any) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full px-6 py-10 bg-gray-50 min-h-screen ">
      <div className="w-full h-auto px-6 py-5 bg-white  mt-20 rounded-lg border-2 border-gray-100">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 pl-2">
            <span className="text-gray-500">Showing</span>
            <select
              className="border border-gray-300 rounded px-3 py-1 text-gray-600"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[3, 5, 10].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded px-4 py-2 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md shadow hover:opacity-90 transition"
            >
              Search
            </button>

          </div>
        </div>

        <div className="overflow-x-auto ">
          <table className="min-w-full text-base text-left">
            <thead className="bg-gray-200 text-gray-800 font-bold">
              <tr className="text-lg">
                <th className="px-5 py-4 text-center"><input type="checkbox" /></th>
                <th className="px-5 py-4">Image</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">ID</th>
                <th className="px-10 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSlides.map((slide, index) => (
                <tr
                  key={slide.id}
                  className={`text-lg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="px-5 py-4 text-center"><input type="checkbox" /></td>
                  <td className="px-5 py-4">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-300"
                    />
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900">{slide.title}</td>
                  <td className="px-5 py-4 text-gray-700">{slide.id}</td>
                  <td className="px-7 py-4 text-right space-x-2">
                    <Button
                      type="text"
                      icon={<EditOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
                    />
                    <Popconfirm
                      title="Bạn có chắc muốn xoá không?"
                      okText="Xoá"
                      cancelText="Hủy"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined style={{ fontSize: 20 }} />}
                      />
                    </Popconfirm>
                  </td>
                </tr>
              ))}
              {filteredSlides.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-gray-500">
                    No slides found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>


          {totalPages > 1 && (
            <div className="mt-6 flex float-right items-center space-x-2">
              <button
                onClick={() => handleChangePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => handleChangePage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded border transition 
            ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handleChangePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}

        </div>
      </div>
    </div>


  );
};

export default ListBanner;
