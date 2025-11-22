// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { Header, AdminNav } from './Layouts';

const PanelCaja = () => (
    <div id="caja-view" className="sub-view active-sub-view">
        <h2>Panel de Caja</h2> 
        
        <div className="apertura-caja-form">
            <h3>Abrir Caja</h3> 
            <div className="caja-input-row">
                <label>Monto Inicial</label>
                <input type="number" placeholder="$" defaultValue="100.00" /> 
                <span>14/11/2025</span> 
            </div>
            <div className="caja-input-row">
                <label>Cajero/Fecha</label> 
                <input type="text" defaultValue="Ana Pérez" readOnly /> 
                <i className="fas fa-calendar-alt"></i>
            </div>
            <button className="caja-confirm-btn">Confirmar Apertura</button> 
        </div>

        <h3 style={{marginBottom: '20px'}}>Resumen Diario</h3> 
        <div className="resumen-diario">
            <div className="resumen-card vendido">
                <strong>Total Vendido Hoy:</strong> 
                <span>$250.00</span> 
            </div>
            <div className="resumen-card caja">
                <strong>Total en Caja:</strong> 
                <span>$300.00</span> 
            </div>
        </div>
        <button className="btn btn-cerrar-caja">Cerrar Caja</button> 
    </div>
);

const GestionProductos = () => (
    <div id="gestion-productos-view" className="sub-view active-sub-view">
        <h2>Gestión de Productos</h2> 
        <div className="gestion-acciones">
            <button className="btn-nuevo-producto">
                <i className="fas fa-plus"></i> Nuevo Producto 
            </button>
            <div className="search-bar">
                <input type="text" placeholder="Buscar producto..." />
            </div>
        </div>
        
        <table className="productos-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>1</td><td>Hamburguesa</td><td>Platos</td><td>$5.00</td><td><span style={{color: 'green'}}>Activo</span></td><td><button className="btn-accion btn-editar">Editar</button><button className="btn-accion btn-eliminar">Eliminar</button></td></tr>
                <tr><td>2</td><td>Salchipapa</td><td>Platos</td><td>$4.00</td><td><span style={{color: 'green'}}>Activo</span></td><td><button className="btn-accion btn-editar">Editar</button><button className="btn-accion btn-eliminar">Eliminar</button></td></tr>
                <tr><td>3</td><td>Refresco</td><td>Bebidas</td><td>$2.00</td><td><span style={{color: 'green'}}>Activo</span></td><td><button className="btn-accion btn-editar">Editar</button><button className="btn-accion btn-eliminar">Eliminar</button></td></tr>
            </tbody>
        </table>
    </div>
);

const ReportesVentas = () => (
    <div id="reportes-view" className="sub-view active-sub-view">
        <h2>Reportes de Ventas</h2> 
        
        <div className="export-buttons">
            <button className="btn-excel"><i className="fas fa-file-excel"></i> Exportar a Excel</button> 
            <button className="btn-pdf"><i className="fas fa-file-pdf"></i> PDF</button> 
        </div>

        <div className="reporte-overview">
            <div className="kpi-card">
                <strong>Ventas del Día:</strong> 
                <span>$550.00</span> 
            </div>
            <div className="kpi-card">
                <strong>Ventas de la Semana:</strong> 
                <span>$3,100.00</span> 
            </div>
            <div className="kpi-card">
                <strong>Ventas del Mes:</strong> 
                <span>$12,500.00</span> 
            </div>
            <div className="kpi-card">
                <strong>Ventas del Año:</strong> 
                <span>$140,000.00</span> 
            </div>
        </div>

        <div className="chart-container">
            <div className="chart-box">
                <h3>Ventas vs. Tiempo</h3> 
                <div className="chart-sim">(Simulación de Gráfico Lineal: Ene - Oct)</div> 
            </div>
            <div className="chart-box">
                <h3>Rendimiento por Categoría</h3> 
                <div className="chart-sim">(Simulación de Gráfico de Barras: Platos, Bebidas, Postres)</div> 
            </div>
        </div>
        
        <h3>Detalle de Ventas Mensual (Octubre 2025)</h3>
        <table className="productos-table" style={{marginTop: '15px'}}>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Tipo de Pago</th>
                    <th>Monto Total</th>
                    <th>Detalle</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>01/10/2025</td><td>Efectivo</td><td>$250.00</td><td>2x Combo Hamburguesa</td></tr>
                <tr><td>02/10/2025</td><td>Tarjeta</td><td>$120.00</td><td>1x Salchipapa + Refresco</td></tr>
                <tr><td>03/10/2025</td><td>QR</td><td>$300.00</td><td>2x Pipocas de Pollo</td></tr>
            </tbody>
        </table>
    </div>
);

export const AdminDashboard = ({ onLogout, userName }) => {
    const [activeSubView, setActiveSubView] = useState('caja-view');

    const renderSubView = () => {
        switch (activeSubView) {
            case 'gestion-productos-view':
                return <GestionProductos />;
            case 'reportes-view':
                return <ReportesVentas />;
            case 'caja-view':
            default:
                return <PanelCaja />;
        }
    };

    return (
        <div id="dashboard-view" className="view active-view">
            <Header 
                title="SABOR VELOZ" 
                role="Administrador" 
                userName={userName} 
                onLogout={onLogout}
                extraContent={
                    <AdminNav activeView={activeSubView} onNavChange={setActiveSubView} />
                }
            />
            {renderSubView()}
        </div>
    );
};