import {RoutesType} from "@/models/menu.type";

export type operateType = "add" | "see" | "up";

export type ModalType = {
  operateType: operateType;
  nowData: RoutesType | null; //| TableRecordData
  modalShow: boolean;
  modalLoading: boolean;
};


