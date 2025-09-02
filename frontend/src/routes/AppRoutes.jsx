import { Routes, Route } from "react-router-dom";
import Layout from "../componentes/layout";
import RutaPrivada from "../componentes/RutaPrivada";
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
import Roles from "../pages/Roles";
import LoginCorreo from "../pages/LoginCorreo";
import Bandeja from "../pages/Bandeja";
import Empleados from "../pages/empleados";
import PerfilAdmin from '../pages/perfilAdmin';
import Factura from "../pages/factura";
import PendientesFactura from "../pages/PendientesFactura"; // <-- Importa la nueva página

import NotFound from "../pages/NotFound";
import NoAutorizado from "../pages/NoAutorizado"; 
import HistorialCotizaciones from '../pages/HistorialCotizaciones';

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas privadas (requieren login) */}
      <Route element={<RutaPrivada />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes/agregarCliente" element={<AgregarCliente />} />
          <Route path="/clientes/historial" element={<HistorialCliente />} />
          <Route path="/historial/:id" element={<HistorialCliente />} />
          <Route path="/cotizacion" element={<Cotizacion />} />
          <Route path="/historial-cotizaciones" element={<HistorialCotizaciones />} />
          <Route path="/pendientes" element={<Pendiente />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/EntradasYSalidas" element={<EntradasYSalidas />} />
          <Route path="/pendientes-factura" element={<PendientesFactura />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/perfil-admin" element={<PerfilAdmin />} />
          <Route path="/factura/:id" element={<Factura />} />
          <Route path="/login-correo" element={<LoginCorreo />} />
          <Route path="/bandeja" element={<Bandeja />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Rutas protegidas por ROL (Administrador) */}
      <Route element={<RutaPrivada rolesPermitidos={["Administrador"]} />}>
        <Route element={<Layout />}>
          <Route path="/roles" element={<Roles />} />
        </Route>
      </Route>

      {/* Ruta para 403 */}
      <Route path="/no-autorizado" element={<NoAutorizado />} />
    </Routes>
  );
}

export default AppRoutes;
