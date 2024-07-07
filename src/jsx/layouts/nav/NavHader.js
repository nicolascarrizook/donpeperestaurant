import React, { useContext, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

export function  NavMenuToggle(){
	setTimeout(()=>{	
		let mainwrapper = document.querySelector("#main-wrapper");
		if(mainwrapper.classList.contains('menu-toggle')){
			mainwrapper.classList.remove("menu-toggle");
		}else{
			mainwrapper.classList.add("menu-toggle");
		}
	},200);
}


const NavHader = () => {
  const [toggle, setToggle] = useState(false);
  const { navigationHader, openMenuToggle, background } = useContext(
    ThemeContext
  );
  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo">
      
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          //openMenuToggle();
         NavMenuToggle();
        }}
      >
      </div>
    </div>
  );
};

export default NavHader;
