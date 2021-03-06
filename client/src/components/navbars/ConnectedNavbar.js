import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container/*,
  InputGroup,
  InputGroupText,
  InputGroupAddon, 
  Input,*/
} from "reactstrap";

import APIService from "routers/apiservice";
import AuthService from "services/auth";

const navbarTitle = {
  "dashboard": "Dashboard",
  "portfolio": "Portfolio",
  "orders": "Orders",
  "assets": "Assets",
  "dexs": "Dexs",
  "wires": "Wires",
  "categories": "Categories",
  "platforms": "Platforms"
}

function Header(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const location = useLocation();
  const pathname = props.location.pathname;
  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("dark");
    }
    setIsOpen(!isOpen);
  };
  const getBrand = () => {
    return navbarTitle[Object.keys(navbarTitle).find(k => pathname.includes(k))];
  };
  const getBrandLink = () => {
    const key = Object.keys(navbarTitle).find(k => pathname.includes(k));
    return "/app/" + key;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("dark");
    } else {
      setColor("transparent");
    }
  };
  const refresh = () => {
    APIService.refreshPortfolio().then(res => {
      console.log("cool");
    })
  }
  const logout = () => {
    AuthService.logout();
  }
  React.useEffect(() => {
    window.addEventListener("resize", updateColor.bind(this));
  });
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);
  return (
    /*
      <form>
      <InputGroup className="no-border">
        <Input placeholder="Search..." />
        <InputGroupAddon addonType="append">
          <InputGroupText>
            <i className="nc-icon nc-zoom-split" />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </form>
    */
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "dark"
          : color
      }
      expand="lg"
      className={
        props.location.pathname.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute fixed-top"
          : "navbar-absolute fixed-top " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand href={getBrandLink()}>{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <Nav navbar>
            <NavItem>
              <Link 
                className="nav-link btn-magnify" 
                onClick={refresh}
                to="#">
                <i className="nc-icon nc-refresh-69" />
                <p>
                  <span className="d-lg-none d-md-block">Refresh</span>
                </p>
              </Link>
            </NavItem>
            <NavItem>
              <Link onClick={logout} to="/login" className="nav-link btn-rotate">
                <i className="nc-icon nc-button-power" />
                <p>
                  <span className="d-lg-none d-md-block">Disconnect</span>
                </p>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
