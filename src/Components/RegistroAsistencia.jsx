import React, { useState } from 'react';
import axios from '../api/axios'; // Asegúrate de que la ruta sea correcta

export const RegistroAsistencia = ({ onVolver }) => {
    const [datos, setDatos] = useState({ nombre: '', apellido: '' });
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const handleRegistro = async (tipo) => {
        if (!datos.nombre || !datos.apellido) {
            setMensaje({ texto: "Por favor completa nombre y apellido", tipo: "error" });
            return;
        }

        try {
            const endpoint = tipo === 'ingreso' ? '/api/asistencia/ingreso' : '/api/asistencia/salida';
            const res = await axios.post(endpoint, datos);
            setMensaje({ texto: res.data.mensaje, tipo: "success" });
            setDatos({ nombre: '', apellido: '' });
        } catch (err) {
            setMensaje({ texto: err.response?.data || "Error en el registro", tipo: "error" });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4]">
            {/* Logo Sabor Veloz */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-red-600">SABOR VELOZ</h1>
                <p className="text-gray-600 font-semibold italic">Registro de Personal</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-red-500 outline-none"
                        value={datos.nombre}
                        onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Apellido"
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-red-500 outline-none"
                        value={datos.apellido}
                        onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
                    />
                </div>

                {mensaje.texto && (
                    <div className={`mt-4 p-2 text-center rounded ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {mensaje.texto}
                    </div>
                )}

                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => handleRegistro('ingreso')}
                        className="flex-1 bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                        REGISTRAR INGRESO
                    </button>
                    <button
                        onClick={() => handleRegistro('salida')}
                        className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                        REGISTRAR SALIDA
                    </button>
                </div>
            </div>
            
            <button onClick={onVolver} className="mt-6 text-gray-500 hover:underline">
                Volver al Login
            </button>
        </div>
    );
};