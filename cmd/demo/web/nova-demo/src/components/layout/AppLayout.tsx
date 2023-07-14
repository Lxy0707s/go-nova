import React, { useState } from 'react';
import {Link, Outlet} from "react-router-dom";
import {
    GithubFilled,
    QuestionCircleFilled,
    LogoutOutlined
} from '@ant-design/icons';
import {
    PageContainer,
    ProCard,
    ProLayout,
    SettingDrawer,
    ProSettings
} from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import { Footer } from "./Footer";
import { appList } from "./appConfig";
import { AppMenuRoute } from "@/config";

const token = {
    header: {
        colorBgHeader: '#004FD9',
        colorBgRightActionsItemHover: 'rgba(0,0,0,0.06)',
        colorTextRightActionsItem: 'rgba(255,255,255,0.65)',
        colorHeaderTitle: '#fff',
        colorBgMenuItemHover: 'rgba(0,0,0,0.06)',
        colorBgMenuItemSelected: 'rgba(0,0,0,0.15)',
        colorTextMenuSelected: '#fff',
        colorTextMenu: 'rgba(255,255,255,0.75)',
        colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
        colorTextMenuActive: 'rgba(255,255,255,0.95)',
    },
    sider: {
        colorMenuBackground: '#fff',
        colorMenuItemDivider: '#dfdfdf',
        colorTextMenu: '#595959',
        colorTextMenuSelected: 'rgba(42,122,251,1)',
        colorBgMenuItemSelected: 'rgba(230,243,254,1)',
    },
}

const AppLayout= () => {
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>(
        {
            fixSiderbar: true,
            fixedHeader: true,
            layout: 'mix',
            splitMenus: true,
            navTheme: "light",
            contentWidth: "Fluid",
            colorPrimary: "#1677FF",
            siderMenuType: "sub",
        }
    );

    const [pathname, setPathname] = useState('/welcome');

    return (
        <div id="layout" style= {{height: '100vh'}}>
            <ProLayout
                menu={{ type: 'group'}}
                token={token}
                route={AppMenuRoute}
                appList={appList}
                pageTitleRender={false}
                avatarProps={{
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                    size: 'small',
                    title: 'admin',
                    render: (props, dom) => {
                        return (
                            <Dropdown menu={{
                                items: [{
                                    key: 'logout',
                                    icon: <LogoutOutlined />,
                                    label: '退出登录',
                                    },
                                ]}}>
                                {dom}
                            </Dropdown>
                        );
                    },
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    return [
                        // 网站辅助信息，比如帮助跳转，git等
                        <GithubFilled key="GithubFilled" />,
                        <QuestionCircleFilled key="QuestionCircleFilled" />,
                    ];
                }}
                menuItemRender={(item, dom) => (
                    <div onClick={() => {
                        setPathname(item.path ?? '/welcome');
                        console.log("route-path-->",item.path)
                    }}>
                        <Link to={item.path ?? '/'}>
                            {dom}
                        </Link>

                    </div>

                )}
                headerTitleRender={(logo, title, _) => {
                    return (
                        <div>
                            {logo}
                            {<div style={{ color: 'white', textTransform: 'uppercase' }}>
                                Xyu-Pro
                            </div>}
                        </div>
                    );
                }}
                // 此设置用于页面重新渲染/刷新后访问的menu焦点
                // location={{
                //     pathname,
                // }}
                defaultCollapsed={true}
                {...settings}
            >
                <PageContainer fixedHeader >
                    <ProCard style={{ height: 'auto', overflow: 'auto' }}>
                        <Outlet/>
                    </ProCard>
                </PageContainer>

                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <Footer.footerRender/>
            </ProLayout>
            <SettingDrawer
                pathname={pathname}
                enableDarkTheme
                getContainer={() => document.getElementById('layout')}
                settings={settings}
                onSettingChange={(changeSetting) => {
                    setSetting(changeSetting);
                }}
                disableUrlParams={false}
            />
        </div>
    );
};

export default AppLayout