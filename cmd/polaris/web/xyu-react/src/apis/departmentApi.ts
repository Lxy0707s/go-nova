import HttpReq from "@/utils/req/request";
import {getToken} from "@/utils/tool/authority";

export const getUserDept = () => {
    return new HttpReq().withMethod("POST")
        .withUrl("/api/v1/user-dept")
        .withToken(getToken())
        .withDataType("json")
        .axiosFun();
}

export const getSysDept = () => {
    return new HttpReq().withMethod("POST")
        .withUrl("/api/v1/sys-dept")
        .withToken(getToken())
        .withDataType("json")
        .axiosFun();
}