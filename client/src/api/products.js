
import axios from "axios";
import Cookies from "js-cookie";

const API = "http://localhost:4000/api/products";

export const getProductsRequest = () => axios.get(API);

export const createProductRequest = (product) => {
  const token = Cookies.get("token");
  return axios.post(API, product, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

export const updateProductRequest = (id, product) => {
  const token = Cookies.get("token");
  return axios.put(`${API}/${id}`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

export const deleteProductRequest = (id) => {
  const token = Cookies.get("token");
  return axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};
