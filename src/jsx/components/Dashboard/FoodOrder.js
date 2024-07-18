import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../../../store/store/useStore';
import { closeRegister } from '../../../services/functions';

const FoodOrder = () => {
    const { orders, fetchOrders } = useStore();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCloseRegister = async () => {
        await closeRegister();
        fetchOrders();
        alert("Caja cerrada y órdenes reseteadas.");
    };

    const isToday = (someDate) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear();
    };

    const todayOrders = orders.filter(order => isToday(new Date(order.date)));

    return (
        <>
            <div className="row">
                <div className="col-xl-12 col-xxl-12">
                    <button onClick={handleCloseRegister} className="btn btn-primary mb-4">
                        Cerrar Caja
                    </button>
                    <div className="row">
                        {todayOrders.map((order, index) => (
                            <div className="col-xl-4 col-sm-6 sp15" key={index}>
                                <div className="card h-auto b-hover">
                                    <div className="card-body px-3">
                                        <div className="text-center">
                                            <h4>Order #{order.orderId}</h4>
                                            <p>{new Date(order.date).toLocaleString()}</p>
                                            <p>Método de Pago: {order.paymentMethod}</p>
                                        </div>
                                        <hr />
                                        <div className="order-menu">
                                            <h6 className="font-w600">Pedido</h6>
                                            {order.items.map((item, idx) => (
                                                <div className="d-flex align-items-center mb-2" key={idx}>
                                                    <div className="order-items">
                                                        <h6 className="font-w500 text-nowrap mb-0">{item.name}</h6>
                                                        <p className="mb-0">Cantidad: <strong>x{item.number}</strong></p>
                                                        <p className="mb-0">Precio Unitario: <strong>${item.price.toFixed(2)}</strong></p>
                                                        <p className="mb-0">Precio Total: <strong>${(item.price * item.number).toFixed(2)}</strong></p>
                                                        {item.extras.length > 0 && (
                                                            <div>
                                                                <p className="mb-0">Adicionales:</p>
                                                                <ul style={{ paddingLeft: '20px', margin: '2px 0' }}>
                                                                    {item.extras.map((extra, extraIdx) => (
                                                                        <li key={extraIdx}>{extra} - $500</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <hr />
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h4 className="mb-0">Subtotal</h4>
                                                <h4 className="mb-0 text-primary">${order.subtotal.toFixed(2)}</h4>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h4 className="mb-0">Adicionales Totales</h4>
                                                <h4 className="mb-0 text-primary">${order.extrasTotal.toFixed(2)}</h4>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h4 className="mb-0">Descuento</h4>
                                                <h4 className="mb-0 text-primary">-${order.discount.toFixed(2)}</h4>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h4 className="mb-0">Total</h4>
                                                <h4 className="mb-0 text-primary">${order.total.toFixed(2)}</h4>
                                            </div>
                                            <Link to={"#"} className={`btn btn-block btn-outline-${order.btnTheme}`}>{order.status}</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default FoodOrder;
