// fetch-config.ts
import Qs from 'qs'

export enum ContentType {
    json = 'application/json;charset=UTF-8',
    form = 'application/x-www-form-urlencoded; charset=UTF-8'
}

export enum HttpMethod {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    patch = 'PATCH',
    delete = 'DELETE'
}

export interface IReqConfig {
    body?: any
    method?: string
    headers?: IHeader
    token?: string
    'Content-Type'?: string
}

export interface IHeader {
    'Content-Type'?: string
    'X-Requested-With'?: string
    token?: string
    [propName: string]: any
}

export const promiseTimeOut = (ms: number, promise:Promise<any>) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("promise timeout"))
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timeoutId);
                resolve(res);
            },
            (err) => {
                clearTimeout(timeoutId);
                reject(err);
            }
        );
    })
}

export const request = async (url: string, config: IReqConfig) => {
    let promise: Response
    let contentType: string

    if (config['Content-Type'] !== undefined) {
        contentType = config['Content-Type']
    } else {
        contentType = ContentType.json
    }

    const reqUrl = url //.replace('//', '/')
    // 如果实例配置没传token过来的话，直接使用保存在sessionStorage的token
    // 这里假设后端直接读头文件的token字段，我直接用token当字段了，Authorization也同理
    const headers: Headers = new Headers({
        token: config.token === undefined ? sessionStorage.token : config.token, 'Content-Type': contentType
    } as IHeader)

    if (!config.method || config.method === HttpMethod.get) {
        promise = await fetch(reqUrl, {
            headers
        })
    } else if (config.method === HttpMethod.post) {
        promise = await fetch(reqUrl, {
            body: Qs.stringify(config.body),
            headers,
            method: HttpMethod.post
        })
    } else {
        promise = await fetch(reqUrl, {
            body: JSON.stringify(config.body),
            headers,
            method: config.method
        })
    }
    return handleRes(promise)
}


const handleRes = async (res: Response) => {
    // 如果res.ok，则请求成功
    if (res.ok) {
        return await parseRes(res)
    }
    // 请求失败，则不做解析返回
    return  res
}

const parseRes = async (res: Response) => {
    const contentType = res.headers.get('Content-Type')
    // 判定返回的内容类型，做不同的处理
    if (contentType) {
        if (contentType.indexOf('json') > -1) {
            return await res.json()
        }
        if (contentType.indexOf('text') > -1) {
            return await res.text()
        }
        if (contentType.indexOf('form') > -1) {
            return await res.formData()
        }
        if (contentType.indexOf('video') > -1) {
            return await res.blob()
        }
    }
    return await res.text()
}
