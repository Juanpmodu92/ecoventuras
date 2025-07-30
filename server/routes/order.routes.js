import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getOrders, getAllOrders, createOrder, updateOrderStatus} from "../controllers/order.controller.js";
import { isAdmin } from "../middlewares/validateRole.js";

const router = Router();

router.post("/orders", authRequired, createOrder);
router.get("/orders", authRequired, getOrders);
router.get("/admin/orders", authRequired, isAdmin, getAllOrders);
router.patch("/orders/:id/status", authRequired, isAdmin, updateOrderStatus)

export default router;
