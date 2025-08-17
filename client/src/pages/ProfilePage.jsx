import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resUser = await axios.get("/me");
        setRole(resUser.data.rol);

        if (resUser.data.rol === "admin") {
          const res = await axios.get("/admin/profile");
          setProfile({ ...resUser.data, ...res.data });
        } else {
          const res = await axios.get("/cliente/profile");
          setProfile({ ...resUser.data, ...res.data });
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <p className="p-6">Cargando perfil...</p>;

  const logout = async () => {
    try {
      await axios.post("/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center flex items-center justify-center gap-2">
          <span className="text-purple-700">👤</span> Mi Perfil
        </h1>

        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl mb-4">
            {profile.username?.charAt(0).toUpperCase()}
          </div>

          {/* Datos */}
          <h2 className="text-xl font-semibold text-gray-700">
            {profile.username}
          </h2>
          <p className="text-gray-500">{profile.name || "Sin nombre"}</p>
          <p className="text-gray-500">{profile.email || "Sin correo"}</p>
          <p className="text-sm text-gray-400 mt-1">
            Rol:{" "}
            <span className="font-medium text-gray-600 capitalize">{role}</span>
          </p>
        </div>

        {/* Acciones */}
        <div className="mt-6 space-y-3">
          {role === "admin" ? (
            <>
              <Link
                to="/admin/users"
                className="block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Gestionar Usuarios
              </Link>
              <Link
                to="/admin/products"
                className="block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Gestionar Productos
              </Link>
              <Link
                to="/admin/reports"
                className="block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Ver Reportes
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/orders"
                className="block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Mis Órdenes
              </Link>
              <Link
                to="/profile/edit"
                className="block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Editar Perfil
              </Link>
            </>
          )}

          {/* Opciones comunes */}
          <Link
            to="/profile/change-password"
            className="block bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Cambiar Contraseña
          </Link>
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
