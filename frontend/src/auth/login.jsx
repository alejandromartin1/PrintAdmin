import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css'; 
import logo from '../assets/RUZ.png'; // Asegúrate de colocar tu logo en la carpeta correcta

const Login = () => {
    const [correo, setEmail] = useState('');
    const [contrasena, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Función para validar el formato del correo electrónico
    const validateEmail = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    const handleLogin = async () => {
        setLoading(true);
        setMessage('');

        // Validación básica de email y contraseña
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
                    <img src={logo} alt="impresosRuz" />
                </div>
                <div className="auth-box">
                    <h2>Iniciar Sesión</h2>
                    <input 
                        type="email" 
                        className="auth-input"
                        placeholder="Email" 
                        value={correo} 
                        onChange={e => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        className="auth-input"
                        placeholder="Password" 
                        value={contrasena} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                    <button className="auth-button" onClick={handleLogin} disabled={loading}>
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                    <p className="auth-message">{message}</p>
                    <p className='message2'>
                        ¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate</Link>
                    </p>
                </div>
            </div>
            <svg className="wave" viewBox="0 0 1440 320">
                <path fill="red" fillOpacity="1" d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,138.7C672,149,768,203,864,213.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L0,320Z"></path>
            </svg>
        </div>
    );
};

export default Login;
