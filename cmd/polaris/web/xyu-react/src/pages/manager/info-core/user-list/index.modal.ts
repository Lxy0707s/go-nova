import {UserBasicParam, UserBasicType} from "@/models/user.type";

export type operateType = "add" | "see" | "up";

export type ModalType = {
    operateType: operateType;
    nowData: UserBasicType | UserBasicParam | null;
    modalShow: boolean;
    modalLoading: boolean;
};
