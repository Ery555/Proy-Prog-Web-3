import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el navegador
import clienteAxios from '../api/axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 2. Inicializamos el navegador

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const respuesta = await clienteAxios.post('/auth/login', { email, password });
            
            // Guardamos el token
            localStorage.setItem('token', respuesta.data.token);
            
            // 3. Redirigimos al Dashboard (Ya no usamos alert)
            navigate('/dashboard');
            
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al conectar con el servidor');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '20px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Ingresar al Sistema
                </button>
            </form>
        </div>
    );
};

export default LoginPage;