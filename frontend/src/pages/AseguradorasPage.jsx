import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios';

const AseguradorasPage = () => {
    const [aseguradoras, setAseguradoras] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [nuevaAseguradora, setNuevaAseguradora] = useState({
        nombre: '',
        nit: '',
        direccion: '',
        telefono: ''
    });

    const obtenerAseguradoras = async () => {
        try {
            const res = await clienteAxios.get('/aseguradoras');
            setAseguradoras(res.data);
        } catch (error) {
            console.error("Error al cargar aseguradoras:", error);
        }
    };

    useEffect(() => {
        obtenerAseguradoras();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await clienteAxios.post('/aseguradoras', nuevaAseguradora);
            setNuevaAseguradora({ nombre: '', nit: '', direccion: '', telefono: '' });
            setMostrarForm(false);
            obtenerAseguradoras();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al guardar la aseguradora');
        }
    };

    const handleEliminar = async (id_aseguradora) => {
        if (!window.confirm('¿Estás seguro de desactivar esta aseguradora?')) return;
        try {
            await clienteAxios.put(`/aseguradoras/eliminar/${id_aseguradora}`);
            setAseguradoras(aseguradoras.filter(a => a.id_aseguradora !== id_aseguradora));
        } catch (err) {
            alert('No se pudo eliminar la aseguradora');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
            
            {/* NUEVA BARRA DE NAVEGACIÓN ACTUALIZADA */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    🏢 Clientes
                </button>
                <button onClick={() => navigate('/contratos')} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    📄 Contratos
                </button>
                <button onClick={() => navigate('/aseguradoras')} style={{ padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🛡️ Aseguradoras
                </button>
                <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: 'auto' }}>
                    Salir
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '10px 20px', borderRadius: '8px' }}>
                <h2>Gestión de Compañías Aseguradoras</h2>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button 
                    onClick={() => setMostrarForm(!mostrarForm)}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {mostrarForm ? 'Cerrar Formulario' : '+ Registrar Aseguradora'}
                </button>
            </div>

            {mostrarForm && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        
                        <div>
                            <label>Nombre de la Compañía:</label>
                            <input type="text" placeholder="Ej: Nacional Seguros" value={nuevaAseguradora.nombre} onChange={(e) => setNuevaAseguradora({...nuevaAseguradora, nombre: e.target.value})} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </div>
                        <div>
                            <label>NIT:</label>
                            <input type="text" value={nuevaAseguradora.nit} onChange={(e) => setNuevaAseguradora({...nuevaAseguradora, nit: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </div>
                        <div>
                            <label>Dirección Central:</label>
                            <input type="text" value={nuevaAseguradora.direccion} onChange={(e) => setNuevaAseguradora({...nuevaAseguradora, direccion: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </div>
                        <div>
                            <label>Teléfono de Contacto:</label>
                            <input type="text" value={nuevaAseguradora.telefono} onChange={(e) => setNuevaAseguradora({...nuevaAseguradora, telefono: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                        </div>

                        <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Guardar Aseguradora
                        </button>
                    </form>
                </div>
            )}

            <h3 style={{ marginTop: '30px' }}>Listado de Compañías Registradas</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Compañía</th>
                        <th style={{ padding: '12px' }}>NIT</th>
                        <th style={{ padding: '12px' }}>Teléfono</th>
                        <th style={{ padding: '12px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {aseguradoras.map((a) => (
                        <tr key={a.id_aseguradora} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>{a.id_aseguradora}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{a.nombre}</td>
                            <td style={{ padding: '12px' }}>{a.nit}</td>
                            <td style={{ padding: '12px' }}>{a.telefono}</td>
                            <td style={{ padding: '12px' }}>
                                <button 
                                    onClick={() => handleEliminar(a.id_aseguradora)}
                                    style={{ padding: '5px 10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
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

export default AseguradorasPage;