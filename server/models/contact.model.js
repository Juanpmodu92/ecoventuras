import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pendiente", "leído", "resuelto"],
        default: "pendiente",
    },
}, {
    timestamps: true
});

export default mongoose.model("ContactMessage", contactSchema);
