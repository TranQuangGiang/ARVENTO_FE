import React, { useState } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from "antd";

const slides = [
  {
    id: 1,
    title: "Giày Nam",
    slug: "https://example.com/summer-shoes"
  },
  {
    id: 2,
    title: "Giày Nữ",
    slug: "https://example.com/summer-shoes"
  },
  
];

const ListCategory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const filteredSlides = slides.filter((slide) =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSlides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSlides = filteredSlides.slice(startIndex, startIndex + itemsPerPage);


  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }; return (
    <div className="w-full px-6 py-10 bg-gray-50 min-h-screen">
      <div className="w-full h-auto px-6 py-5 bg-white mt-20 rounded-lg border-2 border-gray-100">
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

        <div className="overflow-x-auto">
          <table className="min-w-full text-base text-left">
            <thead className="bg-gray-200 text-gray-800 ">
              <tr className="text-lg">
                <th className="px-5 py-4 font-semibold">ID</th>
                <th className="px-5 py-4 font-semibold">Title</th>
                <th className="px-5 py-4 font-semibold">Slug</th>
                <th className="px-25 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSlides.map((slide, index) => (
                <tr
                  key={slide.id}
                  className={`text-lg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="px-5 py-4 text-gray-700">{slide.id}</td>
                  <td className="px-5 py-4 font-light text-gray-900">{slide.title}</td>
                  <td className="px-5 py-4 font-light text-gray-900">{slide.slug}</td>
                  <td className="px-5 py-4 text-right space-x-1.5">                 
                    <Button
                      type="default"
                      className="flex items-center px-3 py-1.5 rounded transition-colors duration-200"
                      style={{ color: undefined }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#3b82f6';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = '';
                      }}
                      icon={<EditOutlined style={{ fontSize: 20, color: 'inherit' }} />}
                    >
                      Edit
                    </Button>

                    <Popconfirm
                      title="Bạn có chắc muốn xoá không?"
                      okText="Xoá"
                      cancelText="Hủy"
                    >
                      <Button
                        type="default"
                        className="flex items-center px-3 py-1.5 rounded transition-colors duration-200"
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.borderColor = '#ef4444';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = '';
                          e.currentTarget.style.borderColor = '';
                        }}
                        icon={<DeleteOutlined style={{ fontSize: 20, color: 'inherit' }} />}
                      >
                        Delete
                      </Button>
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
          </table>{totalPages > 1 && (
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

export default ListCategory;