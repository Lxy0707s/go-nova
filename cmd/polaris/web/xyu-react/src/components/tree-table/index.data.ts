export const defaultData = [
    {
        "icon": "smile_filled",
        "title": "数据大屏",
        "key": "2",
        "url": "/home",
        "parent_key": "1",
        "sorts": 1,
        "conditions": 0,
        "powers": []
    },
    {
        "icon": "crown_filled",
        "title": "管理中心",
        "key": "3",
        "url": "/manager",
        "parent_key": "1",
        "sorts": 1,
        "children": [
            {
                "icon": "crown_filled",
                "title": "信息总览",
                "key": "3.1",
                "url": "/manager/screen",
                "parent_key": "3",
                "sorts": 1,
                "conditions": 0,
                "powers": []
            },
            {
                "icon": "crown_filled",
                "title": "授权中心",
                "key": "3.2",
                "url": "/manager/auth-info",
                "parent_key": "3",
                "sorts": 1,
                "children": [
                    {
                        "icon": "crown_filled",
                        "title": "用户管理",
                        "key": "3.2.1",
                        "url": "/manager/auth-info/user",
                        "parent_key": "3.2",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": [
                            {
                                "id": 1,
                                "menu_key": "3.2.1",
                                "title": "新增",
                                "auth_code": "user:add",
                                "desc": "用户管理 - 添加权限",
                                "sorts": 1,
                                "conditions": 1
                            },
                            {
                                "id": 2,
                                "menu_key": "3.2.1",
                                "title": "修改",
                                "auth_code": "user:up",
                                "desc": "用户管理 - 修改权限",
                                "sorts": 2,
                                "conditions": 1
                            },
                            {
                                "id": 3,
                                "menu_key": "3.2.1",
                                "title": "查看",
                                "auth_code": "user:query",
                                "desc": "用户管理 - 查看权限",
                                "sorts": 3,
                                "conditions": 1
                            },
                            {
                                "id": 4,
                                "menu_key": "3.2.1",
                                "title": "删除",
                                "auth_code": "user:del",
                                "desc": "用户管理 - 删除权限",
                                "sorts": 4,
                                "conditions": 1
                            },
                            {
                                "id": 5,
                                "menu_key": "3.2.1",
                                "title": "分配角色",
                                "auth_code": "user:role",
                                "desc": "用户管理 - 分配角色权限",
                                "sorts": 5,
                                "conditions": 1
                            }
                        ]
                    },
                    {
                        "icon": "crown_filled",
                        "title": "角色管理",
                        "key": "3.2.2",
                        "url": "/manager/auth-info/role",
                        "parent_key": "3.2",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": [
                            {
                                "id": 6,
                                "menu_key": "3.2.2",
                                "title": "新增",
                                "auth_code": "role:add",
                                "desc": "角色管理 - 添加权限",
                                "sorts": 1,
                                "conditions": 1
                            },
                            {
                                "id": 7,
                                "menu_key": "3.2.2",
                                "title": "修改",
                                "auth_code": "role:up",
                                "desc": "角色管理 - 修改权限",
                                "sorts": 2,
                                "conditions": 1
                            },
                            {
                                "id": 8,
                                "menu_key": "3.2.2",
                                "title": "查看",
                                "auth_code": "role:query",
                                "desc": "角色管理 - 查看权限",
                                "sorts": 3,
                                "conditions": 1
                            },
                            {
                                "id": 18,
                                "menu_key": "3.2.2",
                                "title": "分配权限",
                                "auth_code": "role:power",
                                "desc": "角色管理 - 分配权限",
                                "sorts": 4,
                                "conditions": 1
                            },
                            {
                                "id": 9,
                                "menu_key": "3.2.2",
                                "title": "删除",
                                "auth_code": "role:del",
                                "desc": "角色管理 - 删除权限",
                                "sorts": 5,
                                "conditions": 1
                            }
                        ]
                    },
                    {
                        "icon": "crown_filled",
                        "title": "菜单管理",
                        "key": "3.2.3",
                        "url": "/manager/auth-info/menu",
                        "parent_key": "3.2",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    },
                    {
                        "icon": "crown_filled",
                        "title": "组件权限",
                        "key": "3.2.4",
                        "url": "/manager/auth-info/element",
                        "parent_key": "3.2",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    }
                ],
                "conditions": 0,
                "powers": [
                    {
                        "id": 100,
                        "menu_key": "3.2",
                        "title": "访问",
                        "auth_code": "user:view",
                        "desc": "用户管理 - 菜单查看",
                        "sorts": 2,
                        "conditions": 1
                    }
                ]
            },
            {
                "icon": "crown_filled",
                "title": "系统管理",
                "key": "3.3",
                "url": "/manager/system",
                "parent_key": "3",
                "sorts": 1,
                "children": [
                    {
                        "icon": "crown_filled",
                        "title": "配置管理",
                        "key": "3.3.1",
                        "url": "/manager/system/config",
                        "parent_key": "3.3",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    },
                    {
                        "icon": "crown_filled",
                        "title": "日志管理",
                        "key": "3.3.2",
                        "url": "/manager/system/log",
                        "parent_key": "3.3",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    }
                ],
                "conditions": 0,
                "powers": []
            }
        ],
        "conditions": 0,
        "powers": []
    },
    {
        "icon": "tablet_filled",
        "title": "服务中心",
        "key": "4",
        "url": "/service-core",
        "parent_key": "1",
        "sorts": 1,
        "children": [
            {
                "icon": "crown_filled",
                "title": "信息总览",
                "key": "4.1",
                "url": "/service-core/screen",
                "parent_key": "4",
                "sorts": 1,
                "conditions": 0,
                "powers": []
            },
            {
                "icon": "crown_filled",
                "title": "服务列表",
                "key": "4.2",
                "url": "/service-core/server",
                "parent_key": "4",
                "sorts": 1,
                "children": [
                    {
                        "icon": "crown_filled",
                        "title": "服务注册",
                        "key": "4.2.1",
                        "url": "/service-core/server/register",
                        "parent_key": "4.2",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    },
                    {
                        "icon": "crown_filled",
                        "title": "服务拓扑",
                        "key": "4.2.2",
                        "url": "/service-core/server/topology",
                        "parent_key": "4.2",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    }
                ],
                "conditions": 0,
                "powers": []
            },
            {
                "icon": "crown_filled",
                "title": "服务器集群",
                "key": "4.3",
                "url": "/service-core/machine",
                "parent_key": "4",
                "sorts": 1,
                "children": [
                    {
                        "icon": "crown_filled",
                        "title": "集群管理",
                        "key": "4.3.1",
                        "url": "/service-core/machine/cluster",
                        "parent_key": "4.3",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    }
                ],
                "conditions": 0,
                "powers": []
            },
            {
                "icon": "crown_filled",
                "title": "项目中心",
                "key": "4.4",
                "url": "/service-core/project",
                "parent_key": "4",
                "sorts": 1,
                "children": [
                    {
                        "icon": "crown_filled",
                        "title": "项目登记",
                        "key": "4.4.1",
                        "url": "/service-core/project/record",
                        "parent_key": "4.4",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    },
                    {
                        "icon": "crown_filled",
                        "title": "团队管理",
                        "key": "4.4.2",
                        "url": "/service-core/project/team",
                        "parent_key": "4.4",
                        "sorts": 1,
                        "conditions": 0,
                        "powers": []
                    }
                ],
                "conditions": 0,
                "powers": []
            }
        ],
        "conditions": 0,
        "powers": []
    }
]