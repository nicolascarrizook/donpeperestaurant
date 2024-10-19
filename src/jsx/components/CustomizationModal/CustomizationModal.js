import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useStore from '../../../store/store/useStore';

const CustomizationModal = ({ show, handleClose, product, productIndex }) => {
  const { addExtra, removeExtra, updateExtraPrice } = useStore();
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [extraPrices, setExtraPrices] = useState({});
  const [editingExtra, setEditingExtra] = useState(null);

  useEffect(() => {
    setSelectedExtras(product.extras || []);
    const initialPrices = {};
    ['Queso', 'Jamon', 'Huevo'].forEach(extra => {
      initialPrices[extra] = product.extraPrices?.[extra] || 450;
    });
    setExtraPrices(initialPrices);
  }, [product]);

  const handleExtraChange = (extra) => {
    setSelectedExtras((prev) =>
      prev.includes(extra)
        ? prev.filter((item) => item !== extra)
        : [...prev, extra]
    );
  };

  const handleEditPrice = (extra) => {
    setEditingExtra(extra);
  };

  const handlePriceChange = (extra, price) => {
    const numericPrice = parseFloat(price) || 450;
    setExtraPrices(prev => ({
      ...prev,
      [extra]: numericPrice
    }));
  };

  const handleSave = () => {
    product.extras.forEach((extra) => removeExtra(product.cartId, extra));
    selectedExtras.forEach((extra) => {
      const price = extraPrices[extra] || 450;
      addExtra(product.cartId, extra, price);
    });
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
          {['Queso', 'Jamon', 'Huevo'].map((extra) => (
            <div key={extra} className="form-check d-flex align-items-center justify-content-between mb-2">
              <div>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={extra.toLowerCase()}
                  onChange={() => handleExtraChange(extra)}
                  checked={selectedExtras.includes(extra)}
                />
                <label className="form-check-label ms-2" htmlFor={extra.toLowerCase()}>
                  {extra}
                </label>
              </div>
              <div className="d-flex align-items-center">
                {editingExtra === extra ? (
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: '80px' }}
                    value={extraPrices[extra]}
                    onChange={(e) => handlePriceChange(extra, e.target.value)}
                    onBlur={() => setEditingExtra(null)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="me-2">${extraPrices[extra]}</span>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleEditPrice(extra)}
                    >
                      Editar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
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