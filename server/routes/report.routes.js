// routes/report.routes.js
import { Router } from "express";
import { getSalesReport } from "../controllers/report.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/validateRole.js";

const router = Router();

router.get("/admin/reports/sales", authRequired, isAdmin, getSalesReport);

export default router;
