import mongoose from "mongoose";
import { number } from "zod";
import { _enum } from "zod/v4/core";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    documentType: {
        type: String,
        enum: ["CC", "CE", "TI", "NIT"],
        required: true
    },
    documentNumber: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    termsRead: {
        type: Boolean,
        required: true
    },
    termsAccept: {
        type: Boolean,
        required: true
    },
    rol: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    code: { type: String, unique: true },
    category: {
        type: String,
        enum: ["hogar", "personal", "jardinería", "otros"], // puedes extender esto
        required: true
    }
});

export default mongoose.model('User', userSchema);

