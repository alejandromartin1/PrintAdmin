import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/auth.css'; 

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Estado para botón de carga

    const handleRegister = async () => {
        setLoading(true);
        setMessage('');
        try {
          await axios.post('http://localhost:5000/register', { email, password });
            setMessage("Registro exitoso 🎉 Ahora puedes iniciar sesión.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error al registrarse");
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Registro</h2>
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
                <button className="auth-button" onClick={handleRegister} disabled={loading}>
                    {loading ? "Cargando..." : "Registrarse"}
                </button>
                <p className="auth-message">{message}</p>
                <p>¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link></p>
            </div>
        </div>
    );
};

export default Register;
