import React, { useState, useEffect } from 'react';
import { Header } from './Layouts';
import api from '../api/axios';

// Componente Apertura
const AperturaCaja = ({ onAbrirCaja, userName, loading }) => {
    const [montoInicial, setMontoInicial] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!montoInicial || isNaN(montoInicial)) return alert("Monto inválido");
        onAbrirCaja(montoInicial);
    };
    return (
        <div className="apertura-caja-container animated-fade-in">
            <div className="apertura-caja-card">
                <i className="fas fa-cash-register" style={{fontSize: '3rem', color: '#9e1b32', marginBottom:'20px'}}></i>
                <h2>APERTURA</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{margin:'15px 0', textAlign:'left'}}>
                        <label style={{fontWeight:'bold'}}>Monto Inicial</label>
                        <input type="number" value={montoInicial} onChange={(e) => setMontoInicial(e.target.value)} placeholder="0.00" required style={{width:'100%', padding:'10px', fontSize:'1.2rem', border:'1px solid #9e1b32', borderRadius:'5px'}} />
                    </div>
                    <button type="submit" style={{width:'100%', padding:'15px', background:'#9e1b32', color:'white', border:'none', borderRadius:'5px', fontSize:'1.1rem'}} disabled={loading}>
                        {loading ? 'ABRIENDO...' : 'INICIAR'}
                    </button>
                </form>
            </div>
        </div>
    );
};

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
            if (activeTab === 'Bebidas') return catDB === 'bebidas' || nombre.includes('coca') || nombre.includes('jugo');
            if (activeTab === 'Otros') {
                return !nombre.includes('hamburguesa') && !nombre.includes('pollo') && !nombre.includes('pipoca') && !nombre.includes('salchipapa') && !catDB.includes('bebidas');
            }
            return true;
        });
    };

    const agregarApedido = (producto) => {
        const index = pedidoActual.findIndex(item => item.idProducto === producto.idProducto);
        if (index > -1) {
            const copy = [...pedidoActual];
            copy[index].cantidad += 1;
            setPedidoActual(copy);
        } else {
            setPedidoActual([...pedidoActual, { ...producto, cantidad: 1 }]);
        }
    };
    
    const removerDePedido = (id) => {
        const index = pedidoActual.findIndex(p => p.idProducto === id);
        if (index > -1) {
            const copy = [...pedidoActual];
            copy[index].cantidad -= 1;
            if (copy[index].cantidad <= 0) copy.splice(index, 1);
            setPedidoActual(copy);
        }
    };

    const registrarVenta = async (tipoPedido) => {
        if (pedidoActual.length === 0) return alert("Pedido vacío");
        setProcesando(true);
        try {
            const res = await api.post('/Ventas/registrar', {
                Usuario: usuarioObj.usuario, 
                MetodoPago: metodoPago,
                TipoPedido: tipoPedido,
                NombreCliente: nombreCliente,
                Productos: pedidoActual.map(p => ({ IdProducto: p.idProducto, Cantidad: p.cantidad }))
            });
            alert(`✅ Venta OK!\nTicket: ${res.data.ticket}`);
            setPedidoActual([]); setNombreCliente('');
        } catch (error) {
            alert("Error: " + (error.response?.data || error.message));
        } finally {
            setProcesando(false);
        }
    };

    const total = pedidoActual.reduce((sum, item) => sum + (item.cantidad * item.precio), 0).toFixed(2);

    return (
        <div className="cajero-layout animated-fade-in">
            {/* ZONA 1: PRODUCTOS (SCROLL) */}
            <section className="menu-section">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                     <h2 style={{color:'#9e1b32', margin:0, fontSize:'1.2rem'}}>MENÚ</h2>
                     <button onClick={onCerrarTurno} style={{background:'#333', color:'white', border:'none', padding:'5px 10px', borderRadius:'15px', fontSize:'0.75rem'}}>
                        <i className="fas fa-lock"></i> Cerrar
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
                    {getFilteredProducts().map(p => (
                        <div key={p.idProducto} className={`product-card ${!p.disponible ? 'agotado' : ''}`} onClick={() => p.disponible && agregarApedido(p)}>
                            <span>{p.nombreProducto}</span>
                            <div className="price">{p.precio.toFixed(2)} Bs</div>
                            {!p.disponible && <small style={{color:'red'}}>Agotado</small>}
                        </div>
                    ))}
                </div>
            </section>

            {/* ZONA 2: TICKET FIJO ABAJO */}
            <section className="pedido-section">
                {/* 1. Título "Ticket Actual" Restaurado */}
                <div className="pedido-header">Ticket Actual</div>

                <div style={{padding:'5px 10px'}}>
                    <input type="text" placeholder="Cliente..." value={nombreCliente} onChange={(e)=>setNombreCliente(e.target.value)} 
                        style={{width:'100%', padding:'8px', borderRadius:'5px', border:'1px solid #ccc', marginTop:'5px'}} />
                </div>

                <div className="pedido-lista">
                    {pedidoActual.length === 0 ? <p style={{textAlign:'center', color:'#ccc', fontSize:'0.9rem', padding:'10px'}}>Sin productos</p> : 
                        pedidoActual.map(item => (
                            <div key={item.idProducto} className="pedido-item">
                                <div>
                                    <span style={{fontWeight:'bold'}}>{item.nombreProducto}</span>
                                    <div style={{fontSize:'0.8rem', color:'#666'}}>{item.cantidad} x {item.precio} Bs</div>
                                </div>
                                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                    <strong>{(item.cantidad * item.precio).toFixed(2)}</strong>
                                    <button onClick={()=>removerDePedido(item.idProducto)} style={{background:'#fee2e2', color:'red', border:'none', borderRadius:'50%', width:'22px', height:'22px'}}>×</button>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="pago-selector-container" style={{padding:'5px 10px'}}>
                    <div className="pago-buttons" style={{display:'flex', gap:'5px'}}>
                        {['Efectivo', 'Tarjeta', 'QR'].map(op => (
                            <button key={op} onClick={()=>setMetodoPago(op)} 
                                style={{flex:1, borderRadius:'5px', border:'1px solid #ddd', background: metodoPago===op ? '#333':'#fff', color: metodoPago===op ? '#fff':'#333'}}>
                                {op}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Total GRANDE y en su lugar original */}
                <div className="total-display">
                    Total: {total} Bs
                </div>

                <div className="action-buttons">
                    <button className="btn-registra" onClick={()=>registrarVenta('Local')} disabled={procesando}>AQUÍ</button>
                    <button className="btn-cocina" onClick={()=>registrarVenta('Llevar')} disabled={procesando}>LLEVAR</button>
                </div>
            </section>
        </div>
    );
};

export const Cajero = ({ onLogout, user }) => {
    const [cajaAbierta, setCajaAbierta] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    
    useEffect(() => { verificarEstadoCaja(); }, []);

    const verificarEstadoCaja = async () => {
        setLoading(true);
        try {
            const res = await api.get('/Caja/estado');
            if (res.data.abierta) {
                setCajaAbierta(true);
                const pRes = await api.get('/Productos/lista');
                setProducts(pRes.data);
            } else setCajaAbierta(false);
        } catch (error) { setCajaAbierta(false); } 
        finally { setLoading(false); }
    };

    const handleAbrirCaja = async (monto) => {
        setLoading(true);
        try {
            await api.post('/Caja/abrir', { IdUsuario: user.idUsuario, MontoInicial: parseFloat(monto) });
            setCajaAbierta(true); verificarEstadoCaja();
        } catch (error) { alert("Error: " + error.message); setLoading(false); }
    };

    const handleCerrarTurno = async () => {
        if (!window.confirm("¿Cerrar turno?")) return;
        const monto = prompt("Monto final en caja:");
        if (!monto) return;
        try {
            await api.post('/Caja/cerrar', { IdUsuario: user.idUsuario, MontoCierreCalculado: parseFloat(monto) });
            alert("Cerrado"); window.location.reload(); 
        } catch (error) { alert("Error: " + error.message); }
    };

    const handleLogoutSeguro = () => {
        if (cajaAbierta) return alert("Cierra turno primero");
        onLogout();
    };

    return (
        <div id="cajero-view" className="view">
            <Header title="SABOR VELOZ" role="CAJERO" userName={user.nombre} onLogout={handleLogoutSeguro} />
            {loading ? <p style={{textAlign:'center', marginTop:'50px'}}>Cargando...</p> : 
                !cajaAbierta ? <AperturaCaja onAbrirCaja={handleAbrirCaja} userName={user.nombre} loading={loading} /> : 
                <POSInterface products={products} usuarioObj={user} onCerrarTurno={handleCerrarTurno} />
            }
        </div>
    );
};