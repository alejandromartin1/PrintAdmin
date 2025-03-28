import { Routes, Route } from "react-router-dom";
import Layout from "../componentes/layout";
import Welcome from "../auth/welcome";
import Login from "../auth/login";
import Register from "../auth/registro";
import Dashboard from "../pages/dashboard";
import AgregarCliente from "../pages/agregarCliente";
import HistorialCliente from "../pages/historial";
import Cotizacion from "../pages/cotizaciones";
import Pendiente from "../pages/pendientes";
import Inventario from "../pages/inventario";
import EntradasYSalidas from "../pages/entradasYsalidas";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Agrupamos las rutas dentro de Layout para que Sidebar y Navbar aparezcan */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes/agregarCliente" element={<AgregarCliente />} />
        <Route path="/clientes/historial" element={<HistorialCliente />} />
        <Route path="/cotizacion" element={<Cotizacion />} />
        <Route path="/pendientes" element={<Pendiente />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/EntradasYSalidas" element={<EntradasYSalidas />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
