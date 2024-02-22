import React from "react";
import {RouteObject} from "react-router-dom";
import {RoleList, UserList, Manager, ElementPage, MenuPage, ConfigPage, ManagerScreen} from "@/pages/manager";


export const ManagerRoute:RouteObject[]  = [
    // ---------- 数据总览
    { path: '/manager', element: <Manager/> },

    // ---------- 数据总览
    { path: '/manager/screen', element: <ManagerScreen/> },

    // ---------- 角色/角色/黑白名单管理
    { path: '/manager/auth-info/user', element: <UserList/>},
    { path: '/manager/auth-info/role', element: <RoleList/> },
    { path: '/manager/auth-info/menu', element: <MenuPage/>},
    { path: '/manager/auth-info/element', element: <ElementPage/>},

    // ---------- 系统菜单/配置管理
    { path: '/manager/system/config', element: <ConfigPage/>},
]