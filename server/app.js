
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from './routes/auth.routes.js';
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js"
import reportRoutes from "./routes/report.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import userRoutes from "./routes/user.routes.js";


const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true           
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api", reportRoutes);


// Rutas:

app.use("/api", authRoutes);

app.use("/api", productRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", cartRoutes);

app.use("/api", orderRoutes);

app.use("/api", favoriteRoutes);

app.use("/api", adminRoutes);

app.use("/api", userRoutes);

app.use("/api/contact", contactRoutes);



export default app;
