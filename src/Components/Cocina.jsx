// src/components/Cocina.jsx
import React, { useState } from 'react';
import { Header } from './Layouts';

const initialOrdenes = [
    { id: 789, estado: 'pendiente', pago: 'Efectivo', items: [{nombre: 'Hamburguesa', cantidad: 1}, {nombre: 'Salchipapa', cantidad: 1}] },
    { id: 788, estado: 'preparacion', pago: 'Tarjeta', items: [{nombre: 'Pollo Frito', cantidad: 2}, {nombre: 'Papas Grandes', cantidad: 1}] },
    { id: 787, estado: 'listo', pago: 'QR', items: [{nombre: 'Salchiburguer', cantidad: 1}, {nombre: 'Soda', cantidad: 1}] },
];

const OrderCard = ({ orden, moverOrden }) => {
    let buttonHTML = null;
    let statusColor = '';
    
    if (orden.estado === 'pendiente') {
        buttonHTML = <button className="btn-iniciar-prep" onClick={() => moverOrden(orden.id, 'preparacion')}>Iniciar Preparación</button>;
        statusColor = '#ffc107'; 
    } else if (orden.estado === 'preparacion') {
        buttonHTML = <button className="btn-marcar-listo" onClick={() => moverOrden(orden.id, 'listo')}>Marcar como Listo</button>;
        statusColor = '#17a2b8'; 
    } else if (orden.estado === 'listo') {
        buttonHTML = <span style={{color: '#28a745', fontWeight: 'bold'}}>¡Listo para entregar!</span>;
        statusColor = '#28a745'; 
    }

    return (
        <div className={`orden-card ${orden.estado}`} data-id={orden.id}>
            <div className="orden-header">
                <span>Pedido #{orden.id}</span> 
                <span style={{color: statusColor}}>{orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}</span> 
            </div>
            <ul className="orden-items">
                {orden.items.map((item, i) => (
                    <li key={i}>{item.cantidad}x {item.nombre}</li>
                ))}
            </ul>
            <div className="orden-footer">
                <span>Pago: {orden.pago}</span> 
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
        alert(`Pedido #${id} movido a ${nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1)}.`);
    };

    const renderColumn = (estado, title) => (
        <div className={`ordenes-col col-${estado}`}>
            <h3>{title}</h3> 
            <div id={`${estado}-list`}>
                {ordenes.filter(o => o.estado === estado).map(orden => (
                    <OrderCard key={orden.id} orden={orden} moverOrden={moverOrden} />
                ))}
            </div>
        </div>
    );

    return (
        <div id="cocina-view" className="view active-view">
            <Header 
                title="SABOR VELOZ - COCINA" 
                role="COCINA" 
                userName={userName} 
                onLogout={onLogout}
            />
            <h1 style={{color: 'var(--color-secondary)', margin: '20px 0', textAlign: 'center'}}>COCINA</h1> 

            <div className="ordenes-layout">
                {renderColumn('pendiente', 'Pendientes')} 
                {renderColumn('preparacion', 'En Preparación')} 
                {renderColumn('listo', 'Listos')} 
            </div>
        </div>
    );
};