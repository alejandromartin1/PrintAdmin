import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css'; 
import logo from '../assets/RUZ.png'; 

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('usuario'); // Nuevo estado para el rol
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setLoading(true);
        setMensaje('');
    
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { 
                nombre, 
                apellido, 
                correo,
                contrasena,
                rol // 👈 Se envía también el rol
            });
    
            setMensaje(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
            
        } catch (error) {
            console.error('Error completo:', error);
            const serverMessage = error.response?.data?.error || 
                                  error.response?.data?.message || 
                                  "Error al conectar con el servidor";
            setMensaje(`Error: ${serverMessage}`);
        } finally {
            setLoading(false);
        }
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
                        type="text" 
                        className="auth-input"
                        placeholder="Nombre" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        className="auth-input"
                        placeholder="Apellido" 
                        value={apellido} 
                        onChange={(e) => setApellido(e.target.value)} 
                    />
                    <input 
                        type="email" 
                        className="auth-input"
                        placeholder="Correo electrónico" 
                        value={correo} 
                        onChange={(e) => setCorreo(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        className="auth-input"
                        placeholder="Contraseña" 
                        value={contrasena} 
                        onChange={(e) => setContrasena(e.target.value)} 
                    />
                    <select 
                        className="auth-input"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                    >
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                        <option value="empleado">Empleado</option>
                    </select>
                    <button 
                        className="auth-button" 
                        onClick={handleRegister} 
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Registrarse"}
                    </button>
                    <p className="auth-message">{mensaje}</p>
                    <p className='message2'>
                        ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
                    </p>
                </div>
            </div>
            <svg className="wave" viewBox="0 0 1440 320">
                <path fill="red" fillOpacity="1" d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,138.7C672,149,768,203,864,213.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L0,320Z"></path>
            </svg>
        </div>
    );
};

export default Register;
