import { isAdmin, isCliente } from "../middlewares/roles.middleware.js";

// Solo admins pueden acceder
router.get("/admin/profile", authRequired, isAdmin, (req, res) => {
    res.json({ message: `Hola Admin ${req.user.id}` });
});

// Solo clientes pueden acceder
router.get("/cliente/profile", authRequired, isCliente, (req, res) => {
    res.json({ message: `Hola Cliente ${req.user.id}` });
});

export default user.routes