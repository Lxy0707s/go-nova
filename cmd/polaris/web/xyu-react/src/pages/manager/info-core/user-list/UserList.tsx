import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    SearchOutlined,
    ToolOutlined
} from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {
    Button,
    Divider,
    Form,
    Input,
    InputRef,
    message,
    Modal,
    Popconfirm, Result,
    Select,
    Space, Spin, Tag,
    Tooltip, Tree
} from 'antd';
import React, {useRef, useState} from 'react';
import {FilterConfirmProps} from "antd/es/table/interface";
import {inject, observer} from "mobx-react";
import {CoreProps} from "@/pages/manager/info-core/index.props";
import {useMount, useSetState} from 'react-use';
import {ModalType, operateType} from './index.modal';
import utils from "@/utils/utils";
import {UserBasicParam, UserBasicType, UserRoleType} from "@/models/user.type";
import {RoleTreeInfo, RoleTreeType} from "@/models/role.type";
import {useNavigate} from "react-router-dom";
import {Res} from "@/models/response.type";
import {toNumber} from "lodash";

type DataIndex = keyof UserBasicType;

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

// export const UserList:React.FC= () =>{
//     const clicks = () => {
//         console.log("UserList")
//     }
//     return <>
//         <Button onClick={clicks}>
//             UserList
//         </Button>
//     </>
// }

export const UserList: React.FC<CoreProps> = inject("coreStore")(
    observer((props:CoreProps)=> {
        const {coreStore} = props;
        const [searchText, setSearchText] = useState('');
        const [searchedColumn, setSearchedColumn] = useState('');
        const [userData, setUserData] = useState<UserBasicType[]>([]);
        const [loading, setLoading] = useState(false); // 数据是否正在加载中
        const [spinLoading, setSpinLoading] = useState<boolean>(false)

        const searchInput = useRef<InputRef>(null);
        const [form] = Form.useForm();
        const navigate = useNavigate();

        const [messageApi, contextHolder] = message.useMessage();

        // 模态框相关参数
        const [modal, setModal] = useSetState<ModalType>({
            operateType: "add", // see查看，add添加，up修改
            nowData: null,
            modalShow: false,
            modalLoading: false,
        });

        /** 生命周期 - 首次加载组件时触发 **/
        useMount(() => {
            setUserData(coreStore.rootStore.users);
            // 获取角色列表
            initRoleTree();
        });

        /** 构建表格数据,如果需要二次处理数据，在这里处理即可 **/
        const tableSource = () => {
            //console.log("----------->")
            return userData ? [...userData] : []
        }

        const roleTreeSelect = () =>{
            return role.roleTreeDefault ? [...role.roleTreeDefault] : []
        }

        /** 初始化角色树 **/
        const initRoleTree = () =>{
            const roleData = coreStore.rootStore.roles
            if(roleData){
                let roleTree: RoleTreeType[] = []
                for (let i = 0; i < roleData.length; i++) {
                    roleTree[i] = {title:"", key: 0}
                    roleTree[i].title = roleData[i].role;
                    roleTree[i].key = roleData[i].uid
                }
                setRole(
                    {roleData:roleTree}
                )
            }
        }

        /**
         * 添加/修改/查看 模态框出现
         * @param data 当前选中的那条数据
         * @param type add添加/up修改/see查看
         * **/
        const onModalShow = (
            data: UserBasicType | UserBasicParam | null,
            type: operateType
        ): void => {
            setModal({
                modalShow: true,
                nowData: data,
                operateType: type,
            });
            // 用setTimeout是因为首次让Modal出现时得等它挂载DOM，不然form对象还没来得及挂载到Form上
            if (type === "add") {
                form.resetFields();
            } else {
                form.setFieldsValue({
                    formConditions: data.conditions,
                    formUsername: data.username,
                    formPassword: data.password,
                    formAddress: data.address,
                    formPhone: data.phone,
                    formEmail: data.email,
                    formDesc: data.desc,
                });
            }
        };

        // 角色树相关参数
        const [role, setRole] = useSetState<RoleTreeInfo>({
            roleData: [],
            roleTreeLoading: false,
            roleTreeShow: false,
            roleTreeDefault: [],
        });

        // 分页相关参数

        const handleSearch = (
            selectedKeys: string[],
            confirm: (param?: FilterConfirmProps) => void,
            dataIndex: DataIndex,
        ) => {
            confirm();
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
        };

        const handleReset = (clearFilters: () => void) => {
            clearFilters();
            setSearchText('');
        };

        /** 模态框确定 **/
        const onOk = async () => {
            const values =  form.getFieldsValue()// .validateFields();
            setModal({
                modalLoading: true,
            });
            const params: UserBasicParam = {
                username: values.formUsername,
                password: values.formPassword,
                address: values.formAddress,
                phone: values.formPhone,
                email: values.formEmail,
                desc: values.formDesc,
                conditions: values.formConditions,
            };
            switch (modal.operateType) {
                case "see":
                    onClose();
                    break;
                case "add":
                    // 新增
                    const addResp: Res = coreStore.addUser([params]);
                    if (addResp && addResp.status === 200) {
                        setUserData(addResp.data)
                        messageApi.success(addResp?.message ?? "success")
                        onClose();
                    }else {
                        messageApi.warning(addResp.message)
                    }
                    setModal({modalLoading: false});
                    break;
                case "up": // 修改
                    params.uid = modal?.nowData?.uid;
                    const upResp: Res = coreStore.updateUser(params);
                    if (upResp && upResp.status === 200) {
                        setUserData(upResp.data);
                        messageApi.success(upResp?.message ?? "success")
                        onClose();
                    }else {
                        messageApi.warning(upResp.message)
                    }
                    setModal({modalLoading: false});
                    break
                default:
                    messageApi.warning("unknown type of option!!!")
                    setModal({modalLoading: false});
            }
            return null
        };

        // 删除某一条数据
        const onDel =  async (uid: number)  => { //Promise<void>
            setLoading(true);
            if (uid === coreStore.rootStore.userStatus.userID){
                messageApi.warning("自己不能删除自己的账户，请联系管理员.").then(null);
                setLoading(false);
                return
            }
            const resp = await coreStore.deleteUser(uid);
            if (resp && resp.status === 200) {
                setUserData(resp.data)
                messageApi.success(resp?.message ?? "success").then(null)
            } else {
                messageApi.error(resp?.message ?? "操作失败").then(null);
            }
            setLoading(false);
        };

        /** 模态框关闭 **/
        const onClose = () => {
            setModal({modalShow: false});
        };

        /** 分配角色按钮点击，角色控件出现 **/
        const onTreeShowClick = (record: UserBasicType): void => {
            setModal({
                nowData: record,
            });
            setRole({
                roleTreeShow: true,
                roleTreeDefault: record.roleIds ? [...record.roleIds] : []//record.roleIds || [],
            });
        };

        /**  分配角色确定 **/
        const onRoleOk =  () => { //: Promise<void>
            if (!modal.nowData?.uid) {
                messageApi.error("未获取到该条数据id").then(null);
                return "failed";
            }
            const params:UserRoleType = {
                id: modal.nowData.uid,
                roles: role.roleTreeDefault.map((item) => Number(item)),
            };
            setRole({
                roleTreeLoading: true,
            });
            const resp: Res = coreStore.setUserRoles(params);
            if (resp && resp.status === 200) {
                messageApi.success("分配成功").then(null);
                setUserData(resp.data.users);
                onRoleClose();
                if (resp.data.status === 1){
                    setSpinLoading(true)
                    messageApi.success("修改涉及当前用户，请重新登录，即将跳转...")
                    setTimeout(()=>{
                        setSpinLoading(false)
                        navigate("/login")
                    }, 3000)
                }
            } else {
                messageApi.error(resp?.message ?? "操作失败").then(null);
            }
            setRole({
                roleTreeLoading: false,
                roleTreeShow: false
            });
        };

        /**  分配角色树关闭 **/
        const onRoleClose = (): void => {
            setRole({
                roleTreeShow: false,
            });
        };

        /** 实时保存角色树的选中结果 **/
        const onTreeChange = (selectKeys: React.Key[]) => {
            setRole({
                roleTreeDefault: selectKeys.map((item)=>toNumber(item))
            })
        }

        const getColumnSearchProps = (dataIndex: DataIndex): ProColumns<UserBasicType> => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search ${dataIndex}`}
                        //value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button type="primary" icon={<SearchOutlined />} size="small" style={{ width: 90 }}
                                onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        >
                            Search
                        </Button>
                        <Button size="small" style={{ width: 90 }}
                                onClick={() => clearFilters && handleReset(clearFilters)}
                        >
                            Reset
                        </Button>
                        <Button type="link" size="small"
                                onClick={() => {
                                    close();
                                }}>
                            close
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
            ),
            onFilter: (value, record) =>
                record[dataIndex].toString().toLowerCase()
                    .includes((value as string).toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            render: (text) => <div>{text}</div>
        });

        const columns: ProColumns<UserBasicType>[] = [
            {
                title: '用户名',
                dataIndex: 'username',
                fixed: 'left',
                width: 100,
                align: "center",
                copyable: true,
                onFilter: true,
                ...getColumnSearchProps('username'),
            },
            {
                title: '角色',
                width: 130,
                align: "center",
                dataIndex: 'roleIds',
                onFilter: true,
                tooltip: {
                    title: "黄色: 角色被禁用，红色线: 没有分配角色"
                },
                render: (v, record)=>{
                    const result: JSX.Element[] = [];
                    const ids = Array.from(record.roleIds)
                    if (ids.length === 0) {
                        result.push(<Tag color="#f50" key="0">{""}</Tag>);
                        return result
                    }
                    ids.forEach((uid, index) => {
                        const roleInfo = coreStore.getRoleNameByUid(uid)
                        switch (roleInfo.data.conditions){
                            case 1:
                                result.push(<Tag color="processing" key={index}>{roleInfo.data.name}</Tag>);
                                break
                            default:
                                result.push(<Tag color="warning" key={index}>{roleInfo.data.name}</Tag>);
                        }
                    });
                    return result
                }
            },
            {
                title: '电话',
                width: 150,
                align: "center",
                dataIndex: 'phone',
                onFilter: true,
                copyable: true,
                ...getColumnSearchProps('phone'),
            },
            {
                title: '邮箱',
                width: 150,
                align: "center",
                dataIndex: 'email',
                hideInSearch: true,
                copyable: true,
            },
            {
                title: "状态",
                dataIndex: "conditions",
                align: "center",
                width: 150,
                key: "conditions",
                render: (v: number): JSX.Element =>
                    v === 1 ? (
                        <span style={{ color: "green" }}>启用</span>
                    ) : (
                        <span style={{ color: "red" }}>禁用</span>
                    ),
            },
            {
                title: "操作",
                key: "control",
                fixed: 'right',
                align: "center",
                width: 120,
                render: (v: null, record: UserBasicType) => {
                    const controls = [];
                    // p.includes("user:query") &&
                    controls.push(
                        <span
                            key="0"
                            className="control-btn green"
                            onClick={() => onModalShow(record, "see")}
                        >
                            <Tooltip placement="top" title="查看">
                                <EyeOutlined style={{ color: "green" }} />
                            </Tooltip>
                         </span>
                    );
                    coreStore.checkPower({authCode: "user:up"}) &&
                    controls.push(
                        <span
                            key="1"
                            className="control-btn blue"
                            onClick={() => onModalShow(record, "up")}
                        >
                         <Tooltip placement="top" title="修改">
                            <EditOutlined style={{ color: "red" }} />
                         </Tooltip>
                        </span>
                    );
                    coreStore.checkPower({authCode: "user:role"}) &&
                    controls.push(
                        <span
                            key="2"
                            className="control-btn blue"
                            onClick={() => onTreeShowClick(record)}
                        >
                         <Tooltip placement="top" title="分配角色">
                            <ToolOutlined style={{ color: "blue" }}/>
                         </Tooltip>
                        </span>);
                    coreStore.checkPower({authCode: "user:del"}) &&
                    controls.push(
                        <Popconfirm
                            key="3"
                            title="确定删除吗?"
                            onConfirm={() => onDel(record.uid)}
                            okText="确定"
                            cancelText="取消"
                        >
                      <span className="control-btn red">
                        <Tooltip placement="top" title="删除">
                            <DeleteOutlined  style={{ color: "red" }} />
                        </Tooltip>
                      </span>
                      </Popconfirm>
                    );

                    const result: JSX.Element[] = [];
                    controls.forEach((item, index) => {
                        if (index) {
                            result.push(<Divider key={`line${index}`} type="vertical" />);
                        }
                        result.push(item);
                    });

                    return result;
                },
            },
        ];

        return (
            coreStore.checkPower({authCode: "user:query"})?
            <>
                {contextHolder}
                <ProTable<UserBasicType>
                    rowKey={"uid"}
                    pagination={{showSizeChanger: true}}
                    columns={columns}
                    toolbar={{title:"系统用户列表"}}
                    dataSource={tableSource()}
                    // request={(params, sorter, filter) => {
                    //    // 表单搜索项会从 params 传入，传递给后端接口。
                    //    //  console.log("0",params);
                    //    //  console.log("1",sorter)
                    //    //  console.log("2",filter)
                    //    // 可以将请求参数传给后端然后这里重新渲染
                    //     return Promise.resolve({
                    //         data: tableSource(),//elements
                    //         success: true,
                    //     });
                    // }}
                    search={{
                        labelWidth: 'auto',
                        defaultCollapsed: false,
                        searchGutter: 24,
                        span: {xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6}
                    }}
                    toolBarRender={() => [
                        coreStore.checkPower({authCode: "user:add"}) &&
                        <Button type="primary" onClick={
                            ()=>onModalShow(null, "add")
                            } key="primary">
                            新建用户
                        </Button>,
                    ]}
                />
                {/* 新增&修改&查看 模态框 */}
                <Modal
                    title={{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}
                    confirmLoading={modal.modalLoading}
                    open={modal.modalShow}
                    onOk={()=>onOk()}
                    onCancel={() => onClose()}
                >
                    <Form
                        form={form}
                        initialValues={{formConditions: 1,}}
                    >
                        <Form.Item
                            label="用户名"
                            name="formUsername"
                            {...formItemLayout}
                            rules={[
                                { required: true, whitespace: true, message: "必填" },
                                { max: 12, message: "最多输入12位字符" },
                            ]}
                        >
                            <Input
                                placeholder="请输入用户名"
                                disabled={modal.operateType === "see"}
                            />
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            name="formPassword"
                            {...formItemLayout}
                            rules={[
                                { required: true, whitespace: true, message: "必填" },
                                { min: 6, message: "最少输入6位字符" },
                                { max: 18, message: "最多输入18位字符" },
                            ]}
                        >
                            <Input
                                type="password"
                                placeholder="请输入密码"
                                disabled={modal.operateType === "see"}
                                autoComplete = "off"
                            />
                        </Form.Item>
                        <Form.Item
                            label="电话"
                            name="formPhone"
                            {...formItemLayout}
                            rules={[
                                () => ({
                                    validator: (rule, value) => {
                                        const v = value;
                                        if (v) {
                                            if (!utils.checkPhone(v)) {
                                                return Promise.reject("请输入有效的手机号码");
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input
                                placeholder="请输入手机号"
                                maxLength={11}
                                disabled={modal.operateType === "see"}
                            />
                        </Form.Item>
                        <Form.Item
                            label="住址"
                            name="formAddress"
                            {...formItemLayout}
                        >
                            <Input
                                placeholder="请输入住址"
                                disabled={modal.operateType === "see"}
                            />
                        </Form.Item>
                        <Form.Item
                            label="邮箱"
                            name="formEmail"
                            {...formItemLayout}
                            rules={[
                                () => ({
                                    validator: (rule, value) => {
                                        const v = value;
                                        if (v) {
                                            if (!utils.checkEmail(v)) {
                                                return Promise.reject("请输入有效的邮箱地址");
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input
                                placeholder="请输入邮箱地址"
                                disabled={modal.operateType === "see"}
                            />
                        </Form.Item>
                        <Form.Item
                            label="描述"
                            name="formDesc"
                            {...formItemLayout}
                            rules={[{ max: 100, message: "最多输入100个字符" }]}
                        >
                            <TextArea
                                rows={4}
                                disabled={modal.operateType === "see"}
                                autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="状态"
                            name="formConditions"
                            {...formItemLayout}
                            rules={[{ required: true, message: "请选择状态" }]}
                        >
                            <Select disabled={modal.operateType === "see"}>
                                <Option key={1} value={1}>
                                    启用
                                </Option>
                                <Option key={-1} value={-1}>
                                    禁用
                                </Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    width={345}
                    open={role.roleTreeShow}
                    onOk={onRoleOk}
                    onCancel={onRoleClose}
                    confirmLoading={role.roleTreeLoading}
                > <span>角色配置</span>
                    <Tree
                        checkable
                        onCheck={onTreeChange}
                        checkedKeys={roleTreeSelect()}
                        treeData={role.roleData}
                        style={{paddingTop:12}}
                    />
                </Modal>
            </> :<>{spinLoading && <Spin className={"example"} size="large"/>}
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
             </>
        );
    })
)

