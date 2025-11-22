// src/components/Layouts.jsx
import React from 'react';

// Barra de Navegación del Administrador (Página 2)
export const AdminNav = ({ activeView, onNavChange }) => {
    return (
        <nav className="dashboard-nav" id="admin-nav">
            <button 
                className={`nav-button ${activeView === 'caja-view' ? 'active-nav' : ''}`} 
                onClick={() => onNavChange('caja-view')}
            >
                Panel de Caja
            </button>
            <button 
                className={`nav-button ${activeView === 'gestion-productos-view' ? 'active-nav' : ''}`} 
                onClick={() => onNavChange('gestion-productos-view')}
            >
                Gestión de Productos
            </button>
            <button 
                className={`nav-button ${activeView === 'reportes-view' ? 'active-nav' : ''}`} 
                onClick={() => onNavChange('reportes-view')}
            >
                Reportes de Ventas
            </button>
        </nav>
    );
};

// Header Base (Guindo)
export const Header = ({ title, role, userName, onLogout, extraContent }) => {
    return (
        <header className="dashboard-header">
            <h1 className="logo-text">{title}</h1>
            {extraContent}
            <div className="user-info">
                <span>{role}: <strong id="cajero-name">{userName}</strong></span> |
                <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
            </div>
        </header>
    );
};