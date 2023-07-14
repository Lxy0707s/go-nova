import React, {useEffect} from 'react';
import { inject, observer} from 'mobx-react';
import {ManagerProps} from "@/pages/manager/props.interface";
import {ProTable} from "@ant-design/pro-components";
import {UserType} from "@/pages/manager/model.interface";
import {userColumns} from "@/pages/manager/user/DataColumns";
import {Button} from "antd";


const UserList: React.FC<ManagerProps> = inject("managerStore")(
    observer( (props: ManagerProps)=> {
        const {managerStore} = props

        useEffect(
            ()=>{
                managerStore?.queryUserList()
                const interval = setInterval(() => {
                    managerStore?.queryUserList()
                }, 10000); // 10s一次

                return () => {
                    clearInterval(interval); // 组件卸载时清除定时器
                };
            },[managerStore])

        return (
            <ProTable<UserType>
                rowKey="key"
                columns={userColumns}
                pagination={{
                    showSizeChanger: true,
                }}
                request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    console.log(params, sorter, filter);
                    return Promise.resolve({
                        data: managerStore?.userList,
                        success: true,
                    });
                }}

                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: false,
                    searchGutter: 24,
                    span: {xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6}
                }}
                dateFormatter="string"
                toolbar={{
                    title: '高级表格',
                    tooltip: '这是一个标题提示',
                }}
                toolBarRender={() => [
                    <Button type="primary" key="primary">创建Todo</Button>,
                ]}
            />
        )
    })
)


export default UserList;