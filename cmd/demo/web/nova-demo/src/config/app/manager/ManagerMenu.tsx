import {CrownFilled, SmileFilled} from "@ant-design/icons";
import React from "react";


export const ManagerMenu = {
    path: '/manager',
    name: '管理中心',
    icon: <SmileFilled />,
    routes: [
        {
            path: '/manager/user-list',
            name: '用户管理',
            icon: <CrownFilled />,
        },
    ]
}
