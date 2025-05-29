import React, { useState } from "react";

const EditBanner = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.files?.[0] || null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) {
      alert("Vui lòng nhập tiêu đề và chọn ảnh.");
      return;
    }

  };

  return (
  <div className="w-full px-6 py-10 bg-gray-50 min-h-screen ">
    <div className="max-w-3xl mx-auto mt-30 bg-white shadow-xl border border-gray-200 rounded-l p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Update Banner</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Nhập tiêu đề Banner"
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition 
            ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto w-40 h-40 object-cover rounded-lg border border-gray-300"
            />
          ) : (
            <div className="text-gray-500">
              <p>Kéo và thả ảnh vào đây, hoặc bấm để chọn</p>
              <p className="text-sm mt-1">(Chỉ hỗ trợ ảnh JPG, PNG...)</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setImage(null);
              setPreviewUrl(null);
            }}
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Update Banner
          </button>
        </div>

      </form>
    </div>
  </div>
  );
};

export default EditBanner;
