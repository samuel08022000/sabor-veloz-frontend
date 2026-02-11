import React, { useState } from 'react';
import api from '../api/axios';

export const RegistroAsistencia = ({ onVolver }) => {
    const [paso, setPaso] = useState(1); // 1: Selección, 2: Formulario
    const [tipoRegistro, setTipoRegistro] = useState(''); // 'ingreso' o 'salida'
    const [datos, setDatos] = useState({ nombre: '', apellido: '' });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [loading, setLoading] = useState(false);

    const seleccionarTipo = (tipo) => {
        setTipoRegistro(tipo);
        setPaso(2);
    };

    const handleFinalizar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ texto: '', tipo: '' });

        try {
            // Endpoints correctos según tu Backend
            const endpoint = tipoRegistro === 'ingreso' ? '/api/asistencia/ingreso' : '/api/asistencia/salida';
            const res = await api.post(endpoint, datos);
            
            setMensaje({ texto: res.data.mensaje || "¡Registro exitoso!", tipo: 'success' });
            
            // Esperar 2 segundos para que lean el mensaje y volver al inicio
            setTimeout(() => {
                setPaso(1);
                setDatos({ nombre: '', apellido: '' });
                setMensaje({ texto: '', tipo: '' });
            }, 2000);

        } catch (err) {
            // Capturamos el mensaje de error real del Backend
            const mensajeError = err.response?.data?.mensaje || err.response?.data || "Error al conectar con el servidor";
            setMensaje({ 
                texto: typeof mensajeError === 'string' ? mensajeError : "Error de registro", 
                tipo: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login-view" className="view">
            <div className="login-container">
                <h1 className="logo-login">SABOR VELOZ</h1>
                
                <div className="login-form-box" style={{ textAlign: 'center' }}>
                    
                    {paso === 1 ? (
                        <>
                            <h2 style={{ marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>CONTROL DE PERSONAL</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <button 
                                    onClick={() => seleccionarTipo('ingreso')}
                                    className="btn-primary"
                                    style={{ background: '#10b981', height: '80px', fontSize: '1.2rem' }}
                                >
                                    📥 REGISTRAR ENTRADA
                                </button>
                                <button 
                                    onClick={() => seleccionarTipo('salida')}
                                    className="btn-primary"
                                    style={{ background: '#ef4444', height: '80px', fontSize: '1.2rem' }}
                                >
                                    📤 REGISTRAR SALIDA
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 style={{ marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
                                {tipoRegistro === 'ingreso' ? '📝 DATOS DE ENTRADA' : '📝 DATOS DE SALIDA'}
                            </h2>
                            <form onSubmit={handleFinalizar}>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        placeholder="Nombre" 
                                        required
                                        value={datos.nombre}
                                        onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        placeholder="Apellido" 
                                        required
                                        value={datos.apellido}
                                        onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Procesando...' : 'CONFIRMAR REGISTRO'}
                                </button>

                                <button 
                                    type="button" 
                                    onClick={() => setPaso(1)} 
                                    style={{ marginTop: '15px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Volver atrás
                                </button>
                            </form>
                        </>
                    )}

                    {mensaje.texto && (
                        <p style={{ 
                            marginTop: '15px', 
                            color: mensaje.tipo === 'success' ? '#10b981' : '#ef4444',
                            fontWeight: 'bold'
                        }}>
                            {mensaje.texto}
                        </p>
                    )}
                </div>

                <button 
                    onClick={onVolver}
                    style={{ marginTop: '20px', color: 'white', background: 'rgba(0,0,0,0.5)', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}
                >
                    ⬅️ Volver al Login Principal
                </button>
            </div>
        </div>
    );
};