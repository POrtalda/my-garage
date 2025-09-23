import { useContext } from 'react';
import './App.css';
import Vehicle from './components/Vehicle/Vehicle';
import ThemeContext from './context/ThemeContext';

function App({ vehicles }) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? 'app dark' : 'app light'}>
      {vehicles !== null ? (
        vehicles.map((v) => <Vehicle key={v.id} vehicle={v} />)
      ) : (
        <p>Loading vehicles...</p>
      )}
    </div>
  );
}

export default App;
