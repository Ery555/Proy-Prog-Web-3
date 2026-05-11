import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios';

const PolizasPage = () => {
    const [polizas, setPolizas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [aseguradoras, setAseguradoras] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [nuevaPoliza, setNuevaPoliza] = useState({
        id_cliente: '',
        id_aseguradora: '',
        numero_codigo_poliza: '',
        tipo_poliza: '',
        direccion_poliza: '',
        inicio_vigencia: '',
        fin_vigencia: ''
    });

    const cargarTodo = async () => {
        try {
            const [resPol, resCli, resAse] = await Promise.all([
                clienteAxios.get('/polizas'),
                clienteAxios.get('/clientes'),
                clienteAxios.get('/aseguradoras')
            ]);
            setPolizas(resPol.data);
            setClientes(resCli.data);
            setAseguradoras(resAse.data);
        } catch (error) {
            console.error("Error al sincronizar datos:", error);
        }
    };

    useEffect(() => {
        cargarTodo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await clienteAxios.post('/polizas', nuevaPoliza);
            setNuevaPoliza({
                id_cliente: '', id_aseguradora: '', numero_codigo_poliza: '',
                tipo_poliza: '', direccion_poliza: '', inicio_vigencia: '', fin_vigencia: ''
            });
            setMostrarForm(false);
            cargarTodo();
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Error al registrar póliza');
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Desea anular esta póliza?')) return;
        try {
            await clienteAxios.put(`/polizas/eliminar/${id}`);
            cargarTodo();
        } catch (err) {
            alert('Error al procesar la solicitud');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            {/* Barra de Navegación Unificada */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '10px', cursor: 'pointer' }}>🏢 Clientes</button>
                <button onClick={() => navigate('/contratos')} style={{ padding: '10px', cursor: 'pointer' }}>📄 Contratos</button>
                <button onClick={() => navigate('/aseguradoras')} style={{ padding: '10px', cursor: 'pointer' }}>🛡️ Aseguradoras</button>
                <button onClick={() => navigate('/polizas')} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}>📋 Pólizas</button>
                <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{ marginLeft: 'auto', backgroundColor: '#dc3545', color: 'white' }}>Salir</button>
            </div>

            <h2>Gestión de Pólizas de Seguro</h2>
            <button onClick={() => setMostrarForm(!mostrarForm)} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#28a745', color: 'white' }}>
                {mostrarForm ? 'Cerrar' : '+ Nueva Póliza'}
            </button>

            {mostrarForm && (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Cliente:</label>
                        <select value={nuevaPoliza.id_cliente} onChange={(e) => setNuevaPoliza({...nuevaPoliza, id_cliente: e.target.value})} required style={{ width: '100%', padding: '8px' }}>
                            <option value="">-- Seleccionar Institución --</option>
                            {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
                        </select>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Aseguradora:</label>
                        <select value={nuevaPoliza.id_aseguradora} onChange={(e) => setNuevaPoliza({...nuevaPoliza, id_aseguradora: e.target.value})} required style={{ width: '100%', padding: '8px' }}>
                            <option value="">-- Seleccionar Compañía --</option>
                            {aseguradoras.map(a => <option key={a.id_aseguradora} value={a.id_aseguradora}>{a.nombre}</option>)}
                        </select>
                    </div>
                    <input type="text" placeholder="Número de Póliza" value={nuevaPoliza.numero_codigo_poliza} onChange={(e) => setNuevaPoliza({...nuevaPoliza, numero_codigo_poliza: e.target.value})} required />
                    <input type="text" placeholder="Tipo (Ej: Automotores)" value={nuevaPoliza.tipo_poliza} onChange={(e) => setNuevaPoliza({...nuevaPoliza, tipo_poliza: e.target.value})} required />
                    <input type="text" placeholder="Dirección de Riesgo" value={nuevaPoliza.direccion_poliza} onChange={(e) => setNuevaPoliza({...nuevaPoliza, direccion_poliza: e.target.value})} style={{ gridColumn: 'span 2' }} />
                    <div><label>Inicio Vigencia:</label><input type="date" value={nuevaPoliza.inicio_vigencia} onChange={(e) => setNuevaPoliza({...nuevaPoliza, inicio_vigencia: e.target.value})} required /></div>
                    <div><label>Fin Vigencia:</label><input type="date" value={nuevaPoliza.fin_vigencia} onChange={(e) => setNuevaPoliza({...nuevaPoliza, fin_vigencia: e.target.value})} required /></div>
                    <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#007bff', color: 'white' }}>Guardar Póliza</button>
                </form>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                        <th style={{ padding: '10px' }}>Código</th>
                        <th style={{ padding: '10px' }}>Cliente</th>
                        <th style={{ padding: '10px' }}>Aseguradora</th>
                        <th style={{ padding: '10px' }}>Vencimiento</th>
                        <th style={{ padding: '10px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {polizas.map(p => (
                        <tr key={p.id_poliza} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{p.numero_codigo_poliza}</td>
                            <td style={{ padding: '10px' }}>{p.cliente_nombre}</td>
                            <td style={{ padding: '10px' }}>{p.aseguradora_nombre}</td>
                            <td style={{ padding: '10px', color: 'red' }}>{p.fin_vigencia.substring(0, 10)}</td>
                            <td style={{ padding: '10px' }}>
                                <button onClick={() => handleEliminar(p.id_poliza)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Anular</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PolizasPage;