// src/components/Cajero.jsx
import React, { useState, useEffect } from 'react';
import { Header } from './Layouts';

// Datos de simulación (Luego se obtendrán de tu API ASP.NET)
const initialProducts = [
    { nombre: "Hamburguesa", precio: 50.00, categoria: "platos" },
    { nombre: "Salchipapa", precio: 40.00, categoria: "platos" },
    { nombre: "Salchihamburguesa", precio: 60.00, categoria: "platos" },
    { nombre: "Pollo a la broaster", precio: 75.00, categoria: "platos" },
    { nombre: "Pipocas de Carne", precio: 35.00, categoria: "platos" },
    { nombre: "Pipocas de pollo", precio: 35.00, categoria: "platos" },
    { nombre: "Coca cola 500ml", precio: 10.00, categoria: "bebidas" },
    { nombre: "Agua Mineral", precio: 5.00, categoria: "bebidas" },
    { nombre: "Flan Casero", precio: 15.00, categoria: "postres" }
];

// Lógica de hora (para el Header)
const useCurrentTime = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit', second:'2-digit'}));
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit', second:'2-digit'}));
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return time;
};

export const Cajero = ({ onLogout, userName }) => {
    const [pedidoActual, setPedidoActual] = useState([]);
    const [activeTab, setActiveTab] = useState('general');
    const currentTime = useCurrentTime();

    const agregarApedido = (nombre) => {
        const existingItemIndex = pedidoActual.findIndex(item => item.nombre === nombre);
        const productoInfo = initialProducts.find(p => p.nombre === nombre);

        if (existingItemIndex > -1) {
            const updatedPedido = [...pedidoActual];
            updatedPedido[existingItemIndex].cantidad += 1;
            setPedidoActual(updatedPedido);
        } else {
            setPedidoActual([...pedidoActual, {
                nombre: nombre,
                cantidad: 1,
                precio: productoInfo.precio
            }]);
        }
    };
    
    const removerDePedido = (nombre) => {
        const itemIndex = pedidoActual.findIndex(p => p.nombre === nombre);
        if (itemIndex > -1) {
            const updatedPedido = [...pedidoActual];
            updatedPedido[itemIndex].cantidad -= 1;

            if (updatedPedido[itemIndex].cantidad <= 0) {
                updatedPedido.splice(itemIndex, 1);
            }
            setPedidoActual(updatedPedido);
        }
    };

    const calcularTotal = () => {
        const total = pedidoActual.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
        return total.toFixed(2).replace('.', ',');
    };

    const registrarVenta = () => {
        if (pedidoActual.length === 0) {
            alert("El pedido está vacío.");
            return;
        }
        // ** CONEXIÓN REAL: Aquí se enviaría la venta a tu API de ASP.NET **
        alert(`Venta registrada por un total de $${calcularTotal()}.`);
        setPedidoActual([]); 
    };

    const enviarACocina = () => {
        if (pedidoActual.length === 0) {
            alert("El pedido está vacío para enviar.");
            return;
        }
        // ** CONEXIÓN REAL: Aquí se enviaría el pedido a tu API/SignalR **
        alert(`Pedido enviado a la cocina. Total de ítems: ${pedidoActual.length}.`);
        setPedidoActual([]); 
    };

    const filteredProducts = initialProducts.filter(p => {
        if (activeTab === 'general') return true;
        return p.categoria === activeTab;
    });

    return (
        <div id="cajero-view" className="view active-view">
            <Header 
                title="SABOR VELOZ" 
                role="Cajero" 
                userName={userName} 
                onLogout={onLogout}
                extraContent={
                    <div className="user-info">
                        <span>Hora Actual: <strong id="horaActual">{currentTime}</strong></span>
                    </div>
                }
            />
            
            <div className="cajero-layout">
                <section className="menu-section">
                    {/* Barra de pestañas guinda/blanca */}
                    <div className="menu-tabs">
                        {['General', 'Platos', 'Bebidas', 'Postres'].map(tab => (
                            <button 
                                key={tab}
                                className={`tab-button ${activeTab === tab.toLowerCase() ? 'active' : ''}`} 
                                onClick={() => setActiveTab(tab.toLowerCase())}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="product-grid" id="productGrid">
                        {filteredProducts.map(p => (
                            <div 
                                key={p.nombre}
                                className="product-card" 
                                onClick={() => agregarApedido(p.nombre)}
                            >
                                <span>{p.nombre}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pedido-section">
                    <div className="pedido-header">Pedido actual</div>
                    <div className="pedido-lista" id="pedidoLista">
                        {pedidoActual.map((item, index) => (
                            <div key={index} className="pedido-item">
                                <span className="pedido-item-qty">{item.cantidad}x {item.nombre}</span>
                                <span>
                                    ${(item.cantidad * item.precio).toFixed(2).replace('.', ',')} 
                                    <span 
                                        className="pedido-item-remove" 
                                        onClick={() => removerDePedido(item.nombre)}
                                    >(x)</span>
                                </span>
                            </div>
                        ))}
                        {pedidoActual.length === 0 && <p style={{textAlign: 'center', color: '#999', paddingTop: '20px'}}>No hay ítems en el pedido.</p>}
                    </div>

                    <div className="pago-metodos">
                        <label><input type="radio" name="pago" value="Efectivo" defaultChecked /> Efectivo</label>
                        <label><input type="radio" name="pago" value="Tarjeta" /> Tarjeta</label>
                        <label><input type="radio" name="pago" value="Transferencia/QR" /> Transferencia/QR</label>
                    </div>
                    
                    <div className="total-display">Total: <span id="totalPedido">{calcularTotal()}</span></div>

                    <div className="action-buttons">
                        <button className="btn btn-registra" onClick={registrarVenta}>Registra venta</button>
                        <button className="btn btn-cocina" onClick={enviarACocina}>Enviar a cocina</button>
                    </div>
                </section>
            </div>
        </div>
    );
};