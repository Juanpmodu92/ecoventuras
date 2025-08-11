import React from "react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    total,
    loading,
    error,
    updateItem,
    removeItem,
    clearCart,
    checkout,
  } = useCart();

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p>Error: {error}</p>;
  if (cartItems.length === 0) return <p>El carrito está vacío.</p>;

  const handleCheckout = async () => {
    try {
      const result = await checkout();
      alert("Compra exitosa. Número de orden: " + result.order._id);
    } catch {
      alert("Error en el proceso de pago");
    }
  };

  return (
    <div>
      <h2>Tu carrito</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.productId}>
            <strong>{item.name}</strong> - ${item.price} x {item.quantity} = ${item.subtotal}
            <div>
              <button
                onClick={() => updateItem(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateItem(item.productId, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.productId)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Total: ${total}</h3>
      <button onClick={clearCart}>Vaciar carrito</button>
      <button onClick={handleCheckout}>Finalizar compra</button>
    </div>
  );
};

export default Cart;
