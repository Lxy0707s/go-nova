import { RouteObject } from "react-router-dom";

import UserList from "../../../pages/manager/user/User";


export const ManagerRoute:RouteObject[]  = [
    { path: '/manager', element: <>  </>},
    { path: '/manager/user-list', element: <UserList/> },
]