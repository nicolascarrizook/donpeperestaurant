import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Modal, Spinner, Toast } from "react-bootstrap";
import useStore from "../../../../store/store/useStore";

function Products() {
  const { products, fetchProducts, updateProduct, deleteProduct, loading } =
    useStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "true",
    category: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Memoizar productos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Memoizar productos paginados
  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleEdit = (productToEdit) => {
    setSelectedProduct(productToEdit);
    setProduct({
      ...productToEdit,
      stock: productToEdit.stock.toString(),
      price: productToEdit.price.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (productId) => {
    deleteProduct(productId);
  };

  const handleModalClose = () => {
    if (isSaving) {
      return; // No cerrar si está guardando
    }
    setShowModal(false);
    setSelectedProduct(null);
    setProduct({
      name: "",
      description: "",
      price: "",
      stock: "true",
      category: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const productToUpdate = {
        ...product,
        id: selectedProduct.id,
        price: parseFloat(product.price),
        stock: product.stock === "true" || product.stock === true,
        category: product.category.toLowerCase(),
      };

      const success = await updateProduct(productToUpdate);

      if (success) {
        // Actualizar solo el producto en el estado local
        setSelectedProduct(productToUpdate);
        setProduct(productToUpdate);

        setToastMessage({
          type: "success",
          message: "Producto actualizado correctamente",
        });

        // No cerramos el modal
        setIsSaving(false);
      } else {
        setToastMessage({
          type: "error",
          message: "No se pudo actualizar el producto",
        });
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setToastMessage({
        type: "error",
        message: "Error al actualizar el producto",
      });
    } finally {
      setIsSaving(false);
      setShowToast(true);
    }
  };

  // Agregar un efecto para recargar productos cuando cambie la página
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex flex-column gap-1">
                <h4 className="card-title mb-0">Lista de Productos</h4>
                <small className="text-muted">
                  Total de productos: {products.length}
                </small>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <div className="search-box" style={{ minWidth: "300px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Buscar por nombre o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="form-select form-select-sm"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value="10">10 por página</option>
                  <option value="25">25 por página</option>
                  <option value="50">50 por página</option>
                </select>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div>
                              <h6 className="mb-1">{product.name}</h6>
                              <small className="text-muted">
                                ID: #{product.id}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge
                            bg={
                              product.category === "Comida" ? "info" : "success"
                            }
                          >
                            {product.category}
                          </Badge>
                        </td>
                        <td>{product.description}</td>
                        <td className="fw-bold">
                          ${parseFloat(product.price).toFixed(2)}
                        </td>
                        <td>
                          <Badge
                            bg={product.stock === "true" ? "success" : "danger"}
                          >
                            {product.stock === "true" ? "En Stock" : "Agotado"}
                          </Badge>
                        </td>
                        <td>
                          <div className="btn-group">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex align-items-center justify-content-between p-3 border-top">
                <p className="mb-0 text-muted">
                  Mostrando {currentProducts.length} de{" "}
                  {filteredProducts.length} productos
                </p>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, idx) => (
                      <li
                        key={idx + 1}
                        className={`page-item ${
                          currentPage === idx + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(idx + 1)}
                        >
                          {idx + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        backdrop="static" // Previene cerrar al hacer clic fuera
        keyboard={false} // Previene cerrar con la tecla ESC
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto: {selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="minutas">Minutas</option>
                <option value="sandwiches">Sandwiches</option>
                <option value="miga">Miga</option>
                <option value="pizzas">Pizzas</option>
                <option value="cervezas">Cervezas</option>
                <option value="gaseosas">Gaseosas</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                required
              >
                <option value="true">En Stock</option>
                <option value="false">Agotado</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleModalClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              !product.name || !product.price || !product.category || isSaving
            }
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast mejorado */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastMessage.type === "success" ? "success" : "danger"}
          className="animate__animated animate__fadeInRight"
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">
              {toastMessage.type === "success" ? "Éxito" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body
            className={toastMessage.type === "success" ? "text-white" : ""}
          >
            {toastMessage.message}
          </Toast.Body>
        </Toast>
      </div>
    </>
  );
}

export default Products;
