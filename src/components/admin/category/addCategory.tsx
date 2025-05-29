import React, { useState } from "react";

const AddCategory = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Vui lòng nhập tiêu đề và mô tả.");
      return;
    }
    console.log("Thêm danh mục:", { title, description });
    setTitle("");
    setDescription("");
  };

  return (
  <div className="w-full px-6 py-10 bg-gray-50 min-h-screen ">
    <div className="max-w-3xl mx-auto mt-30 bg-white shadow-xl border border-gray-200 rounded-l p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Thêm Danh Mục</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập tiêu đề danh mục"
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Mô tả</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập mô tả"
          />
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
            }}
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Thêm Danh Mục
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default AddCategory;