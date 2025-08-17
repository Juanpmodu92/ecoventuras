// src/api/users.js
import axios from "./axios";

// Obtener todos los usuarios (solo admin)
export const getUsersRequest = () => axios.get("/users");

// Obtener un usuario por ID
export const getUserRequest = (id) => axios.get(`/users/${id}`);

// Actualizar un usuario
export const updateUserRequest = (id, data) => axios.put(`/users/${id}`, data);

// Eliminar un usuario
export const deleteUserRequest = (id) => axios.delete(`/users/${id}`);
