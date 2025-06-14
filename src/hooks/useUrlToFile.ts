export const convertToFile = async (file: any, index: number) => {
  if (file.originFileObj) return file.originFileObj; // Ảnh mới
  if (file.url) {
    const res = await fetch(file.url);
    const blob = await res.blob();
    return new File([blob], file.name || `image_${index}.jpg`, { type: blob.type });
  }
  return null;
};