import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("No se pudo obtener el producto");
        const data = await res.json();
        setProduct(data);
        setMainImage(data.imageUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("No se pudo obtener productos relacionados");
        const data = await res.json();
        const filtered = data.filter((p) => p._id !== id).slice(0, 3);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Error al obtener relacionados:", err);
      }
    };

    fetchProduct();
    fetchRelated();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Cargando producto...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center text-gray-500">Producto no encontrado</p>;

  const thumbnails = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg p-6 shadow">
        {/* Galería izquierda */}
        <div className="flex gap-4">
          {/* Miniaturas */}
          <div className="flex flex-col gap-3">
            {thumbnails.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} thumbnail ${idx + 1}`}
                className={`w-16 h-16 object-cover rounded-md border cursor-pointer hover:border-blue-500 ${
                  mainImage === img ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          {/* Imagen principal */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src={mainImage}
              alt={product.name}
              className="max-h-96 object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Información derecha */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold bg-yellow-400 text-yellow-900 px-2 py-1 rounded">
              MÁS VENDIDO
            </span>
            <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-blue-500">
              {"★".repeat(5)} <span className="text-gray-500">(500)</span>
            </div>
            <p className="text-3xl font-semibold mt-4 text-gray-800">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(product.price)}
            </p>
            <p className="text-green-600 text-sm">12 CUOTAS DE $ 2.083 CON 0% INTERÉS</p>

            <div className="mt-4 text-sm">
              <p className="text-green-600 font-medium">Llega hoy</p>
              <p className="text-gray-500">Retira en agencia EcoVenturas</p>
              <p className="mt-2">
                Stock disponible:{" "}
                <span className="font-semibold">{product.stock} unidades</span>
              </p>
            </div>

            {/* Descripción dentro del bloque */}
            <p className="mt-4 text-gray-600 italic">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Continuar compra
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>

{/* Productos relacionados */}
<div className="mt-8">
  <h2 className="text-lg font-semibold mb-4">Productos de tu interés</h2>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {relatedProducts.length > 0 ? (
      relatedProducts.map((item) => (
        <Link
          key={item._id}
          to={`/product/${item._id}`}
          className="bg-white p-4 rounded-lg shadow flex flex-col items-center hover:shadow-lg transition-shadow"
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-32 object-contain"
          />
          <p className="mt-2 text-sm">{item.name}</p>
          <p className="text-green-600 font-medium">
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(item.price)}
          </p>
          <p className="text-xs text-green-500">Envío gratis</p>
        </Link>
      ))
    ) : (
      <p className="text-gray-500">No hay productos relacionados</p>
    )}
  </div>
</div>
    </div>
  );
}
