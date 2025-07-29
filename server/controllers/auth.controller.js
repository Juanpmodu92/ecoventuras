import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userFound = await User.findOne({ email });

        if (userFound)
            return res.status(400).json(["The email is already in use"],);

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            rol: req.body.rol || 'client'
        });

        const userSaved = await newUser.save();

        // create access token
        const token = await createAccessToken({
            id: userSaved._id,
            username: userSaved.username,
            rol: userSaved.rol
        });

        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: true,
            sameSite: "none",
        });

        
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            rol: userSaved.rol
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            username,
            email,
            password: hashedPassword,
            rol: 'admin'
        });

        const savedAdmin = await newAdmin.save();

        const token = await createAccessToken({
            id: savedAdmin._id,
            username: savedAdmin.username,
            rol: savedAdmin.rol
        });

        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: true,
            sameSite: "none"
        });

        res.status(201).json({
            id: savedAdmin._id,
            username: savedAdmin.username,
            email: savedAdmin.email,
            rol: savedAdmin.rol
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userFound = await User.findOne({ email });

        if (!userFound)
            return res.status(400).json({
                message: ["The email does not exist"],
            });

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            return res.status(400).json({
                message: ["The password is incorrect"],
            });
        }

        const token = await createAccessToken({
            id: userFound._id,
            username: userFound.username,
            rol: userFound.rol
        });

        res.cookie("token", token, {
        });

        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            rol: userFound.rol,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.send(false);

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
        if (error) return res.sendStatus(401);

        const userFound = await User.findById(user.id);
        if (!userFound) return res.sendStatus(401);

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            rol: userFound.rol
        });
    });
};

export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
    });
    return res.sendStatus(200);
};