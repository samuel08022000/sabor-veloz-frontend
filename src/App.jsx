import React, { useState, useEffect } from 'react';
import { Login } from './Components/Login';
import { AdminDashboard } from './Components/AdminDashboard';
import { Cajero } from './Components/Cajero';
import { Cocina } from './Components/Cocina';
import { RegistroAsistencia } from './Components/RegistroAsistencia'; 
import './index.css'; 

function App() {
    // 1. Estado para navegar entre el Login y la Asistencia
    const [view, setView] = useState('main'); // 'main' o 'asistencia'

    // 2. Intentar recuperar sesión de localStorage al cargar
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('saborVelozUser');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLoginSuccess = (userData) => {
        console.log("Usuario logueado:", userData); // Mantenemos tu log original
        setCurrentUser(userData);
        localStorage.setItem('saborVelozUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('saborVelozUser');
    };

    // --- LÓGICA DE NAVEGACIÓN ---

    // Si el usuario hizo clic en el botón de asistencia, mostramos esa vista
    if (view === 'asistencia') {
        return <RegistroAsistencia onVolver={() => setView('main')} />;
    }

    // Si no hay usuario logueado, mostramos el Login con el nuevo botón integrado
    if (!currentUser) {
        return <Login 
            onLoginSuccess={handleLoginSuccess} 
            onAsistenciaClick={() => setView('asistencia')} 
        />;
    }

    // Renderizar según el Rol que viene del Backend (Tu lógica original intacta)
    switch (currentUser.rol) { 
        case 'Administrador':
        case 'Admin':
            return <AdminDashboard onLogout={handleLogout} userName={currentUser.nombre} />;
        case 'Cajero':
            return <Cajero onLogout={handleLogout} user={currentUser} />;
        case 'Cocina':
        case 'Cocinero':
            return <Cocina onLogout={handleLogout} userName={currentUser.nombre} />;
        default:
            return (
                <div className="view">
                    Rol no reconocido: {currentUser.rol} 
                    <button onClick={handleLogout} className="btn-primary" style={{marginLeft: '10px'}}>Salir</button>
                </div>
            );
    }
}

export default App;