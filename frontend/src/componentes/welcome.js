import { Link } from 'react-router-dom';
import '../styles/Welcome.css';
import background from '../assets/cmyk1.JPG'; 

const Welcome = () => {
    return (
        <div className="welcome-container" style={{ backgroundImage: `url(${background})` }}>
            <h1 className="welcome-title">¡Bienvenido a PrintAdmin!</h1>
            <p className='subtitle'>Administra tu Imprenta de forma eficiente</p>
            <div className="welcome-buttons">
                <Link to="/login">
                    <button className="welcome-button btn-primary">Iniciar Sesión</button>
                </Link> 
                <Link to="/register">
                    <button className="welcome-button btn-secondary">Registrarse</button>
                </Link>
            </div>
        </div>
    );
};

export default Welcome;
