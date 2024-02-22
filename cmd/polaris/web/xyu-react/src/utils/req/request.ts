import {IHeader, IReqConfig, promiseTimeOut, request} from './rest.fun';
import {newGqlClient} from "@/utils/req/gql.fun";
import axios from 'axios';
import {axiosFetch} from "@/utils/req/axios.fun";

export const  base_url = "https://aa12b3d6-16ca-4d5f-acc7-80424fa5251a.mock.pstmn.io" //"http://127.0.0.1:8080"


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

    public withToken(token: string) {
        this.reqConfig.Authorization = token
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

    public async axiosFun(){
        return axiosFetch(this.url, this.reqConfig).then(
            (response)=>{
                if (response.data.status === 200){
                    return Promise.resolve(response.data)
                }else {
                    return Promise.resolve({
                        data: null,
                        status: response.data.status,
                        message: "failed"
                    })
                }
            }
        ).catch((err)=>{
        })
    }

    public async reqFun() {
        // 没有设置超时，默认请求
        if (this.timeout === 0) {
            return request(this.url, this.reqConfig)
                .then(response => {
                    return response.data;
                }).catch((err)=>{
                    console.log("无超时等待请求类型，请求出错",this.url,err.toString())
                    return null;
                });
        }
        // 超时封装
        return promiseTimeOut(this.timeout, request(this.url, this.reqConfig)
            .then(response => {
                return response.data;
            }).catch((err)=>{
                console.log("请求出错",this.url,err.toString())
                return null;
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