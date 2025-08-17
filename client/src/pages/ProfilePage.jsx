import { useEffect, useState } from "react";
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
          <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center text-4xl font-bold text-purple-700 mb-4">
            {profile.username?.charAt(0).toUpperCase()}
          </div>

          {/* Datos */}
          <h2 className="text-2xl font-bold text-gray-800">
            {profile.name || "Sin nombre"}
          </h2>
          <p className="text-gray-500 text-sm">@{profile.username}</p>
          <p className="text-gray-600 mt-1">{profile.email || "Sin correo"}</p>
          <p className="text-sm text-gray-400 mt-1">
            Rol:{" "}
            <span className="font-medium text-gray-600 capitalize">{role}</span>
          </p>
        </div>

        {/* Acciones */}
        <div className="mt-6 space-y-3">
          {role === "admin" ? (
            <>
              <a
                href="/admin/users"
                className="block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Gestionar Usuarios
              </a>
              <a
                href="/admin/products"
                className="block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Gestionar Productos
              </a>
              <a
                href="/admin/reports"
                className="block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Ver Reportes
              </a>
            </>
          ) : (
            <>
              <a
                href="/orders"
                className="block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Mis Órdenes
              </a>
              <a
                href="/profile/edit"
                className="block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Editar Perfil
              </a>
            </>
          )}

          {/* Opciones comunes */}
          <a
            href="/profile/change-password"
            className="block bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Cambiar Contraseña
          </a>
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
