import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios';

const Dashboard = () => {
    const [clientes, setClientes] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({ nombre_entidad: '', nit: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 1. Cargar clientes al iniciar
    const obtenerClientes = async () => {
        try {
            const res = await clienteAxios.get('/clientes');
            setClientes(res.data);
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
    };

    useEffect(() => {
        obtenerClientes();
    }, []);

    // 2. Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token'); // Borramos el pase de entrada
        navigate('/login');
    };

    // 3. Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await clienteAxios.post('/clientes', nuevoCliente);
            setNuevoCliente({ nombre_entidad: '', nit: '' }); // Limpiar campos
            setMostrarForm(false); // Ocultar formulario
            obtenerClientes(); // Recargar la lista automáticamente
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al guardar el cliente');
        }
    };
    // 4. Función para eliminación lógica
    const handleEliminar = async (id) => {
        // Preguntamos por seguridad (Punto 2 - Facilidad de uso)
        if (!window.confirm('¿Estás seguro de desactivar este cliente?')) return;

        try {
            await clienteAxios.put(`/clientes/eliminar/${id}`);

            // Actualizamos el estado local para quitarlo de la lista sin llamar a la DB
            setClientes(clientes.filter(cliente => cliente.id !== id));

            alert('Cliente desactivado correctamente');
        } catch (err) {
            console.error("Error al eliminar:", err);
            alert('No se pudo eliminar el cliente');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Panel de Control - Seguros</h1>
                <button
                    onClick={handleLogout}
                    style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Cerrar Sesión
                </button>
            </div>
            <hr />

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setMostrarForm(!mostrarForm)}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {mostrarForm ? 'Cancelar' : '+ Agregar Nuevo Cliente'}
                </button>
            </div>

            {/* Formulario Desplegable */}
            {mostrarForm && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                    <h3>Registrar Nueva Entidad</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nombre de la Institución (Ej: ABC)"
                            value={nuevoCliente.nombre_entidad}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre_entidad: e.target.value })}
                            style={{ padding: '8px', marginRight: '10px', width: '250px' }}
                            required
                        />
                        <input
                            type="text"
                            placeholder="NIT"
                            value={nuevoCliente.nit}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nit: e.target.value })}
                            style={{ padding: '8px', marginRight: '10px', width: '150px' }}
                            required
                        />
                        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                            Guardar Cliente
                        </button>
                    </form>
                </div>
            )}

            <h3>Lista de Clientes (Empresas Asesoradas)</h3>
            <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Nombre de la Entidad</th>
                        <th style={{ padding: '10px' }}>NIT</th>
                        <th style={{ padding: '10px' }}>Acciones</th> {/* Nueva Columna */}
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((c) => (
                        <tr key={c.id}>
                            <td style={{ padding: '10px' }}>{c.id}</td>
                            <td style={{ padding: '10px' }}>{c.nombre_entidad}</td>
                            <td style={{ padding: '10px' }}>{c.nit}</td>
                            <td style={{ padding: '10px' }}>
                                <button
                                    onClick={() => handleEliminar(c.id)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#ff4d4d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '3px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;