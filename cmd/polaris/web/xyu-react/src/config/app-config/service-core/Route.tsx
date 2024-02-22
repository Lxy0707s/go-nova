import React from "react";
import {ServiceScreen, ServiceCore, Register} from "@/pages/service-core";
import {RouteObject} from "react-router-dom";
import {Topology} from "@/pages/service-core";

export const ServiceRoute:RouteObject[] = [
    // --------- 数据总览
    { path: '/service-core', element: <ServiceCore/> },
    // --------- 数据总览
    { path: '/service-core/screen', element: <ServiceScreen/> },

    // --------- 服务中心 注册/拓扑
    { path: '/service-core/server/register', element: <Register/> },
    { path: '/service-core/server/topology', element: <Topology/> },

    // --------- 集群中心 集群服务器
    // { path: '/service-core/machine/cluster', element: <Cluster/> },
    //
    // // --------- 项目中心 项目/团队
    // { path: '/service-core/project/record', element: <ProjectPage/> },
    // { path: '/service-core/project/team', element: <TeamPage/> },
]