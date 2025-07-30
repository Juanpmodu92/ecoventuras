import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { addToCart, getCart, removeFromCart, clearCart, updateCartItem, checkoutCart } from "../controllers/cart.controller.js";

const router = Router();

router.get("/cart", authRequired, getCart);
router.post("/cart", authRequired, addToCart);
router.post("/cart/checkout", authRequired, checkoutCart);
router.put("/cart/item", authRequired, updateCartItem);
router.delete("/cart/item", authRequired, removeFromCart);
router.delete("/cart", authRequired, clearCart);

export default router;
