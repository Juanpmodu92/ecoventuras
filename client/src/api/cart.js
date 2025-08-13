import axios from "./axios";

export const getCartRequest = () => axios.get("/cart", { withCredentials: true });

export const addToCartRequest = (productId, quantity) =>
    axios.post("/cart", { productId, quantity }, { withCredentials: true });

export const updateCartItemRequest = (productId, quantity) =>
    axios.put("/cart/item", { productId, quantity }, { withCredentials: true });

export const removeFromCartRequest = (productId) =>
    axios.delete("/cart/item", {
        data: { productId },
        withCredentials: true
    });

export const clearCartRequest = () =>
    axios.delete("/cart", { withCredentials: true });

export const checkoutCartRequest = () =>
    axios.post("/cart/checkout", {}, { withCredentials: true });
