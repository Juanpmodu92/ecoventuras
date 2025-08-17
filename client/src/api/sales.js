// src/api/sales.js
import axios from "./axios"; // o la ruta correcta a tu instancia de axios

export const getSalesReportRequest = () => axios.get("/sales/report");
