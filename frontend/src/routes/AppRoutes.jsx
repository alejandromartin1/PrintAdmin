import { Routes, Route } from "react-router-dom";
import Layout from "../componentes/layout";
import Welcome from "../auth/welcome";
import Login from "../auth/login";
import Register from "../auth/registro";
import Dashboard from "../pages/dashboard";
import CrearFactura from "../pages/agregarCliente";
import HistorialFacturas from "../pages/historial";
import Cotizacion from "../pages/cotizaciones";
import Pendiente from "../pages/pendientes";
import Inventario from "../pages/inventario";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Agrupamos las rutas dentro de Layout para que Sidebar y Navbar aparezcan */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes/agregarCliente" element={<CrearFactura />} />
        <Route path="/clientes/historial" element={<HistorialFacturas />} />
        <Route path="/cotizacion" element={<Cotizacion />} />
        <Route path="/pendientes" element={<Pendiente />} />
        <Route path="/inventario" element={<Inventario />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
