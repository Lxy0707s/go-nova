import { Menu } from "./menu.type";

// 权限添加修改时的参数类型
export interface PowerParam {
    id?: number; // ID, 添加时可以没有id
    uid?: number;
    menu_key?: string; // 所属的菜单
    title?: string; // 标题
    auth_code?: string; // auth_code
    sorts?: number; // 排序
    conditions?: number; // 状态 1启用，-1禁用
    desc?: string; // 描述
}

// 权限对象
export interface Power extends PowerParam {
    id: number; // ID
    key?: string | number;
    title: string;
}


export interface PowerTree extends Menu {
    powers: Power[];
}

// 默认被选中的菜单和权限
export type PowerTreeDefault = {
    menus: string[];
    powers: number[];
};