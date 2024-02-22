// 角色添加和修改时的参数类型
import {MenuAndPower} from "@/models/menu.type";

export interface RoleType {
    id?:            number;
    uid?:           number;
    role?:          string;
    conditions?:    number;
    sorts?:         number;
    desc?:          string;
    createdAt?:     string;
    updatedAt?:     string;
}

export type RoleTreeInfo = {
    roleData: RoleTreeType[]; // 所有的角色数据
    roleTreeLoading: boolean; // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
    roleTreeShow: boolean; // 角色树是否显示
    roleTreeDefault: number[]; // 用于角色树，默认需要选中的项
};

export interface RoleParam {
    uid?: number; // UUID,添加时可以不传id
    role: string; // 角色名
    desc: string; // 描述
    sorts: number; // 排序编号
    conditions: number; // 状态，1启用，-1禁用
    menuAndPowers?: MenuAndPower[]; // 添加时可以不传菜单和权限
}

// 角色对象
export interface Role extends RoleParam {
    id: number; // ID
    menuAndPowers: MenuAndPower[]; // 当前角色拥有的菜单id和权限id
}

export interface RoleTreeType {
    title?: string,
    key: number|string,
}

export interface RoleMpType {
    id?: number,
    menus?: string[],
    powers?: number[]
}