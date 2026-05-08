import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // El backend ahora busca en la columna 'email'
            const respuesta = await clienteAxios.post('/auth/login', { email, password });
            
            localStorage.setItem('token', respuesta.data.token);
            
            // Redirigir al Dashboard
            navigate('/dashboard');
            
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al conectar con el servidor');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center' }}>Sistema de Seguros - Login</h2>
            {error && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email Institucional:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Entrar al Sistema
                </button>
            </form>
        </div>
    );
};

export default LoginPage;