import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from '../src/componentes/welcome';
import Login from '../src/componentes/login';
import Register from '../src/componentes/registro';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
