// config/db.js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecoventurasdb');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    process.exit(1);
  }
};
