import React, { useEffect, useState } from "react";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import useStore from "../../../store/store/useStore";

const CustomizationModal = ({ show, handleClose, product }) => {
  const { addExtra, removeExtra, extrasPrices } = useStore();
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    setSelectedExtras(product?.extras || []);
  }, [product]);

  const handleExtraChange = (extra) => {
    setSelectedExtras((prev) =>
      prev.includes(extra)
        ? prev.filter((item) => item !== extra)
        : [...prev, extra]
    );
  };

  const handleSave = async () => {
    try {
      console.log("Estado actual:", {
        productExtras: product.extras,
        selectedExtras: selectedExtras,
        cartId: product.cartId,
      });

      // Primero removemos los extras que ya no están seleccionados
      const extrasToRemove = product.extras.filter(
        (extra) => !selectedExtras.includes(extra)
      );

      // Luego identificamos los nuevos extras a agregar
      const extrasToAdd = selectedExtras.filter(
        (extra) => !product.extras.includes(extra)
      );

      // Removemos los extras no deseados
      for (const extra of extrasToRemove) {
        await removeExtra(product.cartId, extra);
      }

      // Agregamos los nuevos extras
      for (const extra of extrasToAdd) {
        await addExtra(product.cartId, extra);
      }

      setSaveStatus("Cambios guardados correctamente");
      setTimeout(() => {
        setSaveStatus("");
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setSaveStatus("Error al guardar los cambios");
      setTimeout(() => setSaveStatus(""), 1500);
    }
  };

  if (!product) return null;

  const availableExtras = extrasPrices ? Object.keys(extrasPrices) : [];
  const totalExtras = selectedExtras.reduce(
    (total, extra) => total + (extrasPrices?.[extra] || 0),
    0
  );

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton className="border-0">
        <Modal.Title>
          <div className="d-flex flex-column">
            <h5 className="mb-1">Personalizar Pedido</h5>
            <div className="text-muted fs-6">
              {product.name} -
              <Badge bg="primary" className="ms-2">
                Total Adicionales: ${totalExtras}
              </Badge>
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

        <div className="table-responsive">
          <Table hover className="table-striped">
            <thead className="bg-light">
              <tr>
                <th className="py-3">Selección</th>
                <th className="py-3">Adicional</th>
                <th className="py-3 text-end">Precio</th>
                <th className="py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {availableExtras.map((extra) => {
                const isSelected = selectedExtras.includes(extra);
                return (
                  <tr
                    key={extra}
                    onClick={() => handleExtraChange(extra)}
                    style={{ cursor: "pointer" }}
                    className={isSelected ? "table-active" : ""}
                  >
                    <td className="py-3">
                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          id={`extra-${extra}`}
                        />
                      </div>
                    </td>
                    <td className="py-3">
                      <label
                        className="form-check-label"
                        htmlFor={`extra-${extra}`}
                        style={{ cursor: "pointer" }}
                      >
                        {extra}
                      </label>
                    </td>
                    <td className="py-3 text-end">
                      <span className="fw-bold">
                        ${extrasPrices?.[extra] || 0}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge
                        bg={isSelected ? "success" : "secondary"}
                        className="px-3 py-2"
                      >
                        {isSelected ? "Agregado" : "Disponible"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-light">
              <tr>
                <td colSpan="2" className="fw-bold">
                  Total Seleccionado
                </td>
                <td className="text-end fw-bold">${totalExtras}</td>
                <td className="text-center">
                  <Badge bg="primary" className="px-3 py-2">
                    {selectedExtras.length} items
                  </Badge>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomizationModal;
