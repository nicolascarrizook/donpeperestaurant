import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../../../store/store/useStore';

const FoodOrder = () => {
    const { orders, fetchOrders } = useStore();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <>
            <div className="row">
                <div className="col-xl-12 col-xxl-12">
                    <div className="row">
                        {orders.map((order, index) => (
                            <div className="col-xl-4 col-sm-6 sp15" key={index}>
                                <div className="card h-auto b-hover">
                                    <div className="card-body px-3">
                                        <div className="text-center">
                                            <h4>Order #{order.orderId}</h4>
                                            <p>{new Date(order.date).toLocaleString()}</p>
                                        </div>
                                        <hr />
                                        <div className="order-menu">
                                            <h6 className="font-w600"> Pedido </h6>
                                            {order.items.map((item, idx) => (
                                                <div className="d-flex align-items-center mb-2" key={idx}>
                                                    <div className="order-items">
                                                        <h6 className="font-w500 text-nowrap mb-0">{item.name}</h6>
                                                        <p className="mb-0">x{item.number}</p>
                                                    </div>
                                                    <h6 className="text-primary mb-0 ms-auto">+${item.price.toFixed(2)}</h6>
                                                </div>
                                            ))}
                                            <hr />
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
