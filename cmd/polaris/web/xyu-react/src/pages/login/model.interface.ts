
// -------------------- login type --------------------------------

import authorize from "@/components/authorized/Secured";

export type LoginParamsType = {
    userName: string; // 账户名
    password: string; // 密码
    times: string;    // 登录时间
    type: string;     // 登录类型： account | email
    challengeKey: string; // 后端上传-加密/避免后端缓存浪费，每次加密给前端，由前端存储
    pic_captcha: string;  // 前端传入，如果成功，则一起返回后端进行校验
};


// const type

export const defaultToken = "admin"

// -------------------- form rule --------------------------------

export const emailRegxRule = [
    {
        required: true,
        message: '请输入邮箱地址！',
    },
    {
        //  /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
        pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
        message: '邮箱地址格式错误！',
    },
]

export const emailCodeRule = [{
    required: true,
    message: '请输入邮箱验证码！',
},]

export const captchaCodeRule = [{
    required: true,
    message: '请输入验证码！',
},]

export const userNameRule = [
    {
        required: true,
        message: '请输入用户名!',
    },
]

export const passwordRule = [{
    required: true,
    message: '请输入密码！',
},]