import React from "react";
import {RouteObject} from "react-router-dom";
import { IndexPageStyle, IndexPageContent } from './style';
import {CenterScreen, LeftScreen, RightScreen, TopScreen} from "@/pages/home";

export const Screen = ()=> {
    return (

        <IndexPageStyle>
            <TopScreen />
            <IndexPageContent>
                <LeftScreen/>
                {/* 中间内容 */}
                <div className='center-page'>
                    <CenterScreen />
                </div>
                <RightScreen/>
            </IndexPageContent>
        </IndexPageStyle>
    )
}

export const ScreenRoute:RouteObject[]  = [
    { path: '/home', element: <Screen/>,}
]