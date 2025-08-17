import { Router } from "express";
import { 
    registerAdmin,
    register, 
    login, 
    updateProfile, 
    changePassword, 
    logout,
    verifyToken
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema, changePasswordSchema} from "../schemas/auth.schema.js";
import User from "../models/user.model.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);

router.post("/admin/register", registerAdmin);

router.post("/login", validateSchema(loginSchema), login);

router.post("/logout", logout);

router.get("/verify",  verifyToken);

router.put("/profile", authRequired, updateProfile);

router.put("/profile/password", authRequired, validateSchema(changePasswordSchema), changePassword);

router.get("/profile", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      rol: user.rol
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo el perfil" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      rol: user.rol
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo los datos de sesión" });
  }
});

export default router;
