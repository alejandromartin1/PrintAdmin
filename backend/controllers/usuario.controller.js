exports.obtenerPerfil = (req, res) => {
  res.json({
    mensaje: "Perfil accedido correctamente",
    usuario: req.user, // esto viene del token verificado por el middleware
  });
};
