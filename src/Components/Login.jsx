import React, { useState } from 'react';
import api from '../api/axios'; // Importamos nuestra config

export const Login = ({ onLoginSuccess, onAsistenciaClick }) => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/Auth/login', { 
                Usuario: usuario, 
                Password: password 
            });

            onLoginSuccess({
                idUsuario: response.data.idUsuario,
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

                        <button type="submit" className="btn-primary" disabled={loading} style={{width: '100%'}}>
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {error && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</p>}

                    {/* --- ESTO ES LO NUEVO: Botón dentro del mismo recuadro --- */}
                    <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee'}}>
                        <button 
                            type="button" 
                            onClick={onAsistenciaClick}
                            className="btn-asistencia-link"
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: '2px solid #e11d48', // Color rojo Sabor Veloz
                                color: '#e11d48',
                                padding: '10px',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                        >
                            🕒 REGISTRO DE ASISTENCIA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};