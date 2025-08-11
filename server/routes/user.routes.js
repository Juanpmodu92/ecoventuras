import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin, isCliente } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/admin/profile", authRequired, isAdmin, (req, res) => {
    res.json({ message: `Hola Admin ${req.user.id}` });
});

router.get("/cliente/profile", authRequired, isCliente, (req, res) => {
    res.json({ message: `Hola Cliente ${req.user.id}` });
});

export default router;
