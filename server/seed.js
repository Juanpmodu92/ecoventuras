import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const productos = [
  {
    name: "Detergente ecológico en polvo",
    description: "Detergente biodegradable sin químicos agresivos",
    price: 25.5,
    stock: 80,
    category: "Limpieza",
    code: "ECO-006"
  },
  {
    name: "Esponjas de luffa natural",
    description: "Pack de 3 esponjas vegetales compostables",
    price: 14.9,
    stock: 120,
    category: "Higiene",
    code: "ECO-007"
  },
  {
    name: "Jabón artesanal de carbón activado",
    description: "Limpieza profunda y sin químicos dañinos",
    price: 9.75,
    stock: 200,
    category: "Cuidado personal",
    code: "ECO-008"
  },
  {
    name: "Cepillo para platos de coco",
    description: "Mango de bambú y fibra de coco natural",
    price: 11.3,
    stock: 60,
    category: "Cocina",
    code: "ECO-009"
  },
  {
    name: "Velas ecológicas de cera de soya",
    description: "Pack de 2 velas aromáticas naturales",
    price: 28,
    stock: 35,
    category: "Hogar",
    code: "ECO-010"
  }
];


const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(productos);
    console.log("✅ Productos insertados correctamente");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error al insertar productos:", error.message);
  }
};

seedProducts();
