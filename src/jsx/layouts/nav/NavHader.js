import React from "react";
import { Link } from "react-router-dom";

const NavHader = () => {
  return (
    <div className="nav-header d-flex justify-content-between align-items-center">
      <Link to="/dashboard" className="brand-logo">
        <img src="/logo.png" alt="Logo" className="brand-title" />
      </Link>
      <div className="brand-title text-center">
        <h4 className="mb-0">Sistema</h4>
        <span className="brand-sub-title">Gestión de Pedidos</span>
      </div>
      <div className="brand-logo invisible">
        <img src="/logo.png" alt="" className="brand-title invisible" />
      </div>
    </div>
  );
};

export default NavHader;
