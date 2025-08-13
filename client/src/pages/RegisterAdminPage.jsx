import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterAdminPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { signupAdmin, isAuthenticated } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (values) => {
        // Forzar el rol admin
        values.rol = "admin";
        signupAdmin(values);
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent">
            <div className="bg-gradient-to-b from-[#E0E7DF] to-[#96A999] shadow-lg rounded-lg p-8 w-full max-w-3xl">
                <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
                    Registro de Administrador
                </h1>

                <form
                    onSubmit={onSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {/* Campos exactamente igual que en el registro normal */}
                    {/* Nombres */}
                    <div>
                        <label className="block text-blue-600 font-semibold">
                            Nombres *
                        </label>
                        <input
                            type="text"
                            {...register("firstName", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">Requerido</p>
                        )}
                    </div>

                    {/* Apellidos */}
                    <div>
                        <label className="block text-blue-600 font-semibold">
                            Apellidos *
                        </label>
                        <input
                            type="text"
                            {...register("lastName", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm">Requerido</p>
                        )}
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                        <label className="block text-blue-600 font-semibold">
                            Fecha de Nacimiento *
                        </label>
                        <input
                            type="date"
                            {...register("birthDate", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                    </div>

                    {/* Tipo y Número de Documento */}
                    <div>
                        <label className="block text-blue-600 font-semibold">
                            Tipo de Documento *
                        </label>
                        <select
                            {...register("documentType", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        >
                            <option value="">Seleccione</option>
                            <option value="CC">Cédula de Ciudadanía</option>
                            <option value="CE">Cédula de Extranjería</option>
                            <option value="TI">Tarjeta de Identidad</option>
                            <option value="NIT">NIT</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-blue-600 font-semibold">
                            Número de Documento *
                        </label>
                        <input
                            type="number"
                            {...register("documentNumber", {
                                required: true,
                                valueAsNumber: true,
                            })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                    </div>

                    {/* Usuario */}
                    <div>
                        <label className="block text-blue-600 font-semibold">
                            Usuario *
                        </label>
                        <input
                            type="text"
                            {...register("username", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <label className="block text-blue-600 font-semibold">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-blue-600 font-semibold">
                            Contraseña *
                        </label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-blue-600 font-semibold">
                            Repetir Contraseña *
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                    </div>

                    {/* Teléfono */}
                    <div className="md:col-span-2">
                        <label className="block text-blue-600 font-semibold">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            {...register("phone", { required: true })}
                            className="w-full border border-blue-400 rounded px-3 py-2"
                        />
                    </div>

                    {/* Términos */}
                    <div className="md:col-span-2 flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("termsRead", { required: true })}
                            />
                            He leído los términos y condiciones
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("termsAccept", { required: true })}
                            />
                            Acepto los términos y condiciones
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Registrar Administrador
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterAdminPage;
