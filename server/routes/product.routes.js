import { Router } from "express";
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

// Todos los usuarios pueden consultar esta ruta
router.get("/products", authRequired, getAvailableProducts);

// Solo administradores autenticados pueden consultar estas rutas
router.post("/products", authRequired, isAdmin, validateSchema(productSchema), createProduct);
router.put("/products/:id", authRequired, isAdmin, validateSchema(productSchema), updateProduct);
router.delete("/products/:id", authRequired, isAdmin, deleteProduct);
router.get("/products/:id", authRequired, isAdmin, validateSchema(productSchema), getProductById);
router.get("/admin/products",authRequired, isAdmin, validateSchema(productSchema), getProducts );
router.get("/admin/low-stock-count", authRequired, isAdmin, getLowStockCount);


export default router;