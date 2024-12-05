// Menu.js
import React, { useReducer, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import useStore, { CATEGORIES } from "../../../../store/store/useStore";
import Products from "./Products";

function reducer(state, action) {
  if (action.type === "addMenu") {
    return { ...state, addMenu: !state.addMenu };
  }
}

const Menu = () => {
  const [state, dispatch] = useReducer(reducer, { addMenu: false });
  const { addProduct } = useStore();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: true,
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productToSave = {
      ...product,
      price: Number(product.price),
      stock: product.stock === "true",
    };
    await addProduct(productToSave);
    setProduct({
      name: "",
      description: "",
      price: "",
      stock: true,
      category: "",
    });
    dispatch({ type: "addMenu" });
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h4 className="card-title mb-1">Gestión de Productos</h4>
                <p className="text-muted mb-0">
                  Administra el menú de tu restaurante
                </p>
              </div>
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2 rounded-pill px-4"
                onClick={() => dispatch({ type: "addMenu" })}
              >
                <i className="fas fa-plus-circle"></i>
                Nuevo Producto
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={state.addMenu}
        onHide={() => dispatch({ type: "addMenu" })}
        centered
        size="md"
        className="professional-modal"
      >
        <Modal.Header className="bg-light border-0">
          <div className="w-100">
            <h5 className="modal-title fw-bold">Agregar Producto</h5>
            <p className="text-muted small mb-0">
              Complete los datos del nuevo producto
            </p>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch({ type: "addMenu" })}
          />
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Form.Group>
                <Form.Label className="small fw-bold text-primary mb-2">
                  NOMBRE DEL PRODUCTO
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="form-control-solid"
                  required
                />
              </Form.Group>
            </div>

            <div className="mb-4">
              <Form.Group>
                <Form.Label className="small fw-bold text-primary mb-2">
                  DESCRIPCIÓN
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="form-control-solid"
                  required
                />
              </Form.Group>
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="small fw-bold text-primary mb-2">
                    PRECIO
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="form-control-solid"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group>
                  <Form.Label className="small fw-bold text-primary mb-2">
                    CATEGORÍA
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="form-control-solid"
                    required
                  >
                    <option value="" disabled>
                      Seleccionar categoría
                    </option>
                    {Object.values(CATEGORIES).map((category) => (
                      <option key={category} value={category}>
                        {formatCategoryName(category)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="mb-4">
              <Form.Label className="small fw-bold text-primary mb-3">
                DISPONIBILIDAD
              </Form.Label>
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  id="stock-true"
                  label="En stock"
                  name="stock"
                  value="true"
                  checked={product.stock === "true"}
                  onChange={handleChange}
                  className="professional-radio"
                />
                <Form.Check
                  type="radio"
                  id="stock-false"
                  label="Sin stock"
                  name="stock"
                  value="false"
                  checked={product.stock === "false"}
                  onChange={handleChange}
                  className="professional-radio"
                />
              </div>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer className="bg-light border-0">
          <Button
            variant="light"
            onClick={() => dispatch({ type: "addMenu" })}
            className="fw-medium"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="fw-medium px-4"
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Products />

      <style jsx>{`
        .professional-modal .modal-content {
          border: none;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }

        .form-control-solid {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          transition: border-color 0.15s ease-in-out;
        }

        .form-control-solid:focus {
          background-color: #fff;
          border-color: var(--bs-primary);
          box-shadow: none;
        }

        .professional-radio .form-check-input:checked {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
        }

        .professional-radio .form-check-label {
          font-size: 0.875rem;
        }
      `}</style>
    </>
  );
};

export default Menu;
