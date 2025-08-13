import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutConfirmPage() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkout = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/cart/checkout`,
          {},
          { withCredentials: true }
        );

        if (!res.data || !res.data.order) {
          throw new Error("No se recibió la orden del servidor");
        }

        setOrder(res.data.order);
      } catch (error) {
        console.error("Error en checkout:", error);
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    checkout();
  }, [navigate]);

  if (loading) return <h2 className="p-6">Procesando compra...</h2>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        ¡Compra confirmada!
      </h1>
      {order && (
        <>
          <p className="mb-2">
            Tu orden <span className="font-semibold">#{order._id}</span> ha sido
            generada correctamente.
          </p>
          <p className="text-gray-600">
            Total:{" "}
            <span className="font-semibold">
              ${order.total?.toLocaleString("es-CO")}
            </span>
          </p>
          <p className="text-gray-500 text-sm">
            Gracias por comprar en <strong>EcoVenturas</strong>. Recibirás un
            correo con los detalles.
          </p>
        </>
      )}
    </div>
  );
}
