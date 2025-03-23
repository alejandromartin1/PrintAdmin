import { Routes, Route } from "react-router-dom";
import Layout from "../componentes/layout";
import Welcome from "../auth/welcome";
import Login from "../auth/login";
import Register from "../auth/registro";
import Dashboard from "../pages/dashboard";
import CrearFactura from "../pages/crearFactura";
import HistorialFacturas from "../pages/historialFactura";
import Cotizacion from "../pages/cotizaciones";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Agrupamos las rutas dentro de Layout para que Sidebar y Navbar aparezcan */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/facturacion/crearFactura" element={<CrearFactura />} />
        <Route path="/facturacion/historial" element={<HistorialFacturas />} />
        <Route path="/cotizacion" element={<Cotizacion />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
