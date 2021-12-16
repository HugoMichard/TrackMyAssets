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
  //const routes = "coucou";
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
          href="/app/dashboard"
          className="simple-text logo-mini"
        >
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
        <a
          href="/app/dashboard"
          className="simple-text logo-normal"
        >
          Track My Assets
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
            <li className={checkActiveRoute(pathname, "dashboard") ? "active" : ""}>
                <NavLink
                    to={"/app/dashboard"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "dashboard") ? "active" : ""}
                    >
                    <i className="nc-icon nc-layout-11" />
                    <p>Dashboard</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "portfolio") ? "active" : ""}>
                <NavLink
                    to={"/app/portfolio"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "portfolio") ? "active" : ""}
                    >
                    <i className="nc-icon nc-chart-pie-36" />
                    <p>Portfolio</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "orders") ? "active" : ""}>
                <NavLink
                    to={"/app/orders"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "orders") ? "active" : ""}
                    >
                    <i className="nc-icon nc-paper" />
                    <p>Orders</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "assets") ? "active" : ""}>
                <NavLink
                    to={"/app/assets"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "assets") ? "active" : ""}
                    >
                    <i className="nc-icon nc-bank" />
                    <p>Assets</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "dexs") ? "active" : ""}>
                <NavLink
                    to={"/app/dexs"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "dexs") ? "active" : ""}
                    >
                    <i className="nc-icon nc-globe" />
                    <p>Dexs</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "wires") ? "active" : ""}>
                <NavLink
                    to={"/app/wires"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "wires") ? "active" : ""}
                    >
                    <i className="nc-icon nc-send" />
                    <p>Wires</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "categories") ? "active" : ""}>
                <NavLink
                    to={"/app/categories"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "categories") ? "active" : ""}
                    >
                    <i className="nc-icon nc-bullet-list-67" />
                    <p>Categories</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "platforms") ? "active" : ""}>
                <NavLink
                    to={"/app/platforms"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "platforms") ? "active" : ""}
                    >
                    <i className="nc-icon nc-laptop" />
                    <p>Platforms</p>
                </NavLink>
            </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
