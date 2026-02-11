import React, { useState } from 'react';
import { Login } from './Components/Login';
import { AdminDashboard } from './Components/AdminDashboard';
import { Cajero } from './Components/Cajero';
import { Cocina } from './Components/Cocina';
import { RegistroAsistencia } from './Components/RegistroAsistencia';
import './index.css'; 

function App() {
    // Estado para navegar entre el sistema y la asistencia
    const [view, setView] = useState('main'); 

    // Intentar recuperar sesión de localStorage al cargar
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('saborVelozUser');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem('saborVelozUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('saborVelozUser');
    };

    // 1. Vista de Registro de Asistencia (Independiente)
    if (view === 'asistencia') {
        return <RegistroAsistencia onVolver={() => setView('main')} />;
    }

    // 2. Si no hay usuario logueado, mostramos el Login + Botón de Asistencia abajo
    if (!currentUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                {/* Contenedor del Login */}
                <div className="w-full max-w-md">
                    <Login onLoginSuccess={handleLoginSuccess} />
                </div>

                {/* --- BOTÓN DEBAJO DEL INICIO DE SESIÓN --- */}
                <button 
                    onClick={() => setView('asistencia')}
                    className="mt-6 bg-white border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors shadow-md flex items-center gap-2"
                >
                    <span>🕒</span> REGISTRO DE ASISTENCIA (EMPLEADOS)
                </button>
            </div>
        );
    }

    // 3. Renderizar según el Rol si ya está logueado
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
                    <button onClick={handleLogout} className="btn-primary mt-4">Salir</button>
                </div>
            );
    }
}

export default App;