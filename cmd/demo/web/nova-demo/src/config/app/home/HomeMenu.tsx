import {CrownFilled, SmileFilled} from "@ant-design/icons";
import React from "react";


export const HomeMenu = {
    path: '/home',
    name: '首页',
    icon: <SmileFilled />,
    routes: [
        {
            path: '/home/page',
            name: '一级页面',
            icon: <CrownFilled />,
        },
    ]
}
