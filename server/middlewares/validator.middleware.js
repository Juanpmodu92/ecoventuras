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
                    case "firstName":
                        return err.message || "El nombre es requerido";
                    case "lastName":
                        return err.message || "El apellido es requerido";
                    case "username":
                        return err.message || "El nombre de usuario es requerido";
                    case "email":
                        return err.code === "invalid_format"
                            ? "El correo electrónico no es válido"
                            : err.message || "El correo electrónico es requerido";
                    case "password":
                        return err.message || "La contraseña es requerida";
                    case "documentType":
                        return err.message || "Tipo de documento es requerido";
                    case "documentNumber":
                        return err.message || "Número de documento es requerido";
                    case "title":
                        return err.message || "El título es requerido";
                    case "description":
                        return err.message || "La descripción es requerida";
                    case "date":
                        return err.code === "invalid_string"
                            ? "La fecha debe tener formato ISO válido"
                            : err.message || "Formato de fecha inválido";
                    default:
                        return `Campo inválido: ${campo}`;
                }
            });

            return res.status(400).json({ errors: mensajes });
        }

        return res.status(400).json({
            errors: [error.message || "Solicitud inválida"],
        });
    }
};
