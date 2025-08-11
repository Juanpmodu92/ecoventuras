import { z } from "zod";

export const productSchema = z.object({
    name: z.string({
        required_error: "El nombre del producto es obligatorio"
    }),
    description: z.string({
        required_error: "La descripción del producto es obligatoria"
    }),
    price: z.preprocess(
        val => Number(val),
        z.number().positive("El precio debe ser un número positivo")
    ),
    stock: z.preprocess(
        val => Number(val),
        z.number().int("El stock debe ser un número entero").nonnegative("El stock no puede ser negativo")
    ),
    code: z.string({
        required_error: "El código del producto es obligatorio"
    }).min(1, "El código del producto no puede estar vacío"),
    category: z.enum(["hogar", "cuidado personal", "jardinería", "higiene", "cocina"], {
    required_error: "La categoría es obligatoria"
})
});

