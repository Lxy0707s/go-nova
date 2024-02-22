import { ManagerMenu, ManagerRoute } from "./manager";
import { ServiceMenu, ServiceRoute } from "./service-core";
import { ScreenMenu, ScreenRoute } from "./home";
import { LoginMenu, LoginRoute } from "./login"

export {
    // -------------------菜单路由，对接layout----------------
    ScreenMenu,
    ManagerMenu,
    ServiceMenu,
    LoginMenu,

    // -------------------组件路由，对接react-router-dom----------------
    ScreenRoute,
    ManagerRoute,
    ServiceRoute,
    LoginRoute,
}