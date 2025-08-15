// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useNotifications } from "../context/NotificationsContext";
import { useState, useRef, useEffect } from "react";
import { Search, Heart, ShoppingCart, Bell, Menu, ChevronDown, X } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const { favoritesCount } = useFavorites();
  const { notificationsCount } = useNotifications();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscar:", searchQuery);
    setSearchQuery("");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout(navigate);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  // Cerrar menú usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menús con ESC y clic fuera en móvil
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    const handleClickOutsideMobile = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutsideMobile);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutsideMobile);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      {/* Barra superior */}
      <div className="bg-green-600 text-white text-sm px-6 py-1 flex justify-between">
        <span>🌱 EcoPuntos: ¡Acumula y obtén descuentos sostenibles!</span>
        <span className="hidden sm:block">
          {isAuthenticated ? `Hola, ${user?.firstName}` : "Bienvenido a EcoVenturas"}
        </span>
      </div>

      {/* Barra principal */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="Ir al inicio">
            <img src={logo} alt="EcoVenturas" className="h-20 w-auto" />
          </Link>
          <Link to="/">
            <div
              className="hidden sm:flex items-center text-[#2D5333] text-sm cursor-pointer hover:text-green-600"
              title="Ir al inicio"
            >
              <h1 className="text-4xl font-bold italic">EcoVenturas</h1>
            </div>
          </Link>
        </div>

        {/* Buscador escritorio */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl mx-6 relative hidden md:block"
        >
          <input
            type="text"
            placeholder="Buscar productos, marcas y más..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-full pl-10 pr-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Buscar"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={18}
            aria-hidden="true"
          />
        </form>

        {/* Iconos y usuario (escritorio) */}
        <div className="flex items-center gap-6 text-gray-700">
          {/* Favoritos */}
          <Link to="/favorites" className="relative hover:text-green-600" aria-label="Favoritos">
            <Heart size={22} />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Notificaciones */}
          <Link to="/notifications" className="relative hover:text-green-600" aria-label="Notificaciones">
            <Bell size={22} />
            {notificationsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1">
                {notificationsCount}
              </span>
            )}
          </Link>

          {/* Carrito */}
          <Link to="/cart" className="relative hover:text-green-600" aria-label="Carrito">
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Usuario */}
          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-green-700 font-semibold hover:text-green-800"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-white ${
                    user?.rol === "admin" ? "bg-yellow-500" : "bg-green-600"
                  }`}
                >
                  {`${user?.firstName?.[0] || "U"}${user?.lastName?.[0] || ""}`}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user?.rol === "admin"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : "bg-green-100 text-green-800 border border-green-300"
                  }`}
                >
                  {user?.rol === "admin" ? "Administrador" : "Cliente VIP"}
                </span>
                <ChevronDown size={16} aria-hidden="true" />
              </button>

              {userMenuOpen && (
                <ul
                  className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg w-56 overflow-hidden z-50"
                  role="menu"
                >
                  <li className="p-4 border-b">
                    <span className="block font-semibold">{user?.firstName} {user?.lastName}</span>
                    <Link to="/profile" className="text-green-600 text-sm hover:underline">
                      Mi perfil
                    </Link>
                  </li>

                  {user?.rol === "admin" ? (
                    <>
                      <li><Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link></li>
                      <li><Link to="/admin/orders" className="block px-4 py-2 hover:bg-gray-100">Órdenes</Link></li>
                      <li><Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-100">Productos</Link></li>
                      <li><Link to="/admin/reports" className="block px-4 py-2 hover:bg-gray-100">Reportes</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Mis compras</Link></li>
                      <li><Link to="/favorites" className="block px-4 py-2 hover:bg-gray-100">Favoritos</Link></li>
                    </>
                  )}

                  <li className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition"
              >
                Ingresa
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition"
              >
                Crear tu cuenta
              </Link>
            </div>
          )}

          {/* Menú móvil */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden text-gray-700 ml-1"
            aria-label="Abrir menú"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Categorías escritorio */}
      <div className="bg-green-50 px-6 py-2 text-sm text-gray-700 hidden md:flex justify-center gap-6">
        <Link to="/category/hogar" className="hover:text-green-600">Hogar</Link>
        <Link to="/category/ecotecnologia" className="hover:text-green-600">EcoTecnología</Link>
        <Link to="/category/moda" className="hover:text-green-600">Moda</Link>
        <Link to="/category/jardin" className="hover:text-green-600">Jardín</Link>
        <Link to="/category/alimentos" className="hover:text-green-600">Alimentos</Link>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4">
          {/* Buscador */}
          <form onSubmit={handleSearch} className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Buscar productos, marcas y más..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-full pl-10 pr-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Buscar en móvil"
            />
          </form>

          {/* Categorías */}
          <div className="flex flex-col gap-3 text-sm">
            <Link onClick={() => setMobileMenuOpen(false)} to="/category/hogar" className="hover:text-green-600">Hogar</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/category/ecotecnologia" className="hover:text-green-600">EcoTecnología</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/category/moda" className="hover:text-green-600">Moda</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/category/jardin" className="hover:text-green-600">Jardín</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/category/alimentos" className="hover:text-green-600">Alimentos</Link>
          </div>

          {/* Login / Registro móvil */}
          {!isAuthenticated && (
            <div className="flex flex-col gap-3 mt-4">
              <Link
                onClick={() => setMobileMenuOpen(false)}
                to="/login"
                className="bg-green-600 text-white px-3 py-2 rounded-full text-center hover:bg-green-700"
              >
                Ingresa
              </Link>
              <Link
                onClick={() => setMobileMenuOpen(false)}
                to="/register"
                className="bg-green-600 text-white px-3 py-2 rounded-full text-center hover:bg-green-700"
              >
                Crear tu cuenta
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
