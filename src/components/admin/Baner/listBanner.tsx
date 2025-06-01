import React, { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, message } from "antd";
import { useDeleteBanner, useBannersAdmin, useUpdateBannerStatus } from "../../../hooks/listbanner";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi"; // Icon cộng


const ListBanner = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { data: banners, isLoading, isError } = useBannersAdmin();
  const updateStatus = useUpdateBannerStatus();
  const deleteBanner = useDeleteBanner();
const [hasShownSuccess, setHasShownSuccess] = useState(false);

useEffect(() => {
  const successMessage = location.state?.successMessage;
  if (successMessage && !hasShownSuccess) {
    message.success(successMessage);
    setHasShownSuccess(true);

    navigate(location.pathname, { replace: true });
  }
}, [location.state, navigate, hasShownSuccess]);



  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading banners</div>;

  const filteredSlides = banners?.filter((slide: any) =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const totalPages = Math.ceil(filteredSlides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSlides = filteredSlides.slice(startIndex, startIndex + itemsPerPage);

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleToggleStatus = (id: string, checked: boolean) => {
    updateStatus.mutate(
      { id, isActive: checked },
      {
        onSuccess: () => {
          message.success('Status update successful');
        },
        onError: () => {
          message.error('Update status failed');
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteBanner.mutate(id, {
      onSuccess: () => {        
        message.success('Successfully removed the banner');
      },
      onError: () => {
        message.error('Removing banner failed');
      }
    });
  };

  return (
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
      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md shadow hover:opacity-90 transition"
      onClick={() => navigate("/admin/addbanner")}
    >
      <FiPlus className="text-lg" />
      ADD NEW
    </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-base text-left">
            <thead className="bg-gray-200 text-gray-800 ">
              <tr className="text-lg">
                <th className="px-5 py-4 text-center font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">ID</th>
                <th className="px-5 py-4 font-semibold">Title</th>
                <th className="px-5 py-4 font-semibold">Link</th>
                <th className="px-5 py-4 font-semibold">Image</th>
                <th className="px-25 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSlides.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-center text-gray-500">
                    No banners found.
                  </td>
                </tr>
              )}
              {currentSlides.map((slide: any, index: number) => (
                <tr
                  key={slide._id}
                  className={`text-lg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="px-5 py-4 text-center">
                    <Switch 
                      checked={slide.is_active} 
                      onChange={(checked) => {
                        console.log('Switch changed:', slide._id, checked);
                        handleToggleStatus(slide._id, checked);
                      }} 
                    />

                  </td>
                  <td className="px-5 py-4 text-gray-700 text-[15px]">{slide._id}</td>
                  <td className="px-5 py-4 font-light text-gray-900 text-[15px]">{slide.title}</td>
                  <td className="px-5 py-4 font-light text-gray-900 text-[15px]">{slide.link}</td>
                  <td className="px-5 py-4">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-300"
                    />
                  </td>
                  <td className="px-7 py-4 text-right space-x-2">
                    <Button
                      type="default"
                      className="flex items-center px-3 py-1.5 rounded transition-colors duration-200"
                      icon={<EditOutlined style={{ fontSize: 20 }} />}
                      onClick={() => navigate(`/admin/editbanner/${slide._id}`)}
                    >
                      Edit
                    </Button>

                    <Popconfirm
                      title="Are you sure you want to delete?"
                      okText="Delete"
                      cancelText="Cancel"
                      onConfirm={() => handleDelete(slide._id)}
                    >
                      <Button
                        type="default"
                        className="flex items-center px-3 py-1.5 rounded transition-colors duration-200"
                        icon={<DeleteOutlined style={{ fontSize: 20 }} />}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-6 flex float-right items-center space-x-2">
              <button
                aria-label="Previous Page"
                onClick={() => handleChangePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                &lt;
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Page ${idx + 1}`}
                  onClick={() => handleChangePage(idx + 1)}
                  className={`w-10 h-10 flex items-center justify-center border rounded ${
                    currentPage === idx + 1
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                aria-label="Next Page"
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
