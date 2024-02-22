// 菜单添加，修改时的参数类型
import React from "react";

export const rootMenu:string = "1"

export interface TreeSourceData {
    id: number; // ID,添加时可以没有id
    key: string | number;
    title: string; // 标题
    icon: string; // 图标
    url: string; // 链接路径
    parent_key: number | string | null; // 父级ID
    desc: string; // 描述
    sorts: number; // 排序编号
    conditions: number; // 状态，1启用，-1禁用
    children?: TreeSourceData[]; // 子菜单
    powers?: [],

    [propName: string]: any
}

/**
 * 对于router组件，仅仅关心，path，element
 * 对于menu组件，仅仅关心，name，path，icon，author/key
 * 对于授权管理中心，则根据需要进行表格组件的展示/管理即可
 */
export type RoutesType = {
    id?: number,  // id
    key?: string,
    parent_key?: string, // 父级id
    path?:string, // route路径
    name?:string, // 标题title
    icon?: string, // 图标索引
    author?: string[], // 鉴权信息
    element?: string | null, // 路由组件
    conditions?: number, // 是否使用，没有权限时使用 0：关闭， 1：使用
    desc?: string, // 备注
    children?: RoutesType[] | any,
    [propName: string]: any
}

export type routeEleObject = {
    key: string | null,
    ele?: React.ReactNode | any | null,
}

export type MenuObject = {
    path?: string,
    name?: string,
    icon?: React.ReactNode,
    author?: string[],
    routes?: MenuObject[],
}

// 菜单对象
export interface Menu extends RoutesType{
    id: number; // ID
    key: string ,
}

// 菜单id和权限id
export interface MenuAndPower {
    menuId: string; // 菜单ID
    powers: number[]; // 该菜单拥有的所有权限ID
}
