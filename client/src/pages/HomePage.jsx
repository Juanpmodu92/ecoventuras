// HomePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4 text-[#007BFF]">Catálogo de Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-100 h-48 object-cover rounded mx-auto"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <br />
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-900 mb-2 font-bold">{product.price} USD</p>
            <div className="flex-grow"></div>
            <button className="mt-3 w-full bg-[#007BFF] hover:bg-[#0056b3] text-white py-2 px-4 rounded">
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
