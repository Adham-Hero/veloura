import api from "./api";

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data; // { products, page, pages, total }
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const getRelatedProducts = async (id) => {
  const { data } = await api.get(`/products/${id}/related`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/products/categories/list");
  return data;
};

export const createProduct = async (product) => {
  const { data } = await api.post("/products", product);
  return data;
};

export const updateProduct = async (id, product) => {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};
