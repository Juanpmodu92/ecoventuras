import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/orders`,
        {
          params: filterStatus ? { status: filterStatus } : {},
          withCredentials: true
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/orders/${id}/status`,
        { status },
        { withCredentials: true }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  if (loading) return <p className="p-6">Cargando órdenes...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Órdenes (Admin)</h1>

      {/* Filtro por estado */}
      <div className="mb-4">
        <label className="mr-2">Filtrar por estado:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="enviada">Enviada</option>
          <option value="entregada">Entregada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Cliente</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="border-b">
              <td className="border p-2">{order._id}</td>
              <td className="border p-2">
                {order.userId?.firstName} {order.userId?.lastName}
              </td>
              <td className="border p-2">${order.total.toLocaleString("es-CO")}</td>
              <td className="border p-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="border px-1 py-0.5"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="enviada">Enviada</option>
                  <option value="entregada">Entregada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </td>
              <td className="border p-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2 space-x-2">
                <a
                  href={`${import.meta.env.VITE_API_URL}/orders/${order._id}/invoice-pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
