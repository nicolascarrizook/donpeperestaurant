import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const OrderReceipt = forwardRef(({ order, isCash }, ref) => {
  if (!order) return null;

  const isWithoutNumber = order?.orderId?.startsWith('sin-asignar');

  // Helper function to safely convert price to number and format it
  const formatPrice = (price) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div
      ref={ref}
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        margin: '0 auto',
        width: '280px',
        textAlign: 'center',
        padding: '8px',
        border: '1px solid #000',
        lineHeight: '1.4',
        boxSizing: 'border-box',
      }}
    >
      {/* Encabezado */}
      <div style={{ marginBottom: '10px', borderBottom: '1px solid #000', paddingBottom: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}><strong>Don Pepe</strong></h2>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#555' }}><strong>Recibo de Orden</strong></h3>
        <p style={{ margin: '6px 0', fontSize: '14px' }}>
          Turno: <strong>{isWithoutNumber ? 'Sin asignar' : order.orderId.substring(11)}</strong>
        </p>
        <p style={{ margin: '6px 0', fontSize: '14px' }}>
          Fecha: <strong>{new Date(order.date).toLocaleString()}</strong>
        </p>
        <p style={{ margin: '6px 0', fontSize: '14px' }}>
          Método de Pago: <strong>{order.paymentMethod}</strong>
        </p>
      </div>

      {/* Detalles del Pedido */}
      <div style={{ textAlign: 'left', marginBottom: '10px', borderBottom: '1px solid #000', paddingBottom: '8px' }}>
        {order.items.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{item.name}</p>
            <p style={{ margin: '6px 0', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Cantidad:</span> <strong>{item.number}</strong>
            </p>
            <p style={{ margin: '6px 0', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Precio Unitario:</span> <strong>${formatPrice(item.price)}</strong>
            </p>
            <p style={{ margin: '6px 0', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Precio Total:</span> <strong>${formatPrice(item.price * item.number)}</strong>
            </p>
            {item.extras && item.extras.length > 0 && (
              <div style={{ marginTop: '6px' }}>
                <p style={{ margin: '6px 0', fontSize: '14px' }}>Adicionales:</p>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '14px' }}>
                  {item.extras.map((extra, idx) => (
                    <li key={idx}>{extra} - ${formatPrice(item.extraPrices[extra] || 450)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Totales */}
      <div style={{ textAlign: 'right', marginBottom: '10px', paddingTop: '8px', borderTop: '1px solid #000' }}>
        <p style={{ margin: '6px 0', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal:</span> <strong>${formatPrice(order.subtotal)}</strong>
        </p>
        <p style={{ margin: '6px 0', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Adicionales Totales:</span> <strong>${formatPrice(order.extrasTotal)}</strong>
        </p>
        <p style={{ margin: '6px 0', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Descuento:</span> <strong>- ${formatPrice(order.discount)}</strong>
        </p>
        <p style={{ margin: '10px 0', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span>Total a pagar:</span> <strong>${formatPrice(order.total)}</strong>
        </p>
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
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        extras: PropTypes.arrayOf(PropTypes.string),
        extraPrices: PropTypes.objectOf(PropTypes.number),
      })
    ).isRequired,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    discount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    extrasTotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    subtotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  isCash: PropTypes.bool.isRequired,
};

export default OrderReceipt;