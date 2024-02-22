import React from "react";
import {Screen} from "@/config/app-config/home";
import {ConfigPage, ElementPage, Manager, ManagerScreen, MenuPage, RoleList, UserList} from "@/pages/manager";
import {Register, ServiceCore, ServiceScreen, Topology} from "@/pages/service-core";
import {
    ApartmentOutlined, ApiOutlined, AppstoreAddOutlined,
    AreaChartOutlined, CloudFilled, CloudServerOutlined, CommentOutlined, ControlOutlined,
    CrownFilled, FileOutlined, HomeFilled, KeyOutlined, MenuOutlined, ProfileOutlined,
    RadarChartOutlined, SettingFilled, SisternodeOutlined,
    SmileFilled, SoundOutlined,
    TabletFilled, TeamOutlined, ToolOutlined, UngroupOutlined, UserSwitchOutlined, WalletOutlined, WindowsFilled,
} from "@ant-design/icons";
import {routeEleObject} from "@/models/menu.type";


const routeEleDic:routeEleObject[] = [
    { key: "home", ele: <Screen/> },
    { key: "manager", ele: <Manager/> },
    { key: "manager_screen", ele: <ManagerScreen/> },
    { key: "authInfo_user", ele: <UserList/> },
    { key: "authInfo_role", ele:  <RoleList/>},
    { key: "authInfo_menu", ele: <MenuPage/> },
    { key: "authInfo_element", ele: <ElementPage/> },
    { key: "system_config", ele: <ConfigPage/> },
    { key: "serviceCore", ele: <ServiceCore/> },
    { key: "serviceCore_screen", ele: <ServiceScreen/> },
    { key: "server_register", ele: <Register/> },
    { key: "server_topology", ele: <Topology/> },
    { key: "test", ele: <div>hello</div> },
    // { key: "machine_cluster", ele: <Cluster/> },
    // { key: "project_record", ele: <ProjectPage/> },
    // { key: "project_team", ele: <TeamPage/> },
];

export const IconList:string[] = [
    "home_outlined",
    "windows_outlined",
    "smile_filled",
    "tablet_filled",
    "crown_filled",
    "radar_chart_outlined",
    "area_chart_outlined",
    "apartment_outlined",
    "cloud_Outlined",
    "appstore_add_outlined",
    "team_outlined",
    "ungroup_outlined",
    "user_switch_Outlined",
    "profile_outlined",
    "wallet_Outlined",
    "file_outlined",
    "setting_filled",
    "tool_outlined",
    "sound_outlined",
    "key_outlined",
    "menu_outlined",
    "sisternode_outlined",
    "control_outlined",
    "comment_outlined",
    "cloud_server_outlined",
    "appstore_add_outlined",
    "api_outlined",
];

const MenuIcons:Map<string, JSX.Element | React.ReactNode | undefined>  = new Map(
    [
        ["home_outlined",   <HomeFilled/>],
        ["windows_outlined", <WindowsFilled />],
        ["smile_filled", <SmileFilled />],
        ["tablet_filled",   <TabletFilled />],
        ["crown_filled",    <CrownFilled />],
        ["radar_chart_outlined", <RadarChartOutlined />],
        ["area_chart_outlined",  <AreaChartOutlined />],
        ["apartment_outlined",   <ApartmentOutlined />],
        ["cloud_Outlined",     <CloudFilled />],
        ["appstore_add_outlined",    <AppstoreAddOutlined />],
        ["team_outlined",        <TeamOutlined />],
        ["ungroup_outlined",    <UngroupOutlined />],
        ["user_switch_Outlined",  <UserSwitchOutlined />],
        ["profile_outlined",      <ProfileOutlined />],
        ["wallet_Outlined",     <WalletOutlined />],
        ["file_outlined",       <FileOutlined />],
        ["setting_filled",      <SettingFilled/>],
        ["tool_outlined",       <ToolOutlined />],
        ["sound_outlined",      <SoundOutlined />],
        ["sisternode_outlined", <SisternodeOutlined />],
        ["menu_outlined",       <MenuOutlined />],
        ["key_outlined",        <KeyOutlined />],
        ["control_outlined",    <ControlOutlined />],
        ["comment_outlined",    <CommentOutlined />],
        ["cloud_server_outlined",   <CloudServerOutlined />],
        ["api_outlined",        <ApiOutlined />],
        ["appstore_add_outlined", <AppstoreAddOutlined />]
    ]
)

export function getIconMap() {
    return MenuIcons
}

export function getIconDict(icon:string){
    return MenuIcons.get(icon)
}

export function getRouteEleDict(menuKey:string){
    if(!routeEleDic){
        return <div>Menu 列表数据为空，请检查.</div>
    }
    let eles = undefined
    routeEleDic.forEach((element,index)=>{
        if(element.key === menuKey){
            eles = element.ele
        }
    })
    if(eles === undefined){
        return <div>开发中，请期待</div>
    }
    return  eles
}