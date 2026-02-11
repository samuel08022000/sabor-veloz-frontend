import React, { useState } from 'react';
import { Login } from './Components/Login';
import { AdminDashboard } from './Components/AdminDashboard';
import { Cajero } from './Components/Cajero';
import { Cocina } from './Components/Cocina';
import { RegistroAsistencia } from './Components/RegistroAsistencia';
import './index.css'; 

function App() {
    // Estado para alternar entre la aplicación principal y el registro de asistencia
    const [view, setView] = useState('main'); // 'main' o 'asistencia'

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
    };

    // 1. Si la vista es 'asistencia', mostramos el componente de entrada/salida
    if (view === 'asistencia') {
        return <RegistroAsistencia onVolver={() => setView('main')} />;
    }

    // 2. Si no hay usuario logueado, mostramos Login y el acceso a Asistencia
    if (!currentUser) {
        return (
            <div className="relative">
                <Login onLoginSuccess={handleLoginSuccess} />
                
                {/* Botón flotante para acceder al Registro de Asistencia */}
                <div className="fixed bottom-6 right-6">
                    <button 
                        onClick={() => setView('asistencia')}
                        className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-black transition-all font-bold"
                    >
                        🕒 Registro de Asistencia
                    </button>
                </div>
            </div>
        );
    }

    // 3. Si hay usuario, renderizamos según su Rol (Lógica original)
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
                    <button onClick={handleLogout} className="ml-4 underline">Salir</button>
                </div>
            );
    }
}

export default App;