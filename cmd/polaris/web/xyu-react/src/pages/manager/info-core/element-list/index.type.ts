/** 当前页面所需所有类型声明 **/
import {Power} from "@/models/power.type";

// 构建table所需数据
export type TableRecordData = Power & {
  key: number;
  serial: number;
  control: number;
};

export type operateType = "add" | "see" | "up";

export type ModalType = {
  operateType: operateType;
  nowData: TableRecordData | null;
  modalShow: boolean;
  modalLoading: boolean;
};
