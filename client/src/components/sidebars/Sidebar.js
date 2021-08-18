import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import logo from "logo.svg";

var ps;

// verifies if routeName is the one active (in browser input)
function checkActiveRoute(pathname, toCheck) {
  return "/admin/" + toCheck === pathname;
}

function Sidebar(props) {
  const sidebar = React.useRef();
  const pathname = props.location.pathname;
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  return (
    <div
      className="sidebar"
      data-color="black"
      data-active-color="danger"
    >
      <div className="logo">
        <a
          href="https://www.creative-tim.com"
          className="simple-text logo-mini"
        >
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
        <a
          href="https://www.creative-tim.com"
          className="simple-text logo-normal"
        >
          Creative Tim
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
            <li className={checkActiveRoute(pathname, "dashboard") ? "active" : ""}>
                <NavLink
                    to={"/admin/dashboard"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "dashboard") ? "active" : ""}
                    >
                    <i className="nc-icon nc-tile-56" />
                    <p>Dashboard</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "tables") ? "active" : ""}>
                <NavLink
                    to={"/admin/tables"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "tables") ? "active" : ""}
                    >
                    <i className="nc-icon nc-bank" />
                    <p>Assets</p>
                </NavLink>
            </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
