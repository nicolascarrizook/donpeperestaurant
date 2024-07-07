import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useStore from '../../../store/store/useStore';

const CustomizationModal = ({ show, handleClose, product, productIndex }) => {
  const { addExtra, removeExtra } = useStore(); // Asegúrate de tener una función para remover extras
  const [selectedExtras, setSelectedExtras] = useState([]);

  useEffect(() => {
    setSelectedExtras(product.extras || []);
  }, [product]);

  const handleExtraChange = (extra) => {
    setSelectedExtras((prev) =>
      prev.includes(extra)
        ? prev.filter((item) => item !== extra)
        : [...prev, extra]
    );
  };

  const handleSave = () => {
    product.extras.forEach((extra) => removeExtra(product.cartId, extra));
    selectedExtras.forEach((extra) => addExtra(product.cartId, extra));
    handleClose();
  };

  if (!product) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Personalizar {product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5>Adicionales disponibles:</h5>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="queso"
              onChange={() => handleExtraChange('Queso')}
              checked={selectedExtras.includes('Queso')}
            />
            <label className="form-check-label" htmlFor="queso">
              Queso ($500)
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="jamon"
              onChange={() => handleExtraChange('Jamon')}
              checked={selectedExtras.includes('Jamon')}
            />
            <label className="form-check-label" htmlFor="jamon">
              Jamon ($500)
            </label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomizationModal;
