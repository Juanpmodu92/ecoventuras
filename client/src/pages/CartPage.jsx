import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, total, loading, error, updateItem, removeItem, clearCart, checkout } = useCart();

  const handleQuantityChange = (productId, event) => {
    const quantity = parseInt(event.target.value);
    if (quantity > 0) {
      updateItem(productId, quantity);
    }
  };

  const handleRemove = (productId) => {
    removeItem(productId);
  };

  const handleCheckout = async () => {
    try {
      const result = await checkout();
      alert("Compra exitosa! Número de orden: " + result.order._id);
    } catch (err) {
      alert("Error en el pago: " + err.message);
    }
  };

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  if (cartItems.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Carrito</h1>
        <p>Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.productId} className="mb-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p>Precio: ${item.price.toFixed(2)}</p>
              <p>Stock disponible: {item.stock}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.productId, e)}
                className="border rounded px-2 py-1 w-16"
              />
              <button
                onClick={() => handleRemove(item.productId)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
            <div>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 font-bold text-lg">
        Total: ${total.toFixed(2)}
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={clearCart}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Vaciar carrito
        </button>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
