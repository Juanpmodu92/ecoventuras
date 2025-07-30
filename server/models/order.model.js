import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pendiente", "confirmada", "enviada", "entregada", "cancelada"],
        default: "pendiente"
    },
    estimatedDeliveryDate: {
    type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Order = mongoose.model("Order", orderSchema);
