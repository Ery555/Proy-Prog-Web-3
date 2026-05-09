import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios';

const ContratosPage = () => {
    const [contratos, setContratos] = useState([]);
    const [clientes, setClientes] = useState([]); // Para el menú desplegable
    const [mostrarForm, setMostrarForm] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [nuevoContrato, setNuevoContrato] = useState({
        id_cliente: '',
        codigo: '',
        objeto: '',
        fecha_inicio: '',
        fecha_fin: '',
        importe: ''
    });

    const cargarDatos = async () => {
        try {
            // Traemos ambos datos al mismo tiempo
            const [resContratos, resClientes] = await Promise.all([
                clienteAxios.get('/contratos'),
                clienteAxios.get('/clientes')
            ]);
            setContratos(resContratos.data);
            setClientes(resClientes.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await clienteAxios.post('/contratos', nuevoContrato);
            setNuevoContrato({ id_cliente: '', codigo: '', fecha_inicio: '', fecha_fin: '', importe: '' });
            setMostrarForm(false);
            cargarDatos(); // Recargamos la tabla
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al guardar el contrato');
        }
    };

    const handleEliminar = async (id_contrato) => {
        if (!window.confirm('¿Estás seguro de anular/desactivar este contrato?')) return;
        try {
            await clienteAxios.put(`/contratos/eliminar/${id_contrato}`);
            setContratos(contratos.filter(c => c.id_contrato !== id_contrato));
        } catch (err) {
            alert('No se pudo eliminar el contrato');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>

            {/* Menú de Navegación */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    🏢 Clientes
                </button>
                <button onClick={() => navigate('/contratos')} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    📄 Contratos
                </button>
                <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: 'auto' }}>
                    Salir
                </button>
            </div>

            <h2>Gestión de Contratos de Asesoría</h2>

            <button onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
                {mostrarForm ? 'Cerrar Formulario' : '+ Registrar Nuevo Contrato'}
            </button>

            {/* Formulario de Contratos */}
            {mostrarForm && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>

                        {/* SELECT DINÁMICO DE CLIENTES */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <label><strong>Cliente (Institución):</strong></label>
                            <select
                                value={nuevoContrato.id_cliente}
                                onChange={(e) => setNuevoContrato({ ...nuevoContrato, id_cliente: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            >
                                <option value="">-- Seleccione una Institución --</option>
                                {clientes.map(c => (
                                    <option key={c.id_cliente} value={c.id_cliente}>
                                        {c.nombre} ({c.sigla})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Código del Contrato:</label>
                            <input type="text" value={nuevoContrato.codigo} onChange={(e) => setNuevoContrato({ ...nuevoContrato, codigo: e.target.value })} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Objeto / Título del Contrato:</label>
                            <textarea
                                value={nuevoContrato.objeto}
                                onChange={(e) => setNuevoContrato({ ...nuevoContrato, objeto: e.target.value })}
                                placeholder="Ej: Asesoría técnica para la renovación de pólizas de aeronavegación..."
                                required
                                style={{ width: '100%', padding: '10px', marginTop: '5px', height: '60px' }}
                            />
                        </div>
                        <div>
                            <label>Importe (Bs.):</label>
                            <input type="number" step="0.01" value={nuevoContrato.importe} onChange={(e) => setNuevoContrato({ ...nuevoContrato, importe: e.target.value })} required style={{ width: '100%', padding: '8px' }} />
                        </div>

                        <div>
                            <label>Fecha de Inicio:</label>
                            <input type="date" value={nuevoContrato.fecha_inicio} onChange={(e) => setNuevoContrato({ ...nuevoContrato, fecha_inicio: e.target.value })} required style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div>
                            <label>Fecha de Fin (Vencimiento):</label>
                            <input type="date" value={nuevoContrato.fecha_fin} onChange={(e) => setNuevoContrato({ ...nuevoContrato, fecha_fin: e.target.value })} required style={{ width: '100%', padding: '8px' }} />
                        </div>

                        <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Guardar Contrato
                        </button>
                    </form>
                </div>
            )}

            {/* Tabla de Contratos */}
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                        <th style={{ padding: '12px' }}>Código</th>
                        <th style={{ padding: '12px' }}>Institución</th>
                        <th style={{ padding: '12px' }}>Objeto</th>
                        <th style={{ padding: '12px' }}>Inicio</th>
                        <th style={{ padding: '12px' }}>Vencimiento</th>
                        <th style={{ padding: '12px' }}>Importe</th>
                        <th style={{ padding: '12px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {contratos.map((c) => (
                        <tr key={c.id_contrato} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.codigo}</td>
                            <td style={{ padding: '12px' }}>{c.cliente_nombre}</td>
                            <td style={{ padding: '12px', fontSize: '0.9em' }}>{c.objeto}</td>
                            {/* Cortamos la fecha para que se vea bonita (YYYY-MM-DD) */}
                            <td style={{ padding: '12px' }}>{c.fecha_inicio.substring(0, 10)}</td>
                            <td style={{ padding: '12px', color: 'red', fontWeight: 'bold' }}>{c.fecha_fin.substring(0, 10)}</td>
                            <td style={{ padding: '12px' }}>Bs. {c.importe}</td>
                            <td style={{ padding: '12px' }}>
                                <button
                                    onClick={() => handleEliminar(c.id_contrato)}
                                    style={{ padding: '5px 10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Anular
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContratosPage;