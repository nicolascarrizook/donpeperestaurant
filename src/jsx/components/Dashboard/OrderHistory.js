import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactDOM from "react-dom";
import useStore from "../../../store/store/useStore";
import OrderReceipt from "../OrderReceipt/OrderReceipt";

function OrderHistory() {
  const { orders, fetchOrders, loadMoreOrders, loading, hasMoreOrders } =
    useStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Mover filteredOrders antes de handleScroll
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      const matchesSearch =
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate =
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate);
      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, startDate, endDate]);

  // Mover totalPages antes de handleScroll
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Ahora handleScroll puede acceder a totalPages
  const handleScroll = useCallback(
    (e) => {
      const bottom =
        e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
      if (bottom && !loading && hasMoreOrders && currentPage === totalPages) {
        loadMoreOrders();
      }
    },
    [loading, hasMoreOrders, currentPage, totalPages, loadMoreOrders]
  );

  useEffect(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  // Debug para ver el estado de las órdenes en cada render
  useEffect(() => {
    console.log("Estado actual de órdenes:", {
      total: orders.length,
      orders: orders,
      loading,
    });
  }, [orders, loading]);

  // Memoizar órdenes paginadas
  const currentOrders = useMemo(() => {
    console.log("Órdenes filtradas:", filteredOrders.length); // Debug
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelectedOrder(null);
  }, []);

  const handlePrintOrder = useCallback((orderToPrint) => {
    if (!orderToPrint) return;

    // Limpiar cualquier div de impresión anterior
    const oldPrintDivs = document.querySelectorAll(".print-container");
    oldPrintDivs.forEach((div) => div.remove());

    // Crear nuevo div para el portal
    const printDiv = document.createElement("div");
    printDiv.className = "print-container";
    document.body.appendChild(printDiv);

    const isCash = orderToPrint.paymentMethod.toLowerCase() === "efectivo";

    ReactDOM.render(
      <div style={{ width: "300px", margin: "0 auto", padding: "20px" }}>
        <OrderReceipt order={orderToPrint} isCash={isCash} />
      </div>,
      printDiv,
      () => {
        const content = printDiv.innerHTML;
        const printWindow = window.open("", "_blank");

        if (!printWindow) {
          alert("Por favor, permite las ventanas emergentes para imprimir");
          document.body.removeChild(printDiv);
          return;
        }

        printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Recibo de Orden #${orderToPrint.orderId}</title>
                        <meta charset="UTF-8">
                        <style>
                            @page {
                                size: 80mm auto;
                                margin: 0;
                            }
                            body {
                                font-family: system-ui, -apple-system, sans-serif;
                                margin: 0;
                                padding: 10px;
                            }
                            @media print {
                                body {
                                    width: 80mm;
                                }
                                .no-print {
                                    display: none;
                                }
                            }
                            .receipt-container {
                                width: 300px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="receipt-container">
                            ${content}
                        </div>
                        <div class="no-print" style="text-align: center; margin-top: 20px;">
                            <button onclick="window.print()" style="padding: 8px 16px; margin: 0 8px;">
                                Imprimir
                            </button>
                            <button onclick="window.close()" style="padding: 8px 16px; margin: 0 8px;">
                                Cerrar
                            </button>
                        </div>
                    </body>
                </html>
            `);

        // Limpiar y cerrar
        printWindow.document.close();

        // Remover el div de impresión después de un tiempo
        setTimeout(() => {
          if (printDiv && document.body.contains(printDiv)) {
            document.body.removeChild(printDiv);
          }
        }, 100);

        // Imprimir después de que todo esté listo
        setTimeout(() => {
          try {
            printWindow.focus();
            printWindow.print();
          } catch (e) {
            console.error("Error al imprimir:", e);
          }
        }, 500);
      }
    );
  }, []);

  const handlePrintClick = (order) => {
    handlePrintOrder(order);
  };

  const getPaymentMethodBadge = (method) => {
    const badges = {
      efectivo: "success",
      tarjeta: "primary",
      transferencia: "info",
    };
    return badges[method.toLowerCase()] || "secondary";
  };

  const getOrderStatus = (order) => {
    const hoursSinceOrder =
      (new Date() - new Date(order.date)) / (1000 * 60 * 60);
    if (hoursSinceOrder < 24) return { text: "Reciente", variant: "success" };
    if (hoursSinceOrder < 48) return { text: "Ayer", variant: "info" };
    return { text: "Anterior", variant: "secondary" };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const PaginationSection = ({ currentPage, totalPages, setCurrentPage }) => {
    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {getPageNumbers().map((page, idx) => (
            <li
              key={idx}
              className={`page-item ${currentPage === page ? "active" : ""} ${
                page === "..." ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => typeof page === "number" && setCurrentPage(page)}
              >
                {page}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const renderHeader = () => (
    <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div className="d-flex flex-column gap-1">
        <h4 className="card-title mb-0">Historial de Ordenes</h4>
        <small className="text-muted">
          Total de ordenes: {filteredOrders.length}
        </small>
      </div>

      <div className="d-flex gap-3 align-items-center flex-wrap">
        {/* Selector de fechas */}
        <div className="d-flex align-items-center gap-2">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            className="form-control form-control-sm"
            placeholderText="Seleccionar fechas..."
            isClearable={true}
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
          />
          {dateRange[0] && dateRange[1] && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setDateRange([null, null])}
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          )}
        </div>

        {/* Buscador existente */}
        <div className="search-box" style={{ minWidth: "250px" }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar por ID o método de pago..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Selector de items por página */}
        <select
          className="form-select form-select-sm"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value="10">10 por página</option>
          <option value="25">25 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Agregar debug para ver si hay órdenes
  console.log("Órdenes actuales:", currentOrders.length);

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            {renderHeader()}
            <div
              className="card-body p-0"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
              onScroll={handleScroll}
            >
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Estado</th>
                      <th>ID Orden</th>
                      <th>Fecha</th>
                      <th>Items</th>
                      <th>Método de Pago</th>
                      <th>Subtotal</th>
                      <th>Descuentos</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order, index) => {
                      const status = getOrderStatus(order);
                      const itemCount = order.items.reduce(
                        (acc, item) => acc + item.number,
                        0
                      );
                      const subtotal = order.items.reduce(
                        (acc, item) =>
                          acc + (parseFloat(item.price) || 0) * item.number,
                        0
                      );
                      const discount =
                        subtotal - (parseFloat(order.total) || 0);

                      // Crear una clave única usando múltiples propiedades
                      const uniqueKey = `${order.id || "no-id"}-${
                        order.orderId || "no-orderid"
                      }-${index}`;

                      return (
                        <tr key={uniqueKey}>
                          <td>
                            <Badge bg={status.variant}>{status.text}</Badge>
                          </td>
                          <td>{order.orderId || "sin-asignar"}</td>
                          <td>
                            <div>
                              {new Date(order.date).toLocaleDateString()}
                            </div>
                            <small className="text-muted">
                              {new Date(order.date).toLocaleTimeString()}
                            </small>
                          </td>
                          <td>
                            <Badge bg="info">{itemCount} items</Badge>
                          </td>
                          <td>
                            <Badge
                              bg={getPaymentMethodBadge(order.paymentMethod)}
                            >
                              {order.paymentMethod}
                            </Badge>
                          </td>
                          <td>{formatCurrency(subtotal)}</td>
                          <td>
                            {discount > 0 && (
                              <span className="text-danger">
                                -{formatCurrency(discount)}
                              </span>
                            )}
                          </td>
                          <td className="fw-bold">
                            {formatCurrency(order.total)}
                          </td>
                          <td>
                            <div className="btn-group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowModal(true);
                                }}
                              >
                                Ver Detalles
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => handlePrintOrder(order)}
                              >
                                Imprimir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {loading && (
                <div className="text-center p-3">
                  <Spinner animation="border" variant="primary" size="sm" />
                </div>
              )}

              {!loading && !hasMoreOrders && orders.length > 0 && (
                <div className="text-center p-3 text-muted">
                  No hay más órdenes para cargar
                </div>
              )}

              {!loading && orders.length === 0 && (
                <div className="text-center p-5">
                  <p>No se encontraron órdenes</p>
                </div>
              )}

              {/* Paginación mejorada */}
              <div className="d-flex align-items-center justify-content-between p-3 border-top">
                <p className="mb-0 text-muted">
                  Mostrando {currentOrders.length} de {filteredOrders.length}{" "}
                  órdenes
                </p>
                <PaginationSection
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal con detalles adicionales */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            <div className="d-flex align-items-center gap-2">
              Orden #{selectedOrder?.orderId}
              {selectedOrder && (
                <Badge bg={getOrderStatus(selectedOrder).variant}>
                  {getOrderStatus(selectedOrder).text}
                </Badge>
              )}
            </div>
            <div className="text-muted fs-6 mt-1">
              {selectedOrder &&
                new Date(selectedOrder.date).toLocaleDateString("es-AR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          {selectedOrder && (
            <div id="order-receipt">
              <OrderReceipt
                order={selectedOrder}
                isCash={
                  selectedOrder.paymentMethod.toLowerCase() === "efectivo"
                }
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <button
            className="btn btn-outline-secondary"
            onClick={handleModalClose}
          >
            Cerrar
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePrintOrder}
            disabled={!selectedOrder}
          >
            Imprimir Orden
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrderHistory;
