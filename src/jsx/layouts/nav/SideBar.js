/// Menu
import React, { useCallback, useContext, useState } from "react";

/// Scroll
import { Collapse } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

/// Link
import { Link, NavLink, useLocation } from "react-router-dom";

import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { MenuList } from "./Menu";

// Estilos inline para hover
const menuItemStyle = {
  transition: "all 0.3s ease",
  cursor: "pointer",
};

const menuLinkStyle = {
  transition: "all 0.3s ease",
  ":hover": {
    backgroundColor: "#f8f9fa",
    transform: "translateX(5px)",
  },
};

const MenuItem = ({
  item,
  activeMenu,
  activeSubmenu,
  onMenuClick,
  onSubmenuClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === item.to;

  if (item.classsChange === "menu-title") {
    return (
      <li className="menu-title">
        <span>{item.title}</span>
      </li>
    );
  }

  return (
    <li
      className={`${activeMenu === item.title ? "mm-active" : ""}`}
      style={menuItemStyle}
    >
      {item.content && item.content.length > 0 ? (
        <Link
          to="#"
          className="has-arrow ai-icon"
          onClick={() => onMenuClick(item.title)}
          style={menuLinkStyle}
        >
          <i className={item.iconStyle}></i>
          <span className="nav-text">{item.title}</span>
        </Link>
      ) : (
        <NavLink
          to={item.to}
          className={`ai-icon ${isActive ? "mm-active" : ""}`}
          style={menuLinkStyle}
        >
          <i className={item.iconStyle}></i>
          <span className="nav-text">{item.title}</span>
        </NavLink>
      )}
      <SubMenu
        isOpen={activeMenu === item.title}
        items={item.content}
        activeSubmenu={activeSubmenu}
        onSubmenuClick={onSubmenuClick}
      />
    </li>
  );
};

const SubMenu = ({ isOpen, items, activeSubmenu, onSubmenuClick }) => {
  if (!items) return null;

  return (
    <Collapse in={isOpen}>
      <ul className={`mm-collapse ${isOpen ? "mm-show" : ""}`}>
        {items.map((item, index) => (
          <SubMenuItem
            key={index}
            item={item}
            activeSubmenu={activeSubmenu}
            onSubmenuClick={onSubmenuClick}
          />
        ))}
      </ul>
    </Collapse>
  );
};

const SubMenuItem = ({ item, activeSubmenu, onSubmenuClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.to;

  return (
    <li
      className={`${activeSubmenu === item.title ? "mm-active" : ""}`}
      style={menuItemStyle}
    >
      {item.content && item.content.length > 0 ? (
        <>
          <NavLink
            to={item.to}
            className={`${item.hasMenu ? "has-arrow" : ""} ${
              isActive ? "mm-active" : ""
            }`}
            onClick={() => onSubmenuClick(item.title)}
            style={menuLinkStyle}
          >
            {item.title}
          </NavLink>
          <Collapse in={activeSubmenu === item.title}>
            <ul
              className={`mm-collapse ${
                activeSubmenu === item.title ? "mm-show" : ""
              }`}
            >
              {item.content.map((subItem, index) => (
                <li key={index} style={menuItemStyle}>
                  <Link
                    className={
                      location.pathname === subItem.to ? "mm-active" : ""
                    }
                    to={subItem.to}
                    style={menuLinkStyle}
                  >
                    {subItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Collapse>
        </>
      ) : (
        <Link
          to={item.to}
          className={isActive ? "mm-active" : ""}
          style={menuLinkStyle}
        >
          {item.title}
        </Link>
      )}
    </li>
  );
};

const SideBar = () => {
  const { iconHover, sidebarposition, headerposition, sidebarLayout } =
    useContext(ThemeContext);
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubmenu, setActiveSubmenu] = useState("");
  const [hideOnScroll, setHideOnScroll] = useState(true);

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  const handleMenuClick = useCallback(
    (menuTitle) => {
      setActiveMenu(activeMenu === menuTitle ? "" : menuTitle);
    },
    [activeMenu]
  );

  const handleSubmenuClick = useCallback(
    (submenuTitle) => {
      setActiveSubmenu(activeSubmenu === submenuTitle ? "" : submenuTitle);
    },
    [activeSubmenu]
  );

  const sidebarClass = `dlabnav border-right ${iconHover} ${
    sidebarposition.value === "fixed" &&
    sidebarLayout.value === "horizontal" &&
    headerposition.value === "static"
      ? hideOnScroll > 120
        ? "fixed"
        : ""
      : ""
  }`;

  return (
    <div className={sidebarClass}>
      <PerfectScrollbar className="dlabnav-scroll">
        <ul className="metismenu" id="menu">
          {MenuList.map((item, index) => (
            <MenuItem
              key={index}
              item={item}
              activeMenu={activeMenu}
              activeSubmenu={activeSubmenu}
              onMenuClick={handleMenuClick}
              onSubmenuClick={handleSubmenuClick}
            />
          ))}
        </ul>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
