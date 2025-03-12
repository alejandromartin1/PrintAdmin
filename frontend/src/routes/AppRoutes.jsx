import {Routes, Route } from 'react-router-dom';
import Welcome from '../auth/welcome';
import Login from '../auth/login';
import Register from '../auth/registro';
import Dashboard from '../pages/dashboard';


function AppRoutes () {
    return (
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
    );
}

export default AppRoutes ;