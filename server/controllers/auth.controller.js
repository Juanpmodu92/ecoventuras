import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            birthDate,
            username,
            email,
            password,
            confirmPassword,
            documentType,
            documentNumber,
            phone,
            termsRead,
            termsAccept,
            rol
        } = req.body;

        // Validar campos obligatorios
        if (
            !firstName || !lastName || !birthDate || !username || !email ||
            !password || !confirmPassword || !documentType || !documentNumber ||
            !phone || termsRead !== true || termsAccept !== true
        ) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Validar contraseñas
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Las contraseñas no coinciden" });
        }

        // Verificar si ya existe el usuario por email o documento
        const userFound = await User.findOne({
            $or: [{ email }, { documentNumber }]
        });
        if (userFound) {
            return res.status(400).json({ message: "El email o número de documento ya está en uso" });
        }

        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        const newUser = new User({
            firstName,
            lastName,
            birthDate,
            username,
            email,
            password: passwordHash,
            documentType,
            documentNumber,
            phone,
            termsRead,
            termsAccept,
            rol: rol || "client"
        });

        const userSaved = await newUser.save();

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
            firstName: userSaved.firstName,
            lastName: userSaved.lastName,
            birthDate: userSaved.birthDate,
            email: userSaved.email,
            documentType: userSaved.documentType,
            documentNumber: userSaved.documentNumber,
            phone: userSaved.phone,
            rol: userSaved.rol
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            documentType,
            documentNumber
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            documentType,
            documentNumber,
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
            firstName: savedAdmin.firstName,
            lastName: savedAdmin.lastName,
            email: savedAdmin.email,
            documentType: savedAdmin.documentType,
            documentNumber: savedAdmin.documentNumber,
            rol: savedAdmin.rol
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        res.cookie("token", token);

        res.json({
            id: userFound._id,
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            username: userFound.username,
            email: userFound.email,
            documentType: userFound.documentType,
            documentNumber: userFound.documentNumber,
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
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
            documentType: userFound.documentType,
            documentNumber: userFound.documentNumber,
            rol: userFound.rol
        });
    });
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            firstName,
            lastName,
            username,
            email,
            documentType,
            documentNumber
        } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (username !== undefined) user.username = username;
        if (email !== undefined) user.email = email;
        if (documentType !== undefined) user.documentType = documentType;
        if (documentNumber !== undefined) user.documentNumber = documentNumber;

        await user.save();

        res.status(200).json({
            message: "Perfil actualizado correctamente",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                documentType: user.documentType,
                documentNumber: user.documentNumber,
                rol: user.rol,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "La contraseña actual es incorrecta" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
    });
    return res.sendStatus(200);
};
