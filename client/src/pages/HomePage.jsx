import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("No se pudo cargar el catálogo.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-[#007BFF] text-center">
        🛍️ Catálogo de Productos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map(product => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 flex flex-col"
          >
            {/* Imagen con zoom y overlay */}
            <div className="relative group overflow-hidden rounded-t-xl bg-gray-100 flex items-center justify-center h-52">
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
              {/* Overlay con botón */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
                  onClick={() => navigate(`/product/${product._id}`)} // 👈 Redirige
                >
                  Ver detalles
                </button>
              </div>
            </div>

            {/* Información del producto */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mt-2 flex-grow">{product.description}</p>
              <p className="text-[#007BFF] font-bold text-xl mt-4">
                {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(product.price)}
              </p>
              <button
                onClick={() => addToCart(product._id, 1)}
                aria-label={`Agregar ${product.name} al carrito`}
                className="mt-4 bg-[#007BFF] hover:bg-[#0056b3] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200"
              >
                🛒 Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
