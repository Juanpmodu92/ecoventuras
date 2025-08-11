import { createContext, useState, useContext, useEffect } from "react";
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart as apiClearCart,
  checkoutCart as apiCheckoutCart,
} from "../api/cart";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await fetchCart();
      setCartItems(res.data.items);
      setTotal(res.data.total);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error cargando el carrito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      await addItemToCart(product._id || product.id, quantity);
      await loadCart();
    } catch (err) {
      setError(err.response?.data?.message || "Error agregando al carrito");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      setLoading(true);
      await updateCartItem(productId, quantity);
      await loadCart();
    } catch (err) {
      setError(err.response?.data?.message || "Error actualizando el carrito");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setLoading(true);
      await removeItemFromCart(productId);
      await loadCart();
    } catch (err) {
      setError(err.response?.data?.message || "Error eliminando del carrito");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await apiClearCart();
      setCartItems([]);
      setTotal(0);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error vaciando el carrito");
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      const res = await apiCheckoutCart();
      await loadCart();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error en el pago");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        loading,
        error,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
