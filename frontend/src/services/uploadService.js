import api from "./api";

// Uploads a File object as multipart/form-data and returns the hosted image URL.
export const uploadImage = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return data.url;
};
