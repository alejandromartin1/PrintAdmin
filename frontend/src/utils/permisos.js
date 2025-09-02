export const tienePermiso = (permiso) => {
  const permisos = JSON.parse(localStorage.getItem('permisos') || '[]');
  return permisos.includes(permiso);
};
