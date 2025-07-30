import { z } from "zod";

export const productSchema = z.object({
    name: z.string({
        required_error: "El nombre del producto es obligatorio"
    }),
    description: z.string({
        required_error: "La descripción del producto es obligatoria"
    }),
    price: z.number({
        required_error: "El precio es obligatorio"
    }).positive("El precio debe ser un número positivo"),
    stock: z.number({
        required_error: "El stock es obligatorio"
    }).int("El stock debe ser un número entero").nonnegative("El stock no puede ser negativo"),
    code: z.string({
        required_error: "El código del producto es obligatorio"
    }).min(1, "El código del producto no puede estar vacío"),
    category: z.enum(["hogar", "personal", "jardinería", "otros"], {
        required_error: "La categoría es obligatoria"
    })
});

