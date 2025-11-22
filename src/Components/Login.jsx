// src/components/Login.jsx
import React, { useState } from 'react';

// Simulamos la función de login que luego conectarás a tu API de ASP.NET
const simulatedLogin = (usuario, rol) => {
    // ** AQUÍ IRÍA LA LLAMADA A TU API ASP.NET **
    // Ejemplo: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ usuario, contraseña, rol }) });
    console.log(`Intentando iniciar sesión como ${rol} con usuario: ${usuario}`);

    // Simulación de éxito (Acepta cualquier usuario siempre que no esté vacío)
    if (usuario && rol) {
        return { success: true, role: rol };
    }
    return { success: false, message: 'Usuario o rol no válidos.' };
};

export const Login = ({ onLoginSuccess }) => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('admin');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const result = simulatedLogin(usuario, rol);

        if (result.success) {
            onLoginSuccess(result.role, usuario); 
        } else {
            setError(result.message || 'Credenciales inválidas.');
        }
    };

    return (
        <div id="login-view" className="view active-view">
            <div className="login-container">
                {/* Logo estilizado con la clase CSS correcta */}
                <h1 className="logo-login">SABOR VELOZ</h1>

                <div className="login-form-box">
                    <form onSubmit={handleSubmit} id="loginForm">
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
                            <div className="password-input-wrapper">
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    placeholder="Contraseña" 
                                    required
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                />
                                <i 
                                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666' }}
                                ></i>
                            </div>
                        </div>

                        {/* Botones de Rol Segmentados */}
                        <div className="radio-group">
                            {['Admin', 'Cajero', 'Cocina'].map(r => (
                                <div key={r}>
                                    <input 
                                        type="radio" 
                                        id={`rol${r}`} 
                                        name="rol" 
                                        value={r.toLowerCase()} 
                                        checked={rol === r.toLowerCase()}
                                        onChange={() => setRol(r.toLowerCase())}
                                    />
                                    <label htmlFor={`rol${r}`}>{r}</label>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                    </form>
                    
                    {error && <p className="error-message" style={{display: 'block'}}>{error}</p>}
                </div>
            </div>
        </div>
    );
};