import HttpReq from "@/utils/req/request";
import {getToken} from "@/utils/tool/authority";

export const getPower= (token:string) => {
    return new HttpReq().withMethod("POST")
        .withUrl("/api/v1/sys-role-power")
        .withToken(getToken())
        .withDataType("json")
        .axiosFun();
}
