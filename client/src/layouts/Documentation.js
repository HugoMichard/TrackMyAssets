import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, useLocation } from "react-router-dom";

import DocumentationNavbar from "components/navbars/DocumentationNavbar.js";
import DocumentationSidebar from "components/sidebars/DocumentationSidebar.js";

import routes from "routers/routes.js";

var ps;

function Documentation(props) {
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

  return (
    <div className="wrapper">
      <DocumentationSidebar
        {...props}
      />
      <div className="main-panel" ref={mainPanel}>
        <DocumentationNavbar {...props} />
        <Switch>
            {allRoutes.map((prop, key) => {
                const MainContent = prop.component;
                return (
                <Route
                    path={prop.path}
                    render={(props) => (
                      <MainContent {...props}/>
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

export default Documentation;
