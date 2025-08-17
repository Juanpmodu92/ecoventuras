import axios from "./axios";

// Petición al backend para traer el reporte de ventas
export const getSalesReportRequest = async (start, end) => {
  const params = {};
  if (start && end) {
    params.start = start;
    params.end = end;
  }

  return await axios.get("/admin/reports/sales", { params });
};
