import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css'; 
import logo from '../assets/RUZ.png';

const Login = () => {
    const [correo, setEmail] = useState('');
    const [contrasena, setPassword] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    const handleLogin = async () => {
        setLoading(true);
        setMessage('');

        if (!correo || !contrasena) {
            setMessage("Por favor ingresa correo y contraseña.");
            setLoading(false);
            return;
        }

        if (!validateEmail(correo)) {
            setMessage("Por favor ingresa un correo válido.");
            setLoading(false);
            return;
        }

        try {
  const res = await axios.post('http://localhost:5000/api/auth/login', { correo, contrasena });
  localStorage.setItem("loginTime", new Date().toISOString());

  // Guarda el usuario completo
  localStorage.setItem('usuario', JSON.stringify(res.data.user));
  
  // Guarda rol y permisos por separado
  localStorage.setItem('rol', res.data.user.rol);
  localStorage.setItem('permisos', JSON.stringify(res.data.user.permisos || []));
  localStorage.setItem('token', res.data.token);

  setMessage("Inicio de sesión exitoso 🎉");
  setTimeout(() => {
    navigate('/dashboard');
  }, 1000);
} catch (error) {
  setMessage(error.response?.data?.message || "Error al iniciar sesión");
}

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-logo">
                    <img src={logo} alt="Impresos Ruz" />
                </div>
                <div className="auth-box">
                    <h2>Bienvenida Administradora</h2>
                    <p className="admin-instruction">Por favor ingrese sus credenciales para acceder al sistema.</p>

                    <input 
                        type="email" 
                        className="auth-input"
                        placeholder="Correo electrónico" 
                        value={correo} 
                        onChange={e => setEmail(e.target.value)} 
                    />

                    <div className="password-container">
                        <input 
                            type={mostrarContrasena ? "text" : "password"} 
                            className="auth-input"
                            placeholder="Contraseña" 
                            value={contrasena} 
                            onChange={e => setPassword(e.target.value)} 
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                        >
                            {mostrarContrasena ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

                    <button className="auth-button" onClick={handleLogin} disabled={loading}>
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                    <p className="auth-message">{message}</p>
                </div>
            </div>
            <svg className="wave" viewBox="0 0 1440 320">
                <path fill="red" fillOpacity="1" d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,138.7C672,149,768,203,864,213.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L0,320Z"></path>
            </svg>
        </div>
    );
};

export default Login;
