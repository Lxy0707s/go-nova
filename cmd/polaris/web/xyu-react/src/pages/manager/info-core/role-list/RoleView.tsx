import {inject, observer} from 'mobx-react';
import {ProColumns, ProTable} from "@ant-design/pro-components";
import React, { useState} from "react";
import {
    Button,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Result,
    Select,
    Spin,
    Tooltip
} from "antd";
import {CoreProps} from "@/pages/manager/info-core/index.props";
import {useMount, useSetState} from "react-use";
import {ModalType, SearchInfo, TableRecordData} from "@/pages/manager/info-core/role-list/index.modal";
import {operateType} from "@/pages/manager/info-core/menu-list/index.type";
import {DeleteOutlined, EditOutlined, EyeOutlined, ToolOutlined} from "@ant-design/icons";
import utils from "@/utils/utils";
import {Res} from "@/models/response.type";
import {RoleParam, RoleType} from "@/models/role.type";
import {TTree} from "@/components/tree-table/TreeTable";
import {useNavigate} from "react-router-dom";
import {useRefState} from 'nchooks'
import "./index.css"
import {rootMenu} from "@/models/menu.type";

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

// 默认被选中的菜单和权限
export type PowerTreeType = {
    menus: string[];
    powers: number[];
};

// 权限树相关参数
export type PowerTreeInfo = {
    treeOnOkLoading: boolean; // 是否正在分配权限
    powerTreeShow: boolean; // 权限树是否显示
    // checkedData: PowerTreeType; // 树默认需要选中的项 单独抽离，解决set异步问题
};


// export const RoleView:React.FC<CoreProps> = inject("coreStore")(
//     observer((props:CoreProps)=>{
//         const {coreStore} = props;
//         const clicks = () => {
//             console.log("RoleView")
//         }
//         return <>
//             <Button onClick={clicks}>
//                 RoleView
//             </Button>
//         </>
//     })
// )

export const RoleView: React.FC<CoreProps> = inject("coreStore")(
    observer((props:CoreProps)=> {
        const { coreStore } = props;
        const [form] = Form.useForm();
        const [roleData, setRoleData] = useState<RoleType[]>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const [spinLoading, setSpinLoading] = useState<boolean>(false)

        const [powerTreeData,setPowerTreeData ] =  useState([])

        const navigate = useNavigate();
        const [messageApi, contextHolder] = message.useMessage();

        /** 生命周期 - 首次加载组件时触发 **/
        useMount(() => {
            getPowerTreeData();
            setRoleData(coreStore.rootStore.roles);
        });

        /** 构建表格数据,如果需要二次处理数据，在这里处理即可 **/
        const tableSource = () => {
            return roleData ? [...roleData] : []
        }

        /** 模态框相关参数控制 **/
        const [modal, setModal] = useSetState<ModalType>({
            operateType: "add",
            nowData: null,
            modalShow: false,
            modalLoading: false,
        });

        /** 权限树相关参数 **/
        const [power, setPower] = useSetState<PowerTreeInfo>({
            treeOnOkLoading: false,
            powerTreeShow: false,
        });

        /** 权限树相关参数 **/
        const [mp, setMp, mpRef] = useRefState<PowerTreeType>({
            menus: [],
            powers: []
        });

        /** 搜索相关参数 **/
        const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
            title: undefined, // 角色名
            conditions: undefined, // 状态
        });

        /**
         * 添加/修改/查看 模态框出现
         * @param data 当前选中的那条数据
         * @param type add添加/up修改/see查看
         * **/
        const onModalShow = (data: TableRecordData | null, type: operateType) => {
            setModal({
                modalShow: true,
                nowData: data,
                operateType: type,
            });
            setTimeout(() => {
                if (type === "add") {
                    // 新增，需重置表单各控件的值
                    form.resetFields();
                } else {
                    // 查看或修改，需设置表单各控件的值为当前所选中行的数据
                    form.setFieldsValue({
                        formConditions: data?.conditions,
                        formDesc: data?.desc,
                        formSorts: data?.sorts,
                        formRole: data?.role,
                    });
                }
            });
        };

        /** 模态框确定 **/
        const onOk =  async () => {
            setModal({
                modalLoading: true,
            });
            const values =  form.getFieldsValue();//validateFields();
            const params: RoleParam = {
                role: values?.formRole,
                sorts: values?.formSorts,
                conditions: values?.formConditions,
                desc: values?.formDesc,
            };
            switch (modal.operateType) {
                case "see":
                    onClose();
                    break;
                case "add":
                    // 新增
                    const addResp: Res = coreStore.addRole([params]);
                    if (addResp && addResp.status === 200) {
                        setRoleData(addResp.data)
                        messageApi.success(addResp?.message ?? "success").then(null)
                    }else {
                        messageApi.warning(addResp.message).then(null)
                    }
                    onClose()
                    break
                case "up":
                    // 修改
                    params.uid = modal?.nowData?.uid;
                    const upResp: Res = coreStore.updateRole(params);
                    if (upResp && upResp.status === 200) {
                        setRoleData(upResp.data);
                        messageApi.success(upResp?.message ?? "success").then(null)
                    }else {
                        messageApi.warning(upResp.message).then(null)
                    }
                    onClose()
                    break
                default:
                    messageApi.warning("unknown type of option!!!").then(null);
                    onClose()
            }

            return Promise.resolve()
        };

        /** 删除某一条数据 **/
        const onDel =  async (uid: number) => {
            setLoading(true);
            const resp =  await coreStore.deleteRole(uid)
            if (resp && resp.status === 200) {
                setRoleData(resp.data.role);
                messageApi.success(resp?.message ?? "success").then(null)
                if (resp.data.status === 1){
                    setSpinLoading(true)
                    messageApi.success("修改涉及当前用户，请重新登录，即将跳转...").then(null)
                    setTimeout(()=>{
                        setSpinLoading(false)
                        navigate("/login")
                    }, 3000)
                }
            } else {
                messageApi.error(resp?.message ?? "failed").then(null);
            }
            setLoading(false);
        };

        /** 模态框关闭 **/
        const onClose = () => {
            setModal({ modalShow: false, modalLoading: false });
        };

        /** 分配权限按钮点击，权限控件出现 **/
        const onAllotPowerClick = (record: TableRecordData) => {
            // 根据角色id获取当前角色已经分配的权限
            const item = coreStore.getMenuAndPowerByUid(record.uid)
            if (item.status === 200 && item.data){
                const menus = utils.arrSimple(item.data.menus)
                const powers = item.data.powers
                setModal({ nowData: record });
                setMp({menus, powers})
                setPower({
                    powerTreeShow: true, // set 数据
                });
            }
        };

        /** 权限树确定 给角色分配菜单和权限 **/
        const onPowerTreeOk =  (arr: PowerTreeType) => {
            if (!modal?.nowData?.uid) {
                messageApi.error("该数据没有ID").then(null);
                return;
            }
            // 过滤器：
            const params = {
                id: modal.nowData.uid,
                menus: utils.arrSimple(arr.menus),
                powers: arr.powers,
            };
            setPower({
                treeOnOkLoading: true,
            });
            const status = coreStore.setRoleMPs(params)
            if (status === 1) {
                setSpinLoading(true)
                messageApi.success("修改涉及当前用户，请重新登录，即将跳转...").then(null)
                setTimeout(()=>{
                    setSpinLoading(false)
                    navigate("/login")
                }, 3000)
            }
            setPower({ treeOnOkLoading: false ,powerTreeShow : false});
        };

        /** 关闭菜单树 **/
        const onPowerTreeClose = () => {
            setPower({
                powerTreeShow: false,
            });
        };

        /** 函数 - 获取所有的菜单权限数据，用于分配权限控件的原始数据 **/
        const getPowerTreeData = () => {
            const  item = coreStore.getAllMenusAndPowers()
            setPowerTreeData(item)
        };

        /** 表格列标签 **/
        const columns: ProColumns<RoleType>[] = [
            {
                title: '排序',
                dataIndex: 'index',
                valueType: 'indexBorder',
                hideInSearch: true,
                width: 48,
            },
            {
                title: '角色名称',
                dataIndex: 'role',
                copyable: true,
                onFilter: true,
            },
            {
                title: '排序',
                dataIndex: 'sorts',
                onFilter: true,
                copyable: true,
            },
            {
                title: '备注',
                dataIndex: 'desc',
                onFilter: true,
                copyable: true,
            },
            {
                title: "状态",
                dataIndex: "conditions",
                key: "conditions",
                render: (v: number) =>
                    v === 1 ? (
                        <span style={{ color: "green" }}>启用</span>
                    ) : (
                        <span style={{ color: "red" }}>禁用</span>
                    ),
            },
            {
                title: "操作",
                key: "control",
                width: 200,
                render: (v: number, record: TableRecordData) => {
                    const controls = [];
                    // p.includes("role:query") &&
                    controls.push(
                        <span
                            key="0"
                            className="control-btn green"
                            onClick={() => onModalShow(record, "see")}
                        >
                            <Tooltip placement="top" title="查看">
                             <EyeOutlined style={{color:"green"}}/>
                            </Tooltip>
                        </span>
                    );
                    coreStore.checkPower({authCode: "role:up"}) &&
                    controls.push(
                        <span
                            key="1"
                            className="control-btn blue"
                            onClick={() => onModalShow(record, "up")}
                        >
                          <Tooltip placement="top" title="修改">
                            <EditOutlined style={{color:"blue"}}/>
                          </Tooltip>
                        </span>
                    );
                    coreStore.checkPower({authCode: "role:power"}) &&
                    controls.push(
                        <span
                            key="2"
                            className="control-btn blue"
                            onClick={() => onAllotPowerClick(record)}
                        >
                          <Tooltip placement="top" title="分配权限">
                            <ToolOutlined />
                          </Tooltip>
                        </span>
                    );
                    coreStore.checkPower({authCode: "role:del"}) &&
                    controls.push(
                        <Popconfirm
                            key="3"
                            title="确定执行删除吗?"
                            onConfirm={() => onDel(record.uid)}
                            okText="确定"
                            cancelText="取消"
                        >
                          <span className="control-btn red">
                            <Tooltip placement="top" title="删除">
                              <DeleteOutlined style={{color:"red"}}/>
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
            coreStore.checkPower({authCode: "role:query"}) ?
            <>
                {contextHolder}
                <ProTable<RoleType>
                    rowKey="uid"
                    dateFormatter="string"
                    loading={loading}
                    columns={columns}
                    pagination={{
                        showSizeChanger: true,
                    }}
                    dataSource={tableSource()}
                    request={(params, sorter, filter) => {
                        // 表单搜索项会从 params 传入，传递给后端接口。
                        // console.log(params, sorter, filter);
                        return Promise.resolve({
                            data: tableSource(),
                            success: true,
                        });
                    }}
                    search={{
                        labelWidth: 'auto',
                        defaultCollapsed: false,
                        searchGutter: 24,
                        span: {xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6}
                    }}
                    toolBarRender={() => [
                        coreStore.checkPower({authCode: "role:add"})
                        &&
                        <Button  onClick={() => onModalShow(null, "add")}
                            type="primary" key="primary">
                            创建角色
                        </Button>,
                    ]}
                />
                {/* 新增&修改&查看 模态框 */}
                <Modal
                    title={{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}
                    open={modal.modalShow}
                    onOk={onOk}
                    onCancel={onClose}
                    confirmLoading={modal.modalLoading}
                >
                    <Form
                        form={form}
                        initialValues={{
                            formConditions: 1,
                        }}
                    >
                        <Form.Item
                            label="角色名"
                            name="formRole"
                            {...formItemLayout}
                            rules={[
                                { required: true, whitespace: true, message: "必填" },
                                { max: 12, message: "最多输入12位字符" },
                            ]}
                        >
                            <Input
                                placeholder="请输入角色名"
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
                            label="排序"
                            name="formSorts"
                            {...formItemLayout}
                            rules={[{ required: true, message: "请输入排序号" }]}
                        >
                            <InputNumber
                                min={0}
                                max={99999}
                                style={{ width: "100%" }}
                                disabled={modal.operateType === "see"}
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
                <TTree
                    title={modal.nowData ? `分配权限：${modal.nowData.role}` : "分配权限"}
                    data={powerTreeData}
                    hiddenKey={rootMenu}
                    defaultChecked={mpRef.current}
                    loading={power.treeOnOkLoading}
                    modalShow={power.powerTreeShow}
                    onOk={onPowerTreeOk}
                    onClose={onPowerTreeClose}
                />
            </>
            : <>{spinLoading && <Spin className={"example"} size="large"/>}
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
            </>
        )
    })
)