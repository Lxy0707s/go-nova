import {Alert, message} from "antd";
import React from "react";


export const ConfigPage: React.FC = () => {

    const messageShow = () => {
        message.success("")
    }
    return (
        <>
            <h3>
                系统配置管理开发中....
            </h3>
            <button
                onClick={messageShow}>
                reRender
            </button>
        </>
    );
}