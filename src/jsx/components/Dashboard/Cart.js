import { Link, useNavigate } from "react-router-dom";
import useStore from '../../../store/store/useStore';
import { useEffect, useState } from "react";
import { incrementOrderNumber, getOrderNumber } from '../../../services/functions';
import CustomizationModal from "../CustomizationModal/CustomizationModal";

export const Cart = () => {
  const { cart, incrementProduct, decrementProduct, removeFromCart } = useStore();
  const [isCash, setIsCash] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [isNotNumber, setIsNotNumber] = useState(false);
  const [nextOrderNumber, setNextOrderNumber] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderNumber = async () => {
      const currentOrderNumber = await getOrderNumber();
      setNextOrderNumber(currentOrderNumber + 1);
    };
    fetchOrderNumber();
  }, []);

  const getNumericPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price);
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return 0;
  };

  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = getNumericPrice(item.price);
    return acc + (itemPrice * item.number);
  }, 0);


  const extrasTotal = cart.reduce((acc, item) => {
    if (item.category.toLowerCase() === 'comida') {
      return acc + item.extras.reduce((extrasSum, extra) => {
        return extrasSum + (item.extraPrices[extra] || 450);
      }, 0) * item.number;
    }
    return acc;
  }, 0);
  const total = subtotal + extrasTotal;
  const discount = isCash ? total * 0.1 : 0;
  const totalWithDiscount = total - discount;

  const handleOpenModal = (index) => {
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
    navigate('/checkout', { state: { orderNumber: number, isCash } });
  };

  return (
    <>
      <div className="card dlab-bg dlab-position">
        <div className="card-header border-0 pb-0">
          <h4 className="cate-title">Registro de órdenes</h4>
        </div>
        <div className="card-body pt-0 pb-2">
          <hr className="my-2 text-primary" style={{ opacity: "0.9" }} />
          <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="font-w500 text-primary">
                {isNotNumber ? "Orden sin número" : `Orden #${nextOrderNumber}`}
              </h4>
            </div>
            <div>
              <input
                type="checkbox"
                checked={isNotNumber}
                onChange={(e) => setIsNotNumber(e.target.checked)}
              /> Orden sin número
            </div>
            {cart.length === 0 ? (
              <div className="text-center my-4">
                <h4>No hay productos en el carrito</h4>
              </div>
            ) : (
              cart.map((item, index) => (
                <div className="order-check d-flex align-items-center my-3" key={item.cartId}>
                  <div className="dlab-info w-100">
                    <div className="d-flex align-items-center justify-content-between">
                      <h4 className="dlab-title"><Link to={"#"}>{item.name}</Link></h4>
                      <h4 className="text-primary ms-2">+${getNumericPrice(item.price).toFixed(2)}</h4>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span>x{item.number}</span>
                      <div className="quntity">
                        <button data-decrease onClick={() => decrementProduct(item.cartId)}>-</button>
                        <input data-value type="text" value={item.number} readOnly />
                        <button data-increase onClick={() => incrementProduct(item.cartId)}>+</button>
                      </div>
                      <button
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => removeFromCart(item.cartId)}
                      >Remover</button>
                    </div>
                    {item.category.toLowerCase() === 'comida' && (
                      <>
                        <h5>Adicionales:</h5>
                        <div className="d-flex align-items-center flex-wrap">
                          {item.extras.length > 0 ? (
                            item.extras.map((extra, idx) => (
                              <span key={idx} className="badge bg-secondary me-1 mb-1">
                                {extra} - ${item.extraPrices[extra] || 0}
                              </span>
                            ))
                          ) : (
                            <span>No hay adicionales</span>
                          )}
                        </div>
                        <button
                          className="btn btn-sm btn-primary mt-2"
                          onClick={() => handleOpenModal(index)}
                          style={{ width: '100%' }}
                        >
                          Personalizar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <hr className="my-2 text-primary" style={{ opacity: "0.9" }} />
        </div>
        {cart.length > 0 && (
          <div className="card-footer pt-0 border-0">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="font-w500">Subtotal</h4>
              <h5 className="font-w500 text-primary">${subtotal.toFixed(2)}</h5>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="font-w500">Adicionales Totales</h4>
              <h5 className="font-w500 text-primary">+ ${extrasTotal.toFixed(2)}</h5>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h4 className="font-w500">Descuentos</h4>
                <input
                  type="checkbox"
                  checked={isCash}
                  onChange={(e) => setIsCash(e.target.checked)}
                /> Pago en efectivo
              </div>
              <h5 className="font-w500 text-primary">- ${discount.toFixed(2)}</h5>
            </div>
            <hr className="my-2 text-primary" style={{ opacity: "0.9" }} />

            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="font-w500">Total</h4>
              <h3 className="font-w500 text-primary">${totalWithDiscount.toFixed(2)}</h3>
            </div>

            <button onClick={handleCheckout} className="btn btn-primary btn-block">Checkout</button>
          </div>
        )}
      </div>
      {selectedProductIndex !== null && (
        <CustomizationModal
          show={showModal}
          handleClose={handleCloseModal}
          product={cart[selectedProductIndex]}
          productIndex={selectedProductIndex}
        />
      )}
    </>
  );
};