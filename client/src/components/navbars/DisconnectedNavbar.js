import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Container,
  Button
} from "reactstrap";


function Header(props) {
  const sidebarToggle = React.useRef();
  const location = useLocation();
  const getBrand = () => {
    return "TrackMyAssets";
  };
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
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color="transparent"
      expand="lg"
      className={"navbar-absolute fixed-top navbar-transparent "}
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <NavbarBrand href="/login">{getBrand()}</NavbarBrand>
        </div>
        <div>
        <Link to="/login">
          <Button
            className="btn-round justify-content-end"
            color="primary">
                Login
          </Button>
        </Link>
        <Link to="register">
          <Button
          className="btn-round justify-content-end"
          color="primary">
              Register
          </Button>
        </Link>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
