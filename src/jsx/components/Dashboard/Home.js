import React,{useContext, useEffect, useReducer,  useState} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Modal} from 'react-bootstrap';

//Import Components
import { ThemeContext } from "../../../context/ThemeContext";

import Pic1 from './../../../images/popular-img/review-img/pic-1.jpg';
import Pic2 from './../../../images/popular-img/review-img/pic-2.jpg';
import Pic3 from './../../../images/popular-img/review-img/pic-3.jpg';
import FavoriteMenu from './FavoriteMenu';
import { Cart } from './Cart';

const orderBlog = [
	{id: 1, image:Pic1, number: 1},
	{id: 2, image:Pic2, number: 1},
	{id: 3, image:Pic3, number: 1},
	{id: 4, image:Pic1, number: 1},
];

const reducer = (previousState, updatedState) => ({
	...previousState,
	...updatedState,
});

const Home = () => {
	const [dropSelect, setDropSelect] = useState('Other');
	const { changeBackground } = useContext(ThemeContext);
	const [detailsModal, setDetailsModal] = useState(false);
	const [notesModal, setNotesModal] = useState(false);
	 useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	 }, []);
	
	const [state, setState] = useReducer(reducer, {orderBlog : orderBlog});	
	const handleCountAdd = (e) => {
		let temp = state.orderBlog.map((data) => {
            if (e === data.id) {
                return { ...data, number: data.number + 1 };
            }
            return data;
        });
        setState({orderBlog : temp});
	}
	const handleCountMinus = (e) => {
		let temp = state.orderBlog.map((data) => {
            if (e === data.id) {
                return { ...data, number: data.number > 0 ? data.number - 1 : data.number };
            }
            return data;
        });
        setState({orderBlog : temp});
	}

	return(
		<>
			<div className="row">
				<div className="col-xl-8 col-xxl-7">
					<div className="row">
						<div className="col-xl-12">
							<h4 className="cate-title">Productos</h4>
							<FavoriteMenu />
						</div>
					</div>
				</div>
				<div className="col-xl-4 col-xxl-5">
					<div className="row">
						<div className="col-xl-12">
							<Cart />
						</div>
						<div className="col-xl-12">
							<div className="card bg-primary blance-card-1 border-primary h-100">
								<div className="card-body pe-0 p-4 pb-3">
									<div className="dlab-media d-flex justify-content-between">
										<div className="dlab-content">
											<h4 className="cate-title">Novedades: Descuento por pago en efectivo 10%</h4>
										</div>	
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default Home;