import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import helmet from "helmet";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

app.use(helmet());
