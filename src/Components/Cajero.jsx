import React, { useState, useEffect } from 'react';
import { Header } from './Layouts';
import api from '../api/axios';

// ==========================================
// 1. COMPONENTE APERTURA DE CAJA
// ==========================================
const AperturaCaja = ({ onAbrirCaja, userName, loading }) => {
    const [montoInicial, setMontoInicial] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!montoInicial || isNaN(montoInicial)) return alert("Ingresa un monto válido");
        onAbrirCaja(montoInicial);
    };

    return (
        <div className="apertura-caja-container animated-fade-in">
            <div className="apertura-caja-card">
                <div className="icon-container">
                    <i className="fas fa-cash-register" style={{fontSize: '2.5rem', color: '#9e1b32'}}></i>
                </div>
                <h2>APERTURA DE TURNO</h2>
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
                        {loading ? 'ABRIENDO...' : 'INICIAR TURNO'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// 2. POS INTERFACE (PUNTO DE VENTA) - MODIFICADO (Bs)
// ==========================================
const POSInterface = ({ products, onLogout, usuarioObj, onCerrarTurno }) => {
    const [pedidoActual, setPedidoActual] = useState([]);
    const [activeTab, setActiveTab] = useState('General');
    const [procesando, setProcesando] = useState(false);
    const [metodoPago, setMetodoPago] = useState('Efectivo');

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

    const registrarVenta = async (tipoPedido) => {
        if (pedidoActual.length === 0) return alert("Pedido vacío");
        setProcesando(true);

        const ventaDto = {
            Usuario: usuarioObj.usuario, 
            MetodoPago: metodoPago,
            TipoPedido: tipoPedido,
            Productos: pedidoActual.map(p => ({
                IdProducto: p.idProducto,
                Cantidad: p.cantidad
            }))
        };

        try {
            const res = await api.post('/Ventas/registrar', ventaDto);
            // CORRECCIÓN: Bs al final
            alert(`✅ ¡Venta Registrada!\nTicket: ${res.data.ticket}\nPago: ${metodoPago}\nTotal: ${res.data.total.toFixed(2)} Bs`);
            setPedidoActual([]); 
            setMetodoPago('Efectivo');
        } catch (error) {
            console.error(error);
            alert("❌ Error al registrar venta: " + (error.response?.data || error.message));
        } finally {
            setProcesando(false);
        }
    };

    const total = pedidoActual.reduce((sum, item) => sum + (item.cantidad * item.precio), 0).toFixed(2);
    const filteredProducts = products.filter(p => activeTab === 'General' || p.categoria === activeTab);

    const opcionesPago = ['Efectivo', 'Tarjeta', 'QR'];

    return (
        <div className="cajero-layout animated-fade-in">
            <button 
                onClick={onCerrarTurno}
                style={{
                    position: 'fixed', bottom: '20px', left: '20px', 
                    background: '#7f1d1d', color: 'white', border: 'none', 
                    padding: '12px 25px', borderRadius: '30px', fontWeight: 'bold', 
                    cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 100,
                    display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                <i className="fas fa-door-closed"></i> CERRAR TURNO
            </button>

            <section className="menu-section">
                <div className="menu-tabs">
                    {tabs.map(tab => (
                        <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="product-grid">
                    {filteredProducts.map(p => (
                        <div key={p.idProducto} className={`product-card ${!p.disponible ? 'agotado' : ''}`} onClick={() => p.disponible && agregarApedido(p)}>
                            <span>{p.nombreProducto}</span>
                            {/* CORRECCIÓN: Precio en la tarjeta */}
                            <div className="price">{p.precio.toFixed(2)} Bs</div>
                            {!p.disponible && <small style={{color:'red', fontWeight:'bold'}}>Agotado</small>}
                        </div>
                    ))}
                </div>
            </section>

            <section className="pedido-section">
                <div className="pedido-header">Ticket Actual</div>
                <div className="pedido-lista">
                    {pedidoActual.length === 0 ? (
                        <div style={{textAlign:'center', padding: '40px', color: '#9ca3af'}}>
                            <i className="fas fa-shopping-basket" style={{fontSize: '2rem', marginBottom:'10px'}}></i>
                            <p>Agrega productos...</p>
                        </div>
                    ) : (
                        pedidoActual.map((item) => (
                            <div key={item.idProducto} className="pedido-item">
                                <div className="pedido-item-info">
                                    <span className="pedido-item-name">{item.nombreProducto}</span>
                                    {/* CORRECCIÓN: Precio unitario */}
                                    <span className="pedido-item-price">{item.precio} Bs x {item.cantidad}</span>
                                </div>
                                <div className="pedido-actions">
                                    {/* CORRECCIÓN: Subtotal item */}
                                    <strong>{(item.cantidad * item.precio).toFixed(2)} Bs</strong>
                                    <span className="pedido-item-remove" onClick={() => removerDePedido(item.idProducto)}>×</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="pago-selector-container">
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '5px'}}>Método de Pago:</p>
                    <div className="pago-buttons">
                        {opcionesPago.map(opcion => (
                            <button
                                key={opcion}
                                className={`btn-pago ${metodoPago === opcion ? 'active' : ''}`}
                                onClick={() => setMetodoPago(opcion)}
                            >
                                {opcion === 'Efectivo' && <i className="fas fa-money-bill-wave"></i>}
                                {opcion === 'Tarjeta' && <i className="fas fa-credit-card"></i>}
                                {opcion === 'QR' && <i className="fas fa-qrcode"></i>}
                                <span>{opcion}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CORRECCIÓN: Total general */}
                <div className="total-display">Total: {total} Bs</div>
                
                <div className="action-buttons">
                    <button className="btn-registra" onClick={() => registrarVenta("Local")} disabled={procesando || pedidoActual.length === 0}>
                        <i className="fas fa-utensils"></i> COMER AQUÍ
                    </button>
                    <button className="btn-cocina" onClick={() => registrarVenta("Llevar")} disabled={procesando || pedidoActual.length === 0}>
                        <i className="fas fa-shopping-bag"></i> LLEVAR
                    </button>
                </div>
            </section>
        </div>
    );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (LÓGICA GENERAL)
// ==========================================
export const Cajero = ({ onLogout, user }) => {
    const [cajaAbierta, setCajaAbierta] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    
    // Al cargar, verificamos si ya hay caja abierta HOY
    useEffect(() => {
        verificarEstadoCaja();
    }, []);

    const verificarEstadoCaja = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Caja/estado');
            if (res.data.abierta) {
                setCajaAbierta(true);
                loadProductos();
            } else {
                setCajaAbierta(false);
            }
        } catch (error) {
            console.error("Error consultando caja", error);
            setCajaAbierta(false); // Por seguridad, asumimos cerrada si falla
        } finally {
            setLoading(false);
        }
    };

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
            await api.post('/Caja/abrir', {
                IdUsuario: user.idUsuario,
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

    // 🔥 NUEVA LÓGICA: CERRAR TURNO
    const handleCerrarTurno = async () => {
        if (!window.confirm("¿Seguro que deseas CERRAR EL TURNO? Se generará el corte de caja.")) return;

        setLoading(true);
        try {
            // Llamamos al backend para poner FechaCierre
            await api.post('/Caja/cerrar', {
                IdUsuario: user.idUsuario,
                MontoCierreCalculado: 0 // (Opcional) El backend debería calcular el real
            });
            alert("✅ Turno cerrado correctamente.");
            
            // Reseteamos estados para volver a la pantalla de apertura
            setCajaAbierta(false);
            setProducts([]);
        } catch (error) {
            console.error(error);
            alert("Error al cerrar turno: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="cajero-view" className="view">
            <Header title="SABOR VELOZ" role="CAJERO" userName={user.nombre} onLogout={onLogout} />
            
            {loading ? (
                <div style={{height: '80vh', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', color:'var(--primary)'}}>
                    <i className="fas fa-spinner fa-spin" style={{fontSize:'3rem', marginBottom:'20px'}}></i>
                    <h3>Cargando sistema...</h3>
                </div>
            ) : !cajaAbierta ? (
                <AperturaCaja onAbrirCaja={handleAbrirCaja} userName={user.nombre} loading={loading} /> 
            ) : (
                <POSInterface 
                    products={products} 
                    onLogout={onLogout} 
                    usuarioObj={user} 
                    onCerrarTurno={handleCerrarTurno} // Pasamos la función al hijo
                />
            )}
        </div>
    );
};