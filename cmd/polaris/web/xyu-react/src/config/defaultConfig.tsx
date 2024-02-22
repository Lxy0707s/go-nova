import {RouteObject} from "react-router-dom";
import {AppLayout} from "@/components/layout";
import {
    ScreenRoute,
    ManagerRoute,
    ServiceRoute,
    LoginRoute,
} from "./app-config";
import {
    ScreenMenu,
    ManagerMenu,
    ServiceMenu,
} from "./app-config";
import {MenuObject} from "@/models/menu.type";

const defaultRouteEles = [
    ...ScreenRoute,
    ...ManagerRoute,
    ...ServiceRoute,
]

// ---------------- 系统默认路由 ---------------
export const defaultRoutes: RouteObject[] = [
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            ...defaultRouteEles,
            {
                path: '/*',
                element: <div>NotFound</div>,
            },
        ]
    },
     ...LoginRoute,
];


// ---------------- 系统默认菜单 ---------------
export const defaultMenus:MenuObject = {
    path: '/',
    routes: [
        ScreenMenu,
        ManagerMenu,
        ServiceMenu,
    ],
}
