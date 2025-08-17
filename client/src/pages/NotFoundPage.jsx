import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Página no encontrada
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Lo sentimos, la página que estás buscando no existe o fue movida.
      </p>

      <Link
        to="/"
        className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition"
      >
        ⬅️ Volver al inicio
      </Link>
    </div>
  );
}
