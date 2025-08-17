import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsRequest } from "../api/products"; 
import { getOrdersRequest } from "../api/orders"; 
import { getUsersRequest } from "../api/users"; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsRes = await getProductsRequest();
        const ordersRes = await getOrdersRequest();
        const usersRes = await getUsersRequest();

        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          users: usersRes.data.length,
        });
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold">Productos</h2>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold">Pedidos</h2>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold">Usuarios</h2>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/products"
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow text-center"
        >
          Gestión de Productos
        </Link>
        <Link
          to="/admin/orders"
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow text-center"
        >
          Gestión de Pedidos
        </Link>
        <Link
          to="/admin/users"
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-6 rounded-lg shadow text-center"
        >
          Gestión de Usuarios
        </Link>
        <Link
          to="/admin/notifications"
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow text-center"
        >
          Notificaciones
        </Link>
      </div>
    </div>
  );
}
