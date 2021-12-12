import Dashboard from "views/dashboard/Dashboard.js";

import Login from "views/users/Login.js";
import Register from "views/users/Register.js";
import Welcome from "views/users/Welcome.js";

import IndexAssets from "views/assets/Index.js";
import CreateAsset from "views/assets/Create.js";
import DetailAsset from "views/assets/Detail.js";
import DeleteAsset from "views/assets/Delete.js";

import IndexOrders from "views/orders/Index.js";
import CreateOrder from "views/orders/Create.js";
import DetailOrder from "views/orders/Detail.js";

import IndexCategories from "views/categories/Index.js";
import CreateCategory from "views/categories/Create.js";
import DetailCategory from "views/categories/Detail.js";

import IndexPlatforms from "views/platforms/Index.js";
import CreatePlatform from "views/platforms/Create.js";
import DetailPlatform from "views/platforms/Detail.js";

import IndexWires from "views/wires/Index.js";
import CreateWire from "views/wires/Create.js";
import DetailWire from "views/wires/Detail.js";

import IndexDexs from "views/dexs/Index.js";

import IndexPortfolio from "views/portfolio/Index.js";

var routes = {
  "/app/dashboard": {
    "/": Dashboard
  },
  "/app/orders": {
    "/create": CreateOrder,
    "/:ord_id": DetailOrder,
    "/": IndexOrders
  },
  "/app/assets": {
    "/create": CreateAsset,
    "/delete/:ast_id": DeleteAsset,
    "/:ast_id": DetailAsset,
    "/": IndexAssets
  },
  "/app/categories": {
    "/create": CreateCategory,
    "/:cat_id": DetailCategory,
    "/": IndexCategories
  },
  "/app/portfolio": {
    "/": IndexPortfolio
  },
  "/app/platforms": {
    "/create": CreatePlatform,
    "/:plt_id": DetailPlatform,
    "/": IndexPlatforms
  },
  "/app/wires": {
    "/create": CreateWire,
    "/:wir_id": DetailWire,
    "/": IndexWires
  },
  "/app/dexs": {
    "/": IndexDexs
  }
}
export default routes;
