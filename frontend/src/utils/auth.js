// src/utils/auth.js

export const obtenerUsuario = () => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
};

export const obtenerToken = () => {
  return localStorage.getItem("token");
};

export const estaAutenticado = () => {
  return obtenerUsuario() && obtenerToken();
};

export const cerrarSesion = () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  window.location.href = "/login";
};
