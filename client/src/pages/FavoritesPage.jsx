import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No tienes productos favoritos.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mis favoritos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {favorites.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-40 object-contain mx-auto"
              />
              <p className="mt-2 font-medium">{product.name}</p>
              <p className="text-green-600 font-bold">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(product.price)}
              </p>
            </Link>
            <button
              onClick={() => removeFavorite(product._id)}
              className="mt-3 text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
