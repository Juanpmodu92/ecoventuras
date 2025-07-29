export const isAdmin = (req, res, next) => {
    if (req.user.rol !== "admin") {
        return res.status(403).json({ message: "Acceso denegado: solo administradores" });
    }
    next();
};

export const isCliente = (req, res, next) => {
    if (req.user.rol !== "cliente") {
        return res.status(403).json({ message: "Acceso denegado: solo clientes" });
    }
    next();
};
