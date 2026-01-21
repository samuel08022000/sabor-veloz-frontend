import React, { useState, useEffect } from 'react';
import { Header, AdminNav } from './Layouts';
import api from '../api/axios';

// ==========================================
// 1. SUB-VISTA: GESTIÓN DE PRODUCTOS (CRUD)
// ==========================================
const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formData, setFormData] = useState({
        idProducto: 0,
        nombreProducto: '',
        precio: '',
        categoria: 'Platos'
    });

    useEffect(() => { fetchProductos(); }, []);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Productos/lista');
            setProductos(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                nombreProducto: formData.nombreProducto,
                precio: parseFloat(formData.precio),
                categoria: formData.categoria,
                disponible: true
            };
            if (modoEdicion) await api.put(`/Productos/editar/${formData.idProducto}`, payload);
            else await api.post('/Productos/crear', payload);

            setMostrarForm(false);
            fetchProductos();
            limpiarForm();
            alert("Guardado correctamente");
        } catch (error) {
            alert("Error al guardar");
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Eliminar?")) return;
        try {
            await api.delete(`/Productos/eliminar/${id}`);
            fetchProductos();
        } catch (error) { alert("Error al eliminar"); }
    };

    const iniciarEdicion = (producto) => {
        setFormData({ ...producto });
        setModoEdicion(true);
        setMostrarForm(true);
    };

    const iniciarCreacion = () => {
        limpiarForm();
        setModoEdicion(false);
        setMostrarForm(true);
    };

    const limpiarForm = () => setFormData({ idProducto: 0, nombreProducto: '', precio: '', categoria: 'Platos' });

    return (
        <div id="gestion-productos-view" className="sub-view animated-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'var(--primary)', fontSize: '2rem', margin: 0 }}>GESTIÓN DE INVENTARIO</h2>
                <button className="btn-primary" style={{ width: 'auto', padding: '10px 25px' }} onClick={iniciarCreacion}>
                    <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i> Nuevo
                </button>
            </div>

            {mostrarForm && (
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius)', marginBottom: '20px', border: '2px solid var(--primary)', boxShadow: 'var(--shadow-md)' }}>
                    <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>{modoEdicion ? '✏️ Editar' : '✨ Nuevo'}</h3>
                    <form onSubmit={handleGuardar} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                        <div className="caja-input-group" style={{ marginBottom: 0 }}><label>Nombre</label><input required type="text" value={formData.nombreProducto} onChange={e => setFormData({ ...formData, nombreProducto: e.target.value })} /></div>
                        <div className="caja-input-group" style={{ marginBottom: 0 }}><label>Precio</label><input required type="number" step="0.50" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} /></div>
                        <div className="caja-input-group" style={{ marginBottom: 0 }}>
                            <label>Categoría</label>
                            <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #e2e8f0' }}>
                                <option value="Platos">Platos</option><option value="Bebidas">Bebidas</option><option value="Postres">Postres</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}><button type="submit" className="btn-primary" style={{ padding: '14px 20px' }}>Guardar</button><button type="button" onClick={() => setMostrarForm(false)} className="btn-secondary" style={{ padding: '14px 20px', background: '#ef4444', color: 'white' }}>Cancelar</button></div>
                    </form>
                </div>
            )}

            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
                <table className="productos-table">
                    <thead><tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {productos.map(p => (
                            <tr key={p.idProducto}>
                                <td>#{p.idProducto}</td><td><strong>{p.nombreProducto}</strong></td>
                                <td><span style={{ padding: '4px 8px', background: '#e5e7eb', borderRadius: '4px', fontSize: '0.85rem' }}>{p.categoria}</span></td>
                                <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{p.precio.toFixed(2)} Bs</td>
                                <td><span style={{ color: p.disponible ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{p.disponible ? 'Activo' : 'Inactivo'}</span></td>
                                {/* 🔥🔥🔥 AQUÍ ESTÁN LOS BOTONES NUEVOS 🔥🔥🔥 */}
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => iniciarEdicion(p)}
                                            style={{
                                                backgroundColor: '#3b82f6', // Azul
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleEliminar(p.idProducto)}
                                            style={{
                                                backgroundColor: '#ef4444', // Rojo
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ==========================================
// 2. SUB-VISTA: REPORTES FINANCIEROS (MODIFICADO Bs)
// ==========================================
const ReportesVentas = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/Dashboard/resumen');
                if (res.data.exito) setData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExportar = (tipo) => {
        const baseURL = "https://saborvelozweb-production.up.railway.app"; 
    window.open(`${baseURL}/api/Reportes/exportar/${tipo}`, '_blank');
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>;
    if (!data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error de datos.</div>;

    const { metricas, graficos, listaVentas } = data;

    return (
        <div id="reportes-view" className="sub-view animated-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', margin: 0 }}>DASHBOARD FINANCIERO</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" onClick={() => handleExportar('diario')} title="Descargar Diario">
                        <i className="fas fa-file-excel" style={{ marginRight: '8px', color: '#10b981' }}></i> Diario
                    </button>
                    <button className="btn-secondary" onClick={() => handleExportar('semanal')} title="Descargar Semanal">
                        <i className="fas fa-calendar-week" style={{ marginRight: '8px', color: '#3b82f6' }}></i> Semanal
                    </button>
                    <button className="btn-secondary" onClick={() => handleExportar('mensual')} title="Descargar Mensual">
                        <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#8b5cf6' }}></i> Mensual
                    </button>
                </div>
            </div>

            {/* --- KPIs con Bs al final --- */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon icon-day"><i className="fas fa-coins"></i></div>
                    <div className="kpi-info"><span>Ingresos Hoy</span><strong>{metricas.ingresosHoy.toFixed(2)} Bs</strong></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon icon-week"><i className="fas fa-receipt"></i></div>
                    <div className="kpi-info"><span>Pedidos Hoy</span><strong>{metricas.pedidosHoy}</strong></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon icon-month"><i className="fas fa-wallet"></i></div>
                    <div className="kpi-info"><span>Ticket Promedio</span><strong>{metricas.ticketPromedio.toFixed(2)} Bs</strong></div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon icon-year"><i className="fas fa-chart-line"></i></div>
                    <div className="kpi-info"><span>Acumulado Mes</span><strong>{metricas.ingresosMes.toFixed(2)} Bs</strong></div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-box">
                    <h3><i className="fas fa-crown" style={{ color: '#fbbf24' }}></i> Top 5 Productos</h3>
                    <ul style={{ listStyle: 'none', padding: 0, overflowY: 'auto' }}>
                        {graficos.topProductos.map((p, i) => (
                            <li key={i} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontWeight: 'bold', color: 'var(--text-muted)', width: '20px' }}>#{i + 1}</span><span style={{ fontWeight: '500' }}>{p.producto}</span></div>
                                <div><strong style={{ color: 'var(--primary)' }}>{p.cantidadTotal} un.</strong></div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="chart-box">
                    <h3><i className="fas fa-chart-bar" style={{ color: '#3b82f6' }}></i> Tendencia 7 días</h3>
                    <div style={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '20px 0' }}>
                        {graficos.tendenciaSemanal.map((dia, i) => (
                            <div key={i} style={{ textAlign: 'center', width: '100%' }}>
                                <div style={{ height: `${Math.min(dia.total / 10, 150)}px`, background: 'var(--primary-gradient)', width: '60%', margin: '0 auto', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                                <div style={{ fontSize: '0.75rem', marginTop: '5px', color: '#64748b' }}>{dia.fecha}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px', borderTop: '2px dashed #e5e7eb', paddingTop: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '2rem', color: 'var(--primary)' }}>
                    <i className="fas fa-list-alt"></i> ESTADO DE PEDIDOS RECIENTES
                </h3>

                <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', background: 'white', marginTop: '15px' }}>
                    <table className="productos-table">
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={{ padding: '15px' }}>Hora</th>
                                <th>Cajero</th>
                                <th>Pago</th>
                                <th>Total</th>
                                <th>Estado Cocina</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaVentas && listaVentas.length > 0 ? (
                                listaVentas.map((venta, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px', fontSize: '1.1rem' }}>
                                            {new Date(venta.fecha).toLocaleString('es-BO', { timeZone: 'America/La_Paz' })}
                                        </td>
                                        <td>{venta.cajero}</td>
                                        <td><span className="badge-pago" style={{ background: '#e0f2fe', color: '#0369a1' }}>{venta.metodoPago}</span></td>
                                        {/* CORRECCIÓN: Total con Bs al final */}
                                        <td style={{ fontWeight: 'bold' }}>{venta.total.toFixed(2)} Bs</td>
                                        <td>
                                            <span style={{
                                                padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.85rem',
                                                backgroundColor: venta.estado.includes('Pendiente') ? '#fef3c7' :
                                                    venta.estado.includes('Preparación') ? '#dbeafe' :
                                                        venta.estado.includes('Listo') ? '#dcfce7' : '#f3f4f6',
                                                color: venta.estado.includes('Pendiente') ? '#d97706' :
                                                    venta.estado.includes('Preparación') ? '#2563eb' :
                                                        venta.estado.includes('Listo') ? '#16a34a' : '#6b7280'
                                            }}>
                                                {venta.estado.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                                        <i className="fas fa-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></i>
                                        No se encontraron pedidos recientes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const AdminDashboard = ({ onLogout, userName }) => {
    const [activeSubView, setActiveSubView] = useState('gestion-productos-view');
    return (
        <div id="dashboard-view" className="view">
            <Header title="PANEL DE ADMINISTRACIÓN" role="ADMINISTRADOR" userName={userName} onLogout={onLogout}
                extraContent={<AdminNav activeView={activeSubView} onNavChange={setActiveSubView} />} />
            <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                {activeSubView === 'reportes-view' ? <ReportesVentas /> : <GestionProductos />}
            </div>
        </div>
    );
};