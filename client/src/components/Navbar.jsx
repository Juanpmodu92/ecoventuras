import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const adminMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout(navigate);
  };

  // Cierra menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setAdminMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <ul className="flex gap-4 items-center">
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

            {/* Menú admin */}
            {user?.rol === "admin" && (
              <li className="relative" ref={adminMenuRef}>
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="text-[#007BFF] font-semibold"
                >
                  Administrar ⌄
                </button>
                {adminMenuOpen && (
                  <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-md min-w-[200px]">
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/orders"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        Órdenes
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/products"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        Productos
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/reports"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        Reportes
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            
            <li className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-[#007BFF] font-semibold"
              >
                👤 {user?.rol} {user?.firstName} ⌄
              </button>
              {userMenuOpen && (
                <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-md min-w-[180px]">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              )}
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
