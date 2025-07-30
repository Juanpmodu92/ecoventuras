import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getOrders, getAllOrders, createOrder, updateOrderStatus, getInvoice, generateInvoice} from "../controllers/order.controller.js";
import { isAdmin } from "../middlewares/validateRole.js";

const router = Router();

router.post("/orders", authRequired, createOrder);
router.get("/orders", authRequired, getOrders);
router.get("/admin/orders", authRequired, isAdmin, getAllOrders);
router.patch("/orders/:id/status", authRequired, isAdmin, updateOrderStatus)
router.get("/orders/:id/invoice", authRequired, getInvoice);
router.get("/orders/:id/invoice-pdf", authRequired, generateInvoice);


export default router;
