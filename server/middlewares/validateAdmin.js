export function validateAdmin(req, res, next) {
    if (req.user?.rol === 'admin') {
        return next();
    }
    return res.status(403).json({ message: "Acceso denegado: solo administradores." });
}
