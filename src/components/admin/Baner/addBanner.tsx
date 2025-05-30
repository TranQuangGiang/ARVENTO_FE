import React, { useState } from "react";

const AddBanner = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
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
  };

  return (
    <div className="w-full px-6 py-10 bg-gray-50 min-h-screen ">
      <div className="w-[60%] mx-auto p-8   shadow-sm bg-white mt-30">
        <h3 className="text-2xl font-semibold mb-1">ADD NEW BANNER</h3>
        <p className="text-sm text-gray-500 mb-6">Add a new banner to the website</p>

        <hr className="border-t border-gray-300 mb-6 -mt-3" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center">
            <label className="w-32 text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter title"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-700">Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter link"
            />
          </div>

          <div className="flex items-start">
            <label className="w-32 text-gray-700 pt-2">Image</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`flex-1 border-2 border-dashed rounded-xl px-6 py-8 text-center cursor-pointer transition 
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
                  className="mx-auto w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              ) : (
                <div className="text-gray-500">
                  <p>Drag and drop images here, or click to select</p>
                  <p className="text-sm mt-1"> (Only supports JPG, PNG...)</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
            >
              Add Banner
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setLink("");
                setImage(null);
                setPreviewUrl(null);
              }}
              className="border border-gray-300 text-sm px-4 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddBanner;