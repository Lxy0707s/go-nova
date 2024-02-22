import {CrownFilled } from "@ant-design/icons";
import React from "react";

export const ManagerMenu = {
    path: '/manager',
    name: '管理中心',
    icon: <CrownFilled />,
    author: ["admin","auditor","super-admin"],
    routes: [
        {
            path: '/manager/screen',
            author: ["admin","auditor","manager"],
            name: '信息总览',
            icon: <CrownFilled />,
        },
        {
            path: '/manager/auth-info',
            author: ["admin","auditor"],
            name: '授权管理',
            icon: <CrownFilled />,
            routes: [
                {
                    path: '/manager/auth-info/user',
                    author: ["super-admin","admin"],
                    name: '用户管理',
                    icon: <CrownFilled />,
                },
                {
                    path: '/manager/auth-info/role',
                    author: ["admin","manager","super-admin"],
                    name: '角色管理',
                    icon: <CrownFilled />,
                },
                {
                    path: '/manager/auth-info/menu',
                    author: ["admin","auditor","super-admin"],
                    name: '菜单管理',
                    icon: <CrownFilled />,
                },
                {
                    path: '/manager/auth-info/element',
                    author: ["admin","manager"],
                    name: '权限管理',
                    icon: <CrownFilled />,
                },
            ]
        },
        {
            path: '/manager/system',
            author: ["admin","auditor","super-admin"],
            name: '系统管理',
            icon: <CrownFilled />,
            routes: [
                {
                    path: '/manager/system/config',
                    author: ["admin","auditor","super-admin"],
                    name: '配置管理',
                    icon: <CrownFilled />,
                }
            ]
        },
    ]
}