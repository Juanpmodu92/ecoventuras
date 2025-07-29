import { Router } from "express";
import { 
    registerAdmin,
    register, 
    login, 
    logout,
    verifyToken
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/admin/register", registerAdmin);
router.post("/login", validateSchema(loginSchema), login);

router.post("/logout", logout);

router.get("/verify",  verifyToken);

router.get("/profile", authRequired);

export default router;   