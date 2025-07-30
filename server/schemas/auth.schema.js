import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "El apellido es obligatorio"),
    username: z.string().min(1, "El nombre de usuario es obligatorio"),
    email: z.string().email("El correo no es válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    documentType: z.enum(["CC", "CE", "TI", "NIT"], {
        errorMap: () => ({ message: "Tipo de documento no válido" }),
    }),
    documentNumber: z
    .number({ invalid_type_error: "Debe ser un número" })
    .int("Debe ser un número entero")
    .min(1000000, "Número de documento no válido")
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});