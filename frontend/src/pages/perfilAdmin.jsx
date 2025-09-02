import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../styles/perfilAdmin.css';
import { useNavigate } from 'react-router-dom';

const PerfilAdmin = () => {
  const [perfil, setPerfil] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const inputFileRef = useRef(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const res = await axios.get('http://localhost:5000/api/auth/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPerfil(res.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    obtenerPerfil();
  }, [navigate]);

  const handleCerrarSesion = () => {
    // 👉 Ya no eliminamos el token
    navigate('/dashboard');
  };


  const handleClickFoto = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/auth/perfil/foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('Foto subida con éxito!');
      // Aquí se actualiza la propiedad foto_perfil que usas para mostrar la imagen
      setPerfil(prev => ({ ...prev, foto_perfil: res.data.foto }));
    } catch (error) {
      setMensaje('Error al subir la foto');
    }
  };

  if (!perfil) return <div className="perfil-container">Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <h2 className="perfil-title">Mi Perfil</h2>

      <div className="perfil-card">
        {/* Contenedor foto con icono cámara superpuesto */}
        <div className="foto-perfil-contenedor" onClick={handleClickFoto} title="Haz clic para cambiar la foto">
          <img
            src={perfil.foto_perfil ? `http://localhost:5000/uploads/${perfil.foto_perfil}` : '/default-profile.png'}
            alt="Foto de perfil"
            className="perfil-img"
          />
          <div className="icono-camara">📷</div>
        </div>

        {/* Info de perfil al lado o debajo */}
        <div className="perfil-datos">
          <p><strong>Nombre completo:</strong> {perfil.nombreapellido}</p>
          <p><strong>Correo:</strong> {perfil.correo}</p>
          <p><strong>Rol:</strong> {perfil.rol}</p>
        </div>
      </div>

      {/* Input oculto para subir foto */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        className="input-file-oculto"
        ref={inputFileRef}
        onChange={handleFotoChange}
      />

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <button className="btn-cerrar-sesion" onClick={handleCerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default PerfilAdmin;
