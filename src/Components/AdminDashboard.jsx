import React, { useState } from 'react';
import { Header, AdminNav } from './Layouts';

// Componente para Gestión de Productos (Mejorado visualmente en CSS)
const GestionProductos = () => (
    <div id="gestion-productos-view" className="sub-view">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{color: 'var(--primary)', fontSize: '2rem'}}>Inventario</h2> 
            <button className="btn-primary" style={{width: 'auto', padding: '10px 20px'}}>
                + Nuevo Producto
            </button>
        </div>
        
        <table className="productos-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Hamburguesa Doble</td><td>Platos</td><td>$5.00</td><td><span style={{color: 'green'}}>Activo</span></td><td><button>Editar</button></td></tr>
                <tr><td>Salchipapa</td><td>Platos</td><td>$4.00</td><td><span style={{color: 'green'}}>Activo</span></td><td><button>Editar</button></td></tr>
                <tr><td>Coca Cola</td><td>Bebidas</td><td>$2.00</td><td><span style={{color: 'green'}}>Activo</span></td><td><button>Editar</button></td></tr>
            </tbody>
        </table>
    </div>
);

// ... (imports anteriores)

const ReportesVentas = () => (
    <div id="reportes-view" className="sub-view animated-fade-in">
        {/* Encabezado con Título y Botones de Exportar */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
            <h2 style={{color: 'var(--primary)', fontSize: '2.5rem', margin: 0}}>DASHBOARD FINANCIERO</h2> 
            <div style={{display: 'flex', gap: '10px'}}>
                <button className="btn-secondary" onClick={() => alert("Exportando Excel...")}>
                    <i className="fas fa-file-excel" style={{marginRight: '8px', color: '#10b981'}}></i> Exportar Excel
                </button>
                <button className="btn-secondary" onClick={() => alert("Generando PDF...")}>
                    <i className="fas fa-file-pdf" style={{marginRight: '8px', color: '#ef4444'}}></i> PDF
                </button>
            </div>
        </div>

        {/* 1. Tarjetas de Resumen (KPIs) - Restaurando las 4 métricas */}
        <div className="kpi-grid">
            <div className="kpi-card">
                <div className="kpi-icon icon-day"><i className="fas fa-calendar-day"></i></div>
                <div className="kpi-info">
                    <span>Ventas Hoy</span>
                    <strong>$550.00</strong>
                </div>
            </div>
            <div className="kpi-card">
                <div className="kpi-icon icon-week"><i className="fas fa-calendar-week"></i></div>
                <div className="kpi-info">
                    <span>Esta Semana</span>
                    <strong>$3,100.00</strong>
                </div>
            </div>
            <div className="kpi-card">
                <div className="kpi-icon icon-month"><i className="fas fa-calendar-alt"></i></div>
                <div className="kpi-info">
                    <span>Este Mes</span>
                    <strong>$12,500.00</strong>
                </div>
            </div>
            <div className="kpi-card">
                <div className="kpi-icon icon-year"><i className="fas fa-chart-line"></i></div>
                <div className="kpi-info">
                    <span>Total Año</span>
                    <strong>$140,000.00</strong>
                </div>
            </div>
        </div>

        {/* 2. Sección de Gráficos (Simulada pero estilizada) */}
        <div className="charts-grid">
            <div className="chart-box">
                <h3><i className="fas fa-chart-area"></i> Ventas vs. Tiempo</h3> 
                <div className="chart-placeholder">
                    {/* Aquí iría <Line options={...} data={...} /> de Chart.js */}
                    <div className="fake-graph-line"></div>
                    <span>(Gráfico de Ventas Mensuales)</span>
                </div> 
            </div>
            <div className="chart-box">
                <h3><i className="fas fa-chart-pie"></i> Rendimiento por Categoría</h3> 
                <div className="chart-placeholder">
                    {/* Aquí iría <Bar options={...} data={...} /> */}
                    <div className="fake-graph-bar">
                        <div style={{height: '60%'}}></div>
                        <div style={{height: '80%'}}></div>
                        <div style={{height: '40%'}}></div>
                    </div>
                    <span>(Platos vs Bebidas)</span>
                </div> 
            </div>
        </div>
        
        {/* 3. Tabla de Detalles Restaurada */}
        <div style={{marginTop: '30px'}}>
            <h3 style={{fontFamily: 'var(--font-brand)', fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '15px'}}>
                Detalle de Transacciones Recientes
            </h3>
            <div style={{overflowX: 'auto', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)'}}>
                <table className="productos-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo de Pago</th>
                            <th>Monto Total</th>
                            <th>Detalle Orden</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>01/10/2025</td><td><span className="badge-pago efectivo">Efectivo</span></td><td>$250.00</td><td>2x Combo Hamburguesa</td><td><span style={{color: '#10b981', fontWeight: 'bold'}}>Completado</span></td></tr>
                        <tr><td>02/10/2025</td><td><span className="badge-pago tarjeta">Tarjeta</span></td><td>$120.00</td><td>1x Salchipapa + Refresco</td><td><span style={{color: '#10b981', fontWeight: 'bold'}}>Completado</span></td></tr>
                        <tr><td>03/10/2025</td><td><span className="badge-pago qr">QR</span></td><td>$300.00</td><td>2x Pipocas de Pollo</td><td><span style={{color: '#10b981', fontWeight: 'bold'}}>Completado</span></td></tr>
                        <tr><td>03/10/2025</td><td><span className="badge-pago efectivo">Efectivo</span></td><td>$50.00</td><td>1x Hamburguesa Simple</td><td><span style={{color: '#f59e0b', fontWeight: 'bold'}}>Pendiente</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// ... (resto del AdminDashboard)

export const AdminDashboard = ({ onLogout, userName }) => {
    // Al eliminar PanelCaja, cambiamos la vista por defecto a productos
    const [activeSubView, setActiveSubView] = useState('gestion-productos-view');

    const renderSubView = () => {
        switch (activeSubView) {
            case 'reportes-view': return <ReportesVentas />;
            case 'gestion-productos-view':
            default: return <GestionProductos />;
        }
    };

    return (
        <div id="dashboard-view" className="view">
            <Header 
                title="SABOR VELOZ ADMIN" 
                role="ADMINISTRADOR" 
                userName={userName} 
                onLogout={onLogout}
                extraContent={
                    <AdminNav activeView={activeSubView} onNavChange={setActiveSubView} />
                }
            />
            <div style={{padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%'}}>
                {renderSubView()}
            </div>
        </div>
    );
};