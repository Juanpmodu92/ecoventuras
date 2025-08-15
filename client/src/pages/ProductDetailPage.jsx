import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { Heart } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);

  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const isFavorite = favorites.some((item) => item._id === id);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(product._id);
    } else {
      addFavorite(product._id);
    }
  };

  const toggleFavoriteRelated = (prodId) => {
    const fav = favorites.some((item) => item._id === prodId);
    if (fav) {
      removeFavorite(prodId);
    } else {
      addFavorite(prodId);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
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
        const res = await fetch(`http://localhost:4000/api/products`);
        if (!res.ok) throw new Error("No se pudo obtener productos relacionados");
        const data = await res.json();
        const filtered = data.filter((p) => p._id !== id).slice(0, 3);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    fetchRelated();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 4000);
  };

  if (loading) return <p className="text-center text-gray-500">Cargando producto...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center text-gray-500">Producto no encontrado</p>;

  const thumbnails = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className="relative">
      {/* Fondo semi-transparente cuando el overlay está activo */}
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setShowOverlay(false)}
        ></div>
      )}

      {/* Overlay Carrito */}
      {showOverlay && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 p-4 animate-slideIn">
          <h3 className="text-lg font-semibold text-green-600">✅ Agregado al carrito</h3>
          <div className="flex gap-4 mt-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-contain border rounded"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-blue-600 font-bold">
                {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(product.price)}
              </p>
              <p className="text-gray-500 text-sm">Cantidad: {quantity}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ir al carrito
            </button>
            <button
              onClick={() => setShowOverlay(false)}
              className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-50"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg p-6 shadow">
          {/* Galería */}
          <div className="flex gap-4 relative">
            {/* Botón favorito principal */}
            <button
              onClick={toggleFavorite}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition"
            >
              <Heart
                size={24}
                className="text-red-500"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
              />
            </button>

            {/* Miniaturas */}
            <div className="flex flex-col gap-3">
              {thumbnails.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
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

          {/* Información */}
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
                {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(product.price)}
              </p>
              <p className="text-green-600 text-sm">12 CUOTAS SIN INTERÉS</p>

              {/* Info extra */}
              <div className="mt-4 text-sm space-y-1">
                <p className="text-green-600 font-medium">🚚 Llega hoy</p>
                <p className="text-gray-500">📍 Retira en agencia EcoVenturas</p>
                <p>📦 Stock disponible: <span className="font-semibold">{product.stock} unidades</span></p>
              </div>

              {/* Descripción */}
              <p className="mt-4 text-gray-600 italic">{product.description}</p>
            </div>

            {/* Cantidad y botón */}
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center gap-2">
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-16 border rounded p-1"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>

        {/* Relacionados */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Productos de tu interés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map((item) => {
              const fav = favorites.some((f) => f._id === item._id);
              return (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-lg shadow flex flex-col items-center hover:shadow-lg relative"
                >
                  {/* Botón favorito en relacionados */}
                  <button
                    onClick={() => toggleFavoriteRelated(item._id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition"
                  >
                    <Heart
                      size={20}
                      className="text-red-500"
                      fill={fav ? "currentColor" : "none"}
                      stroke="currentColor"
                    />
                  </button>

                  <Link to={`/product/${item._id}`}>
                    <img src={item.imageUrl} alt={item.name} className="h-32 object-contain" />
                    <p className="mt-2 text-sm">{item.name}</p>
                    <p className="text-green-600 font-medium">
                      {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(item.price)}
                    </p>
                    <p className="text-xs text-green-500">Envío gratis</p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
