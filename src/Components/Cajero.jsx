import React, { useState, useEffect } from 'react';
import { Header } from './Layouts';
import api from '../api/axios';

// Componente Apertura de Caja
const AperturaCaja = ({ onAbrirCaja, userName, loading }) => {
    const [montoInicial, setMontoInicial] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAbrirCaja(montoInicial);
    };

    return (
        <div className="apertura-caja-container">
            <div className="apertura-caja-card">
                <div className="icon-container">
                    <i className="fas fa-cash-register" style={{fontSize: '2.5rem', color: '#9e1b32'}}></i>
                </div>
                <h2>APERTURA DE CAJA</h2>
                <form onSubmit={handleSubmit}>
                    <div className="caja-input-group">
                        <label>Cajero Responsable</label>
                        <input type="text" value={userName} readOnly />
                    </div>
                    <div className="caja-input-group">
                        <label>Monto Inicial (Efectivo)</label>
                        <input 
                            type="number" 
                            value={montoInicial} 
                            onChange={(e) => setMontoInicial(e.target.value)}
                            step="0.01"
                            placeholder="0.00"
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'ABRIENDO...' : 'CONFIRMAR APERTURA'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// POS Interface
const POSInterface = ({ products, onLogout, usuarioObj }) => {
    const [pedidoActual, setPedidoActual] = useState([]);
    const [activeTab, setActiveTab] = useState('General');
    const [procesando, setProcesando] = useState(false);

    // Mapeo de categorías del backend a las pestañas del frontend
    const categoriasBackend = [...new Set(products.map(p => p.categoria))];
    const tabs = ['General', ...categoriasBackend];

    const agregarApedido = (producto) => {
        const existingItemIndex = pedidoActual.findIndex(item => item.idProducto === producto.idProducto);
        if (existingItemIndex > -1) {
            const updatedPedido = [...pedidoActual];
            updatedPedido[existingItemIndex].cantidad += 1;
            setPedidoActual(updatedPedido);
        } else {
            setPedidoActual([...pedidoActual, { ...producto, cantidad: 1 }]);
        }
    };
    
    const removerDePedido = (id) => {
        const itemIndex = pedidoActual.findIndex(p => p.idProducto === id);
        if (itemIndex > -1) {
            const updatedPedido = [...pedidoActual];
            updatedPedido[itemIndex].cantidad -= 1;
            if (updatedPedido[itemIndex].cantidad <= 0) updatedPedido.splice(itemIndex, 1);
            setPedidoActual(updatedPedido);
        }
    };

    const registrarVenta = async (tipoPedido) => { // "Local" o "Llevar"
        if (pedidoActual.length === 0) return alert("Pedido vacío");
        setProcesando(true);

        // Armar el DTO exacto que espera VentasController
        const ventaDto = {
            Usuario: usuarioObj.usuario, // string username
            MetodoPago: "Efectivo", // Por ahora hardcodeado, puedes agregar selector
            TipoPedido: tipoPedido,
            Productos: pedidoActual.map(p => ({
                IdProducto: p.idProducto,
                Cantidad: p.cantidad
            }))
        };

        try {
            const res = await api.post('/Ventas/registrar', ventaDto);
            alert(`✅ ¡Venta Registrada!\nTicket: ${res.data.ticket}\nTotal: $${res.data.total}`);
            setPedidoActual([]);
        } catch (error) {
            console.error(error);
            alert("❌ Error al registrar venta: " + (error.response?.data || error.message));
        } finally {
            setProcesando(false);
        }
    };

    const total = pedidoActual.reduce((sum, item) => sum + (item.cantidad * item.precio), 0).toFixed(2);
    const filteredProducts = products.filter(p => activeTab === 'General' || p.categoria === activeTab);

    return (
        <div className="cajero-layout">
            <section className="menu-section">
                <div className="menu-tabs">
                    {tabs.map(tab => (
                        <button 
                            key={tab} 
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`} 
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="product-grid">
                    {filteredProducts.map(p => (
                        <div key={p.idProducto} className="product-card" onClick={() => agregarApedido(p)}>
                            <span>{p.nombreProducto}</span>
                            <div className="price">${p.precio.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="pedido-section">
                <div className="pedido-header">Ticket Actual</div>
                <div className="pedido-lista">
                    {pedidoActual.map((item) => (
                        <div key={item.idProducto} className="pedido-item">
                            <div className="pedido-item-info">
                                <span className="pedido-item-name">{item.nombreProducto}</span>
                                <span className="pedido-item-price">${item.precio} x {item.cantidad}</span>
                            </div>
                            <div className="pedido-actions">
                                <strong>${(item.cantidad * item.precio).toFixed(2)}</strong>
                                <span className="pedido-item-remove" onClick={() => removerDePedido(item.idProducto)}>×</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="total-display">Total: ${total}</div>
                <div className="action-buttons">
                    <button className="btn-registra" onClick={() => registrarVenta("Local")} disabled={procesando}>
                        <i className="fas fa-utensils"></i> COMER AQUÍ
                    </button>
                    <button className="btn-cocina" onClick={() => registrarVenta("Llevar")} disabled={procesando}>
                        <i className="fas fa-shopping-bag"></i> LLEVAR
                    </button>
                </div>
            </section>
        </div>
    );
};

export const Cajero = ({ onLogout, user }) => {
    const [cajaAbierta, setCajaAbierta] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    
    // 1. Verificar estado de caja al cargar
    useEffect(() => {
        const fetchEstado = async () => {
            try {
                const res = await api.get('/Caja/estado');
                if (res.data.abierta) {
                    setCajaAbierta(true);
                    loadProductos();
                }
            } catch (error) {
                console.error("Error consultando caja", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEstado();
    }, []);

    const loadProductos = async () => {
        try {
            const res = await api.get('/Productos/lista');
            setProducts(res.data);
        } catch (error) {
            console.error("Error cargando productos", error);
        }
    };

    const handleAbrirCaja = async (monto) => {
        setLoading(true);
        try {
            // El backend espera CajaDTO: { IdUsuario, MontoInicial }
            await api.post('/Caja/abrir', {
                IdUsuario: user.idUsuario, // Usamos el ID del usuario logueado
                MontoInicial: parseFloat(monto)
            });
            setCajaAbierta(true);
            loadProductos();
        } catch (error) {
            alert("Error al abrir caja: " + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="cajero-view" className="view">
            <Header title="SABOR VELOZ" role="CAJERO" userName={user.nombre} onLogout={onLogout} />
            {loading ? <div style={{padding: 40, textAlign: 'center'}}>Cargando sistema...</div> : 
             !cajaAbierta ? <AperturaCaja onAbrirCaja={handleAbrirCaja} userName={user.nombre} loading={loading} /> 
             : <POSInterface products={products} onLogout={onLogout} usuarioObj={user} />
            }
        </div>
    );
};