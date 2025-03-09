import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from '../src/componentes/welcome';
import Login from '../src/componentes/login';
import Register from '../src/componentes/registro';
import Dashboard from '../src/componentes/dashboard';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
