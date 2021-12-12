import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { useLocation } from "react-router-dom";
import NotificationAlert from "react-notification-alert";

import DisconnectedNavbar from "components/navbars/DisconnectedNavbar.js";
import WelcomeNavbar from "components/navbars/WelcomeNavbar.js";

import Login from "views/users/Login.js"
import Register from "views/users/Register.js"
import Welcome from "views/users/Welcome.js"


var ps;

function getRequestedViewComponent(pathname) {
  if(pathname === "/login") {return Login}
  else{
    if(pathname === "/register") {return Register}
    else {return Welcome}
  }
}

function getNavbarToDisplay(pathname) {
  console.log(pathname)
  if(pathname === "/login" || pathname === "/register") {
    return DisconnectedNavbar
  }
  else {
    return WelcomeNavbar
  }
}

function Connection(props) {
    const ViewComponent = getRequestedViewComponent(props.location.pathname);
    const DisplayedNavbar = getNavbarToDisplay(props.location.pathname);
    const mainPanel = React.useRef();
    const location = useLocation();
    React.useEffect(() => {
      if (navigator.platform.indexOf("Win") > -1) {
        ps = new PerfectScrollbar(mainPanel.current);
        document.body.classList.toggle("perfect-scrollbar-on");
      }
      return function cleanup() {
        if (navigator.platform.indexOf("Win") > -1) {
          ps.destroy();
          document.body.classList.toggle("perfect-scrollbar-on");
        }
      };
    });
    React.useEffect(() => {
      mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }, [location]);

    const notify = React.createRef();
    const displayNotification = (notify, message, severity) => {
      const icon = severity === "success" ? "nc-check-2" : "nc-bell-55"
      const options = {
        place: "tc",
        message: (
          <div>
            <div>
              {message}
            </div>
          </div>
        ),
        type: severity,
        icon: "nc-icon " + icon,
        autoDismiss: 3,
      };
      notify.current.notificationAlert(options);
    }
    return (
      <div className="wrapper">
        <div className="main-panel" id="full_width_main_panel" ref={mainPanel}>
          <DisplayedNavbar {...props} />
          <NotificationAlert ref={notify} zIndex={9999} />
          <ViewComponent
            notify={notify}
            displayNotification={displayNotification}/>
        </div>
      </div>
    );
  }

export default Connection;
