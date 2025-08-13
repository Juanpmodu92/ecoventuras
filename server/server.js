import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import helmet from "helmet";
import express from "express";
import path from "path";

dotenv.config();
connectDB();

app.use(helmet());
app.use("/uploads", express.static(path.resolve("uploads")));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


