import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders`,
          { withCredentials: true }
        );
        const foundOrder = res.data.find(o => o._id === id);
        setOrder(foundOrder || null);
      } catch (error) {
        console.error("Error al obtener la orden:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-6">Cargando detalle...</p>;
  if (!order) return <p className="p-6">Orden no encontrada.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Detalle de Orden #{order._id}</h1>
      <p><strong>Estado:</strong> {order.status}</p>
      <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Total:</strong> ${order.total.toLocaleString("es-CO")}</p>

      <h2 className="text-xl font-semibold mt-4">Productos</h2>
      <ul className="list-disc list-inside">
        {order.items.map((item, idx) => (
          <li key={idx}>
            {item.productId.name} — {item.quantity} x ${item.productId.price.toLocaleString("es-CO")}
          </li>
        ))}
      </ul>

      <div className="flex gap-4 mt-6">
        <a
          href={`${import.meta.env.VITE_API_URL}/orders/${order._id}/invoice-pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Descargar PDF
        </a>

        <Link
          to="/orders"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Volver a órdenes
        </Link>
      </div>
    </div>
  );
}
