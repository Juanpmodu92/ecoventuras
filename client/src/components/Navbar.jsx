import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <nav className="bg-transparent text-white px-6 py-3 flex justify-between items-center">
      {/* Logo + Nombre */}
      <div className="flex items-center text-xl font-bold">
        <img src={logo} alt="EcoVenturas Logo" className="h-12 w-12 mr-2" />
        <Link to="/" className="text-[#2D5333] text-4xl">
          EcoVenturas
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative flex-grow mx-4 max-w-xl">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="w-full pl-10 pr-3 py-1 rounded text-black"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-950"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>
      </div>

      {/* Menú */}
      <ul className="flex gap-4">
        <li>
          <Link to="/" className="text-[#007BFF] font-semibold">
            Inicio
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/favorites" className="text-[#007BFF] font-semibold">
                Favoritos
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-[#007BFF] font-semibold">
                Carrito
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-[#007BFF] font-semibold">
                Mis pedidos
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-[#007BFF] font-semibold">
                Contacto
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-[#007BFF] font-semibold"
              >
                Cerrar Sesión
              </button>
            </li>
          </>
        )}
        {!isAuthenticated && (
          <>
            <li>
              <Link to="/login" className="text-[#007BFF] font-semibold">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-[#007BFF] font-semibold">
                Registro
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
