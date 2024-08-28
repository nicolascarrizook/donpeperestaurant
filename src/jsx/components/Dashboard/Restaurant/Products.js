import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import useStore from '../../../../store/store/useStore';

function Products() {
    const [dropValue, setDropValue] = useState('Recently');
    const { products, fetchProducts, updateProduct, deleteProduct } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: 'true',
        category: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const checkboxFun = (type) => {
        setTimeout(() => {
            const checkbox = document.querySelectorAll('.order-history input');
            const motherCheckBox = document.querySelector('.sorting_asc input');
            for (let i = 0; i < checkbox.length; i++) {
                const element = checkbox[i]
                if (type === 'all') {
                    if (motherCheckBox.checked) {
                        element.checked = true
                    } else {
                        element.checked = false
                    }
                } else {
                    if (!element.checked) {
                        motherCheckBox.checked = false
                        break
                    } else {
                        motherCheckBox.checked = true
                    }
                }
            }
        }, 200);
    }

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setProduct(product);
        setShowModal(true);
    };

    const handleDelete = (productId) => {
        deleteProduct(productId);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setProduct({
            name: '',
            description: '',
            price: '',
            stock: 'true',
            category: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProduct(product);
        handleModalClose();
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card h-auto">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-list i-table style-1 mb-0 border-0" id="guestTable-all3">
                                    <thead>
                                        <tr>
                                            <th className="bg-none sorting_asc">
                                                <div className="form-check style-3">
                                                    <input className="form-check-input" type="checkbox" value="" id="checkAll" onClick={() => checkboxFun('all')} />
                                                </div>
                                            </th>
                                            <th>Nombre del producto</th>
                                            <th>Categoria</th>
                                            <th>Descripción</th>
                                            <th>Precio</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map((product, index) => (
                                            <tr key={product.id}>
                                                <td className='order-history'>
                                                    <div className="form-check style-3">
                                                        <input className="form-check-input" type="checkbox" value="" onClick={() => checkboxFun()} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="media-bx d-flex py-3 align-items-center">
                                                        <div>
                                                            <h5 className="mb-0">{product.name}</h5>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <p className="mb-0">{product.category}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <p className="mb-0">{product.description}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <h4 className="text-primary">${product.price}</h4>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger ms-2"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex align-items-center justify-content-sm-between justify-content-center flex-wrap pagination-bx px-4 py-3">
                                <div className="mb-sm-0 mb-3 pagination-title">
                                    <p className="mb-0"><span>Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)}</span> de <span>{products.length}</span> datos</p>
                                </div>
                                <nav>
                                    <ul className="pagination pagination-gutter mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <Link to={"#"} className="page-link" onClick={() => currentPage > 1 && paginate(currentPage - 1)}>
                                                <i className="la la-angle-left"></i>
                                            </Link>
                                        </li>
                                        {[...Array(totalPages).keys()].map(number => (
                                            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                                <Link to={"#"} className="page-link" onClick={() => paginate(number + 1)}>
                                                    {number + 1}
                                                </Link>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <Link to={"#"} className="page-link" onClick={() => currentPage < totalPages && paginate(currentPage + 1)}>
                                                <i className="la la-angle-right"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={handleModalClose}>
                <div className="modal-header">
                    <h5 className="modal-title">Agregar/Editar Producto</h5>
                    <button type="button" className="btn-close" onClick={handleModalClose}></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-inside">
                            <label htmlFor="name" className="form-label">Nombre del producto</label>
                            <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={handleChange} required />
                        </div>
                        <div className="modal-inside">
                            <label htmlFor="description" className="form-label">Descripción del producto</label>
                            <input type="text" className="form-control" id="description" name="description" value={product.description} onChange={handleChange} required />
                        </div>
                        <div className="modal-inside">
                            <label htmlFor="price" className="form-label mb-2">Precio unitario</label>
                            <input type="number" className="form-control" id="price" name="price" value={product.price} onChange={handleChange} required />
                        </div>
                        <div className="modal-inside">
                            <label htmlFor="stock" className="form-label mb-2">En stock</label>
                            <select className="form-select" id="stock" name="stock" value={product.stock} onChange={handleChange} required>
                                <option value="true">Sí</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div className="modal-inside">
                            <label htmlFor="category" className="form-label mb-2">Categoría</label>
                            <select className="form-select" id="category" name="category" value={product.category} onChange={handleChange} required>
                                <option value="" disabled>Seleccionar</option>
                                <option value="Comida">Comida</option>
                                <option value="Bebida">Bebida</option>
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default Products;
