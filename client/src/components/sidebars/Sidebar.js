import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import logo from "logo.svg";

var ps;

// verifies if routeName is the one active (in browser input)
function checkActiveRoute(pathname, toCheck) { return pathname.includes(toCheck);}

function Sidebar(props) {
  const sidebar = React.useRef();
  const pathname = props.location.pathname;
  // TO DO : use if on const dict to generate the list of links
  const routes = "coucou";
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
          href="/dashboard"
          className="simple-text logo-mini"
        >
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
        <a
          href="/dashboard"
          className="simple-text logo-normal"
        >
          Track My Assets
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
            <li className={checkActiveRoute(pathname, "dashboard") ? "active" : ""}>
                <NavLink
                    to={"/dashboard"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "dashboard") ? "active" : ""}
                    >
                    <i className="nc-icon nc-tile-56" />
                    <p>Dashboard</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "orders") ? "active" : ""}>
                <NavLink
                    to={"/orders"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "orders") ? "active" : ""}
                    >
                    <i className="nc-icon nc-paper" />
                    <p>Orders</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "assets") ? "active" : ""}>
                <NavLink
                    to={"/assets"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "assets") ? "active" : ""}
                    >
                    <i className="nc-icon nc-bank" />
                    <p>Assets</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "categories") ? "active" : ""}>
                <NavLink
                    to={"/categories"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "categories") ? "active" : ""}
                    >
                    <i className="nc-icon nc-bullet-list-67" />
                    <p>Categories</p>
                </NavLink>
            </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
