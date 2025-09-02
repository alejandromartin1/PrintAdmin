import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faSignOutAlt,
  faCog,
  faMagnifyingGlass,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState({ nombre: 'Usuario', apellido: '', correo: '' });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [brillo, setBrillo] = useState(100);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const settingsRef = useRef(null);

  const navigate = useNavigate();

  // 🔎 Búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResultados([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/busqueda?q=${encodeURIComponent(query)}`);
      setResultados(res.data);
      setError('');
      setShowSuggestions(true);

      if (res.data.length === 1) {
        navigate(res.data[0].ruta);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError('Ocurrió un error al buscar.');
      setResultados([]);
      setShowSuggestions(false);
    }
  };

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('permisos');
    localStorage.removeItem('gmail_access_token');
    localStorage.removeItem('gmail_refresh_token');
    sessionStorage.removeItem("isLoggedIn");

    setUser({ nombre: 'Usuario', apellido: '', correo: '' });
    setError('');
    setResultados([]);
    setShowSuggestions(false);
    setShowProfile(false);
    setShowSettings(false);

    navigate('/login');
  };

  const handlePerfilClick = () => {
    navigate("/perfil-admin");
  };

  // 🌞 Ajustar brillo
  const handleBrilloChange = (e) => {
    setBrillo(e.target.value);
  };

  // 🕒 Actualizar fecha y hora
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 👆 Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !searchRef.current?.contains(e.target) &&
        !profileRef.current?.contains(e.target) &&
        !settingsRef.current?.contains(e.target)
      ) {
        setShowSuggestions(false);
        setShowProfile(false);
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 👤 Obtener usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
          setError('');
        } else {
          setUser({ nombre: 'Usuario', apellido: '', correo: '' });
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        setUser({ nombre: 'Usuario', apellido: '', correo: '' });
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      {/* 🌗 Overlay de brillo */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          backgroundColor: `rgba(0, 0, 0, ${(100 - brillo) / 100})`,
          zIndex: 9999,
          transition: 'background-color 0.3s',
        }}
      ></div>

      <nav className="navbar">
        {/* 🔍 Buscador */}
        <form className="search-bar" onSubmit={handleSearch} ref={searchRef}>
          <input
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowSuggestions(true)}
          />
          <button type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>

          {showSuggestions && resultados.length > 0 && (
            <div className="search-suggestions">
              <ul className="list-unstyled mb-0">
                {resultados.map((r, i) => (
                  <li key={i}>
                    <Link to={r.ruta} className="resultado-link">
                      <strong>[{r.origen.toUpperCase()}]</strong> {r.titulo} - {r.detalle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <div className="alert-error">{error}</div>}
        </form>

        {/* 👤 Usuario y ajustes */}
        <div className="user-section">
          {/* Perfil */}
          <div className="dropdown-wrapper" ref={profileRef}>
            <FontAwesomeIcon
              icon={faUserCircle}
              className="icon-action"
              title="Perfil"
              onClick={() => {
                setShowProfile((prev) => !prev);
                setShowSettings(false);
              }}
            />
            {showProfile && (
              <div className="dropdown-panel">
                <div className="dropdown-title">Perfil</div>
                <p><strong>{user.nombre} {user.apellido}</strong></p>
                {user.correo && <p>{user.correo}</p>}
                <hr />
                <div className="dropdown-link" onClick={handlePerfilClick}>Perfil </div>
                <Link to="/login-correo" className="dropdown-link">
                  <FontAwesomeIcon icon={faEnvelope} /> Iniciar sesión con Google
                </Link>
                <div className="dropdown-link cerrar" onClick={handleLogout}>
                  Cerrar sesión <FontAwesomeIcon icon={faSignOutAlt} style={{ marginLeft: "8px" }} />
                </div>
              </div>
            )}
          </div>

          {/* Configuración */}
          <div className="dropdown-wrapper" ref={settingsRef}>
            <FontAwesomeIcon
              icon={faCog}
              className="icon-action"
              title="Configuraciones"
              onClick={() => {
                setShowSettings((prev) => !prev);
                setShowProfile(false);
              }}
            />
            {showSettings && (
              <div className="dropdown-panel">
                <div className="dropdown-title">Configuraciones</div>
                <div className="dropdown-link">Cuenta</div>
                <div className="dropdown-link">
                  {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
                </div>
                <div className="dropdown-link">
                  Brillo:
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={brillo}
                    onChange={handleBrilloChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Logout directo */}
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="icon-action"
            title="Cerrar sesión"
            onClick={handleLogout}
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
