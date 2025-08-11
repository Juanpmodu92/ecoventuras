import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function AdminRoute() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.rol !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}

export default AdminRoute;
