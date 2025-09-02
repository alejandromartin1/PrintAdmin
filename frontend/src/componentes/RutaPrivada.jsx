import { Navigate, Outlet } from "react-router-dom";

const RutaPrivada = ({ rolesPermitidos }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const permisos = JSON.parse(localStorage.getItem("permisos") || "[]");

  if (!token) return <Navigate to="/login" replace />;
  
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />;
};

export default RutaPrivada;
