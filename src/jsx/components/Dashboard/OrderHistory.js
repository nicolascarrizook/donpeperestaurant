import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import useStore from '../../../store/store/useStore';

function OrderHistory() {
    const { orders, fetchOrders } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handlePrintOrder = () => {
        setTimeout(() => {
            const printableArea = document.getElementById('printable-area');
            if (printableArea) {
                const printContents = printableArea.innerHTML;
                const printWindow = window.open('', '_blank', 'width=600,height=600');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Imprimir Orden</title>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                                h5, p { margin: 0 0 10px; }
                                .item-detail { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
                                .extras ul { padding-left: 20px; margin: 5px 0; }
                            </style>
                        </head>
                        <body>
                            ${printContents}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            } else {
                console.error('No se pudo encontrar el área imprimible');
            }
        }, 500); // Retraso para asegurarse de que el contenido esté renderizado
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card h-auto">
                        <div className="card-header">
                            <h4 className="card-title">Historial de Órdenes</h4>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID de la Orden</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Método de Pago</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrders.map((order, index) => (
                                            <tr key={order.orderId} id={`order-${order.orderId}`}>
                                                <td>{order.orderId}</td>
                                                <td>{new Date(order.date).toLocaleString()}</td>
                                                <td>${order.total.toFixed(2)}</td>
                                                <td>{order.paymentMethod}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        Ver Detalles
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setTimeout(() => handlePrintOrder(), 500); // Asegura que los datos se carguen antes de imprimir
                                                        }}
                                                    >
                                                        Imprimir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex align-items-center justify-content-between px-4 py-3">
                                <p className="mb-0">
                                    Mostrando {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} de {orders.length} órdenes
                                </p>
                                <nav>
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <Link to="#" className="page-link" onClick={() => currentPage > 1 && paginate(currentPage - 1)}>
                                                <i className="la la-angle-left"></i>
                                            </Link>
                                        </li>
                                        {[...Array(totalPages).keys()].map(number => (
                                            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                                <Link to="#" className="page-link" onClick={() => paginate(number + 1)}>
                                                    {number + 1}
                                                </Link>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <Link to="#" className="page-link" onClick={() => currentPage < totalPages && paginate(currentPage + 1)}>
                                                <i className="la la-angle-right"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para ver detalles de la orden */}
            <Modal show={showModal} onHide={handleModalClose}>
                <div className="modal-header">
                <h5 className="modal-title">Historico de Orden</h5>
                    <button type="button" className="btn-close" onClick={handleModalClose}></button>
                </div>
                <div className="modal-body">
                    {selectedOrder && (
                        <div id="printable-area" className="order-details">
                            <p>Orden generada el {new Date(selectedOrder.date).toLocaleString()}</p>
                            <p><strong>ID de la Orden:</strong> {selectedOrder.orderId}</p>
                            <p><strong>Fecha:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                            <p><strong>Método de Pago:</strong> {selectedOrder.paymentMethod}</p>
                            <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                            <h5>Items:</h5>
                            <div className="items-list">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="item-detail mb-3 p-2 border rounded">
                                        <h6 className="mb-1">{item.name}</h6>
                                        <p className="mb-1"><strong>Cantidad:</strong> {item.number}</p>
                                        <p className="mb-1"><strong>Precio Unitario:</strong> ${item.price.toFixed(2)}</p>
                                        <p className="mb-1"><strong>Precio Total:</strong> ${(item.price * item.number).toFixed(2)}</p>
                                        {item.extras.length > 0 && (
                                            <div className="extras">
                                                <p className="mb-1"><strong>Adicionales:</strong></p>
                                                <ul className="ps-3 mb-0">
                                                    {item.extras.map((extra, extraIdx) => (
                                                        <li key={extraIdx}>{extra}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cerrar</button>
                    <button type="button" className="btn btn-primary" onClick={handlePrintOrder}>Imprimir</button>
                </div>
            </Modal>
        </>
    );
}

export default OrderHistory;
