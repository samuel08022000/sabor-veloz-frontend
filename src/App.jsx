// src/App.jsx
import React, { useState } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { Cajero } from './components/Cajero';
import { Cocina } from './components/Cocina';
import './index.css'; 

function App() {
    const [currentView, setCurrentView] = useState('login');
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState('');

    const handleLoginSuccess = (role, user) => {
        setUserRole(role);
        setUserName(user);
        setCurrentView(role);
    };

    const handleLogout = () => {
        setUserRole(null);
        setUserName('');
        setCurrentView('login');
    };

    const renderView = () => {
        switch (currentView) {
            case 'admin':
                return <AdminDashboard onLogout={handleLogout} userName={userName} />;
            case 'cajero':
                return <Cajero onLogout={handleLogout} userName={userName} />;
            case 'cocina':
                return <Cocina onLogout={handleLogout} userName={userName} />;
            case 'login':
            default:
                return <Login onLoginSuccess={handleLoginSuccess} />;
        }
    };

    return (
        <>{renderView()}</>
    );
}

export default App;