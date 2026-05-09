import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios';

const Dashboard = () => {
    const [clientes, setClientes] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Estado inicial con los 11 campos de la nueva DB
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        sigla: '',
        nit: '',
        direccion: '',
        representante_nombre: '',
        representante_correo: '',
        representante_telefono: '',
        contacto_nombre: '',
        contacto_cargo: '',
        contacto_correo: '',
        contacto_telefono: ''
    });

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await clienteAxios.post('/clientes', nuevoCliente);
            // Limpiar formulario
            setNuevoCliente({
                nombre: '', sigla: '', nit: '', direccion: '',
                representante_nombre: '', representante_correo: '', representante_telefono: '',
                contacto_nombre: '', contacto_cargo: '', contacto_correo: '', contacto_telefono: ''
            });
            setMostrarForm(false);
            obtenerClientes(); // Recargar la tabla
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al guardar el cliente');
        }
    };

    const handleEliminar = async (id_cliente) => {
        if (!window.confirm('¿Estás seguro de desactivar este cliente?')) return;
        try {
            await clienteAxios.put(`/clientes/eliminar/${id_cliente}`);
            setClientes(clientes.filter(c => c.id_cliente !== id_cliente));
        } catch (err) {
            alert('No se pudo eliminar el cliente');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
            
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
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
                <h2>Panel de Gestión de Clientes</h2>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button 
                    onClick={() => setMostrarForm(!mostrarForm)}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {mostrarForm ? 'Cerrar Formulario' : '+ Registrar Nueva Entidad'}
                </button>
            </div>

            {/* FORMULARIO DESPLEGABLE */}
            {mostrarForm && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Formulario de Registro</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        
                        {/* Datos de la Entidad */}
                        <div style={{ gridColumn: 'span 2' }}><h4>Datos de la Institución</h4></div>
                        <input type="text" placeholder="Nombre de la Entidad" value={nuevoCliente.nombre} onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})} required style={{ padding: '8px' }} />
                        <input type="text" placeholder="Sigla (Ej: ABC)" value={nuevoCliente.sigla} onChange={(e) => setNuevoCliente({...nuevoCliente, sigla: e.target.value})} style={{ padding: '8px' }} />
                        <input type="text" placeholder="NIT" value={nuevoCliente.nit} onChange={(e) => setNuevoCliente({...nuevoCliente, nit: e.target.value})} style={{ padding: '8px' }} />
                        <input type="text" placeholder="Dirección" value={nuevoCliente.direccion} onChange={(e) => setNuevoCliente({...nuevoCliente, direccion: e.target.value})} style={{ padding: '8px' }} />

                        {/* Representante Legal */}
                        <div style={{ gridColumn: 'span 2' }}><h4>Representante Legal</h4></div>
                        <input type="text" placeholder="Nombre Representante" value={nuevoCliente.representante_nombre} onChange={(e) => setNuevoCliente({...nuevoCliente, representante_nombre: e.target.value})} style={{ padding: '8px' }} />
                        <input type="email" placeholder="Email Representante" value={nuevoCliente.representante_correo} onChange={(e) => setNuevoCliente({...nuevoCliente, representante_correo: e.target.value})} style={{ padding: '8px' }} />
                        <input type="text" placeholder="Teléfono Representante" value={nuevoCliente.representante_telefono} onChange={(e) => setNuevoCliente({...nuevoCliente, representante_telefono: e.target.value})} style={{ padding: '8px' }} />

                        {/* Persona de Contacto */}
                        <div style={{ gridColumn: 'span 2' }}><h4>Persona de Contacto (Operativo)</h4></div>
                        <input type="text" placeholder="Nombre de Contacto" value={nuevoCliente.contacto_nombre} onChange={(e) => setNuevoCliente({...nuevoCliente, contacto_nombre: e.target.value})} style={{ padding: '8px' }} />
                        <input type="text" placeholder="Cargo" value={nuevoCliente.contacto_cargo} onChange={(e) => setNuevoCliente({...nuevoCliente, contacto_cargo: e.target.value})} style={{ padding: '8px' }} />
                        <input type="email" placeholder="Email Contacto" value={nuevoCliente.contacto_correo} onChange={(e) => setNuevoCliente({...nuevoCliente, contacto_correo: e.target.value})} style={{ padding: '8px' }} />
                        <input type="text" placeholder="Teléfono Contacto" value={nuevoCliente.contacto_telefono} onChange={(e) => setNuevoCliente({...nuevoCliente, contacto_telefono: e.target.value})} style={{ padding: '8px' }} />

                        <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Guardar Cliente en Base de Datos
                        </button>
                    </form>
                </div>
            )}

            {/* TABLA DE CLIENTES */}
            <h3 style={{ marginTop: '30px' }}>Listado de Clientes Activos</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Entidad</th>
                        <th style={{ padding: '12px' }}>NIT</th>
                        <th style={{ padding: '12px' }}>Representante</th>
                        <th style={{ padding: '12px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((c) => (
                        <tr key={c.id_cliente} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px' }}>{c.id_cliente}</td>
                            <td style={{ padding: '12px' }}><strong>{c.nombre}</strong> ({c.sigla})</td>
                            <td style={{ padding: '12px' }}>{c.nit}</td>
                            <td style={{ padding: '12px' }}>{c.representante_nombre}</td>
                            <td style={{ padding: '12px' }}>
                                <button 
                                    onClick={() => handleEliminar(c.id_cliente)}
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

export default Dashboard;