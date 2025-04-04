import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { createOrder } from "../../../services/functions";
import useStore from "../../../store/store/useStore";
import OrderReceipt from "../OrderReceipt/OrderReceipt";

const Checkout = () => {
  const { cart, resetCart, discountPercentage, fetchDiscountPercentage } = useStore();
  const [order, setOrder] = useState(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, isCash } = location.state || {};
  const receiptRef = useRef();

  // Cargar el porcentaje de descuento al inicio
  useEffect(() => {
    const loadDiscount = async () => {
      if (isCash) {
        setIsLoadingDiscount(true);
        await fetchDiscountPercentage();
        setIsLoadingDiscount(false);
      }
    };
    loadDiscount();
  }, [fetchDiscountPercentage, isCash]);

  useEffect(() => {
    const generateOrder = async () => {
      if (cart.length > 0 && (!isCash || !isLoadingDiscount)) {
        const today = new Date().toISOString().split("T")[0];
        const newOrderId = orderNumber
          ? `${today}-${orderNumber}`
          : "sin-asignar";

        const total = cart.reduce((acc, item) => {
          const itemPrice = item.price || 0;
          const itemExtrasTotal = (item.extras.length || 0) * 500;
          return acc + itemPrice * item.number + itemExtrasTotal * item.number;
        }, 0);

        // Usar el porcentaje de descuento cargado o 0 si no hay
        const currentDiscountPercentage = discountPercentage || 0;
        const discount = isCash ? total * (currentDiscountPercentage / 100) : 0;
        const totalWithDiscount = total - discount;
        const extrasTotal = cart.reduce(
          (acc, item) => acc + item.extras.length * 500 * item.number,
          0
        );

        const orderData = {
          orderId: newOrderId,
          date: new Date().toISOString(),
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            number: item.number,
            extras: item.extras,
            extraPrices: item.extraPrices,
          })),
          total: totalWithDiscount,
          discount: discount,
          discountPercentage: isCash ? currentDiscountPercentage : 0,
          paymentMethod: isCash ? "Efectivo" : "Mercadopago",
          extrasTotal: extrasTotal,
          subtotal: total,
        };

        await createOrder(orderData);
        setOrder(orderData);
        resetCart();
      }
    };

    if (!isLoadingDiscount || !isCash) {
      generateOrder();
    }
  }, [cart, orderNumber, resetCart, isCash, discountPercentage, isLoadingDiscount]);

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {order ? (
        <div
          style={{
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <OrderReceipt ref={receiptRef} order={order} isCash={isCash} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "20px",
            }}
          >
            <button onClick={handlePrint} className="btn btn-primary">
              Imprimir Recibo
            </button>
            <button onClick={() => navigate("/")} className="btn btn-secondary">
              Volver al inicio
            </button>
          </div>
        </div>
      ) : (
        <p>Procesando su orden...</p>
      )}
    </div>
  );
};

export default Checkout;
