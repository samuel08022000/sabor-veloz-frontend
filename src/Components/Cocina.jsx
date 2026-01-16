import React, { useState, useEffect } from 'react';
import { Header } from './Layouts';
import api from '../api/axios';

// Función para convertir cualquier estado (Pendiente, PENDIENTE, pendiente) a la clase CSS correcta
const getClaseEstado = (estado) => {
    if (!estado) return '';
    const e = estado.toLowerCase();
    if (e.includes('pendiente')) return 'pendiente';
    if (e.includes('preparacion') || e.includes('preparación')) return 'preparacion';
    if (e.includes('listo')) return 'listo';
    return '';
};

const OrderCard = ({ orden, moverOrden }) => {
    let buttonHTML = null;
    const claseCss = getClaseEstado(orden.estado);

    if (claseCss === 'pendiente') {
        buttonHTML = (
            <button className="btn-accion-cocina btn-iniciar" onClick={() => moverOrden(orden.idComanda, 'En Preparación')}>
                COCINAR <i className="fas fa-fire"></i>
            </button>
        );
    } else if (claseCss === 'preparacion') {
        buttonHTML = (
            <button className="btn-accion-cocina btn-terminar" onClick={() => moverOrden(orden.idComanda, 'Listo')}>
                TERMINAR <i className="fas fa-check"></i>
            </button>
        );
    } else if (claseCss === 'listo') {
        buttonHTML = <span className="status-badge"><i className="fas fa-check-circle"></i> LISTO</span>;
    }

    return (
        <div className={`orden-card ${claseCss}`}>
            <div className="orden-header">
                <span className="orden-id">#{orden.numeroTicket}</span>
                <span className="orden-timer">{orden.tipoPedido?.toUpperCase() || 'LOCAL'}</span>
            </div>
            {/* 🔥 AQUÍ ES DONDE AGREGAMOS EL NOMBRE DEL CLIENTE 🔥 */}
            {/* Si existe el nombre, lo mostramos en grande y negrita */}
            {orden.nombreCliente && (
                <div style={{
                    padding: '0 10px',
                    fontWeight: '800',
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    textTransform: 'uppercase',
                    marginBottom: '5px'
                }}>
                    {orden.nombreCliente}
                </div>
            )}
            <ul className="orden-items">
                {orden.productos.map((item, i) => (
                    <li key={i}><strong>{item.cantidad}x</strong> {item.producto}</li>
                ))}
            </ul>
            <div className="orden-footer">
                {/* 🔴 CAMBIO: Forzar zona horaria de Bolivia */}
                <span className="orden-pago">
                    {new Date(orden.fechaEnvio).toLocaleTimeString('es-BO', {
                        timeZone: 'America/La_Paz',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
                {buttonHTML}
            </div>
        </div>
    );
};

export const Cocina = ({ onLogout, userName }) => {
    const [ordenes, setOrdenes] = useState([]);

    const fetchOrdenes = async () => {
        try {
            const res = await api.get('/Cocina/pendientes');
            console.log("Datos recibidos cocina:", res.data); // <--- MIRAR CONSOLA (F12)
            setOrdenes(res.data);
        } catch (error) {
            console.error("Error cocina:", error);
        }
    };

    useEffect(() => {
        fetchOrdenes();
        const interval = setInterval(fetchOrdenes, 5000); // Recargar cada 5s
        return () => clearInterval(interval);
    }, []);

    const moverOrden = async (id, nuevoEstado) => {
        try {
            await api.put(`/Cocina/actualizar/${id}`, JSON.stringify(nuevoEstado), {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchOrdenes();
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    // Función flexible para filtrar sin importar mayúsculas/minúsculas
    const filtrarPorEstado = (estadoBusqueda) => {
        return ordenes.filter(o => {
            const estadoOrden = o.estado.toLowerCase();
            const estadoBuscado = estadoBusqueda.toLowerCase();
            // Manejo especial para "en preparacion" vs "en preparación"
            if (estadoBuscado.includes('prepara')) return estadoOrden.includes('prepara');
            return estadoOrden === estadoBuscado;
        });
    };

    return (
        <div id="cocina-view" className="view">
            <Header title="KDS COCINA" role="COCINA" userName={userName} onLogout={onLogout} />

            <div className="ordenes-layout">
                {/* Columna 1: Pendientes */}
                <div className="ordenes-col col-pendiente">
                    <h3>PENDIENTES</h3>
                    <div className="ordenes-list">
                        {filtrarPorEstado('Pendiente').map(orden => (
                            <OrderCard key={orden.idComanda} orden={orden} moverOrden={moverOrden} />
                        ))}
                    </div>
                </div>

                {/* Columna 2: En Preparación */}
                <div className="ordenes-col col-preparacion">
                    <h3>EN PREPARACIÓN</h3>
                    <div className="ordenes-list">
                        {filtrarPorEstado('En Preparación').map(orden => (
                            <OrderCard key={orden.idComanda} orden={orden} moverOrden={moverOrden} />
                        ))}
                    </div>
                </div>

                {/* Columna 3: Listos */}
                <div className="ordenes-col col-listo">
                    <h3>LISTOS</h3>
                    <div className="ordenes-list">
                        {filtrarPorEstado('Listo').map(orden => (
                            <OrderCard key={orden.idComanda} orden={orden} moverOrden={moverOrden} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};