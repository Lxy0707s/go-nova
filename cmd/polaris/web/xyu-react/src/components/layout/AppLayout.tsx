import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useRefState} from 'nchooks'
import {Link, Outlet, useNavigate} from "react-router-dom";
import {GithubFilled, QuestionCircleFilled, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import { PageContainer, ProLayout, SettingDrawer, ProSettings } from '@ant-design/pro-components';
import { getMatchMenu } from '@umijs/route-utils';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Footer } from "./Footer";
import { appList } from "./appConfig";
import {MenuDataItem} from "@ant-design/pro-layout";
import Authorized from "@/utils/tool/Authorized";
import {noMatch} from "@/components/layout/NoMatch";
import {appMenuApi} from "@/apis/appMenuApi";
import {getToken} from "@/utils/tool/authority";
import {dataToMenu, getMenus} from "@/config/config.model";
import {defaultMenus} from "@/config/defaultConfig";
import {MenuObject} from "@/models/menu.type";
import {inject, observer} from "mobx-react";
import {RootProps} from "@/pages/root.props";
import {useMount} from "react-use";

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
        colorBgCollapsedButton: '#fff',
        colorTextCollapsedButtonHover: 'rgb(197,216,250)',
        colorTextCollapsedButton: 'rgba(0,0,0,0.45)',
        colorBgMenuItemCollapsedElevated: 'rgb(255,255,255)',
        colorBgMenuItemHover: '#fff',
        colorMenuBackground: '#fff',
        colorMenuItemDivider: '#dfdfdf',
        colorTextMenu: '#595959',
        colorTextMenuSelected: 'rgba(42,122,251,1)',
        colorBgMenuItemSelected: 'rgba(230,243,254,1)',
    },
}

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
      //console.log("item.author",item.author,"item", localItem)

      return Authorized.check(item.author, localItem, null) as MenuDataItem;
  });

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const AppLayout: React.FC<RootProps> = inject("rootStore")(
    observer((props:RootProps)=> {
        const [settings, setSetting] = useState<Partial<ProSettings> | undefined>(
            {
                fixSiderbar: true,
                fixedHeader: true,
                layout: "mix",
                splitMenus: true,
                navTheme: "light",
                contentWidth: "Fluid",
                colorPrimary: "#1677FF",
                siderMenuType: "sub"
            }
        );

        const {rootStore} = props;
        const menuDataRef = useRef<MenuDataItem[]>([]);
        const [pathname, setPathname] = useState('/home');
        const [appMenu,setAppMenu,appMenuRef] = useRefState<MenuObject>(defaultMenus)

        const navigate = useNavigate();
        const actionRef = useRef<{
            reload: () => void;
        }>();

        const loginOut = () => {
            navigate("/login")
        }


        const authorized = useMemo(
            () =>
                getMatchMenu(pathname
                    || '/', menuDataRef.current).pop()
                || { author: undefined },
            [pathname],
        );
        useMount(()=>{
            // 全局初始化
            /**
             * 4 . 根据权限layout渲染菜单
             */
            setSetting({
                fixSiderbar: true,
                fixedHeader: true,
                layout: "mix",
                splitMenus: true,
                navTheme: "light",
                contentWidth: "Fluid",
                colorPrimary: "#1677FF",
                siderMenuType: "sub"
            });
            /**
             * 1 . 判断是否登录，否则跳转登录
             */
            if (rootStore.userStatus.userID === 0) {
                navigate("/login");
            }
            /**
             * 2 . 初始化基础数据，user, powers, role-mps,初始化用户数据（权限内）
             *   role: 数据在role页面刷新，这里不做单独加载
             */
            rootStore.initAppData()
            }
        )

        useEffect(() => {
            menuRefresh()
            //actionRef.current?.reload();
            console.log("初始化完成")
        }, []);

        const menuRefresh = () => {
            appMenuApi(getToken()).then((response:any)=>{
                if (response && response.data === null) {
                    setAppMenu(dataToMenu(response.data)[0])
                }else {
                    setAppMenu(getMenus(rootStore.menus, rootStore.userinfo.menus))
                }
            }).catch(
                (err)=>{
                    console.log(err.message)}
            );
        }
        const items: MenuProps['items'] = [
            {
                key: 'logout',
                icon: <LogoutOutlined/>,
                label: '退出登录',
                onClick: loginOut,
            }, {
                key: 'change_password',
                icon: <SettingOutlined/>,
                label: '修改密码',
            },
        ]

        return (
            <div id="layout" style= {{height: '100vh'}}>
                <ProLayout
                    menu={{ type: 'group'}}
                    siderWidth={210}
                    token={token}
                    actionRef={actionRef}
                    route={appMenuRef.current} // appMenu
                    appList={appList}
                    pageTitleRender={false}
                    avatarProps={{
                        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                        size: 'small',
                        title: 'admin',
                        render: (props, dom) => {
                            return (
                                <Dropdown menu={{ items }}>
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
                    menuItemRender={(menuItemProps, defaultDom) => {
                        if (
                            menuItemProps.isUrl ||
                            !menuItemProps.path ||
                            pathname === menuItemProps.path
                        ) {
                            return defaultDom;
                        }
                        if (menuItemProps.path === "/") {
                            navigate("/home");
                        }
                        return (
                            <div  className={'ant-menu-title-content'}
                                  onClick={() => {
                                      setPathname(menuItemProps.path ?? '/home');
                                      //console.log("route-path-->",menuItemProps.path)
                                  }}>
                                <Link to={menuItemProps.path ?? '/'}>
                                    {defaultDom}
                                </Link>

                            </div>
                        )
                    }}
                    menuDataRender={menuDataRender}
                    // menuDataRender={() => menuDataRender(appRoutes)}
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
                        <Authorized authority={authorized!.author} noMatch={noMatch}>
                            {<Outlet/>}
                        </Authorized>
                    </PageContainer>

                    {/* eslint-disable-next-line react/jsx-pascal-case */}
                    <Footer.footerRender/>
                </ProLayout>
                {/*<SettingDrawer*/}
                {/*    pathname={pathname}*/}
                {/*    enableDarkTheme={false}*/}
                {/*    getContainer={() => document.getElementById('layout')}*/}
                {/*    settings={settings}*/}
                {/*    onSettingChange={(changeSetting) => {*/}
                {/*        setSetting(changeSetting);*/}
                {/*    }}*/}
                {/*    disableUrlParams={false}*/}
                {/*/>*/}
            </div>
        );
    })
);


export default AppLayout