import HttpReq from "@/utils/req/request";
import {getToken} from "@/utils/tool/authority";

export const getUser = (token: string) => {
    return new HttpReq().withMethod("POST")
        .withTimeOut(5)
        .withUrl("/api/v1/user-info")
        .withToken(getToken())
        .withDataType("json")
        .axiosFun();
}

export const getUserAuth = () => {
    return new HttpReq().withMethod("POST")
        .withUrl("/api/v1/user-auth")
        .withToken(getToken())
        .withDataType("json")
        .axiosFun();
}

