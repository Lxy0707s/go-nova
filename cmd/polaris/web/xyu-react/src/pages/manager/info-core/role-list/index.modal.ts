
// 分页相关参数控制
import {RoleType} from "@/models/role.type";

// 构建table所需数据
export type TableRecordData = RoleType & {
    key: number;
    serial: number;
    control: number;
};

// 模态框打开的类型 see查看，add添加，up修改
export type operateType = "see" | "add" | "up";

// 模态框相关参数
export type ModalType = {
    operateType: operateType;
    nowData: TableRecordData | null;
    modalShow: boolean;
    modalLoading: boolean;
};

// 搜索相关参数
export type SearchInfo = {
    title: string | undefined; // 用户名
    conditions: number | undefined; // 状态
};
