import { useContext } from 'react';
import './DarkLight.css';
import ThemeContext from '../../context/ThemeContext';

export default function DarkLight() {

    // creo una variabile per il tema
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext, );

    return(
        <>
            <button className='btn-Dark-Light' onClick={()=> {
                setIsDarkMode(!isDarkMode);
            }}>
                {isDarkMode ? 'Light 🔆' : 'Dark 🌙'}
            </button>
        </>
    );
}