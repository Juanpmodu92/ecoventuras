import { getDashboardSummary } from "../controllers/admin.controller.js";
import { authRequired} from "../middlewares/validateToken.js";
import { Router } from "express";
import { isAdmin } from "../middlewares/validateRole.js";

const router = Router();

router.get("/admin/dashboard", authRequired, isAdmin, getDashboardSummary);

export default router;
