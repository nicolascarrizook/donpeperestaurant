import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const OrderReceipt = forwardRef(({ order, isCash }, ref) => {
  if (!order) return null;

  const isWithoutNumber = order?.orderId?.startsWith('sin-asignar');

  return (
    <div ref={ref} style={{ fontFamily: 'monospace', fontSize: '16px', margin: '0 auto', width: '320px', textAlign: 'center', padding: '20px', border: '1px solid #000' }}>
      <div style={{ marginBottom: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '24px' }}><strong>Don Pepe</strong></h2>
        <h3 style={{ margin: 0, fontSize: '20px' }}><strong>Recibo de Orden</strong></h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Turno: {isWithoutNumber ? 'Sin asignar' : order.orderId.substring(11)}</p>
        <p style={{ margin: 0, fontSize: '14px' }}>Fecha: {new Date(order.date).toLocaleString()}</p>
        <p style={{ margin: 0, fontSize: '14px' }}>Método de Pago: {order.paymentMethod}</p>
      </div>
      <hr />
      <div style={{ textAlign: 'left' }}>
        {order.items.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{item.name}</p>
            <p style={{ margin: '2px 0', fontSize: '14px' }}>
              Cantidad: <strong>{item.number}</strong> x Precio Unitario: <strong>${item.price.toFixed(2)}</strong>
            </p>
            <p style={{ margin: '2px 0', fontSize: '14px' }}>
              Precio Total: <strong>${(item.price * item.number).toFixed(2)}</strong>
            </p>
            {item.extras.length > 0 && (
              <div>
                <p style={{ margin: '2px 0', fontSize: '14px' }}>Adicionales:</p>
                <ul style={{ paddingLeft: '20px', margin: '2px 0', fontSize: '14px' }}>
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
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '2px 0', fontSize: '14px' }}><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
        <p style={{ margin: '2px 0', fontSize: '14px' }}><strong>Adicionales Totales:</strong> ${order.extrasTotal.toFixed(2)}</p>
        <p style={{ margin: '2px 0', fontSize: '14px' }}><strong>Descuento:</strong> -${order.discount.toFixed(2)}</p>
        <p style={{ margin: '2px 0', fontSize: '18px', fontWeight: 'bold' }}><strong>Total a pagar:</strong> ${order.total.toFixed(2)}</p>
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
