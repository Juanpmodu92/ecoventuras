import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest} from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
    };

    export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true)

    const signup = async (user) => {
        try {
        const res = await registerRequest(user);
        console.log("Registro exitoso:", res.data);
        setUser(res.data);
        setIsAuthenticated(true);
        setErrors([]); // limpia errores si todo sale bien
        } catch (error) {
        const data = error.response?.data;

        // Manejo robusto de múltiples formatos de error
        const extractedErrors = Array.isArray(data)
            ? data
            : data?.errors || data?.message || ["Ocurrió un error inesperado"];

        setErrors(extractedErrors);
        }
    };

    const signin = async (user) => {
        try {
            const res = await loginRequest(user)
            console.log("Inicio de sesión exitoso:", res.data);
        setUser(res.data);
        setIsAuthenticated(true);
        setErrors([]); // limpia errores si todo sale bien
        } catch (error) {
        const data = error.response?.data;

        // Manejo robusto de múltiples formatos de error
        const extractedErrors = Array.isArray(data)
            ? data
            : data?.errors || data?.message || ["Ocurrió un error inesperado"];

        setErrors(extractedErrors);
        }
    }


    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false)
        setUser(null);
    }

    useEffect(()=>{
        if (errors.length > 0){
            const timer = setTimeout(()=> {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    useEffect(() =>{
        const checkLogin = async () => {
            const cookies = Cookies.get()
            if (!cookies.token) {
                setIsAuthenticated(false)
                setLoading(false);
                return
            }
            try {
                const res = await verifyTokenRequest(cookies.token);
                // console.log(res);
                if (!res.data) return setIsAuthenticated(false);
                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                setIsAuthenticated(false);
                setLoading(false);
            }
        };
        checkLogin();
    },[])

    return (
        <AuthContext.Provider
        value={{
            signup,
            signin,
            logout,
            loading,
            user,
            isAuthenticated,
            errors,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};
