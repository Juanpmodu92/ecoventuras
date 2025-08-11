import { Router } from "express";
import { sendMessage, getAllMessages } from "../controllers/contact.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/validateRole.js";

const router = Router();

// Enviar mensaje de contacto (cliente autenticado)
router.post("/", authRequired, sendMessage);

// Ver todos los mensajes (solo admin)
router.get("/", authRequired, isAdmin, getAllMessages);

export default router;
