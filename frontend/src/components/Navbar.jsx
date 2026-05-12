import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Para saber en qué ruta estamos y pintar el botón activo

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Función auxiliar para los estilos de los botones
    const getButtonStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            padding: '10px 15px',
            backgroundColor: isActive ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: isActive ? 'bold' : 'normal',
            transition: 'background-color 0.3s'
        };
    };

    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px', alignItems: 'center' }}>
            <button onClick={() => navigate('/dashboard')} style={getButtonStyle('/dashboard')}>
                🏢 Clientes
            </button>
            <button onClick={() => navigate('/contratos')} style={getButtonStyle('/contratos')}>
                📄 Contratos
            </button>
            <button onClick={() => navigate('/aseguradoras')} style={getButtonStyle('/aseguradoras')}>
                🛡️ Aseguradoras
            </button>
            <button onClick={() => navigate('/polizas')} style={getButtonStyle('/polizas')}>
                📋 Pólizas
            </button>
            
            <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: 'auto', fontWeight: 'bold' }}>
                Salir
            </button>
        </div>
    );
};

export default Navbar;