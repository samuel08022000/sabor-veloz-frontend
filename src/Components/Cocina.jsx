import React, { useState } from 'react';
import { Header } from './Layouts';

const initialOrdenes = [
    { id: 789, estado: 'pendiente', pago: 'Efectivo', items: [{nombre: 'Hamburguesa Doble', cantidad: 1}, {nombre: 'Salchipapa', cantidad: 1}], hora: '12:30' },
    { id: 788, estado: 'preparacion', pago: 'Tarjeta', items: [{nombre: 'Pollo Frito (5 pzas)', cantidad: 2}, {nombre: 'Papas Grandes', cantidad: 1}], hora: '12:25' },
    { id: 787, estado: 'listo', pago: 'QR', items: [{nombre: 'Salchiburguer', cantidad: 1}, {nombre: 'Soda 2L', cantidad: 1}], hora: '12:15' },
    { id: 790, estado: 'pendiente', pago: 'Efectivo', items: [{nombre: 'Pipocas de Pollo', cantidad: 2}], hora: '12:32' },
];

const OrderCard = ({ orden, moverOrden }) => {
    let buttonHTML = null;
    
    if (orden.estado === 'pendiente') {
        buttonHTML = (
            <button className="btn-accion-cocina btn-iniciar" onClick={() => moverOrden(orden.id, 'preparacion')}>
                COCINAR <i className="fas fa-fire"></i>
            </button>
        );
    } else if (orden.estado === 'preparacion') {
        buttonHTML = (
            <button className="btn-accion-cocina btn-terminar" onClick={() => moverOrden(orden.id, 'listo')}>
                TERMINAR <i className="fas fa-check"></i>
            </button>
        );
    } else if (orden.estado === 'listo') {
        buttonHTML = <span className="status-badge"><i className="fas fa-check-circle"></i> LISTO</span>;
    }

    return (
        <div className={`orden-card ${orden.estado}`}>
            <div className="orden-header">
                <span className="orden-id">#{orden.id}</span>
                <span className="orden-timer"><i className="far fa-clock"></i> {orden.hora}</span>
            </div>
            
            <ul className="orden-items">
                {orden.items.map((item, i) => (
                    <li key={i}>
                        <strong>{item.cantidad}x</strong> {item.nombre}
                    </li>
                ))}
            </ul>
            
            <div className="orden-footer">
                <span className="orden-pago">{orden.pago}</span>
                {buttonHTML}
            </div>
        </div>
    );
};

export const Cocina = ({ onLogout, userName }) => {
    const [ordenes, setOrdenes] = useState(initialOrdenes);

    const moverOrden = (id, nuevoEstado) => {
        setOrdenes(ordenes.map(orden => 
            orden.id === id ? { ...orden, estado: nuevoEstado } : orden
        ));
    };

    const renderColumn = (estado, title) => (
        <div className={`ordenes-col col-${estado}`}>
            <h3>{title.toUpperCase()}</h3> 
            <div className="ordenes-list">
                {ordenes.filter(o => o.estado === estado).map(orden => (
                    <OrderCard key={orden.id} orden={orden} moverOrden={moverOrden} />
                ))}
            </div>
        </div>
    );

    return (
        <div id="cocina-view" className="view">
            <Header 
                title="SABOR VELOZ KDS" 
                role="COCINA" 
                userName={userName} 
                onLogout={onLogout}
            />
            
            <div className="ordenes-layout">
                {renderColumn('pendiente', 'Pendientes')} 
                {renderColumn('preparacion', 'En Preparación')} 
                {renderColumn('listo', 'Listos para Entregar')} 
            </div>
        </div>
    );
};