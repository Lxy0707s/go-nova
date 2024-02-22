import {CrownFilled, TabletFilled} from "@ant-design/icons";
import React from "react";

export const ServiceMenu = {
    name: '服务中心',
    icon: <TabletFilled />,
    author: ["super-admin","user","auditor","admin"],
    path: '/service-core',
    routes: [
        {
            path: '/service-core/screen',
            name: '信息总览',
            author: ["super-admin","user","auditor","admin"],
            icon: <CrownFilled />,
        },
        {
            path: '/service-core/server',
            name: '服务列表',
            author: ["super-admin","auditor","admin"],
            icon: <CrownFilled />,
            routes: [
                {
                    path: '/service-core/server/register',
                    author: ["super-admin","auditor","admin"],
                    name: '服务注册',
                    icon: <CrownFilled />,
                },
                {
                    path: '/service-core/server/topology',
                    author: ["super-admin","auditor","admin"],
                    name: '服务拓扑',
                    icon: <CrownFilled />,
                },
            ],
        }
    ],
}
