import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/paper/assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/paper/assets/demo/demo.css";
import "assets/css/common.css";
import "assets/css/welcome.css";
import "assets/css/cards.css";
import "assets/css/tiles.css";
import "assets/css/contact.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "@pathofdev/react-tag-input/build/index.css";

import AdminLayout from "layouts/Admin.js";
import ConnectionLayout from "layouts/Connection.js";
import DocumentationLayout from "layouts/Documentation.js";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/login" render={(props) => <ConnectionLayout {...props} />} />
      <Route path="/register" render={(props) => <ConnectionLayout {...props} />} />
      <Route path="/docs" render={(props) => <DocumentationLayout {...props} />} />
      <Route path="/app" render={(props) => <AdminLayout {...props} />} />
      <Route path="/" render={(props) => <ConnectionLayout {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
