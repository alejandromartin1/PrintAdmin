// src/pages/NoAutorizado.jsx
import React from "react";

const NoAutorizado = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl text-gray-700">Acceso denegado. No tienes permisos para ver esta página.</p>
    </div>
  </div>
);

export default NoAutorizado;
