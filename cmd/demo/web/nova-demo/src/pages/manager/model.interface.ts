
export interface UserType {
    key?:      number;
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: string;
}

export const defaultDatas = {
    userList: [
        {
            username: "张三",
            password: "********",
            email: "1234@qq.com",
            phone: "1232543643565",
            address: "北京海淀区",
            status: "请假"
        },
        {
            username: "李四",
            password: "********",
            email: "2353454@qq.com",
            phone: "181233454344",
            address: "上海",
            status: "正常"
        },
        {
            username: "王风",
            password: "********",
            email: "5457687686@qq.com",
            phone: "18397979698332",
            address: "贵州贵阳",
            status: "出差"
        },
        {
            username: "西奥",
            password: "********",
            email: "5645765765@qq.com",
            phone: "24252454326463",
            address: "新加坡",
            status: "实习"
        }
    ]
}