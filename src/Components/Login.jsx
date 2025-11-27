import React, { useState } from 'react';
import api from '../api/axios'; // Importamos nuestra config

export const Login = ({ onLoginSuccess }) => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState(''); // Backend espera "Password", no "contrasena"
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // El DTO del backend espera { Usuario, Password }
            const response = await api.post('/Auth/login', { 
                Usuario: usuario, 
                Password: password 
            });

            // Si llegamos aquí, es 200 OK.
            // Pasamos todos los datos (IdUsuario, Rol, Nombre) hacia arriba
            onLoginSuccess({
                idUsuario: response.data.idUsuario, // Asegúrate de agregar esto en el backend
                nombre: response.data.nombre,
                usuario: response.data.usuario,
                rol: response.data.rol
            });

        } catch (err) {
            console.error(err);
            if (err.response) {
                if (err.response.status === 401) setError('Usuario o contraseña incorrectos.');
                else setError(`Error: ${err.response.data || 'Error en el servidor'}`);
            } else {
                setError('No se pudo conectar con el servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login-view" className="view">
            <div className="login-container">
                <h1 className="logo-login">SABOR VELOZ</h1>
                <div className="login-form-box">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Usuario" 
                                required
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="password" 
                                placeholder="Contraseña" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Eliminamos el selector de roles manual, el backend decide el rol */}
                        
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                    {error && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</p>}
                </div>
            </div>
        </div>
    );
};