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
          href="/"
          className="simple-text logo-mini"
        >
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
        <a
          href="/"
          className="simple-text logo-normal"
        >
          Track My Assets
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
            <li className={checkActiveRoute(pathname, "overview") ? "active" : ""}>
                <NavLink
                    to={"/docs/overview"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "overview") ? "active" : ""}
                    >
                    <i className="nc-icon nc-layout-11" />
                    <p>Overview</p>
                </NavLink>
            </li>
            <li className={checkActiveRoute(pathname, "getting-started") ? "active" : ""}>
                <NavLink
                    to={"/docs/getting-started"}
                    className="nav-link"
                    activeClassName={checkActiveRoute(pathname, "getting-started") ? "active" : ""}
                    >
                    <i className="nc-icon nc-chart-pie-36" />
                    <p>Getting Started</p>
                </NavLink>
            </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
