import { Router } from "express";
import multer from "multer";
import path from "path";

import {
    createProduct,
    getAvailableProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProducts,
    getLowStockCount
} from "../controllers/product.controller.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { productSchema } from "../schemas/product.schema.js";
import { authRequired } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/validateRole.js";

const router = Router();

// ✅ Configurar multer ANTES de usarlo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ✅ Usar upload después de declararlo

// Todos los usuarios pueden consultar esta ruta
router.get("/products", getAvailableProducts);

// Solo administradores autenticados pueden consultar estas rutas
router.post("/products", authRequired, isAdmin, upload.single("image"), validateSchema(productSchema), createProduct);
router.put("/products/:id", authRequired, isAdmin, validateSchema(productSchema), updateProduct);
router.delete("/products/:id", authRequired, isAdmin, deleteProduct);
router.get("/products/:id", authRequired, isAdmin, validateSchema(productSchema), getProductById);
router.get("/admin/products", authRequired, isAdmin, validateSchema(productSchema), getProducts);
router.get("/admin/low-stock-count", authRequired, isAdmin, getLowStockCount);

export default router;
