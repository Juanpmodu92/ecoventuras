import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile");
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          username: res.data.username || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/profile", formData);
      setMessage("✅ Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setMessage("❌ Hubo un error al actualizar el perfil");
    }
  };

  if (loading) return <p className="p-6">Cargando datos...</p>;

  return (
    <div className="p-6 flex justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          ✏️ Editar Perfil
        </h1>

        {message && (
          <div className="mb-4 text-center text-sm font-medium text-gray-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Nombre</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
