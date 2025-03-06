import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/auth.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Estado para botón de carga

    const handleLogin = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setMessage("Inicio de sesión exitoso 🎉");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error al iniciar sesión");
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Iniciar Sesión</h2>
                <input 
                    type="email" 
                    className="auth-input"
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    className="auth-input"
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
                <button className="auth-button" onClick={handleLogin} disabled={loading}>
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                </button>
                <p className="auth-message">{message}</p>
                <p>¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate</Link></p>
            </div>
        </div>
    );
};

export default Login;
