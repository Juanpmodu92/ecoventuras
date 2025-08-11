import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000/api";

const getAuthHeaders = () => {
    const token = Cookies.get("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const fetchCart = () => axios.get(`${API_URL}/cart`, getAuthHeaders());

export const addItemToCart = (productId, quantity = 1) =>
    axios.post(`${API_URL}/cart`, { productId, quantity }, getAuthHeaders());

export const updateCartItem = (productId, quantity) =>
    axios.put(`${API_URL}/cart/item`, { productId, quantity }, getAuthHeaders());

export const removeItemFromCart = (productId) =>
    axios.delete(`${API_URL}/cart/item`, { data: { productId }, ...getAuthHeaders() });

export const clearCart = () =>
    axios.delete(`${API_URL}/cart`, getAuthHeaders());

export const checkoutCart = () =>
    axios.post(`${API_URL}/cart/checkout`, {}, getAuthHeaders());
