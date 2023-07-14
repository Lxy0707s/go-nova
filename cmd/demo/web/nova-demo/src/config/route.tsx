import {RouteObject} from "react-router-dom";
import {useRoutesWithMiddleware} from 'react-router-middleware-plus';
import {HomeRoute, ManagerRoute} from "@/config/app";
import {AppLayout} from "@/components/layout";


const routes: RouteObject[] = [
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            ...HomeRoute,
            ...ManagerRoute,
            {
                path: '/*',
                element: <div>NotFound</div>,
            },
        ]
    },
];


export default function AppRoute() {
    /**
     * 生成路由配置由两种方式：Component  或者是使用Hook useMiddlewareRoute
     * 1. Component 渲染
     * return <ReactRouterMiddleware routes={routes}></ReactRouterMiddleware>;
     * 2. Hook渲染
     * */
    return useRoutesWithMiddleware(routes);
}