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

const Home = () => {
  const { changeBackground } = useContext(ThemeContext);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const { extrasPrices } = useStore();

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
                    <span
                      className="bg-white rounded-pill px-3 py-1"
                      style={{
                        color: "#ff6b00",
                        fontWeight: "bold",
                      }}
                    >
                      10% OFF
                    </span>
                    <span className="text-white">en pagos en efectivo</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-top border-white border-opacity-25">
                <div className="d-flex align-items-center text-white">
                  <i className="fas fa-info-circle me-2"></i>
                  <small>
                    El descuento se aplica automáticamente al seleccionar pago
                    en efectivo
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfigModal
        show={showConfigModal}
        handleClose={() => setShowConfigModal(false)}
      />
    </>
  );
};

export default Home;
