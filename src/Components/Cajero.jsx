import React, { useState, useEffect } from 'react';
import { Header } from './Layouts';
import api from '../api/axios';

// ==========================================
// 1. COMPONENTE APERTURA DE CAJA (SIN CAMBIOS)
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
// 2. POS INTERFACE (CORREGIDO SCROLL HORIZONTAL Y VERTICAL)
// ==========================================
const POSInterface = ({ products, usuarioObj, onCerrarTurno }) => {
    const [pedidoActual, setPedidoActual] = useState([]);
    const [activeTab, setActiveTab] = useState('Hamburguesas');
    const [procesando, setProcesando] = useState(false);
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [nombreCliente, setNombreCliente] = useState('');

    // Detectar móvil
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    // --- ESTILOS CORREGIDOS (AQUÍ ESTÁ LA SOLUCIÓN) ---
    const containerStyle = isMobile ? {
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 70px)', // Altura total menos el header
        overflow: 'hidden' // Evita scroll doble en la página entera
    } : {};

    const menuSectionStyle = isMobile ? {
        flex: 1, // Toma todo el espacio disponible
        overflowY: 'auto', // Permite scroll vertical SOLO en productos
        minHeight: '0', // <--- TRUCO IMPORTANTE para que flexbox permita el scroll
        padding: '10px', 
        background: '#f3f4f6'
    } : {}; 

    const pedidoSectionStyle = isMobile ? {
        height: 'auto', 
        flexShrink: 0, // <--- Evita que esta sección se aplaste
        borderTop: '3px solid #9e1b32', 
        background: 'white',
        display: 'flex', 
        flexDirection: 'column', 
        zIndex: 20,
        boxShadow: '0 -4px 15px rgba(0,0,0,0.2)'
    } : {};

    return (
        <div className="cajero-layout animated-fade-in" style={containerStyle}>
            
            {/* --- [SOLO MÓVIL] BARRA DE CERRAR TURNO (FIJA ARRIBA) --- */}
            {isMobile && (
                <div style={{
                    flexShrink: 0, // <--- No deja que se aplaste
                    background: '#2d3748', padding: '8px 15px', color: 'white', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 10
                }}>
                    <span style={{fontSize:'0.9rem', color:'#cbd5e0'}}>Turno: <b>{usuarioObj.usuario}</b></span>
                    <button onClick={onCerrarTurno} style={{
                        background: '#e53e3e', color: 'white', border: 'none', 
                        padding: '5px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                        <i className="fas fa-power-off"></i> CERRAR TURNO
                    </button>
                </div>
            )}

            {/* --- SECCIÓN 1: MENÚ DE PRODUCTOS (ARRIBA) --- */}
            <section className="menu-section" style={menuSectionStyle}>
                
                {/* Header del menú */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                     <h2 style={{color:'#9e1b32', margin:0}}>MENÚ</h2>
                     {!isMobile && ( 
                         <button onClick={onCerrarTurno} style={{background:'#333', color:'white', border:'none', padding:'8px 15px', borderRadius:'20px', fontSize:'0.8rem', cursor:'pointer'}}>
                            <i className="fas fa-lock"></i> Cerrar Turno
                        </button>
                     )}
                </div>

                {/* --- [CORRECCIÓN SCROLL HORIZONTAL] --- */}
                <div className="menu-tabs" style={isMobile ? {
                    display:'flex', 
                    gap:'10px', 
                    overflowX:'auto', // Habilita deslizar izquierda/derecha
                    whiteSpace: 'nowrap', // Obliga a que estén en una línea
                    paddingBottom:'10px',
                    WebkitOverflowScrolling: 'touch' // Suaviza el scroll en iPhone
                } : {}}>
                    {tabs.map(tab => (
                        <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}
                            style={isMobile ? { 
                                flexShrink: 0, // <--- ¡ESTO ES CLAVE! Evita que los botones se aplasten
                                padding: '10px 15px', 
                                whiteSpace: 'nowrap', 
                                borderRadius: '20px', 
                                background: activeTab===tab ? '#9e1b32':'white', 
                                color: activeTab===tab ? 'white':'#666', 
                                border: 'none',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            } : {}}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
                {/* Grid de Productos */}
                <div className="product-grid" style={isMobile ? {
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '10px', 
                    marginTop: '10px',
                    paddingBottom: '50px' // <--- Espacio extra abajo para poder ver el último producto
                } : {}}>
                    {getFilteredProducts().map(p => (
                        <div key={p.idProducto} className={`product-card ${!p.disponible ? 'agotado' : ''}`} onClick={() => p.disponible && agregarApedido(p)}
                            style={isMobile ? { 
                                minHeight: '120px', 
                                display:'flex', flexDirection:'column', justifyContent:'center' 
                            } : {}}
                        >
                            <span>{p.nombreProducto}</span>
                            <div className="price">{p.precio.toFixed(2)} Bs</div>
                            {!p.disponible && <small style={{color:'red', fontWeight:'bold'}}>Agotado</small>}
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECCIÓN 2: TICKET Y BOTONES (ABAJO) --- */}
            <section className="pedido-section" style={pedidoSectionStyle}>
                
                {/* Header Ticket (Compacto en móvil) */}
                <div style={{padding: '8px', background: '#fff', borderBottom: '1px solid #eee'}}>
                    {!isMobile && <div className="pedido-header">Ticket Actual</div>}
                    <input 
                        type="text" 
                        placeholder="Nombre del Cliente..." 
                        value={nombreCliente}
                        onChange={(e) => setNombreCliente(e.target.value)}
                        style={{
                            width: '100%', padding: '8px', borderRadius: '6px', 
                            border: '1px solid #ccc', fontSize: '1rem', background: '#f9f9f9'
                        }}
                    />
                </div>

                {/* Lista scrollable DENTRO del ticket */}
                <div className="pedido-lista" style={isMobile ? {
                    flex: 1, 
                    overflowY: 'auto', 
                    minHeight: '100px', // Altura mínima para ver items
                    maxHeight: '200px'  // Altura máxima para no tapar toda la pantalla
                } : {}}>
                    {pedidoActual.length === 0 ? (
                        <div style={{textAlign:'center', padding: '20px', color: '#9ca3af'}}>
                            <p>Selecciona productos...</p>
                        </div>
                    ) : (
                        pedidoActual.map((item) => (
                            <div key={item.idProducto} className="pedido-item" style={isMobile ? {padding: '8px', marginBottom: '5px'} : {}}>
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

                {/* Zona de Pagos y Botones (Siempre visible) */}
                <div className="pago-selector-container" style={{padding:'8px', background:'#f8f9fa', borderTop: '1px solid #ddd'}}>
                    <div className="pago-buttons" style={{display:'flex', gap:'5px', marginBottom: '8px'}}>
                        {opcionesPago.map(opcion => (
                            <button key={opcion} onClick={() => setMetodoPago(opcion)}
                                style={{
                                    flex:1, padding:'8px 5px', border:'1px solid #ddd', 
                                    borderRadius:'5px', background: metodoPago===opcion ? '#333':'white',
                                    color: metodoPago===opcion ? 'white':'#333', cursor:'pointer', fontWeight: metodoPago===opcion ? 'bold':'normal', fontSize: '0.9rem'
                                }}
                            >
                                {opcion}
                            </button>
                        ))}
                    </div>

                    <div className="total-display" style={isMobile ? {fontSize: '1.2rem', margin: '5px 0', textAlign: 'right', fontWeight:'bold', color: '#9e1b32'} : {}}>
                        Total: {total} Bs
                    </div>
                
                    <div className="action-buttons" style={{paddingTop:'5px', display:'flex', gap:'10px'}}>
                        <button className="btn-registra" style={{flex:1, padding: isMobile ? '12px' : '15px', background:'#9e1b32', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem'}} onClick={() => registrarVenta("Local")} disabled={procesando || pedidoActual.length === 0}>
                            COMER AQUÍ
                        </button>
                        <button className="btn-cocina" style={{flex:1, padding: isMobile ? '12px' : '15px', background:'#f59e0b', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem'}} onClick={() => registrarVenta("Llevar")} disabled={procesando || pedidoActual.length === 0}>
                            LLEVAR
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

// ==========================================
// 3. COMPONENTE PRINCIPAL (SIN CAMBIOS ESTRUCTURALES)
// ==========================================
export const Cajero = ({ onLogout, user }) => {
    const [cajaAbierta, setCajaAbierta] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    
    // Detectar móvil
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        verificarEstadoCaja();
    }, []);

    useEffect(() => {
        const protectWindow = (e) => {
            if (cajaAbierta) {
                e.preventDefault();
                e.returnValue = "Tienes un turno abierto.";
            }
        };
        window.addEventListener("beforeunload", protectWindow);
        return () => window.removeEventListener("beforeunload", protectWindow);
    }, [cajaAbierta]);

    const handleLogoutSeguro = () => {
        if (cajaAbierta) {
            alert("🛑 ¡ACCESO DENEGADO!\n\nNo puedes cerrar sesión mientras tengas el TURNO ABIERTO.\n\nPor favor, realiza el 'Cierre de Turno' primero.");
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
            } else {
                setCajaAbierta(false);
            }
        } catch (error) {
            console.error(error);
            setCajaAbierta(false); 
        } finally {
            setLoading(false);
        }
    };

    const loadProductos = async () => {
        try {
            const res = await api.get('/Productos/lista');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
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

    const handleCerrarTurno = async () => {
        if (!window.confirm("¿Seguro que deseas CERRAR EL TURNO?")) return;
        const montoInput = prompt("💰 Ingresa el MONTO TOTAL (Efectivo) en caja:", "0.00");
        if (montoInput === null) return;
        
        const montoFinal = parseFloat(montoInput);
        if (isNaN(montoFinal) || montoFinal < 0) return alert("❌ Monto inválido.");

        setLoading(true);
        try {
            await api.post('/Caja/cerrar', {
                IdUsuario: user.idUsuario,
                MontoCierreCalculado: montoFinal 
            });
            alert(`✅ Turno cerrado correctamente.`);
            window.location.reload(); 
        } catch (error) {
            alert("Error al cerrar: " + (error.response?.data?.message || error.message));
            setLoading(false);
        }
    };

    return (
        // Contenedor Principal: En móvil bloqueamos el scroll global para usar el interno
        <div id="cajero-view" className="view" style={{paddingTop:'70px', height: '100vh', overflow: isMobile ? 'hidden' : 'auto'}}>
            <Header title="SABOR VELOZ" role="CAJERO" userName={user.nombre} onLogout={handleLogoutSeguro} />
            
            {loading ? (
                <div style={{height: '80vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
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
        </div>
    );
};