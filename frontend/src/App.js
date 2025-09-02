// src/App.js
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '../src/routes/AppRoutes.jsx';


function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
