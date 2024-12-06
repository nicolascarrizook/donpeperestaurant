import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import useStore from "../../../store/store/useStore";
import { formatCurrency } from "../../../utils/formatters";

const ReceiptSection = ({ children, withBorder }) => (
  <div
    style={{
      marginBottom: "16px",
      ...(withBorder && {
        borderBottom: "1px solid #ddd",
        paddingBottom: "16px",
      }),
    }}
  >
    {children}
  </div>
);

const ReceiptRow = ({ label, value, isTotal, fontSize = "14px" }) => (
  <p
    style={{
      margin: "6px 0",
      fontSize,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      ...(isTotal && {
        fontWeight: "bold",
        marginTop: "12px",
        fontSize: "16px",
      }),
    }}
  >
    <span>{label}</span>
    <strong>{value}</strong>
  </p>
);

const OrderReceipt = forwardRef(({ order, isCash }, ref) => {
  const { extrasPrices } = useStore();

  if (!order) return null;

  const isWithoutNumber = order?.orderId?.startsWith("sin-asignar");

  const toNumber = (value) => {
    const num =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
        : value;
    return isNaN(num) ? 0 : num;
  };

  const renderItemExtras = (item) => {
    if (!item.extras?.length) return null;

    return (
      <div style={{ marginTop: "8px" }}>
        <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
          Adicionales:
        </p>
        <ul
          style={{
            paddingLeft: "16px",
            margin: "4px 0",
            fontSize: "14px",
            listStyle: "none",
          }}
        >
          {item.extras.map((extra, idx) => {
            const extraPrice = toNumber(extrasPrices[extra]);
            return (
              <li
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span>{extra}</span>
                <span>+{formatCurrency(extraPrice)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const calculateItemTotal = (item) => {
    const basePrice = toNumber(item.price) * item.number;
    const extrasTotal =
      item.extras?.reduce((sum, extra) => {
        const extraPrice = toNumber(extrasPrices[extra]);
        return sum + extraPrice * item.number;
      }, 0) || 0;

    return basePrice + extrasTotal;
  };

  const calculateOrderTotals = () => {
    const itemTotals = order.items.map(calculateItemTotal);
    const subtotal = itemTotals.reduce((sum, total) => sum + total, 0);
    const extrasTotal = order.items.reduce((sum, item) => {
      return (
        sum +
        (item.extras?.reduce((extraSum, extra) => {
          return extraSum + toNumber(extrasPrices[extra]) * item.number;
        }, 0) || 0)
      );
    }, 0);

    const discount = isCash ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    return {
      subtotal: toNumber(subtotal),
      extrasTotal: toNumber(extrasTotal),
      discount: toNumber(discount),
      total: toNumber(total),
    };
  };

  const totals = calculateOrderTotals();

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "16px",
        width: "300px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <ReceiptSection withBorder>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: "24px",
            textAlign: "center",
            color: "#ff6b00",
          }}
        >
          Don Pepe
        </h2>
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: "18px",
            textAlign: "center",
            color: "#444",
          }}
        >
          Recibo de Orden
        </h3>
        <ReceiptRow
          label="Turno:"
          value={isWithoutNumber ? "Sin asignar" : order.orderId.substring(11)}
          fontSize="18px"
          isTotal
        />
        <ReceiptRow
          label="Fecha:"
          value={new Date(order.date).toLocaleString()}
        />
        <ReceiptRow label="Método de Pago:" value={order.paymentMethod} />
      </ReceiptSection>

      {/* Items */}
      <ReceiptSection withBorder>
        {order.items.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: index !== order.items.length - 1 ? "16px" : 0,
              padding: "8px",
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {item.name}
            </h4>
            <ReceiptRow label="Cantidad" value={item.number} />
            <ReceiptRow
              label="Precio Unitario"
              value={formatCurrency(item.price)}
            />
            {renderItemExtras(item)}
            <ReceiptRow
              label="Subtotal del ítem"
              value={formatCurrency(calculateItemTotal(item))}
              isTotal
            />
          </div>
        ))}
      </ReceiptSection>

      {/* Totals */}
      <ReceiptSection>
        <ReceiptRow label="Subtotal" value={formatCurrency(totals.subtotal)} />
        <ReceiptRow
          label="Adicionales Totales"
          value={`+${formatCurrency(totals.extrasTotal)}`}
        />
        {isCash && (
          <ReceiptRow
            label="Descuento (10%)"
            value={`-${formatCurrency(totals.discount)}`}
            style={{ color: "#28a745" }}
          />
        )}
        <ReceiptRow
          label="Total a pagar"
          value={formatCurrency(totals.total)}
          isTotal
        />
      </ReceiptSection>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <p style={{ margin: "4px 0" }}>¡Gracias por su compra!</p>
        <p style={{ margin: "4px 0" }}>Don Pepe le desea buen provecho</p>
      </div>
    </div>
  );
});

OrderReceipt.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        number: PropTypes.number.isRequired,
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        extras: PropTypes.arrayOf(PropTypes.string),
        extraPrices: PropTypes.objectOf(PropTypes.number),
      })
    ).isRequired,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    discount: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    extrasTotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    subtotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
  }).isRequired,
  isCash: PropTypes.bool.isRequired,
};

export default OrderReceipt;
