import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { closeRegister, openRegister } from "../../../services/functions";
import useStore from "../../../store/store/useStore";
import { ensureNumber, formatCurrency } from "../../../utils/formatters";

const StatsCard = ({ title, value, color = "#FF6B00" }) => (
  <Card className="border-0 h-100 shadow-sm">
    <Card.Body className="p-4">
      <div className="d-flex flex-column">
        <span style={{ color: color }} className="h2 mb-2 fw-bold">
          {value}
        </span>
        <span className="text-muted">{title}</span>
      </div>
    </Card.Body>
  </Card>
);

const PaymentMethodBadge = ({ method }) => {
  const styles = {
    efectivo: {
      bg: "#FF6B00",
      color: "white",
    },
    tarjeta: {
      bg: "#4CAF50",
      color: "white",
    },
    yape: {
      bg: "#2196F3",
      color: "white",
    },
  };

  return (
    <span
      className="px-3 py-1 rounded-pill"
      style={{
        backgroundColor: styles[method]?.bg,
        color: styles[method]?.color,
        fontSize: "0.875rem",
      }}
    >
      {method.charAt(0).toUpperCase() + method.slice(1)}
    </span>
  );
};

const FoodOrder = () => {
  const { orders, fetchOrders, extrasPrices } = useStore();
  const [dailyStats, setDailyStats] = useState({
    totalIncome: 0,
    totalOrders: 0,
    cashPayments: 0,
    cardPayments: 0,
    yapePayments: 0,
    averageTicket: 0,
    mostSoldItems: [],
    registerStatus: "closed",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Función para verificar si una fecha es de hoy
  const isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  // Asegurarse de que el precio sea un número
  const getItemPrice = (item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
        : Number(item.price);
    return isNaN(price) ? 0 : price;
  };

  // Calcular el total de un ítem incluyendo extras
  const calculateItemTotal = (item) => {
    const basePrice = getItemPrice(item) * ensureNumber(item.number);
    const extrasTotal =
      item.extras?.reduce((sum, extra) => {
        const extraPrice = ensureNumber(extrasPrices[extra]);
        return sum + extraPrice * ensureNumber(item.number);
      }, 0) || 0;
    return basePrice + extrasTotal;
  };

  // Modificamos el useEffect para que solo se ejecute una vez al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []); // Removemos las dependencias

  // Efecto separado para calcular las estadísticas cuando cambien las órdenes
  useEffect(() => {
    calculateDailyStats();
  }, [orders]);

  const calculateDailyStats = () => {
    const todayOrders = orders.filter((order) => isToday(new Date(order.date)));

    const stats = {
      totalIncome: todayOrders.reduce(
        (sum, order) => sum + ensureNumber(order.total),
        0
      ),
      totalOrders: todayOrders.length,
      cashPayments: todayOrders
        .filter((order) => order.paymentMethod === "efectivo")
        .reduce((sum, order) => sum + ensureNumber(order.total), 0),
      cardPayments: todayOrders
        .filter((order) => order.paymentMethod === "tarjeta")
        .reduce((sum, order) => sum + ensureNumber(order.total), 0),
      yapePayments: todayOrders
        .filter((order) => order.paymentMethod === "yape")
        .reduce((sum, order) => sum + ensureNumber(order.total), 0),
    };

    stats.averageTicket =
      stats.totalOrders > 0 ? stats.totalIncome / stats.totalOrders : 0;

    setDailyStats(stats);
  };

  const handleRegisterAction = async (action) => {
    try {
      if (action === "close") {
        await closeRegister();
        alert("Caja cerrada exitosamente");
      } else {
        await openRegister();
        alert("Caja abierta exitosamente");
      }
      fetchOrders();
      calculateDailyStats();
    } catch (error) {
      alert("Error al gestionar la caja: " + error.message);
    }
  };

  // Obtener órdenes del día actual y ordenadas
  const todayOrders = [...orders]
    .filter((order) => isToday(new Date(order.date)))
    .reverse();

  // Obtener órdenes actuales
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = todayOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Cambiar página
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Componente de paginación
  const PaginationComponent = () => {
    const pageNumbers = Math.ceil(todayOrders.length / ordersPerPage);

    if (pageNumbers <= 1) return null;

    return (
      <div className="d-flex justify-content-between align-items-center p-4 border-top">
        <small className="text-muted">
          Mostrando {indexOfFirstOrder + 1} -{" "}
          {Math.min(indexOfLastOrder, todayOrders.length)} de{" "}
          {todayOrders.length} órdenes
        </small>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link border-0"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ color: "#FF6B00" }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>

            {[...Array(pageNumbers)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    pageNumber === currentPage ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link border-0"
                    onClick={() => handlePageChange(pageNumber)}
                    style={{
                      backgroundColor:
                        pageNumber === currentPage ? "#FF6B00" : "transparent",
                      color: pageNumber === currentPage ? "white" : "#6c757d",
                      fontWeight: pageNumber === currentPage ? "500" : "normal",
                      minWidth: "35px",
                      textAlign: "center",
                    }}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}

            <li
              className={`page-item ${
                currentPage === pageNumbers ? "disabled" : ""
              }`}
            >
              <button
                className="page-link border-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageNumbers}
                style={{ color: "#FF6B00" }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  const handlePrintReport = () => {
    // Agregar estilos de impresión
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .table-responsive, .table-responsive * {
          visibility: visible;
        }
        .table-responsive {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print, .no-print * {
          display: none !important;
        }
        @page {
          margin: 1cm;
        }
      }
    `;
    document.head.appendChild(style);

    // Imprimir
    window.print();

    // Limpiar
    document.head.removeChild(style);
  };

  return (
    <div className="container-fluid">
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatsCard
            title="Total del Día"
            value={formatCurrency(dailyStats.totalIncome)}
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatsCard
            title="Órdenes"
            value={dailyStats.totalOrders}
            color="#4CAF50"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <Card className="border-0 h-100 shadow-sm">
            <Card.Body className="p-4">
              <h6 className="text-muted mb-3">Métodos de Pago</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Efectivo</span>
                <span className="fw-bold">
                  {formatCurrency(dailyStats.cashPayments)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tarjeta</span>
                <span className="fw-bold">
                  {formatCurrency(dailyStats.cardPayments)}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Yape</span>
                <span className="fw-bold">
                  {formatCurrency(dailyStats.yapePayments)}
                </span>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm-6 col-xl-3">
          <Card className="border-0 h-100 shadow-sm">
            <Card.Body className="p-4">
              <h6 className="text-muted mb-4">Control de Caja</h6>
              <button
                onClick={() =>
                  handleRegisterAction(
                    dailyStats.registerStatus === "open" ? "close" : "open"
                  )
                }
                className="btn w-100"
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                }}
              >
                Abrir Caja
              </button>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Header
          className="bg-white border-0 no-print"
          style={{ padding: "1.5rem 2rem" }}
        >
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <h6 className="mb-0 fs-5 fw-semibold">Órdenes del Día</h6>
            </div>
            <div>
              <button
                className="btn btn-sm px-4 py-2"
                style={{
                  borderColor: "#FF6B00",
                  color: "#FF6B00",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  backgroundColor: "transparent",
                }}
                onClick={handlePrintReport}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#FF6B00";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#FF6B00";
                }}
              >
                <i className="fas fa-print me-2"></i>
                Imprimir Reporte
              </button>
            </div>
          </div>
        </Card.Header>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th className="ps-4">Orden #</th>
                <th>Hora</th>
                <th style={{ minWidth: "400px" }}>Detalle</th>
                <th>Método De Pago</th>
                <th className="text-end pe-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.orderId}>
                  <td className="ps-4">{order.orderId || "sin-asignar"}</td>
                  <td>
                    {new Date(order.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="mb-1">
                        <span>
                          {item.number}x {item.name}
                        </span>
                        {item.extras?.length > 0 && (
                          <small className="text-muted ms-2">
                            (+{item.extras.join(", ")})
                          </small>
                        )}
                      </div>
                    ))}
                  </td>
                  <td>
                    <PaymentMethodBadge method={order.paymentMethod} />
                  </td>
                  <td className="text-end pe-4">
                    <div className="fw-bold">{formatCurrency(order.total)}</div>
                    {order.discount > 0 && (
                      <small style={{ color: "#FF6B00" }}>
                        -{formatCurrency(order.discount)}
                      </small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="no-print">
          <PaginationComponent />
        </div>
      </Card>
    </div>
  );
};

// Eliminar los estilos CSS anteriores y usar estos más simples
const styles = `
  .pagination .page-link {
    padding: 0.5rem 0.75rem;
    color: #6c757d;
    background-color: transparent;
    border: none;
    margin: 0 2px;
  }

  .pagination .page-link:hover {
    background-color: #fff3eb;
    color: #FF6B00;
  }

  .pagination .page-item.active .page-link {
    background-color: #FF6B00;
    color: white;
  }

  .pagination .page-item.disabled .page-link {
    color: #dee2e6;
    pointer-events: none;
    background-color: transparent;
  }
`;

// Agregar los estilos al documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default FoodOrder;
