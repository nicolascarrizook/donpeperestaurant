// Menu.js
import React, { useReducer, useState } from 'react';
import { Modal } from 'react-bootstrap';
import useStore from '../../../../store/store/useStore';
import OrderHistory from '../OrderHistory';

function reducer(state, action) {
    if (action.type === "addMenu") {
        return { ...state, addMenu: !state.addMenu };
    }
}

const Menu = () => {
    const [state, dispatch] = useReducer(reducer, { addMenu: false });
    const { addProduct } = useStore();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: true,
        category: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productToSave = { ...product, price: Number(product.price), stock: product.stock === 'true' };
        await addProduct(productToSave);
        setProduct({ name: '', description: '', price: '', stock: true, category: '' });
        dispatch({ type: 'addMenu' });
    };

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                        <button type="button" className="btn btn-primary mt-3 mt-sm-0" onClick={() => dispatch({ type: 'addMenu' })}>Agregar productos</button>
                    </div>
                </div>
            </div>

            <Modal className="modal fade" show={state.addMenu} onHide={() => dispatch({ type: 'addMenu' })}>
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Agregar productos</h5>
                    <button type="button" className="btn-close" onClick={() => dispatch({ type: 'addMenu' })}></button>
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
                            <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: 'addMenu' })}>Cerrar</button>
                            <button type="submit" className="btn btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
            </Modal>
            <OrderHistory />
        </>
    )
}

export default Menu;
