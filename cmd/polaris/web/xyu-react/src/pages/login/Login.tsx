import { createFromIconfontCN, LockTwoTone, MailTwoTone, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Spin, Tabs } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./style.css"
import {useNavigate} from "react-router-dom";
import {
    captchaCodeRule,
    emailCodeRule,
    emailRegxRule, LoginParamsType,
    passwordRule, userNameRule
} from "./model.interface";
import moment from "moment";
import {inject, observer} from "mobx-react";
import {LoginProps} from "@/pages/login/props.interface";

const { TabPane } = Tabs;
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1873282_onfaq4da0nb.js',
});

const Login: React.FC<LoginProps> = inject("loginStore")(
    observer((props:LoginProps)=> {
        const { loginStore } = props;
        const [timing, setTiming] = useState(false);
        const [autoLogin, setAutoLogin] = useState(true);
        const [challengeKey, setChallengeKey] = useState('key'); // 验证码，由后端传递
        const [codeImg, setCodeImg] = useState(null);
        const [codeLoading, setCodeLoading] = useState(true);
        const [loading, setLoading] = useState(true);
       // const loginAccountFormRef = useRef();
        const loginEmailFormRef = useRef();
        const navigate = useNavigate();

        const [form] = Form.useForm();

        const onGetCaptcha = useCallback(async email => {
            const ret = loginStore.onGetEmail(email);
            setTiming(true);
        }, []);

        useEffect(() => {
            onGetChallenge();
        }, []);

        const onGetChallenge = () => {
            // 请求接口获取图形验证码
            setCodeImg("data:image/jpeg;base64,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"); //res && res.image_url
            // setChallengeKey("xxx"); //res && res.key
            setCodeLoading(false);
        };

        const  handleAccountSubmit = (values: LoginParamsType) => {
            values.times =  loginStore.getNow();
            values.type = "account"
            values.challengeKey = challengeKey
            setLoading(true);
            console.log("login params:",values)
            loginStore.login(values).then((data) => {
                if (data !== null) {
                    loginStore.setToken(data)
                    setAutoLogin(true)
                    setLoading(false);

                    loginStore.rootStore.updateUserStatus({id:1, token: "success", status: 1})
                    navigate("/")
                }
            }).catch((e)=>{
                loginStore.clearToken()
                setLoading(false);
                form.resetFields();
                navigate("/login")
            })
        };

        const handleEmailSubmit = (values:any) => {
            values.times =  moment().format('YYYY-MM-DD HH:mm:ss');
            values.type = "email"
            values.challengeKey = challengeKey
            const res =  loginStore.login(values)
            res.then((err) => {

            });
        };

        return (
            <div className="box">
                <div className="login-box">
                    <div className="login-title">
                        <h2>云阁 · 演示系统 V1.0.0</h2>
                    </div>
                    <fieldset className="login-contain">
                        <legend className="legend">
                            <span className={'legend-title'}>用户登录</span>
                        </legend>
                        <Tabs defaultActiveKey="account">
                            <TabPane key="account" tab="账户密码登录">
                                {/*ref={loginAccountFormRef}*/}
                                <Form form={form}  onFinish={(values) => {
                                    handleAccountSubmit(values as LoginParamsType);
                                }}>
                                    <Form.Item
                                        style={{ marginBottom: 24 }}
                                        name="userName"
                                        rules={userNameRule}
                                    >
                                        <Input size="large" placeholder='请输入用户名' prefix={<UserOutlined
                                            style={{color: '#1890ff',}}
                                            className={"site-form-item-icon"}
                                        />} />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ marginBottom: 24 }}
                                        name="password"
                                        rules={passwordRule}>
                                        <Input.Password autoComplete="off" size="large" placeholder='请输入密码' prefix={<LockTwoTone className={"site-form-item-icon"} />} />
                                    </Form.Item>
                                    <Row gutter={8}>
                                        <Col span={16}>
                                            <Form.Item name="pic_captcha"
                                                       rules={captchaCodeRule}>
                                                <Input size="large" placeholder='请输入验证码' prefix={<IconFont type="iconyanzhengma"  />} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Spin spinning={codeLoading} className={"check-code-img"}>
                                                <img alt="Captcha"
                                                     style={{ width: '100%', height: 35, marginTop: 2.5, marginRight: 10 }}
                                                     src={codeImg}
                                                     onClick={onGetChallenge}
                                                />
                                            </Spin>
                                        </Col>
                                    </Row>
                                    <Form.Item>
                                        <Button size="large" type="primary"  className={"login-form-button"} htmlType="submit">登录</Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane key="email" tab="邮箱验证码登录">
                                <Form ref={loginEmailFormRef} >
                                    <Form.Item name="email" rules={emailRegxRule}>
                                        <Input size="large" placeholder='请输入邮箱' prefix={<MailTwoTone  />} />
                                    </Form.Item>
                                    <Row gutter={8}>
                                        <Col span={16}>
                                            <Form.Item name="captcha"
                                                // countDown={120}
                                                // getCaptchaButtonText=""
                                                // getCaptchaSecondText="秒"
                                                       className={"input-check-code"}
                                                       rules={emailCodeRule}>
                                                <Input size="large"
                                                       placeholder='请输入邮箱验证码'
                                                       prefix={<IconFont type="iconyanzhengma"  />} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Button
                                                disabled={timing}
                                                className={"input-check-button"}
                                                onClick={() => {

                                                }}
                                            >
                                                {timing ? `${1} 秒` : '获取验证码'}
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Form.Item>
                                        <Button  className={"login-form-button"} size="large" type="primary"  htmlType="submit">
                                            登录
                                        </Button>
                                    </Form.Item>
                                </Form>

                            </TabPane>
                        </Tabs>
                    </fieldset>
                </div>
            </div>
        );
    })
)


export default Login;
