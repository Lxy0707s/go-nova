// 全局用户数据类型
export interface UserInfo {
    userBasicInfo: UserBasicType | null; // 用户的基本信息
    menus?: string[]; // 拥有的所有菜单key集合对象
    roles?: number[]; // 拥有的所有角色uid对象
    powers?: number[]; // 拥有的所有权限uid对象
}

// 用户的基本信息
export interface UserBasicType {
    id?:         number; // ID
    uid?:        number; // uid
    username?:   string; // 用户名
    password?:   string | number; // 密码
    phone?:      string | number; // 手机
    email?:      string; // 邮箱
    address?:    string; // 地址
    desc?:       string; // 描述
    conditions?: number; // 状态 1启用，-1禁用
    roleIds?:    number[]; // 拥有的所有角色ID集合
    createdAt?:     string;
    updatedAt?:     string;
}

// 添加修改用户时参数的数据类型
export interface UserBasicParam extends UserBasicType {
    conditions: number;
    password: string | number;
    username: string;
}

// 用户登录状态信息类型
export interface UserLoginType {
    status: number, // 0 未登录， 1 登录 ，2 登录并且记忆
    userID: number, // 登录成功，则记录用户ID
    token: string, // 登录成功后缓存，用于请求后端接口使用
}

export interface  UserRoleType {
    id: number | string,
    roles: number[]
}