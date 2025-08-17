import axios from "./axios";

export const getOrdersRequest = () => axios.get("/orders");
export const getOrderRequest = (id) => axios.get(`/orders/${id}`);
export const createOrderRequest = (order) => axios.post("/orders", order);
export const updateOrderRequest = (id, order) => axios.put(`/orders/${id}`, order);
export const deleteOrderRequest = (id) => axios.delete(`/orders/${id}`);
