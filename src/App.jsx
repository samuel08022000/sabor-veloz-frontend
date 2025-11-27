import React, { useState, useEffect } from 'react';
import { Login } from './Components/Login';
import { AdminDashboard } from './Components/AdminDashboard';
import { Cajero } from './Components/Cajero';
import { Cocina } from './Components/Cocina';
import './index.css'; 

function App() {
    // Intentar recuperar sesión de localStorage al cargar
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('saborVelozUser');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLoginSuccess = (userData) => {
        console.log("Usuario logueado:", userData);
        setCurrentUser(userData);
        localStorage.setItem('saborVelozUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('saborVelozUser');
        // Opcional: Llamar a endpoint de logout si existiera
    };

    if (!currentUser) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // Renderizar según el Rol que viene del Backend
    switch (currentUser.rol) { // Backend envía "Administrador", "Cajero", "Cocina"
        case 'Administrador':
        case 'Admin':
            return <AdminDashboard onLogout={handleLogout} userName={currentUser.nombre} />;
        case 'Cajero':
            return <Cajero onLogout={handleLogout} user={currentUser} />;
        case 'Cocina':
        case 'Cocinero':
            return <Cocina onLogout={handleLogout} userName={currentUser.nombre} />;
        default:
            return <div className="view">Rol no reconocido: {currentUser.rol} <button onClick={handleLogout}>Salir</button></div>;
    }
}

export default App;