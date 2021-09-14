import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, useLocation } from "react-router-dom";

import ConnectedNavbar from "components/navbars/ConnectedNavbar.js";
import Sidebar from "components/sidebars/Sidebar.js";
import AuthService from 'services/auth'

import routes from "routers/routes.js";
import NotificationAlert from "react-notification-alert";

var ps;

function Dashboard(props) {
  const user = AuthService.getCurrentUser();
  if(!user) {
    window.location = "/login"
  }
  const mainPanel = React.useRef();
  const location = useLocation();
  var allRoutes = [];
  for (const [layout, paths] of Object.entries(routes)) {
    for (const [path, comp] of Object.entries(paths)) {
        allRoutes.push({"path": layout + path, "component": comp});
    }
  }
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
      <Sidebar
        {...props}
      />
      <div className="main-panel" ref={mainPanel}>
        <ConnectedNavbar {...props} />
        <NotificationAlert ref={notify} zIndex={9999} />
        <Switch>
            {allRoutes.map((prop, key) => {
                const MainContent = prop.component;
                return (
                <Route
                    path={prop.path}
                    render={(props) => (
                      <MainContent
                        {...props}
                        notify={notify}
                        displayNotification={displayNotification}/>
                    )}
                    key={key}
                />
                );
            })}
        </Switch>

      </div>
    </div>
  );
}

export default Dashboard;
