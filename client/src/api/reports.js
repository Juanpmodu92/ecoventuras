import axios from "./axios";

export const getSalesReportRequest = async (start, end) => {
  const params = {};
  if (start && end) {
    params.start = start;
    params.end = end;
  }

  return await axios.get("/admin/reports/sales", { params });
};
