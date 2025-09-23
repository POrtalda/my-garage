import { NavLink } from 'react-router';
import './Menu.css';
import DarkLight from '../DarkLight/DarkLight';
import { useContext, useState } from 'react';
import ThemeContext from '../../context/ThemeContext';
import NewVehicle from '../NewVehicle/NewVehicle';

export default function Menu({ title, onAddVehicle }) {
    const { isDarkMode } = useContext(ThemeContext);
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <ul className={isDarkMode ? 'menu menu_dark' : 'menu menulight'}>
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/expired'>Scaduti</NavLink></li>
                <li><NavLink to='/expiring'>In Scadenza</NavLink></li>
            </ul>

            <h1>{title}</h1>

            <div className="menu-actions">
                <DarkLight />
                <button onClick={() => setShowModal(true)}>Nuovo ➕</button>
            </div>

            {showModal && (
                <NewVehicle
                  onAdd={onAddVehicle}
                  onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
