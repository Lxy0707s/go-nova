import { RouteObject } from "react-router-dom";
import { Home, Page } from "@/pages/home";


export const HomeRoute:RouteObject[]  = [
    { path: '/home', element: <Home/>},
    { path: '/home/page', element: <Page/> },
]