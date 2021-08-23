import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/paper/assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/paper/assets/demo/demo.css";
import "assets/css/common.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";
import ConnectionLayout from "layouts/Connection.js";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/login" render={(props) => <ConnectionLayout {...props} />} />
      <Route path="/register" render={(props) => <ConnectionLayout {...props} />} />
      <Route path="/" render={(props) => <AdminLayout {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
