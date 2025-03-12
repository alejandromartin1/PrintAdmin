import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/auth.css'; 
import logo from '../assets/RUZ.png';; 

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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
            <div className="auth-content">
                <div className="auth-logo">
                    <img src={logo} alt="impresosRuz" />
                </div>
                <div className="auth-box">
                    <h2>Registro</h2>
                    <input 
                        type="name" 
                        className="auth-input"
                        placeholder="Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                    />
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
                    <p className='message2'>¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link></p>
                </div>
            </div>
            <svg className="wave" viewBox="0 0 1440 320">
        <path fill="red" fillOpacity="1" d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,138.7C672,149,768,203,864,213.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L0,320Z"></path>
    </svg>
        </div>
    );
};

export default Register;
