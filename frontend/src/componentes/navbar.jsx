import React from 'react';
import '../styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ username }) => {
    return (
        <nav className="navbar">
            <div className="search-bar">
                <input type="text" placeholder="Buscar..." />
               <i><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
            </div>
        </nav>
    );
};

export default Navbar;
