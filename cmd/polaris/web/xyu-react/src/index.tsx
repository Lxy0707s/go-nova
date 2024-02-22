import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import  {defaultRoutes} from "./config/defaultConfig";
import {Provider} from "mobx-react";
import './index.css';
import {rootStore} from './pages/RootStore';
import {useRoutesWithMiddleware} from "react-router-middleware-plus";
import {ConfigPage} from "@/pages/manager";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function AuthRouter() {
    /**
     * 生成路由配置由两种方式：Component  或者是使用Hook useMiddlewareRoute
     * 1. Component 渲染
     * return <ReactRouterMiddleware routes={routes}></ReactRouterMiddleware>;
     * 2. Hook渲染
     * */
    return  (useRoutesWithMiddleware(defaultRoutes))
}

root.render(
    // <ConfigPage/>

    <Provider {...rootStore}>
        <BrowserRouter>
            <AuthRouter />
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
