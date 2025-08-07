
import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
    getFavorites,
    addFavorite,
    removeFavorite,
} from "../controllers/favorite.controller.js";

const router = Router();

router.get("/favorites", authRequired, getFavorites);
router.post("/favorites/:id", authRequired, addFavorite);
router.delete("/favorites/:id", authRequired, removeFavorite);

export default router;
