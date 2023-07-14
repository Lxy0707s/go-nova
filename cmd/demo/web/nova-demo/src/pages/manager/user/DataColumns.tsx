import {ProColumns, TableDropdown} from "@ant-design/pro-components";
import {UserType} from "@/pages/manager/model.interface";


export const userColumns: ProColumns<UserType>[] = [
    {
        title: '序号',
        dataIndex: 'index',
        valueType: 'indexBorder',
        hideInSearch: true,
        width: 48,
    },
    {
        title: '姓名',
        dataIndex: 'username',
        copyable: true,
        onFilter: true,
    },
    {
        title: '密码',
        dataIndex: 'password',
        onFilter: true,
        copyable: true,
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        onFilter: true,
        copyable: true,
    },
    {
        title: '电话',
        dataIndex: 'phone',
        onFilter: true,
        copyable: true,
    },
    {
        title: '住址',
        dataIndex: 'address',
        onFilter: true,
        copyable: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        initialValue: 'all',
        filters: true,
        onFilter: true,
        valueEnum: {
            normal: { text: '正常', status: 'Default' },
            egression: { text: '出差', status: 'Default' },
            practice: { text: '实习', status: 'Processing' },
            vacate: { text: '请假', status: 'Pending' },
            other: { text: '其他', status: 'Pending' },
        },
    },
    {
        title: '操作',
        width: 180,
        key: 'option',
        valueType: 'option',
        render: () => [
            <div key="link1">更新</div>,
            <div key="link2">详情</div>,
            <TableDropdown
                key="actionGroup"
                menus={[
                    { key: 'view', name: '查看' },
                    { key: 'copy', name: '复制' },
                    { key: 'delete', name: '删除' },
                ]
            }
            />,
        ],
    },
];