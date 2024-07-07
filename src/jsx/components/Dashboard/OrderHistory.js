import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import useStore from '../../../store/store/useStore';

function OrderHistory() {
    const [dropValue, setDropValue] = useState('Recently');
    const { products, fetchProducts } = useStore();

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
                                            <th className="bg-none sorting_asc" >
                                                <div className="form-check style-3">
                                                    <input className="form-check-input" type="checkbox" value="" id="checkAll" onClick={() => checkboxFun('all')} />
                                                </div>
                                            </th>
                                            <th>Nombre del producto</th>
                                            <th>Categoria</th>
                                            <th>Descripción</th>
                                            <th>Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex align-items-center justify-content-sm-between justify-content-center flex-wrap pagination-bx px-4 py-3">
                                <div className="mb-sm-0 mb-3 pagination-title">
                                    <p className="mb-0"><span>Showing 1-{products.length}</span> from <span>{products.length}</span> data</p>
                                </div>
                                <nav>
                                    <ul className="pagination pagination-gutter mb-0">
                                        <li className="page-item page-indicator">
                                            <Link to={"#"} className="page-link">
                                                <i className="la la-angle-left"></i>
                                            </Link>
                                        </li>
                                        <li className="page-item active">
                                            <Link to={"#"} className="page-link">1</Link>
                                        </li>
                                        <li className="page-item">
                                            <Link to={"#"} className="page-link">2</Link>
                                        </li>
                                        <li className="page-item">
                                            <Link to={"#"} className="page-link">3</Link>
                                        </li>
                                        <li className="page-item page-indicator">
                                            <Link to={"#"} className="page-link">
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
        </>
    )
}

export default OrderHistory;
