import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, },
    stock: { type: Number, required: true },
    code: { type: String, require: true, unique:true, trim: true },
    category: { type: String, required: true }
    }, {
    timestamps: true
});

export default mongoose.model("Product", productSchema);
