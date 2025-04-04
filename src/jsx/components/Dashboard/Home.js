import React, { useContext, useEffect, useState } from "react";
import { Badge, Button, Form, Modal, Table } from "react-bootstrap";
import { ThemeContext } from "../../../context/ThemeContext";
import useStore from "../../../store/store/useStore";
import { Cart } from "./Cart";
import FavoriteMenu from "./FavoriteMenu";

const ConfigModal = ({ show, handleClose }) => {
  const {
    extrasPrices,
    updateExtraPrice,
    removeExtra,
    addNewExtra,
    fetchExtrasPrices,
  } = useStore();
  const [prices, setPrices] = useState({});
  const [newExtra, setNewExtra] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    fetchExtrasPrices();
  }, [fetchExtrasPrices]);

  useEffect(() => {
    if (extrasPrices) {
      setPrices(extrasPrices);
    }
  }, [extrasPrices]);

  const handlePriceChange = (extra, value) => {
    setPrices((prev) => ({
      ...prev,
      [extra]: parseFloat(value) || 0,
    }));
  };

  const handleAddExtra = async () => {
    if (newExtra.name && newExtra.price) {
      try {
        const numericPrice = parseFloat(newExtra.price);
        if (isNaN(numericPrice)) {
          setSaveStatus("Error: El precio debe ser un número válido");
          return;
        }

        if (prices[newExtra.name]) {
          setSaveStatus("Error: Este adicional ya existe");
          return;
        }

        const success = await updateExtraPrice(newExtra.name, numericPrice);

        if (success) {
          setPrices((prev) => ({
            ...prev,
            [newExtra.name]: numericPrice,
          }));

          setNewExtra({ name: "", price: "" });
          setSaveStatus("Adicional agregado correctamente");

          await fetchExtrasPrices();
        } else {
          setSaveStatus("Error al agregar el adicional");
        }
      } catch (error) {
        console.error("Error al agregar extra:", error);
        setSaveStatus("Error: " + error.message);
      }

      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("Error: Debe completar todos los campos");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleRemoveExtra = async (extra) => {
    if (window.confirm(`¿Estás seguro de eliminar ${extra}?`)) {
      await removeExtra(extra);
      setSaveStatus("Adicional eliminado correctamente");
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  const handleSavePrice = async (extra, price) => {
    try {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice)) {
        throw new Error("El precio debe ser un número válido");
      }

      const success = await updateExtraPrice(extra, numericPrice);

      if (success) {
        setEditingId(null);
        setSaveStatus("Precio actualizado correctamente");

        setPrices((prev) => ({
          ...prev,
          [extra]: numericPrice,
        }));
      } else {
        setSaveStatus("Error al actualizar el precio");
      }
    } catch (error) {
      console.error("Error al guardar el precio:", error);
      setSaveStatus("Error: " + error.message);
    }

    setTimeout(() => setSaveStatus(""), 2000);
  };

  const handleFinalSave = async () => {
    try {
      const updates = Object.entries(prices).map(async ([extra, price]) => {
        const numericPrice = parseFloat(price);
        if (!isNaN(numericPrice)) {
          return updateExtraPrice(extra, numericPrice);
        }
        return Promise.resolve(false);
      });

      const results = await Promise.all(updates);

      if (results.every((result) => result)) {
        setSaveStatus("Todos los cambios guardados correctamente");
      } else {
        setSaveStatus("Algunos cambios no pudieron guardarse");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setSaveStatus("Error al guardar los cambios");
    }

    setTimeout(() => setSaveStatus(""), 2000);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title>
          <div className="d-flex flex-column">
            <h5 className="mb-1">Configuración de Adicionales</h5>
            <div className="text-muted fs-6">
              Total de adicionales: {Object.keys(prices).length}
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {saveStatus && (
          <div
            className={`alert alert-${
              saveStatus.includes("Error") ? "danger" : "success"
            } mb-3`}
          >
            {saveStatus}
          </div>
        )}

        <div className="bg-light p-3 rounded mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Agregar Nuevo Adicional</h6>
          </div>
          <div className="row g-3">
            <div className="col-sm-5">
              <Form.Control
                type="text"
                placeholder="Nombre del adicional"
                value={newExtra.name}
                onChange={(e) =>
                  setNewExtra((prev) => ({
                    ...prev,
                    name: e.target.value.trim(),
                  }))
                }
              />
            </div>
            <div className="col-sm-4">
              <Form.Control
                type="number"
                placeholder="Precio"
                value={newExtra.price}
                onChange={(e) =>
                  setNewExtra((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                min="0"
                step="50"
              />
            </div>
            <div className="col-sm-3">
              <Button
                variant="primary"
                onClick={handleAddExtra}
                className="w-100"
                disabled={!newExtra.name || !newExtra.price}
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <Table hover className="table-striped">
            <thead className="bg-light">
              <tr>
                <th className="py-3">Adicional</th>
                <th className="py-3">Precio</th>
                <th className="py-3 text-center">Estado</th>
                <th className="py-3 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(prices).map(([extra, price]) => (
                <tr key={extra}>
                  <td className="py-3">{extra}</td>
                  <td className="py-3">
                    {editingId === extra ? (
                      <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) =>
                          handlePriceChange(extra, e.target.value)
                        }
                        min="0"
                        step="50"
                        size="sm"
                      />
                    ) : (
                      <span className="fw-bold">${price}</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <Badge
                      bg={editingId === extra ? "warning" : "success"}
                      className="px-3 py-2"
                    >
                      {editingId === extra ? "Editando" : "Activo"}
                    </Badge>
                  </td>
                  <td className="py-3 text-end">
                    <Button
                      variant={editingId === extra ? "success" : "primary"}
                      size="sm"
                      onClick={() => {
                        if (editingId === extra) {
                          handleSavePrice(extra, prices[extra]);
                        } else {
                          setEditingId(extra);
                        }
                      }}
                      className="me-2"
                    >
                      {editingId === extra ? "Guardar" : "Editar"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveExtra(extra)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-light">
              <tr>
                <td colSpan="2" className="fw-bold">
                  Total de Adicionales
                </td>
                <td className="text-center">
                  <Badge bg="primary" className="px-3 py-2">
                    {Object.keys(prices).length} items
                  </Badge>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleFinalSave}>
          Guardar Todos los Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DiscountConfigModal = ({ show, handleClose }) => {
  const { discountPercentage, updateDiscountPercentage } = useStore();
  const [percentage, setPercentage] = useState(10);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (discountPercentage) {
      setPercentage(discountPercentage);
    }
  }, [discountPercentage]);

  const handleSave = async () => {
    try {
      const numericPercentage = parseFloat(percentage);
      if (isNaN(numericPercentage) || numericPercentage < 0 || numericPercentage > 100) {
        setSaveStatus("Error: El porcentaje debe ser un número entre 0 y 100");
        return;
      }

      const success = await updateDiscountPercentage(numericPercentage);
      if (success) {
        setSaveStatus("Porcentaje actualizado correctamente");
        setTimeout(() => handleClose(), 1500);
      } else {
        setSaveStatus("Error al actualizar el porcentaje");
      }
    } catch (error) {
      console.error("Error al guardar el porcentaje:", error);
      setSaveStatus("Error: " + error.message);
    }

    setTimeout(() => setSaveStatus(""), 3000);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Configurar Porcentaje de Descuento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {saveStatus && (
          <div
            className={`alert alert-${
              saveStatus.includes("Error") ? "danger" : "success"
            } mb-3`}
          >
            {saveStatus}
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Porcentaje de descuento para pagos en efectivo</Form.Label>
          <div className="input-group">
            <Form.Control
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0"
              max="100"
              step="1"
            />
            <span className="input-group-text">%</span>
          </div>
          <Form.Text className="text-muted">
            Este porcentaje se aplicará automáticamente a todas las ventas en efectivo.
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-0">
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

const Home = () => {
  const { changeBackground } = useContext(ThemeContext);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const { extrasPrices, discountPercentage = 10, fetchDiscountPercentage } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDiscount = async () => {
      setLoading(true);
      await fetchDiscountPercentage();
      setLoading(false);
    };
    
    loadDiscount();
  }, [fetchDiscountPercentage]);

  return (
    <>
      <div className="row">
        <div className="col-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Productos</h4>
            <button
              className="btn btn-outline-primary btn-sm d-flex align-items-center"
              style={{
                borderRadius: "20px",
                padding: "8px 16px",
                border: "1px solid #ff6b00",
                color: "#ff6b00",
                transition: "all 0.3s ease",
                backgroundColor: "transparent",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#ff6b00";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#ff6b00";
              }}
              onClick={() => setShowConfigModal(true)}
            >
              <i className="fas fa-cog me-2"></i>
              Configurar Adicionales
            </button>
          </div>
          <FavoriteMenu />
        </div>

        <div className="col-4">
          <div style={{ top: "20px" }}>
            <div className="mb-4">
              <Cart />
            </div>

            <div
              className="card border-0"
              style={{
                background: "#ff6b00",
                borderRadius: "15px",
                padding: "20px",
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    flexShrink: 0,
                  }}
                >
                  <i className="fas fa-percentage text-primary"></i>
                </div>
                <div>
                  <h4 className="text-white mb-2">¡Descuento Especial!</h4>
                  <div className="d-flex align-items-center gap-2">
                    {loading ? (
                      <span
                        className="bg-white rounded-pill px-3 py-1"
                        style={{
                          color: "#ff6b00",
                          fontWeight: "bold",
                          width: "80px",
                          height: "28px",
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
                            background: "linear-gradient(90deg, #f0f0f0, #ffffff, #f0f0f0)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite",
                          }}
                        />
                        <style>
                          {`
                            @keyframes shimmer {
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
                      <span
                        className="bg-white rounded-pill px-3 py-1"
                        style={{
                          color: "#ff6b00",
                          fontWeight: "bold",
                        }}
                      >
                        {discountPercentage}% OFF
                      </span>
                    )}
                    <span className="text-white">en pagos en efectivo</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-top border-white border-opacity-25 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center text-white">
                  <i className="fas fa-info-circle me-2"></i>
                  <small>
                    El descuento se aplica automáticamente al seleccionar pago
                    en efectivo
                  </small>
                </div>
                <button
                  className="btn btn-sm btn-light"
                  style={{
                    borderRadius: "20px",
                    padding: "8px 16px",
                    border: "1px solid #ff6b00",
                    color: "#ff6b00",
                    transition: "all 0.3s ease",
                    backgroundColor: "white",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#ff6b00";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#ff6b00";
                  }}
                  onClick={() => setShowDiscountModal(true)}
                >
                  <i className="fas fa-cog me-2"></i>
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfigModal
        show={showConfigModal}
        handleClose={() => setShowConfigModal(false)}
      />
      
      <DiscountConfigModal 
        show={showDiscountModal}
        handleClose={() => setShowDiscountModal(false)}
      />
    </>
  );
};

export default Home;
