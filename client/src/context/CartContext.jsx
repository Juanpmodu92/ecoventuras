import { createContext, useContext, useState, useEffect } from "react";
import {
  getCartRequest,
  addToCartRequest,
  updateCartItemRequest,
  removeFromCartRequest,
  clearCartRequest,
  checkoutCartRequest,
} from "../api/cart";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const getCart = async () => {
    try {
      const res = await getCartRequest();
      setCart(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      if (error.response?.status === 404) {
        // Carrito no existe -> inicializamos vacío
        setCart([]);
        setTotal(0);
      } else {
        console.error("Error al obtener carrito:", error);
      }
    }
  };

  const addToCart = async (productId, quantity) => {
    await addToCartRequest(productId, quantity);
    await getCart();
  };

  const updateCartItem = async (productId, quantity) => {
    await updateCartItemRequest(productId, quantity);
    await getCart();
  };

  const removeFromCart = async (productId) => {
    await removeFromCartRequest(productId);
    await getCart();
  };

  const clearCart = async () => {
    await clearCartRequest();
    setCart([]);
    setTotal(0);
  };

  const checkoutCart = async () => {
    await checkoutCartRequest();
    await getCart();
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        checkoutCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
