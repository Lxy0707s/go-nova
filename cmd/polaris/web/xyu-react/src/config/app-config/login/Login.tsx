import React from "react";
import {RouteObject} from "react-router-dom";
import Login from "@/pages/login/Login";


export const LoginRoute:RouteObject[]  = [
    { path: '/login', element: <Login/>}
]