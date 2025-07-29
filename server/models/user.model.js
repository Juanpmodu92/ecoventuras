import mongoose from "mongoose";
import { _enum } from "zod/v4/core";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
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
    rol:{
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
