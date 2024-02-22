import HttpReq from "@/utils/req/request";

export const appMenuApi = (token: string) => {
    return new HttpReq().withMethod("GET")
        .withTimeOut(5)
        .withUrl("/api/v1/app-menus")
        //.withToken(token)
        .withDataType("json")
        .axiosFun();
}
