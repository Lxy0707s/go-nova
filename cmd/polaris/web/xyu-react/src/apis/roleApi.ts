import HttpReq from "@/utils/req/request";
import {getToken} from "@/utils/tool/authority";

export const getSysRole = (token: string) => {
    return new HttpReq().withMethod("POST")
        .withTimeOut(5)
        .withUrl("/api/v1/sys-role")
        .withToken(getToken())
        .withDataType("json")
        .axiosFun();
}

export const getRolePower= (token:string) => {
    return new HttpReq().withMethod("POST")
        .withTimeOut(5)
        .withUrl("/api/v1/sys-role-power")
        .withToken(getToken())
        .withDataType("json")
        .axiosFun();
}

