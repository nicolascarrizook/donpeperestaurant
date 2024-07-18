import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Nav } from 'react-bootstrap';
import useStore from '../../../store/store/useStore';
import MenuList from './Favorite/MenuList';

const FavoriteMenu = () => {
    const { products, fetchProducts, addToCart } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Grid');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const foodProducts = products.filter(product =>
        product.category.toLowerCase() === 'comida' &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            {activeTab === 'Grid' && (
                <div className="search-bar mb-3">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control"
                    />
                </div>
            )}
            <Tab.Container defaultActiveKey="Grid" onSelect={(tab) => setActiveTab(tab)}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <Nav as="ul" className="grid-tab nav nav-pills" id="list-tab" role="tablist">
                        <Nav.Item as="li" className="nav-item" role="presentation">
                            <Nav.Link as="button" className="nav-link me-3" id="pills-home-tab" eventKey="List">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cup-straw" viewBox="0 0 16 16">
                                    <path d="M13.902.334a.5.5 0 0 1-.28.65l-2.254.902-.4 1.927c.376.095.715.215.972.367.228.135.56.396.56.82q0 .069-.011.132l-.962 9.068a1.28 1.28 0 0 1-.524.93c-.488.34-1.494.87-3.01.87s-2.522-.53-3.01-.87a1.28 1.28 0 0 1-.524-.93L3.51 5.132A1 1 0 0 1 3.5 5c0-.424.332-.685.56-.82.262-.154.607-.276.99-.372C5.824 3.614 6.867 3.5 8 3.5c.712 0 1.389.045 1.985.127l.464-2.215a.5.5 0 0 1 .303-.356l2.5-1a.5.5 0 0 1 .65.278M9.768 4.607A14 14 0 0 0 8 4.5c-1.076 0-2.033.11-2.707.278A3.3 3.3 0 0 0 4.645 5c.146.073.362.15.648.222C5.967 5.39 6.924 5.5 8 5.5c.571 0 1.109-.03 1.588-.085zm.292 1.756C9.445 6.45 8.742 6.5 8 6.5c-1.133 0-2.176-.114-2.95-.308a6 6 0 0 1-.435-.127l.838 8.03c.013.121.06.186.102.215.357.249 1.168.69 2.438.69s2.081-.441 2.438-.69c.042-.029.09-.094.102-.215l.852-8.03a6 6 0 0 1-.435.127 9 9 0 0 1-.89.17zM4.467 4.884s.003.002.005.006zm7.066 0-.005.006zM11.354 5a3 3 0 0 0-.604-.21l-.099.445.055-.013c.286-.072.502-.149.648-.222" />
                                </svg>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item " role="presentation">
                            <Nav.Link as="button" className="nav-link" id="pills-grid-tab" eventKey="Grid">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shop-window" viewBox="0 0 16 16">
                                    <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5m2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5" />
                                </svg>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <Tab.Content>
                    <Tab.Pane eventKey="List">
                        <MenuList />
                    </Tab.Pane>
                    <Tab.Pane eventKey="Grid">
                        <div className="row">
                            {foodProducts.map((item, ind) => (
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
                                                    <h3 className="mb-0 text-primary">$ {item.price}</h3>
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
    )
}
export default FavoriteMenu;
