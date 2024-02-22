import React from "react";
import {getIconDict,} from "@/config/config.data";
import {MenuObject, rootMenu, RoutesType, TreeSourceData} from "@/models/menu.type";

// 对接表格存储格式,此份为默认离线配置
export const defaultRouteData:RoutesType[] = [
    { key: rootMenu, parent_key:"", name: "根菜单", path: '/', icon: "", element:  "root", conditions: 1, desc: "" },
    // --------------- 数据大屏 -----------------//
    { key: "2", parent_key:rootMenu, name: "数据大屏", path: '/home', icon:"smile_filled", element:  "home", conditions: 1, desc: "" },
    // --------------- 管理中心 -----------------//
    { key: "3", parent_key:rootMenu,name: "管理中心",  path: '/manager', icon:"crown_filled", element:  "manager", conditions: 1, desc: "" },
    { key: "3.1", parent_key:"3", name: "信息总览",  path: '/manager/screen', icon:"crown_filled", element:  "manager_screen", conditions: 1, desc: "" },
    { key: "3.2", parent_key:"3", name: "授权中心",  path: '/manager/auth-info', icon:"crown_filled", conditions: 1, desc: "" },
    { key: "3.2.1", parent_key:"3.2", name: "用户管理",  path: '/manager/auth-info/user', icon:"crown_filled", element:  "authInfo_user", conditions: 1, desc: "" },
    { key: "3.2.2", parent_key:"3.2", name: "角色管理",  path: '/manager/auth-info/role', icon:"crown_filled", element:  "authInfo_role", conditions: 1, desc: "" },
    { key: "3.2.3", parent_key:"3.2", name: "菜单管理",  path: '/manager/auth-info/menu', icon:"crown_filled", element:  "authInfo_menu", conditions: 1, desc: "" },
    { key: "3.2.4", parent_key:"3.2", name: "组件权限", path: '/manager/auth-info/element', icon:"crown_filled", element:  "authInfo_element", conditions: 1, desc: "" },
    { key: "3.3", parent_key:"3", name: "系统管理", path: '/manager/system', icon:"crown_filled" , conditions: 1, desc: "" },
    { key: "3.3.1", parent_key:"3.3", name: "配置管理", path: '/manager/system/config', icon:"crown_filled", element:  "system_config", conditions: 1, desc: "" },
   // --------------- 服务中心 -----------------//
    { key: "4", parent_key:rootMenu,name: "服务中心", path: '/service-core', icon:"tablet_filled", element:  "serviceCore", conditions: 1, desc: "" },
    { key: "4.1", parent_key:"4",name: "信息总览", path: '/service-core/screen', icon:"crown_filled", element:  "serviceCore_screen", conditions: 1, desc: "" },
    { key: "4.2", parent_key:"4",name: "服务列表", path: '/service-core/server', icon:"crown_filled" , conditions: 1, desc: "" },
    { key: "4.2.1", parent_key:"4.2",name: "服务注册", path: '/service-core/server/register', icon:"crown_filled", element:  "server_register", conditions: 1, desc: "" },
    { key: "4.2.2", parent_key:"4.2",name: "服务拓扑", path: '/service-core/server/topology', icon:"crown_filled", element:  "server_topology", conditions: 1, desc: "" },

    //
    //{ key: "5", parent_key:"1",name: "售后咨询", path: '/service-product', icon:"tablet_filled", element:  "test", conditions: 1},
]

/** 工具 - 递归将扁平数据转换为tree数据 **/
export function dataToTreeSourceData(treeData: RoutesType[], parentId = "") {
    const tree:TreeSourceData[] = [];

    // 遍历flatData，找到parentId对应的子节点
    for (const node of treeData) {
        if (node.parent_key === parentId) {
            // 递归查找子节点
            const children = dataToTreeSourceData(treeData, node.key);

            // 如果有子节点，则加入children属性中
            if (children.length > 0) {
                node.children = children;
                tree.push({
                    id: node.id,
                    icon: node.icon,
                    title: node.name,
                    key: node.key,
                    url: node.path, // 链接路径
                    parent_key:node.parent_key, // 父级ID
                    desc: node.desc, // 描述
                    sorts: 1, // 排序编号
                    children: children,
                    conditions: node.switch, // 状态，1启用，-1禁用
                    powers: node.powers?node.powers:[],
                });
            }else {
                tree.push({
                    id: node.id,
                    icon: node.icon,
                    title: node.name,
                    key: node.key,
                    url: node.path, // 链接路径
                    parent_key:node.parent_key, // 父级ID
                    desc: node.desc, // 描述
                    sorts: 1, // 排序编号
                    conditions: node.switch, // 状态，1启用，-1禁用
                    powers: node.powers?node.powers:[],
                });
            }

        }
    }
    return tree;
}

/** 工具 - 递归将扁平数据转换为menu tree结构数据 **/
export function dataToMenu(treeData: RoutesType[], parentId = "", matchArray?: string[]) {
    const tree:MenuObject[] = [];

    // 遍历flatData，找到parentId对应的子节点
    for (const node of treeData) {
        if (node.parent_key === parentId) {
            // 递归查找子节点
            const children = dataToMenu(treeData, node.key);

            // 如果有子节点，则加入children属性中
            if (children.length > 0) {
                node.children = children;
                if(Array.isArray(matchArray)){
                    const index = matchArray.findIndex( (mId:string) => {
                        return mId.startsWith(node.key) // 比如菜单key 3.2.1 包含3.2, 因此3.2权限具备
                    })
                    if (index === -1){
                        continue
                    }
                }
                tree.push({
                    path: node.path,
                    name: node.name,
                    icon: getIconDict(node.icon),
                    author: node.author,
                    routes: children,
                })
            }else {
                if (Array.isArray(matchArray)){
                    const index = matchArray.findIndex( (mId:string) => {
                        return mId.startsWith(node.key) // 比如菜单key 3.2.1 包含3.2, 因此3.2权限具备
                    })
                    if (index === -1){
                        continue
                    }
                }
                tree.push({
                    path: node.path,
                    name: node.name,
                    icon: getIconDict(node.icon),
                    author: node.author,
                })
            }
        }
    }
    return tree;
}

export function getMenus(menus: RoutesType[],menuArray?: string[]) {
    return dataToMenu(menus, "", menuArray)[0]
}

export const getTreeSourceData = () => {
    let result = []
    result = dataToTreeSourceData(defaultRouteData)
    return result
}

// ------------------------- 下面为旧版本写法 ------------------------------------//
export function getMenuData  () {
    let result = []
    result = dataToTree(defaultRouteData)
    return treeToMenu(result)[0]
}
/** 工具 - 递归将扁平数据转换为层级数据 **/
function dataToTree(treeData: RoutesType[], parentId = "") {
    const tree = [];

    // 遍历flatData，找到parentId对应的子节点
    for (const node of treeData) {
        if (node.parent_key === parentId) {
            // 递归查找子节点
            const children = dataToTree(treeData, node.key);

            // 如果有子节点，则加入children属性中
            if (children.length > 0) {
                node.children = children;
            }

            // 加入tree中
            tree.push(node);
        }
    }
    return tree;
}

function treeToMenu(treeData: RoutesType[]) {
    const tree: MenuObject[] = [];

    // 遍历flatData，找到parentId对应的子节点
    for (let i=0; i<treeData.length; i++) {
        let node = treeData[i];
        if (node.children){
            // 加入tree中
            tree.push({
                name: node.name,
                path: node.path,
                icon: getIconDict(node.icon),
                author: node.author,
                routes: treeToMenu(node.children),
            });
        }else {
            tree.push({
                name: node.name,
                path: node.path,
                icon: getIconDict(node.icon),
                author: node.author,
            });
        }
    }

    return tree;
}
