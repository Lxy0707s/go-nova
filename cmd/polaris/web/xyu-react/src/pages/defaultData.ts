import {UserBasicType, UserInfo} from "@/models/user.type";
import {RoleType} from "@/models/role.type";
import {PowerParam} from "@/models/power.type";
import {rootMenu} from "@/models/menu.type";

export const DefaultRoleList: RoleType[] = [];

for (let i = 1; i < 3; i += 1) {
    DefaultRoleList.push({
        id: i,
        uid: i,
        role: '内置角色-'+ i,
        conditions: 1,
        sorts:   Math.floor(Math.random() * 10) % 4,
        desc: '备注文案123',
        createdAt: (Date.now() - Math.floor(Math.random() * 2000)).toString(),
        updatedAt: (Date.now() - Math.floor(Math.random() * 2000)).toString(),
    });
}

export const DefaultUserList: UserBasicType[] = [];

const statusEle = [
    'close',
    'running',
    'online',
    'error',
    'all',
]
//
for (let i = 1; i < 3; i += 1) {
    if(i === 1){
        DefaultUserList.push({
            id: i,
            uid: i,
            username: "admin",
            phone: "18325865094",
            email: "123456@qq.com",
            password: 'admin@123',
            address: "贵州省贵阳市观山湖区-xxx小区-xxx路-xx号",
            conditions: 1,
            roleIds: [i],
            createdAt: (Date.now() - Math.floor(Math.random() * 2000)).toString(),
            updatedAt: (Date.now() - Math.floor(Math.random() * 2000)).toString(),
            desc: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案',
        });
    }else {
        DefaultUserList.push({
            id: i,
            uid: i,
            username: "用户-" + i,
            phone: "18325865094",
            email: "123456@qq.com",
            password: 'pwd--xxs',
            address: "贵州省贵阳市观山湖区-xxx小区-xxx路-xx号",
            conditions: Math.floor(Math.random() * 2),
            roleIds: [i],
            createdAt: (Date.now() - Math.floor(Math.random() * 2000)).toString(),
            updatedAt: (Date.now() - Math.floor(Math.random() * 2000)).toString(),
            desc: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案',
        });
    }
}

export const DefaultPowers:PowerParam[] = [
    // 用户类 1- 10
    {
        id: 1,
        uid: 1,
        menu_key: "3.2.1",
        title: "用户浏览",
        auth_code: "user:query",
        desc: "用户管理 - 浏览权限",
        sorts: 1,
        conditions: 1,
    },
    {
        id: 2,
        uid: 2,
        menu_key: "3.2.1",
        title: "用户新增",
        auth_code: "user:add",
        desc: "用户管理 - 新增权限",
        sorts: 2,
        conditions: 1,
    },
    {
        id: 3,
        uid: 3,
        menu_key: "3.2.1",
        title: "用户修改",
        auth_code: "user:up",
        desc: "用户管理 - 修改权限",
        sorts: 3,
        conditions: 1,
    },
    {
        id: 4,
        uid: 4,
        menu_key: "3.2.1",
        title: "用户删除",
        auth_code: "user:del",
        desc: "用户管理 - 删除权限",
        sorts: 4,
        conditions: 1,
    },
    {
        id: 5,
        uid: 5,
        menu_key: "3.2.1",
        title: "角色分配",
        auth_code: "user:role",
        desc: "用户管理 - 角色分配",
        sorts: 5,
        conditions: 1,
    },
    // 角色类  11 -20
    {
        id: 11,
        uid: 11,
        menu_key: "3.2.2",
        title: "角色浏览",
        auth_code: "role:query",
        desc: "角色管理 - 浏览权限",
        sorts: 5,
        conditions: 1,
    },
    {
        id: 12,
        uid: 12,
        menu_key: "3.2.2",
        title: "角色新增",
        auth_code: "role:add",
        desc: "角色管理 - 添加权限",
        sorts: 1,
        conditions: 1,
    },
    {
        id: 13,
        uid: 13,
        menu_key: "3.2.2",
        title: "角色修改",
        auth_code: "role:up",
        desc: "角色管理 - 修改权限",
        sorts: 2,
        conditions: 1,
    },
    {
        id: 14,
        uid: 14,
        menu_key: "3.2.2",
        title: "角色删除",
        auth_code: "role:del",
        desc: "角色管理 - 删除权限",
        sorts: 3,
        conditions: 1,
    },
    {
        id: 15,
        uid: 15,
        menu_key: "3.2.2",
        title: "权限分配",
        auth_code: "role:power",
        desc: "角色管理 - 分配权限",
        sorts: 4,
        conditions: 1,
    },
    // 菜单类 21 -30
    {
        id: 21,
        uid: 21,
        menu_key: "3.2.3",
        title: "菜单浏览",
        auth_code: "menu:query",
        desc: "菜单管理 - 浏览菜单",
        sorts: 5,
        conditions: 1,
    },
    {
        id: 22,
        uid: 22,
        menu_key: "3.2.3",
        title: "路由访问",
        auth_code: "menu:menuList-query",
        desc: "菜单管理 - 路由详情",
        sorts: 5,
        conditions: 1,
    },
    {
        id: 23,
        uid: 23,
        menu_key: "3.2.3",
        title: "菜单添加",
        auth_code: "menu:add",
        desc: "菜单管理 - 添加权限",
        sorts: 5,
        conditions: 1,
    },
    {
        id: 24,
        uid: 24,
        menu_key: "3.2.3",
        title: "菜单修改",
        auth_code: "menu:up",
        desc: "菜单管理 - 修改权限",
        sorts: 5,
        conditions: 1,
    },
    {
        id: 25,
        uid: 25,
        menu_key: "3.2.3",
        title: "菜单删除",
        auth_code: "menu:del",
        desc: "菜单管理 - 删除权限",
        sorts: 5,
        conditions: 1,
    },
    // 权限类 31 -40
    {
        id: 31,
        uid: 31,
        menu_key: "3.2.4",
        title: "权限浏览",
        auth_code: "power:query",
        desc: "权限管理 - 浏览权限",
        sorts: 5,
        conditions: 1,
    },
    {
        id: 32,
        uid: 32,
        menu_key: "3.2.4",
        title: "详情访问",
        auth_code: "power:powerList-query",
        desc: "权限管理 - 详情访问",
        sorts: 5,
        conditions: 1,
    },
    {
        id: 33,
        uid: 33,
        menu_key: "3.2.4",
        title: "权限添加",
        auth_code: "power:add",
        desc: "权限管理 - 添加权限",
        sorts: 6,
        conditions: 1,
    },
    {
        id: 34,
        uid: 34,
        menu_key: "3.2.4",
        title: "权限修改",
        auth_code: "power:up",
        desc: "权限管理 - 修改权限",
        sorts: 6,
        conditions: 1,
    },
    {
        id: 35,
        uid: 35,
        menu_key: "3.2.4",
        title: "权限删除",
        auth_code: "power:del",
        desc: "权限管理 - 删除权限",
        sorts: 6,
        conditions: 1,
    },
];

export const DefaultRoleMps = [
    {
        id: 1, // admin role-id
        menus: [
            rootMenu, "2",
            "3.2.1", "3.2.2", "3.2.3", "3.2.4",
            // "3.1", "3.3.1", "4.1", "4.2.1", "4.2.2"
        ],
        powers: [1,2,3,4,5,11,12,13,14,15,21,22,23,24,25,31,32,32,33,34,35]
    },
    {
        id: 2, // user
        menus: [
            rootMenu, "2",
            // "3.1", "3.2.1", "3.2.2", "3.2.3", "3.2.4", "3.3.1",
            "4.1", "4.2.1", "4.2.2"
        ],
        powers: []
    },
]

export const DefaultUserInfo:UserInfo = {
    userBasicInfo: null,
    menus: [],
    roles: [],
    powers:[]
}
