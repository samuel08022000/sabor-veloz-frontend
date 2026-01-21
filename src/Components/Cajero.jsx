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
                    <i className="fas fa-cash-register" style={{fontSize: '3rem', color: '#9e1b32', marginBottom:'20px'}}></i>
                </div>
                <h2 style={{color:'#333', marginBottom:'10px'}}>APERTURA DE TURNO</h2>
                <p style={{color:'#666', marginBottom:'20px'}}>Debes abrir caja para comenzar a vender.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="caja-input-group" style={{textAlign:'left', marginBottom:'15px'}}>
                        <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Cajero Responsable</label>
                        <input type="text" value={userName} readOnly style={{width:'100%', padding:'10px', background:'#eee', border:'1px solid #ccc', borderRadius:'5px'}} />
                    </div>
                    <div className="caja-input-group" style={{textAlign:'left', marginBottom:'20px'}}>
                        <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Monto Inicial (Efectivo)</label>
                        <input 
                            type="number" 
                            value={montoInicial} 
                            onChange={(e) => setMontoInicial(e.target.value)}
                            step="0.01"
                            placeholder="0.00 Bs"
                            required 
                            style={{width:'100%', padding:'10px', fontSize:'1.2rem', border:'1px solid #9e1b32', borderRadius:'5px'}}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%', padding:'15px', fontSize:'1.1rem'}}>
                        {loading ? 'ABRIENDO...' : 'INICIAR TURNO'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// 2. POS INTERFACE (SIN ESTILOS INLINE CONFLICTIVOS)
// ==========================================
const POSInterface = ({ products, usuarioObj, onCerrarTurno }) => {
    const [pedidoActual, setPedidoActual] = useState([]);
    const [activeTab, setActiveTab] = useState('Hamburguesas');
    const [procesando, setProcesando] = useState(false);
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [nombreCliente, setNombreCliente] = useState('');

    const tabs = ['Hamburguesas', 'Pollos', 'Pipocas', 'Salchipapas', 'Bebidas', 'Otros'];

    const getFilteredProducts = () => {
        return products.filter(p => {
            const nombre = p.nombreProducto.toLowerCase();
            const catDB = p.categoria.toLowerCase();

            if (activeTab === 'Hamburguesas') return nombre.includes('hamburguesa') || catDB.includes('hamburguesa');
            if (activeTab === 'Pollos') return nombre.includes('pollo') || nombre.includes('broaster') || catDB.includes('pollo');
            if (activeTab === 'Pipocas') return nombre.includes('pipoca');
            if (activeTab === 'Salchipapas') return nombre.includes('salchipapa');
            if (activeTab === 'Bebidas') return catDB === 'bebidas' || nombre.includes('coca') || nombre.includes('fanta') || nombre.includes('jugo');
            
            if (activeTab === 'Otros') {
                const esHamburguesa = nombre.includes('hamburguesa') || catDB.includes('hamburguesa');
                const esPollo = nombre.includes('pollo') || nombre.includes('broaster');
                const esPipoca = nombre.includes('pipoca');
                const esSalchi = nombre.includes('salchipapa');
                const esBebida = catDB === 'bebidas' || nombre.includes('coca');
                return !esHamburguesa && !esPollo && !esPipoca && !esSalchi && !esBebida;
            }
            return true;
        });
    };

    const filteredProducts = getFilteredProducts();

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
            NombreCliente: nombreCliente,
            Productos: pedidoActual.map(p => ({
                IdProducto: p.idProducto,
                Cantidad: p.cantidad
            }))
        };

        try {
            const res = await api.post('/Ventas/registrar', ventaDto);
            alert(`✅ ¡Venta Registrada!\nTicket: ${res.data.ticket}\nTotal: ${res.data.total.toFixed(2)} Bs`);
            setPedidoActual([]); 
            setMetodoPago('Efectivo');
            setNombreCliente('');
        } catch (error) {
            console.error(error);
            alert("❌ Error: " + (error.response?.data || error.message));
        } finally {
            setProcesando(false);
        }
    };

    const total = pedidoActual.reduce((sum, item) => sum + (item.cantidad * item.precio), 0).toFixed(2);
    const opcionesPago = ['Efectivo', 'Tarjeta', 'QR'];

    return (
        <div className="cajero-layout animated-fade-in">
            {/* SECCIÓN MENÚ */}
            <section className="menu-section">
                <div className="menu-header-mobile" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                     <h2 style={{color:'#9e1b32', margin:0}}>MENÚ</h2>
                     <button onClick={onCerrarTurno} style={{background:'#333', color:'white', border:'none', padding:'8px 15px', borderRadius:'20px', fontSize:'0.8rem', cursor:'pointer'}}>
                        <i className="fas fa-lock"></i> Cerrar Turno
                    </button>
                </div>

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
                            <span style={{display:'block', lineHeight:'1.2', marginBottom:'5px'}}>{p.nombreProducto}</span>
                            <div className="price">{p.precio.toFixed(2)} Bs</div>
                            {!p.disponible && <small style={{color:'red', fontWeight:'bold'}}>Agotado</small>}
                        </div>
                    ))}
                </div>
            </section>

            {/* SECCIÓN TICKET */}
            <section className="pedido-section">
                <div className="pedido-header">
                    <span>Pedido Actual</span>
                    <span style={{fontSize:'0.9rem'}}>Items: {pedidoActual.reduce((acc, item) => acc + item.cantidad, 0)}</span>
                </div>

                <div style={{padding: '10px', background: '#fff', borderBottom: '1px solid #eee'}}>
                    <input 
                        type="text" 
                        placeholder="Nombre del Cliente..." 
                        value={nombreCliente}
                        onChange={(e) => setNombreCliente(e.target.value)}
                        style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', background: '#f9f9f9'}}
                    />
                </div>

                <div className="pedido-lista">
                    {pedidoActual.length === 0 ? (
                        <div style={{textAlign:'center', padding: '40px', color: '#9ca3af'}}>
                            <p>Selecciona productos...</p>
                        </div>
                    ) : (
                        pedidoActual.map((item) => (
                            <div key={item.idProducto} className="pedido-item">
                                <div className="pedido-item-info">
                                    <span className="pedido-item-name">{item.nombreProducto}</span>
                                    <small>{item.precio} x {item.cantidad}</small>
                                </div>
                                <div className="pedido-actions" style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                    <strong>{(item.cantidad * item.precio).toFixed(2)}</strong>
                                    <button onClick={() => removerDePedido(item.idProducto)} style={{background:'#fee2e2', color:'#ef4444', border:'none', borderRadius:'50%', width:'25px', height:'25px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>×</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="pago-selector-container" style={{padding:'10px', background:'#f8f9fa'}}>
                    <div className="pago-buttons" style={{display:'flex', gap:'5px'}}>
                        {opcionesPago.map(opcion => (
                            <button
                                key={opcion}
                                onClick={() => setMetodoPago(opcion)}
                                style={{
                                    flex:1, padding:'8px', border:'1px solid #ddd', 
                                    borderRadius:'5px', background: metodoPago===opcion ? '#333':'white',
                                    color: metodoPago===opcion ? 'white':'#333', cursor:'pointer',
                                    fontWeight: metodoPago===opcion ? 'bold':'normal'
                                }}
                            >
                                {opcion}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="total-display">
                    Total: {total} Bs
                </div>
                
                <div className="action-buttons">
                    <button className="btn-registra" style={{background:'#9e1b32'}} onClick={() => registrarVenta("Local")} disabled={procesando || pedidoActual.length === 0}>
                        COMER AQUÍ
                    </button>
                    <button className="btn-cocina" style={{background:'#f59e0b'}} onClick={() => registrarVenta("Llevar")} disabled={procesando || pedidoActual.length === 0}>
                        LLEVAR
                    </button>
                </div>
            </section>
            
            {/* 🔥 ESTE DIV ES EL SALVAVIDAS PARA EL SCROLL EN MÓVIL 🔥 */}
            <div className="mobile-spacer"></div>
        </div>
    );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (SIN ESTILOS INLINE EN EL WRAPPER)
// ==========================================
export const Cajero = ({ onLogout, user }) => {
    const [cajaAbierta, setCajaAbierta] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    
    useEffect(() => { verificarEstadoCaja(); }, []);

    // Seguridad
    useEffect(() => {
        const protectWindow = (e) => {
            if (cajaAbierta) { e.preventDefault(); e.returnValue = "Turno abierto"; }
        };
        window.addEventListener("beforeunload", protectWindow);
        return () => window.removeEventListener("beforeunload", protectWindow);
    }, [cajaAbierta]);

    const handleLogoutSeguro = () => {
        if (cajaAbierta) {
            alert("🛑 ¡ACCESO DENEGADO!\nCierra el turno primero.");
            return;
        }
        onLogout();
    };

    const verificarEstadoCaja = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Caja/estado');
            if (res.data.abierta) {
                setCajaAbierta(true);
                loadProductos();
            } else setCajaAbierta(false);
        } catch (error) { setCajaAbierta(false); } 
        finally { setLoading(false); }
    };

    const loadProductos = async () => {
        try {
            const res = await api.get('/Productos/lista');
            setProducts(res.data);
        } catch (error) { console.error(error); }
    };

    const handleAbrirCaja = async (monto) => {
        setLoading(true);
        try {
            await api.post('/Caja/abrir', { IdUsuario: user.idUsuario, MontoInicial: parseFloat(monto) });
            setCajaAbierta(true); loadProductos();
        } catch (error) { alert("Error: " + error.message); } 
        finally { setLoading(false); }
    };

    const handleCerrarTurno = async () => {
        if (!window.confirm("¿Cerrar turno?")) return;
        const monto = prompt("Monto final en caja:");
        if (!monto) return;
        setLoading(true);
        try {
            await api.post('/Caja/cerrar', { IdUsuario: user.idUsuario, MontoCierreCalculado: parseFloat(monto) });
            alert("Turno cerrado.");
            window.location.reload(); 
        } catch (error) { alert("Error: " + error.message); setLoading(false); }
    };

    return (
        // Quitamos estilos inline para dejar que el CSS controle el scroll
        <div id="cajero-view" className="view">
            <Header title="SABOR VELOZ" role="CAJERO" userName={user.nombre} onLogout={handleLogoutSeguro} />
            
            {loading ? (
                <div style={{height: '80vh', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                    <i className="fas fa-spinner fa-spin" style={{fontSize:'3rem', color:'#9e1b32'}}></i>
                </div>
            ) : !cajaAbierta ? (
                <AperturaCaja onAbrirCaja={handleAbrirCaja} userName={user.nombre} loading={loading} /> 
            ) : (
                <POSInterface 
                    products={products} 
                    usuarioObj={user} 
                    onCerrarTurno={handleCerrarTurno} 
                />
            )}
            
            {/* Este div vacío empuja el final de la página hacia abajo en móviles */}
            <div className="mobile-footer-spacer" style={{height: '50px', width:'100%', clear:'both'}}></div>
        </div>
    );
};