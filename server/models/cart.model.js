// models/cart.model.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // o "User" si estás usando un modelo unificado
        required: true,
        unique: true // Un solo carrito por usuario
    },
    items: [
        {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model("Cart", cartSchema);
