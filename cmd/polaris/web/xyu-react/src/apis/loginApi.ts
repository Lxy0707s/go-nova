import HttpReq from "@/utils/req/request";
import {LoginParamsType} from "@/pages/login/model.interface";

export const loginApi = (params: LoginParamsType) => {
    return new HttpReq().withMethod("GET")
        .withUrl("/api/v1/login")
        .withBody(params)
        .withToken("")
        .withDataType("json")
        .axiosFun();
}

