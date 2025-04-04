import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrderNumber,
  incrementOrderNumber,
} from "../../../services/functions";
import useStore from "../../../store/store/useStore";
import CustomizationModal from "../CustomizationModal/CustomizationModal";

export const Cart = () => {
  const {
    cart,
    incrementProduct,
    decrementProduct,
    removeFromCart,
    extrasPrices,
    discountPercentage = 10,
    fetchDiscountPercentage,
  } = useStore();
  const [isCash, setIsCash] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [isNotNumber, setIsNotNumber] = useState(false);
  const [nextOrderNumber, setNextOrderNumber] = useState(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const currentOrderNumber = await getOrderNumber();
      setNextOrderNumber(currentOrderNumber + 1);
      
      setIsLoadingDiscount(true);
      await fetchDiscountPercentage();
      setIsLoadingDiscount(false);
    };
    fetchData();
  }, [fetchDiscountPercentage]);

  const getNumericPrice = (price) => {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      const numericPrice = parseFloat(price);
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return 0;
  };

  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = getNumericPrice(item.price);
    return acc + itemPrice * item.number;
  }, 0);

  const extrasTotal = cart.reduce((acc, item) => {
    if (item.extras && Array.isArray(item.extras) && item.extras.length > 0) {
      const itemExtrasTotal = item.extras.reduce((extrasSum, extra) => {
        const extraPrice = extrasPrices?.[extra] || 0;
        console.log(
          `Item: ${item.name}, Extra: ${extra}, Price: ${extraPrice}`
        );
        return extrasSum + extraPrice;
      }, 0);
      console.log(
        `Total extras for ${item.name}: ${itemExtrasTotal * item.number}`
      );
      return acc + itemExtrasTotal * item.number;
    }
    return acc;
  }, 0);

  const getItemExtrasTotal = (item) => {
    if (
      !item.extras ||
      !Array.isArray(item.extras) ||
      item.extras.length === 0
    ) {
      return 0;
    }
    return (
      item.extras.reduce((sum, extra) => {
        const extraPrice = extrasPrices?.[extra] || 0;
        return sum + extraPrice;
      }, 0) * item.number
    );
  };

  const total = subtotal + extrasTotal;
  const discount = isCash ? total * (discountPercentage / 100) : 0;
  const totalWithDiscount = total - discount;

  const handleOpenModal = (index) => {
    console.log("Abriendo modal para índice:", index);
    setSelectedProductIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductIndex(null);
  };

  const handleCheckout = async () => {
    let number = null;
    if (!isNotNumber) {
      number = await incrementOrderNumber();
      setOrderNumber(number);
    }
    navigate("/checkout", { state: { orderNumber: number, isCash } });
  };

  return (
    <div
      className="bg-white rounded-4"
      style={{
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <i
              className="fas fa-shopping-cart me-2"
              style={{ color: "#ff6b00" }}
            ></i>
            <span style={{ fontSize: "18px", fontWeight: "500" }}>
              Registro de órdenes
            </span>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-2" style={{ color: "#666", fontSize: "14px" }}>
              Sin número
            </span>
            <div className="form-check form-switch">
              <input
                type="checkbox"
                checked={isNotNumber}
                onChange={(e) => setIsNotNumber(e.target.checked)}
                className="form-check-input"
                style={{
                  width: "40px",
                  height: "20px",
                  cursor: "pointer",
                  borderColor: "#ff6b00",
                }}
              />
            </div>
          </div>
        </div>

        <h3
          style={{
            color: "#ff6b00",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          {isNotNumber ? "Orden sin número" : `Orden #${nextOrderNumber}`}
        </h3>
      </div>

      {/* Productos */}
      <div className="px-4">
        {cart.map((item, index) => (
          <div
            key={item.cartId}
            className="mb-4"
            style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "16px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span style={{ fontSize: "16px", fontWeight: "500" }}>
                {item.name}
              </span>
              <div className="text-end">
                <div
                  className="fw-bold"
                  style={{ color: "#ff6b00", fontSize: "16px" }}
                >
                  +${getNumericPrice(item.price).toFixed(2)}
                </div>
                {item.extras && item.extras.length > 0 && (
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Adicionales: ${getItemExtrasTotal(item).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "4px 8px",
                  }}
                >
                  <button
                    onClick={() => decrementProduct(item.cartId)}
                    className="btn btn-link p-0"
                    style={{
                      color: "#666",
                      textDecoration: "none",
                      width: "24px",
                    }}
                  >
                    -
                  </button>
                  <span className="mx-3">{item.number}</span>
                  <button
                    onClick={() => incrementProduct(item.cartId)}
                    className="btn btn-link p-0"
                    style={{
                      color: "#666",
                      textDecoration: "none",
                      width: "24px",
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="btn btn-link text-danger p-0"
                  style={{ textDecoration: "none" }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>

            {item.category.toLowerCase() === "sandwiches" && (
              <div className="mt-3">
                <div className="mb-2">
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    Adicionales:
                  </span>
                  <span
                    className="ms-2"
                    style={{ color: "#999", fontSize: "14px" }}
                  >
                    {item.extras?.length > 0
                      ? item.extras
                          .map((extra) => `${extra} (+$${extrasPrices[extra]})`)
                          .join(", ")
                      : "Sin adicionales"}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenModal(index)}
                  className="btn w-100"
                  style={{
                    backgroundColor: "#ff6b00",
                    color: "white",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                >
                  Personalizar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="p-4 bg-light rounded-bottom-4">
        <div className="d-flex justify-content-between mb-2">
          <span style={{ color: "#666" }}>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span style={{ color: "#666" }}>Adicionales</span>
          <span style={{ color: "#ff6b00" }}>+${extrasTotal.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <label
            className="d-flex align-items-center gap-2"
            style={{ cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={isCash}
              onChange={(e) => setIsCash(e.target.checked)}
              style={{ width: "18px", height: "18px" }}
            />
            <span style={{ color: "#666" }}>Pago en efectivo</span>
          </label>
          {isLoadingDiscount ? (
            <span 
              style={{ 
                color: "#28a745", 
                width: "60px", 
                height: "20px",
                display: "inline-block",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, #e8f5e9, #ffffff, #e8f5e9)",
                  backgroundSize: "200% 100%",
                  animation: "shimmerGreen 1.5s infinite",
                }}
              />
              <style>
                {`
                  @keyframes shimmerGreen {
                    0% {
                      background-position: -200% 0;
                    }
                    100% {
                      background-position: 200% 0;
                    }
                  }
                `}
              </style>
            </span>
          ) : (
            <span style={{ color: "#28a745" }}>-${discount.toFixed(2)}</span>
          )}
        </div>

        <hr style={{ opacity: 0.1 }} />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={{ fontSize: "18px", fontWeight: "500" }}>Total</span>
          <span
            style={{
              color: "#ff6b00",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            ${totalWithDiscount.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          className="btn w-100"
          style={{
            backgroundColor: cart.length > 0 ? "#ff6b00" : "#ccc",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: cart.length > 0 ? "pointer" : "not-allowed",
          }}
          disabled={cart.length === 0}
        >
          Finalizar Pedido
        </button>
      </div>

      <CustomizationModal
        show={showModal}
        handleClose={handleCloseModal}
        product={cart[selectedProductIndex]}
        productIndex={selectedProductIndex}
      />
    </div>
  );
};
