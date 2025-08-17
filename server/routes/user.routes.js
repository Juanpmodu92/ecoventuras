import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin, isCliente } from "../middlewares/validateRole.js";
import User from "../models/user.model.js";

const router = Router();

// Perfil Admin
router.get("/admin/profile", authRequired, isAdmin, (req, res) => {
    res.json({ message: `Hola Admin ${req.user.id}` });
});

// Perfil Cliente
router.get("/cliente/profile", authRequired, isCliente, (req, res) => {
    res.json({ message: `Hola Cliente ${req.user.id}` });
});

// 📌 Obtener todos los usuarios (solo admin)
router.get("/users", authRequired, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

export default router;
