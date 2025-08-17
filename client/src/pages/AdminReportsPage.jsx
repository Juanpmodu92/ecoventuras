import { useEffect, useState } from "react";
import { getSalesReportRequest } from "../api/reports";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const formatCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "COP 0";
    return num.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  const fetchReport = async () => {
    try {
      const res = await getSalesReportRequest(start, end);

      const totalProductsSold =
        res.data?.allProducts?.reduce((acc, p) => acc + (p.quantitySold ?? 0), 0) ?? 0;

      setReport({
        ...res.data,
        totalProductsSold,
      });
    } catch (error) {
      console.error("Error cargando reporte:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (!report) return <p className="p-6">Cargando reporte...</p>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9932CC"];

  const ordersStatusData = Object.entries(report.ordersByStatus ?? {}).map(
    ([status, value]) => ({ name: status, value })
  );

  const salesByCategoryData = (report.salesByCategory ?? []).map((cat) => ({
    name: cat.category,
    totalSold: cat.totalSold,
    totalRevenue: cat.totalRevenue,
  }));

  const topProductsData = (report.topProducts ?? []).map((prod) => ({
    name: prod.name,
    quantitySold: prod.quantitySold,
  }));

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 Reporte de Ventas</h1>

      {/* Filtro de fechas */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Fin</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={fetchReport}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          Aplicar Filtro
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-blue-100 rounded-lg text-center shadow">
          <h3 className="font-semibold">Órdenes Totales</h3>
          <p className="text-3xl font-bold">{report.totalOrders ?? 0}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg text-center shadow">
          <h3 className="font-semibold">Ingresos Totales</h3>
          <p className="text-3xl font-bold">
            {formatCurrency(report.totalRevenue ?? 0)}
          </p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg text-center shadow">
          <h3 className="font-semibold">Productos Vendidos</h3>
          <p className="text-3xl font-bold">{report.totalProductsSold ?? 0}</p>
        </div>
        <div className="p-4 bg-purple-100 rounded-lg text-center shadow">
          <h3 className="font-semibold">Categorías Activas</h3>
          <p className="text-3xl font-bold">
            {report.salesByCategory?.length ?? 0}
          </p>
        </div>
      </div>

      {/* Gráfico Órdenes por Estado */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">📦 Órdenes por Estado</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ordersStatusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {ordersStatusData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ReTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico Ventas por Categoría */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">📂 Ventas por Categoría</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesByCategoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ReTooltip />
            <Legend />
            <Bar dataKey="totalSold" fill="#8884d8" name="Unidades Vendidas" />
            <Bar dataKey="totalRevenue" fill="#82ca9d" name="Ingresos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico Top Productos */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4">🏆 Top Productos Vendidos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProductsData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <ReTooltip />
            <Legend />
            <Bar dataKey="quantitySold" fill="#ff7300" name="Cantidad Vendida" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de TODOS los productos vendidos */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📋 Detalle de Productos Vendidos</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Producto</th>
                <th className="p-3 border-b">Cantidad Vendida</th>
              </tr>
            </thead>
            <tbody>
              {(report.allProducts ?? []).map((prod, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{prod?.name ?? "Sin nombre"}</td>
                  <td className="p-3 border-b">{prod?.quantitySold ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
