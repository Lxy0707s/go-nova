import { RouteObject } from "react-router-dom";
import { Home } from "@/pages/home";


export const HomeRoute:RouteObject[]  = [
    { path: '/home', element: <Home/>},
]