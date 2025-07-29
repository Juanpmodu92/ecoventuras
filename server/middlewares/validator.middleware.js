export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        let parsedErrors = error.errors;

        if (!parsedErrors && typeof error.message === "string") {
            try {
                parsedErrors = JSON.parse(error.message);
            } catch {
                parsedErrors = [];
            }
        }

        if (Array.isArray(parsedErrors)) {
            const mensajes = parsedErrors.map((err) => {
                const campo = err.path[0];
                switch (campo) {
                    case "username":
                        return err.message || "Username is required";
                    case "email":
                        return err.code === "invalid_format"
                            ? "Email is not valid"
                            : err.message || "Email is required";
                    case "password":
                        return err.message || "Password is required",
                        "Password must be at least 6 characters";
                    case "title":
                        return err.message || "Title is required";
                    case "description":
                        return err.message || "Description is required";
                    case "date":
                        return err.code === "invalid_string"
                            ? "Date must be a valid ISO string"
                            : err.message || "Invalid date format";
                    default:
                        return `Invalid field: ${campo}`;
                }
            });

            return res.status(400).json({ errors: mensajes });
        }

        return res.status(400).json({
            errors: [error.message || "Solicitud inválida"],
        });
    }
};