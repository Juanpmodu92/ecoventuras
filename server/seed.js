// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const products = [
  {
    name: "Esponja Vegetal de Lufa",
    description: "Biodegradable, ideal para exfoliar la piel de manera natural.",
    price: 9.5,
    stock: 70,
    code: "ECO-021"
  },
  {
    name: "Bolsa Reutilizable de Tela",
    description: "De algodón orgánico, ideal para tus compras sin plástico.",
    price: 15.0,
    stock: 100,
    code: "ECO-022"
  },
  {
    name: "Detergente Ecológico en Polvo",
    description: "Libre de fosfatos, biodegradable y seguro para el medio ambiente.",
    price: 28.75,
    stock: 60,
    code: "ECO-023"
  },
  {
    name: "Toalla de Microfibra Bambú",
    description: "Absorbente, suave y libre de tintes tóxicos.",
    price: 19.9,
    stock: 85,
    code: "ECO-024"
  },
  {
    name: "Jabón Artesanal de Carbón Activado",
    description: "Ideal para piel grasa. Sin colorantes ni fragancias sintéticas.",
    price: 11.0,
    stock: 90,
    code: "ECO-025"
  },
  {
    name: "Compostador de Cocina",
    description: "Diseñado para espacios pequeños. Reduce tus residuos orgánicos.",
    price: 72.0,
    stock: 25,
    code: "ECO-026"
  },
  {
    name: "Cepillo de Bambú para Cabello",
    description: "Con púas naturales que cuidan tu cuero cabelludo.",
    price: 17.5,
    stock: 55,
    code: "ECO-027"
  },
  {
    name: "Cera Natural para Muebles",
    description: "Protege y da brillo sin químicos dañinos.",
    price: 29.0,
    stock: 40,
    code: "ECO-028"
  },
  {
    name: "Shampoo Sólido Anticaspa",
    description: "Fórmula natural sin sulfatos. Dura hasta 60 lavadas.",
    price: 21.0,
    stock: 50,
    code: "ECO-029"
  },
  {
    name: "Limpiador Multiusos Natural",
    description: "A base de vinagre y aceites esenciales cítricos.",
    price: 13.0,
    stock: 65,
    code: "ECO-030"
  },
  {
    name: "Portacepillos de Bambú",
    description: "Diseño minimalista para mantener tu baño ordenado.",
    price: 10.5,
    stock: 80,
    code: "ECO-031"
  },
  {
    name: "Té Orgánico en Hojas",
    description: "Mezcla relajante sin bolsas plásticas ni químicos.",
    price: 16.5,
    stock: 60,
    code: "ECO-032"
  },
  {
    name: "Pañales de Tela Reutilizables",
    description: "Diseño ajustable, cómodo y económico a largo plazo.",
    price: 27.9,
    stock: 70,
    code: "ECO-033"
  },
  {
    name: "Portacomidas de Acero Inoxidable",
    description: "3 compartimientos, cero plástico, resistente y duradero.",
    price: 49.0,
    stock: 45,
    code: "ECO-034"
  },
  {
    name: "Cepillo para Ropa de Bambú",
    description: "Remueve pelusas y suciedad sin dañar las telas.",
    price: 12.75,
    stock: 75,
    code: "ECO-035"
  },
  {
    name: "Set de Cubiertos de Bambú",
    description: "Incluye tenedor, cuchillo, cuchara y estuche de tela.",
    price: 18.0,
    stock: 90,
    code: "ECO-036"
  },
  {
    name: "Aceite Corporal Natural",
    description: "Hidratante a base de almendras y lavanda.",
    price: 22.0,
    stock: 50,
    code: "ECO-037"
  },
  {
    name: "Enjuague Bucal Natural",
    description: "Sin alcohol, con menta orgánica. Refresca y cuida.",
    price: 14.5,
    stock: 65,
    code: "ECO-038"
  },
  {
    name: "Velas Aromáticas de Soya",
    description: "Luz cálida sin parafina. Fragancia a base de aceites esenciales.",
    price: 20.0,
    stock: 55,
    code: "ECO-039"
  },
  {
    name: "Crema Dental Natural",
    description: "Sin flúor, sin microplásticos, en frasco de vidrio.",
    price: 15.0,
    stock: 80,
    code: "ECO-040"
  },
  {
    name: "Pulsera Repelente Natural",
    description: "Hecha con citronela. Ideal para exteriores sin usar químicos.",
    price: 9.75,
    stock: 90,
    code: "ECO-041"
  },
  {
    name: "Ropa Interior de Bambú",
    description: "Suave, antibacteriana y transpirable. Ideal para piel sensible.",
    price: 26.0,
    stock: 60,
    code: "ECO-042"
  },
  {
    name: "Gafas de Sol de Madera",
    description: "Ligeras, modernas y biodegradables. Protección UV400.",
    price: 52.5,
    stock: 35,
    code: "ECO-043"
  },
  {
    name: "Botella Purificadora con Filtro",
    description: "Ideal para viajes. Purifica agua sobre la marcha.",
    price: 69.9,
    stock: 40,
    code: "ECO-044"
  },
  {
    name: "Bolígrafo Recargable de Bambú",
    description: "Elegante, funcional y amigable con el ambiente.",
    price: 6.5,
    stock: 100,
    code: "ECO-045"
  },
  {
    name: "Tapabocas Reutilizable de Tela",
    description: "Lavable y transpirable. Reduce residuos desechables.",
    price: 8.0,
    stock: 150,
    code: "ECO-046"
  },
  {
    name: "Perfume Natural Roll-On",
    description: "A base de aceites esenciales y alcohol de caña.",
    price: 23.0,
    stock: 55,
    code: "ECO-047"
  },
  {
    name: "Set de Manicure de Bambú",
    description: "Incluye cortaúñas, lima, pinzas y estuche ecológico.",
    price: 19.95,
    stock: 70,
    code: "ECO-048"
  },
  {
    name: "Rasuradora de Acero Reutilizable",
    description: "Cero plástico, compatible con hojas universales.",
    price: 39.9,
    stock: 60,
    code: "ECO-049"
  },
  {
    name: "Cuaderno de Papel Reciclado",
    description: "Hecho 100% con materiales reciclados y libre de cloro.",
    price: 12.0,
    stock: 90,
    code: "ECO-050"
  }
];


async function seedProducts() {
  try {
    await connectDB();

    // Limpia los productos existentes con esos códigos si ya están
    for (const product of products) {
      await Product.findOneAndDelete({ code: product.code });
    }

    // Inserta los nuevos productos
    await Product.insertMany(products);
    console.log("✅ Productos insertados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al insertar productos:", error.message);
    process.exit(1);
  }
}

seedProducts();
