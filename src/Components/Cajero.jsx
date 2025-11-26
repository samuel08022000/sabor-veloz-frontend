import React, { useState, useEffect } from 'react';
import { Header } from './Layouts';

// Datos de simulación
const initialProducts = [
    { id: 1, nombre: "Hamburguesa Clásica", precio: 50.00, categoria: "platos" },
    { id: 2, nombre: "Salchipapa Especial", precio: 40.00, categoria: "platos" },
    { id: 3, nombre: "Salchiburguer", precio: 60.00, categoria: "platos" },
    { id: 4, nombre: "Pollo Broaster", precio: 75.00, categoria: "platos" },
    { id: 5, nombre: "Pipocas de Carne", precio: 35.00, categoria: "platos" },
    { id: 6, nombre: "Coca Cola 500ml", precio: 10.00, categoria: "bebidas" },
    { id: 7, nombre: "Agua Mineral", precio: 5.00, categoria: "bebidas" },
    { id: 8, nombre: "Flan Casero", precio: 15.00, categoria: "postres" }
];

// Componente para Abrir Caja (Movido desde Admin)
const AperturaCaja = ({ onAbrirCaja, userName }) => {
    const [montoInicial, setMontoInicial] = useState('100.00');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAbrirCaja(montoInicial);
    };

    return (
        <div className="apertura-caja-container">
            <div className="apertura-caja-card">
                {/* 🔥 ENVUELVE EL ICONO EN ESTE DIV CLASS "icon-container" */}
                <div className="icon-container">
                    <i className="fas fa-cash-register" style={{fontSize: '2.5rem', color: '#9e1b32'}}></i>
                </div>
                {/* 🔥 FIN DEL CAMBIO */}

                <h2>APERTURA DE CAJA</h2>
                <form onSubmit={handleSubmit}>
                    <div className="caja-input-group">
                        <label>Cajero Responsable</label>
                        <input type="text" value={userName} readOnly style={{backgroundColor: '#f9fafb'}} />
                    </div>
                    <div className="caja-input-group">
                        <label>Monto Inicial (Efectivo)</label>
                        <input 
                            type="number" 
                            value={montoInicial} 
                            onChange={(e) => setMontoInicial(e.target.value)}
                            step="0.01"
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary">CONFIRMAR APERTURA</button>
                </form>
            </div>
        </div>
    );
};

// Componente del POS (Punto de Venta)
const POSInterface = ({ products, onLogout }) => {
    const [pedidoActual, setPedidoActual] = useState([]);
    const [activeTab, setActiveTab] = useState('general');

    const agregarApedido = (producto) => {
        const existingItemIndex = pedidoActual.findIndex(item => item.id === producto.id);

        if (existingItemIndex > -1) {
            const updatedPedido = [...pedidoActual];
            updatedPedido[existingItemIndex].cantidad += 1;
            setPedidoActual(updatedPedido);
        } else {
            setPedidoActual([...pedidoActual, { ...producto, cantidad: 1 }]);
        }
    };
    
    const removerDePedido = (id) => {
        const itemIndex = pedidoActual.findIndex(p => p.id === id);
        if (itemIndex > -1) {
            const updatedPedido = [...pedidoActual];
            updatedPedido[itemIndex].cantidad -= 1;
            if (updatedPedido[itemIndex].cantidad <= 0) updatedPedido.splice(itemIndex, 1);
            setPedidoActual(updatedPedido);
        }
    };

    const calcularTotal = () => pedidoActual.reduce((sum, item) => sum + (item.cantidad * item.precio), 0).toFixed(2);

    const filteredProducts = products.filter(p => activeTab === 'general' || p.categoria === activeTab);

    return (
        <div className="cajero-layout">
            <section className="menu-section">
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
                
                <div className="product-grid">
                    {filteredProducts.map(p => (
                        <div key={p.id} className="product-card" onClick={() => agregarApedido(p)}>
                            <span>{p.nombre}</span>
                            <div className="price">${p.precio.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="pedido-section">
                <div className="pedido-header">Ticket Actual</div>
                <div className="pedido-lista">
                    {pedidoActual.length === 0 ? (
                        <p style={{textAlign: 'center', color: '#9ca3af', marginTop: '50px'}}>Seleccione productos...</p>
                    ) : (
                        pedidoActual.map((item) => (
                            <div key={item.id} className="pedido-item">
                                <div className="pedido-item-info">
                                    <span className="pedido-item-name">{item.nombre}</span>
                                    <span className="pedido-item-price">${item.precio} x {item.cantidad}</span>
                                </div>
                                <div className="pedido-actions">
                                    <strong>${(item.cantidad * item.precio).toFixed(2)}</strong>
                                    <span className="pedido-item-remove" onClick={() => removerDePedido(item.id)}>×</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="total-display">
                    Total: ${calcularTotal()}
                </div>

                <div className="action-buttons">
                    <button className="btn-registra" onClick={() => alert("Venta Registrada")}>COBRAR</button>
                    <button className="btn-cocina" onClick={() => alert("Enviado a Cocina")}>A COCINA</button>
                </div>
            </section>
        </div>
    );
};

export const Cajero = ({ onLogout, userName }) => {
    const [cajaAbierta, setCajaAbierta] = useState(false); // Estado para controlar si la caja se abrió
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAbrirCaja = (monto) => {
        // AQUÍ CONECTARÁS CON TU BACKEND PARA REGISTRAR LA APERTURA
        console.log(`Caja abierta con monto: ${monto}`);
        setCajaAbierta(true);
    };

    return (
        <div id="cajero-view" className="view">
            <Header 
                title="SABOR VELOZ" 
                role="CAJERO" 
                userName={userName} 
                onLogout={onLogout}
                extraContent={<span style={{color: 'white', fontWeight: 'bold'}}>{currentTime}</span>}
            />
            
            {/* RENDERIZADO CONDICIONAL: ¿Caja Abierta? */}
            {!cajaAbierta ? (
                <AperturaCaja onAbrirCaja={handleAbrirCaja} userName={userName} />
            ) : (
                <POSInterface products={initialProducts} onLogout={onLogout} />
            )}
        </div>
    );
};