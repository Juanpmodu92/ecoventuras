import { useCart } from "../context/CartContext";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const SHIPPING_FREE_LIMIT = 50000;
  const SHIPPING_COST = 7000;

  useEffect(() => {
    setSelectedItems(cart.map((item) => item.productId));
  }, [cart]);

  const formatPrice = (price) =>
    price.toLocaleString("es-CO", { style: "currency", currency: "COP" });

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.productId));
    }
  };

  const selectedTotal = useMemo(() => {
    return cart
      .filter((item) => selectedItems.includes(item.productId))
      .reduce((acc, item) => acc + item.subtotal, 0);
  }, [cart, selectedItems]);

  const shippingCost = selectedTotal >= SHIPPING_FREE_LIMIT ? 0 : SHIPPING_COST;

  const goToPayment = () => {
    if (selectedItems.length === 0) {
      alert("Selecciona al menos un producto para continuar.");
      return;
    }
    
    navigate("/checkout/payment");
  };

  return (
    <div className="bg-[#b7c4b3] min-h-screen p-6 flex flex-col md:flex-row gap-6">
      {/* Lista de productos */}
      <div className="flex-1 space-y-4">
        {/* Selección de todos */}
        <div className="bg-white rounded-lg shadow p-3 flex items-center">
          <input
            type="checkbox"
            checked={selectedItems.length === cart.length && cart.length > 0}
            onChange={toggleSelectAll}
            className="w-5 h-5 accent-[#007BFF] rounded-full"
          />
          <span className="ml-2 font-medium">Todos los productos</span>
        </div>

        {/* Productos */}
        {cart.map((item) => {
          const imageSrc = item.imageUrl || "/no-image.png";

          return (
            <div
              key={item.productId}
              className="bg-white rounded-lg shadow p-4 flex items-center"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.productId)}
                onChange={() => toggleSelectItem(item.productId)}
                className="w-5 h-5 accent-[#007BFF] rounded-full"
              />
              <img
                src={imageSrc}
                alt={item.name}
                className="w-16 h-16 object-cover rounded ml-3"
                onError={(e) => {
                  e.target.src = "/no-image.png";
                  e.target.onerror = null;
                }}
              />
              <div className="ml-3 flex-1">
                <p className="font-medium">{item.name}</p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateCartItem(item.productId, Number(e.target.value))
                }
                className="w-16 text-center border rounded mx-3"
              />
              <span className="font-bold">{formatPrice(item.subtotal)}</span>
            </div>
          );
        })}

        {/* Envío */}
        <div className="bg-white rounded-lg shadow p-4 flex justify-between">
          <span className="text-green-600 font-medium">Envío</span>
          <span className={shippingCost === 0 ? "text-green-600" : ""}>
            {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
          </span>
        </div>

        {/* Banner envío gratis */}
        {shippingCost > 0 && selectedTotal > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <p className="font-bold text-green-600">
              Agrega {formatPrice(SHIPPING_FREE_LIMIT - selectedTotal)} más para
              obtener envío gratis
            </p>
            <p className="text-sm text-gray-600">
              Descubre otras imperdibles ofertas →
            </p>
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-lg shadow p-4 w-full md:w-80 h-fit">
        <h2 className="font-bold mb-4">Resumen de compra</h2>
        <div className="flex justify-between mb-2">
          <span>Productos ({selectedItems.length})</span>
          <span>{formatPrice(selectedTotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Envío</span>
          <span className={shippingCost === 0 ? "text-green-600" : ""}>
            {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
          </span>
        </div>
        <input
          type="text"
          placeholder="Ingresa código de cupón"
          className="border rounded w-full px-2 py-1 mb-4"
        />
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>{formatPrice(selectedTotal + shippingCost)}</span>
        </div>
        <button
          onClick={goToPayment}
          className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white py-2 rounded"
        >
          Continuar compra
        </button>
      </div>
    </div>
  );
}
