import React, { useState, useEffect } from 'react';
import { Header } from './Layouts';
import api from '../api/axios';

// Función auxiliar para estilos
const getClaseEstado = (estado) => {
    if (!estado) return '';
    const e = estado.toLowerCase();
    if (e.includes('pendiente')) return 'pendiente';
    if (e.includes('preparacion') || e.includes('preparación')) return 'preparacion';
    if (e.includes('listo')) return 'listo';
    return '';
};

// Componente de Tarjeta de Orden
const OrderCard = ({ orden, moverOrden }) => {
    let buttonHTML = null;
    const claseCss = getClaseEstado(orden.estado);
    
    if (claseCss === 'pendiente') {
        buttonHTML = (
            <button className="btn-accion-cocina btn-iniciar" onClick={() => moverOrden(orden.idComanda, 'En Preparación')}>
                A COCINAR <i className="fas fa-fire"></i>
            </button>
        );
    } else if (claseCss === 'preparacion') {
        buttonHTML = (
            <button className="btn-accion-cocina btn-terminar" onClick={() => moverOrden(orden.idComanda, 'Listo')}>
                TERMINAR <i className="fas fa-check"></i>
            </button>
        );
    } else if (claseCss === 'listo') {
        buttonHTML = <div className="status-badge" style={{textAlign:'center', color:'green', fontWeight:'bold'}}><i className="fas fa-check-circle"></i> LISTO PARA ENTREGAR</div>;
    }

    return (
        <div className={`orden-card ${claseCss}`}>
            <div className="orden-header">
                <span style={{fontSize:'1.2rem'}}>#{orden.numeroTicket}</span>
                <span className="orden-timer" style={{background:'#eee', padding:'2px 8px', borderRadius:'4px'}}>{orden.tipoPedido || 'LOCAL'}</span>
            </div>
            
            {orden.nombreCliente && (
                <div style={{fontWeight: '800', color: '#1e293b', fontSize: '1.3rem', textTransform: 'uppercase', marginBottom: '8px', borderBottom:'1px solid #eee', paddingBottom:'5px'}}>
                    {orden.nombreCliente}
                </div>
            )}
            
            <ul className="orden-items">
                {orden.productos.map((item, i) => (
                    <li key={i} style={{display:'flex', justifyContent:'space-between'}}>
                        <span>{item.producto}</span>
                        <strong style={{background:'#333', color:'white', padding:'2px 6px', borderRadius:'50%', minWidth:'25px', textAlign:'center'}}>{item.cantidad}</strong>
                    </li>
                ))}
            </ul>
            <div className="orden-footer" style={{marginTop:'15px'}}>
                <div style={{fontSize:'0.8rem', color:'#888', marginBottom:'10px', textAlign:'right'}}>
                    Pedido: {new Date(orden.fechaEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                {buttonHTML}
            </div>
        </div>
    );
};

export const Cocina = ({ onLogout, userName }) => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrdenes = async () => {
        try {
            const res = await api.get('/Cocina/pendientes');
            setOrdenes(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error cocina:", error);
        }
    };

    useEffect(() => {
        fetchOrdenes();
        const interval = setInterval(fetchOrdenes, 5000);
        return () => clearInterval(interval);
    }, []);

    const moverOrden = async (id, nuevoEstado) => {
        try {
            // Optimistic UI update (actualiza visualmente antes de confirmar)
            setOrdenes(prev => prev.map(o => o.idComanda === id ? {...o, estado: nuevoEstado} : o));
            
            await api.put(`/Cocina/actualizar/${id}`, JSON.stringify(nuevoEstado), {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchOrdenes(); // Recargar real
        } catch (error) {
            alert("Error de conexión: " + error.message);
            fetchOrdenes(); // Revertir si falló
        }
    };

    const filtrarPorEstado = (estadoBusqueda) => {
        return ordenes.filter(o => {
            const estadoOrden = o.estado.toLowerCase();
            const estadoBuscado = estadoBusqueda.toLowerCase();
            if (estadoBuscado.includes('prepara')) return estadoOrden.includes('prepara');
            return estadoOrden === estadoBuscado;
        });
    };

    return (
        <div id="cocina-view" className="view">
            <Header title="KDS COCINA" role="COCINA" userName={userName} onLogout={onLogout} />
            
            {loading ? <p style={{textAlign:'center', marginTop:'20px'}}>Cargando pedidos...</p> : (
                <div className="ordenes-layout">
                    {/* Columna 1 */}
                    <div className="ordenes-col col-pendiente">
                        <h3><i className="fas fa-clock" style={{color:'#ef4444'}}></i> PENDIENTES ({filtrarPorEstado('Pendiente').length})</h3>
                        <div className="ordenes-list">
                            {filtrarPorEstado('Pendiente').length === 0 && <p style={{textAlign:'center', color:'#999'}}>No hay pedidos pendientes</p>}
                            {filtrarPorEstado('Pendiente').map(orden => (
                                <OrderCard key={orden.idComanda} orden={orden} moverOrden={moverOrden} />
                            ))}
                        </div>
                    </div>

                    {/* Columna 2 */}
                    <div className="ordenes-col col-preparacion">
                        <h3><i className="fas fa-fire" style={{color:'#f59e0b'}}></i> EN HORNO ({filtrarPorEstado('En Preparación').length})</h3>
                        <div className="ordenes-list">
                            {filtrarPorEstado('En Preparación').map(orden => (
                                <OrderCard key={orden.idComanda} orden={orden} moverOrden={moverOrden} />
                            ))}
                        </div>
                    </div>

                    {/* Columna 3 */}
                    <div className="ordenes-col col-listo">
                        <h3><i className="fas fa-check-circle" style={{color:'#10b981'}}></i> LISTOS ({filtrarPorEstado('Listo').length})</h3>
                        <div className="ordenes-list">
                            {filtrarPorEstado('Listo').map(orden => (
                                <OrderCard key={orden.idComanda} orden={orden} moverOrden={moverOrden} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};