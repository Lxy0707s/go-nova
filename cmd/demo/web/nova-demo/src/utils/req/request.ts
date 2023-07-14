import {IHeader, IReqConfig, promiseTimeOut, request} from './rest.fun';
import {newGqlClient} from "@/utils/req/gql.fun";

export const  base_url = "http://127.0.0.1:8080"


// 通用fetch请求封装
export default class HttpReq {
    private reqConfig: IReqConfig = {};
    private timeout: number = 0
    private baseUrl: string = base_url
    private url: string = "";

    public setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl
        return this
    }

    public withUrl(url: string) {
        if (url.includes("http")) {
            this.url = url
            return this
        }
        this.url = this.baseUrl + url
        return this
    }

    public withHeader(hs: IHeader) {
        this.reqConfig.headers = hs
        return this
    }

    public withTimeOut(timeout: number) {
        this.timeout = timeout
        return this
    }

    public withBody(body: any) {
        this.reqConfig.body = body
        return this
    }

    public withMethod(method: string) {
        this.reqConfig.method = method
        return this
    }

    public withDataType(dataType: string) {
        this.reqConfig["Content-Type"] = dataType
        return this
    }

    public async reqFun() {
        // 没有设置超时，默认请求
        if (this.timeout === 0) {
            return request(this.url, this.reqConfig)
                .then(response => {
                    return response.data;
                }).catch((err)=>{
                    console.log("请求出错",this.url)
                    return null
                });
        }
        // 超时封装
        return promiseTimeOut(this.timeout, request(this.url, this.reqConfig)
            .then(response => {
                return response.data;
            }).catch((err)=>{
                console.log("请求出错",this.url)
                return null
            }))
    }
}

export class GqlReq {
    private authorization: string = ""

    public withAuthorization(authorization: string) {
        this.authorization = authorization
        return this
    }

    public gqlClient() {
        if (this.authorization === "") {
            return newGqlClient("")
        }
        return newGqlClient(this.authorization)
    }
}