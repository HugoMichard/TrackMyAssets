import Dashboard from "assets/paper/views/Dashboard.js";
import Login from "views/users/Login.js";
import Register from "views/users/Register.js";
import Notifications from "assets/paper/views/Notifications.js";
import Icons from "assets/paper/views/Icons.js";
import Typography from "assets/paper/views/Typography.js";
import Tables from "assets/paper/views/Tables.js";
import Maps from "assets/paper/views/Map.js";
import UserPage from "assets/paper/views/User.js";
import UpgradeToPro from "assets/paper/views/Upgrade.js";

var routes = {
  "/admin": {
    "/dashboard": Dashboard,
    "/tables": Tables
  },
  "/login": {
    "/": Login
  },
  "/register": {
    "/": Register
  }
}
export default routes;
