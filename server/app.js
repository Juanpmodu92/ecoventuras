
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes.js';
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js"
import reportRoutes from "./routes/report.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api", reportRoutes);


// Rutas:

app.use("/api", authRoutes);

app.use("/api", productRoutes);

app.use("/api", cartRoutes);

app.use("/api", orderRoutes);

app.use("/api", favoriteRoutes);

export default app;
