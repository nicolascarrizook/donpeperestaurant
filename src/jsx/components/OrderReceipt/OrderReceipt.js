import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const OrderReceipt = forwardRef(({ order, isCash }, ref) => {
  if (!order) return null;

  const isWithoutNumber = order?.orderId?.startsWith('sin-asignar');

  return (
    <div ref={ref} style={{ fontFamily: 'monospace', fontSize: '12px', maxWidth: '300px', margin: '0 auto' }}>
      <h3><strong>Turno: {isWithoutNumber ? 'Sin asignar' : order.orderId.substring(11)}</strong></h3>
      <p><strong>Fecha:</strong> {new Date(order.date).toLocaleString()}</p>
      <p><strong>Método de Pago:</strong> {order.paymentMethod}</p>
      <hr />
      <div>
        {order.items.map((item, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <h3><strong>{item.name}</strong></h3>
            <span>Cantidad: <strong
              style={{
                fontSize: '16px',
                marginLeft: '5px',
                color: '#333',
                fontWeight: 'bold'
              }}
            >{item.number}</strong></span>
            <p>Precio: ${item.price.toFixed(2)}</p>
            {item.extras.length > 0 && (
              <div>
                <p>Adicionales:</p>
                <ul>
                  {item.extras.map((extra, idx) => (
                    <li key={idx}>{extra} - $500</li>
                  ))}
                </ul>
              </div>
            )}
            <hr />
          </div>
        ))}
      </div>
      <div>
        <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
        <p><strong>Adicionales Totales:</strong> ${order.extrasTotal.toFixed(2)}</p>
        <p><strong>Descuento:</strong> ${order.discount.toFixed(2)}</p>
        <p><strong>Total con Descuento:</strong> ${order.total.toFixed(2)}</p>
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
        price: PropTypes.number.isRequired,
        extras: PropTypes.arrayOf(PropTypes.string),
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    extrasTotal: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired,
  }).isRequired,
  isCash: PropTypes.bool.isRequired,
};

export default OrderReceipt;
