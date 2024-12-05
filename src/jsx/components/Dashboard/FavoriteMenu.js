import React, { useEffect, useMemo, useState } from "react";
import { Nav, Spinner, Tab } from "react-bootstrap";
import useStore from "../../../store/store/useStore";

const CATEGORIES = {
  MINUTAS: "comida",
  SANDWICHES: "sandwiches",
  MIGA: "miga",
  PIZZAS: "pizzas",
  CERVEZAS: "cervezas",
  GASEOSAS: "gaseosas",
};

const ITEMS_PER_PAGE = 6; // Número de items por página

const FavoriteMenu = () => {
  const { products, fetchProducts, addToCart } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(CATEGORIES.MINUTAS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      await fetchProducts();
      setIsLoading(false);
    };
    loadProducts();
  }, [fetchProducts]);

  // Reset página cuando cambia la categoría o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category.toLowerCase();
      if (!acc[category]) {
        acc[category] = [];
      }
      if (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        acc[category].push(product);
      }
      return acc;
    }, {});
  }, [products, searchTerm]);

  const handleItemClick = (item) => {
    setSelectedItem(item.id);
    addToCart(item);

    // Resetear la selección después de un momento
    setTimeout(() => {
      setSelectedItem(null);
    }, 500);
  };

  const renderProductGrid = (category) => {
    const productsToShow = productsByCategory[category] || [];
    const totalPages = Math.ceil(productsToShow.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProducts = productsToShow.slice(startIndex, endIndex);

    if (isLoading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando productos...</p>
        </div>
      );
    }

    if (productsToShow.length === 0) {
      return (
        <div className="text-center py-5">
          <p>No se encontraron productos en esta categoría</p>
        </div>
      );
    }

    return (
      <>
        <div className="row g-3">
          {currentProducts.map((item, ind) => (
            <div className="col-xl-6 col-xxl-6 col-sm-6" key={ind}>
              <div
                className="card border"
                style={{
                  borderRadius: "10px",
                  backgroundColor:
                    selectedItem === item.id ? "#fff9f5" : "#fff",
                  border:
                    selectedItem === item.id
                      ? "2px solid #ff6b00"
                      : "1px solid #e5e5e5",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  userSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => handleItemClick(item)}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = "scale(0.98)";
                  e.currentTarget.style.backgroundColor = "#fff9f5";
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  if (selectedItem !== item.id) {
                    e.currentTarget.style.backgroundColor = "#fff";
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff9f5";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (selectedItem !== item.id) {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {selectedItem === item.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#ff6b00",
                      color: "white",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <i className="fas fa-check"></i>
                  </div>
                )}

                <div className="card-body p-4">
                  {/* Título y Precio */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4
                      className="text-primary mb-0"
                      style={{ fontSize: "1.25rem" }}
                    >
                      {item.name}
                    </h4>
                    <h4
                      className="text-primary mb-0"
                      style={{ fontSize: "1.25rem" }}
                    >
                      +${item.price}
                    </h4>
                  </div>

                  {/* Categoría */}
                  <div className="mb-3">
                    <span className="text-muted small">
                      <i className="fas fa-tag me-1"></i> {item.category}
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                    {item.description}
                  </p>

                  {/* Quitamos el botón ya que toda la card es clickeable */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="d-flex align-items-center justify-content-between mt-4 pt-3">
            <small className="text-muted">
              Mostrando {currentProducts.length} de {productsToShow.length}{" "}
              productos
            </small>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                  >
                    <i className="fas fa-chevron-left"></i>
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
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="search-bar mb-3">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm"
        />
      </div>

      <Tab.Container
        defaultActiveKey={CATEGORIES.MINUTAS}
        onSelect={(tab) => setActiveTab(tab)}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Nav className="nav nav-tabs style-1" role="tablist">
            <Nav.Item>
              <Nav.Link eventKey={CATEGORIES.MINUTAS}>Minutas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={CATEGORIES.SANDWICHES}>Sandwiches</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={CATEGORIES.MIGA}>Miga</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={CATEGORIES.PIZZAS}>Pizzas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={CATEGORIES.CERVEZAS}>Cervezas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={CATEGORIES.GASEOSAS}>Gaseosas</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Tab.Content>
          {Object.values(CATEGORIES).map((category) => (
            <Tab.Pane key={category} eventKey={category}>
              {renderProductGrid(category)}
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default FavoriteMenu;
