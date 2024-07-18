import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tab } from 'react-bootstrap';
import useStore from '../../../../store/store/useStore';

const MenuList = () => {
    const { products, fetchProducts, addToCart } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.category.toLowerCase() === 'bebida' &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            <div className="search-bar mb-3">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control"
                />
            </div>
            <Tab.Container defaultActiveKey="Grid">
                <Tab.Content>
                    <Tab.Pane eventKey="Grid">
                        <div className="row">
                            {filteredProducts.map((item, ind) => (
                                <div className="col-xl-6 col-xxl-6 col-sm-6" key={ind}>
                                    <div className="card dishe-bx b-hover style-1"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        <div className="card-body pb-0 pt-3">
                                            <div className="border-bottom pb-3">
                                                <h4 className="font-w500 mb-1">
                                                    <Link to={"#"}>{item.name}</Link>
                                                </h4>
                                                <h5 className="font-w400 mb-0">{item.description}</h5>
                                            </div>
                                        </div>
                                        <div className="card-footer border-0 pt-4">
                                            <div className="common d-flex align-items-center justify-content-between">
                                                <div>
                                                    <Link to={"#"}><h4>{item.name}</h4></Link>
                                                    <h3 className="mb-0 text-primary">${item.price}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    );
}

export default MenuList;
