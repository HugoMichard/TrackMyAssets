import Dashboard from "views/dashboard/Dashboard.js";

import Login from "views/users/Login.js";
import Register from "views/users/Register.js";

import Tables from "assets/paper/views/Tables.js";

import IndexAsset from "views/assets/Index.js";
import CreateAsset from "views/assets/Create.js";
import DetailAsset from "views/assets/Detail.js";

import IndexCategories from "views/categories/Index.js";
import CreateCategory from "views/categories/Create.js";
import DetailCategory from "views/categories/Detail.js";


var routes = {
  "/users": {
    "/login": Login,
    "/register": Register
  },
  "/dashboard": {
    "/": Dashboard
  },
  "/tables": {
    "/": Tables
  },
  "/assets": {
    "/create": CreateAsset,
    "/:ast_id": DetailAsset,
    "/": IndexAsset
  },
  "/categories": {
    "/create": CreateCategory,
    "/:cat_id": DetailCategory,
    "/": IndexCategories
  }
}
export default routes;
