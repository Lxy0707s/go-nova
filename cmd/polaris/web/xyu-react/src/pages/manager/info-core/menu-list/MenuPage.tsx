/** 菜单管理页 **/
import React, {useState, useCallback, useEffect} from "react";
import {useRefState} from 'nchooks'
import { useSetState } from "react-use";
import {
    Tree,
    Button,
    Table,
    Tooltip,
    Popconfirm,
    Modal,
    Form,
    Select,
    Input,
    InputNumber,
    message,
    Divider,
    Result,
} from "antd";

import {
    EyeOutlined,
    ToolOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {
    ModalType,
    operateType,
} from "./index.type";
import type { EventDataNode, DataNode } from "rc-tree/lib/interface";
import {CoreProps} from "@/pages/manager/info-core/index.props";
import {inject, observer} from "mobx-react";
import "./index.css";
import {getIconDict, IconList,} from "@/config/config.data";
import {RoutesType} from "@/models/menu.type";

const { Option } = Select;
const { TextArea } = Input;

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

// export const MenuPage:React.FC<CoreProps> = inject("coreStore")(
//     observer((props:CoreProps)=>{
//         const {coreStore} = props;
//         const clicks = () => {
//             console.log("MenuPage cccccc")
//         }
//         return <>
//             <Button onClick={clicks}>
//                 MenuPage
//             </Button>
//         </>
//     })
// )

// 本组件
export const MenuPage:React.FC<CoreProps> = inject("coreStore")(
    observer((props:CoreProps)=> {
        const {coreStore} = props;

        const [data, setData,dataRef] = useRefState<RoutesType[]>([]); // 所有的菜单数据（未分层级）
        const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
        const [selectTree, setSelectTree,selectTreeRef] = useRefState([])

        const [form] = Form.useForm();
        const [messageApi, contextHolder] = message.useMessage();

        // 模态框相关参数控制
        const [modal, setModal] = useSetState<ModalType>({
            operateType: "add",
            nowData: null,
            modalShow: false,
            modalLoading: false,
        });

        const [treeSelect, setTreeSelect] = useState<{ title?: string; key?:string }>(
            {}
        );
        // // 生命周期 - 首次加载组件时触发
        // useMount(() => {
        //     setTreeSelect({
        //         "title": "根菜单",
        //         "key": rootMenu
        //     })
        // });

        useEffect(() => {
            updateData();
        }, []);

        // 获取本页面所需数据
        const updateData = () => {
            // if (!p.includes("menu:query")) {
            //     return;
            // }
            setLoading(true);
            try {
                setSelectTree(coreStore.getTreeData());
                setData(coreStore.rootStore.menus);
            } finally {
                setLoading(false);
            }
        };

        /** 点击树目录时触发 **/
        const onTreeSelect = useCallback(
            (
                keys: React.Key[],
                info: {
                    event: "select";
                    selected: boolean;
                    node: EventDataNode<DataNode> & { title: string; key: string };
                    selectedNodes: DataNode[];
                    nativeEvent: MouseEvent;
                }
            ) => {
                let treeSelect = {};
                if (info.selected) {
                    // 选中
                    treeSelect = { title: info.node.title, key: info.node.key };
                }
                setTreeSelect(treeSelect);
            },
            []
        );

        /** 新增&修改 模态框出现 **/
        const onModalShow = (data: RoutesType | null, type: operateType) => {
            setModal({
                modalShow: true,
                nowData: data,
                operateType: type,
            });

            if (type === "add") {
                form.resetFields();
            } else {
                if (data) {
                    form.setFieldsValue({
                        formConditions: data.conditions,
                        formDesc: data.desc,
                        formIcon: data.icon,
                        formSorts: data.sorts,
                        formTitle: data.name,
                        formUrl: data.path,
                        formKey: data.key,
                    });
                }
            }
        };

        /** 新增&修改 模态框关闭 **/
        const onClose = () => {
            setModal({
                modalShow: false,
            });
        };

        /** 新增&修改 提交 **/
        const onOk = () => {
            if (modal.operateType === "see") {
                onClose();
                return "see";
            }
            const values =  form.getFieldsValue(); //validateFields();
            const params: RoutesType = {
                name: values.formTitle,
                path: values.formUrl,
                icon: values.formIcon,
                parent_key: treeSelect.key || null,
                sorts: values.formSorts,
                desc: values.formDesc,
                conditions: values.formConditions,
                key: values.formKey || "1.1.1"
            };
            setModal({
                modalLoading: true,
            });
            if (modal.operateType === "add") {
                const res = coreStore.addMenuByParams(params);
                if (res && res.status === 200) {
                    messageApi.success("添加成功").then(null);
                    updateData();
                    onClose();
                } else {
                    messageApi.error("添加失败").then(null);
                }
                setModal({
                    modalLoading: false,
                    modalShow: false,
                });
            } else {
                const res = coreStore.upMenuByParams(params);
                if (res && res.status === 200) {
                    updateData();
                    onClose();
                    messageApi.success("修改成功,重新登录后生效....").then(null);
                } else {
                    messageApi.error("修改失败").then(null);
                }
                setModal({
                    modalLoading: false,
                    modalShow: false,
                });
            }
            return "ok";
        };

        /** 删除一条数据 **/
        const onDel = (record: RoutesType) => {
            const params = { key : record.key };
            const res = coreStore.delMenu(params);
            if (res && res.status === 200) {
                updateData();
                messageApi.success("删除成功,重新登录后生效....").then( null);
            } else {
                messageApi.error(res?.message ?? "操作失败").then(null);
            }
            return "del";
        };

        /** 构建表格数据 **/
        const tableSource = () => {
            //const tableData = coreStore.getNewMenus()
            return (dataRef.current? [...dataRef.current]:[])
                .filter((item: RoutesType) => item.parent_key === (treeSelect.key || null))
                .map((item:RoutesType, index) => {
                    return item;
                });
        }

        // ==================
        // 属性 和 memo
        // ==================

        /** 构建表格字段 **/
        const tableColumns:RoutesType[] = [
            {
                title: "层级ID",
                dataIndex: "key",
                key: "key",
            },
            {
                title: "图标",
                dataIndex: "icon",
                key: "icon",
                render: (v: string | null) => {
                    return v ? getIconDict(v) : "";
                },
            },
            {
                title: "菜单名称",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "路径",
                dataIndex: "path",
                key: "path",
                render: (v: string | null) => {
                    return v ? `/${v.replace(/^\//, "")}` : "";
                },
            },
            {
                title: "描述",
                dataIndex: "desc",
                key: "desc",
            },
            {
                title: "父级",
                dataIndex: "parent_key",
                key: "parent_key",
                //render: (v: number | string | null) => getNameByParentId(v),
            },
            {
                title: "状态",
                dataIndex: "conditions",
                key: "conditions",
                render: (v: number) =>
                    v === 1 ?
                        (<span style={{ color: "green" }}>启用</span>)
                        :
                        (<span style={{ color: "red" }}>禁用</span>),
            },
            {
                title: "操作",
                key: "control",
                width: 120,
                render: (v: number, record: RoutesType) => {
                    const controls = [];
                    // 查看权限只有有页面访问权限默认有
                    controls.push(
                        <span
                            key="0"
                            className="control-btn green"
                            onClick={() => onModalShow(record, "see")}
                        >
                    <Tooltip placement="top" title="查看">
                      <EyeOutlined />
                    </Tooltip>
                    </span>);
                    coreStore.checkPower({authCode: "menu:up"}) &&
                    controls.push(
                        <span
                            key="1"
                            className="control-btn blue"
                            onClick={() => onModalShow(record, "up")}
                        >
                      <Tooltip placement="top" title="修改">
                        <ToolOutlined />
                      </Tooltip>
                    </span>);
                    coreStore.checkPower({authCode: "menu:del"}) &&
                    controls.push(
                        <Popconfirm
                            key="2"
                            title="确定删除吗?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => onDel(record)}
                        >
                          <span className="control-btn red">
                            <Tooltip placement="top" title="删除">
                              <DeleteOutlined />
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
            coreStore.checkPower({authCode: "menu:query"})?
                <>
                    {contextHolder}
                    <div className="page-menu-admin">
                        <div className="l">
                            <div className="title">目录结构</div>
                            <div className='tree'>
                                <Tree onSelect={onTreeSelect} treeData={selectTreeRef.current?[...selectTreeRef.current]:[]} />
                            </div>
                        </div>
                        <div className="r">
                            {coreStore.checkPower({authCode: "menu:menuList-query"})? <>
                                    <div className="searchBox">
                                        <ul>
                                            {
                                                treeSelect.title?<Button
                                                        type="primary"
                                                        icon={<PlusCircleOutlined />}
                                                        onClick={() => onModalShow(null, "add")}
                                                        disabled={!coreStore.checkPower({authCode: "menu:add"})}
                                                    >
                                                        {`添加${treeSelect.title || "根级"}子菜单`}
                                                    </Button>
                                                    :""
                                            }
                                        </ul>
                                    </div>
                                    <Table
                                        className="diy-table"
                                        columns={tableColumns}
                                        loading={loading}
                                        dataSource={tableSource().length !== 0 ? tableSource(): []}
                                        // 禁止展开子级菜单，保证和右侧树的正常联动
                                        expandable={{showExpandColumn:false}}
                                        pagination={{
                                            showQuickJumper: true,
                                            showTotal: (total) => `共 ${total} 条数据`,
                                        }}
                                    />
                                </>
                                :<Result
                                    status="403"
                                    title="403"
                                    subTitle="Sorry, you are not authorized to access this page."
                                />
                            }
                        </div>
                        <Modal
                            title={`${{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}`}
                            open={modal.modalShow}
                            onOk={onOk}
                            onCancel={onClose}
                            confirmLoading={modal.modalLoading}
                        >
                            <Form form={form} initialValues={{ formConditions: 1 }}>
                                <Form.Item
                                    label="菜单名"
                                    name="formTitle"
                                    {...formItemLayout}
                                    rules={[
                                        { required: true, whitespace: true, message: "必填" },
                                        { max: 12, message: "最多输入12位字符" },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入菜单名"
                                        disabled={modal.operateType === "see"}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="层级编号"
                                    name="formKey"
                                    {...formItemLayout}
                                    rules={[
                                        { required: true, whitespace: true, message: "必填" },
                                        { max: 12, message: "最多输入4位字符" },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入菜单名"
                                        disabled={modal.operateType === "see"}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="菜单链接"
                                    name="formUrl"
                                    {...formItemLayout}
                                    rules={[{ required: true, whitespace: true, message: "必填" }]}
                                >
                                    <Input
                                        placeholder="请输入菜单链接"
                                        disabled={modal.operateType === "see"}
                                    />
                                </Form.Item>
                                <Form.Item label="图标" name="formIcon" {...formItemLayout}>
                                    <Select
                                        popupClassName="iconSelect"
                                        disabled={modal.operateType === "see"}
                                    >
                                        {IconList.map((item, index) => {return (
                                            <Option key={index} value={item}>
                                                {getIconDict(item)}
                                            </Option>
                                        );
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="描述"
                                    name="formDesc"
                                    {...formItemLayout}
                                    rules={[{ max: 100, message: "最多输入100位字符" }]}
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
                                        <Option key={1} value={1}> 启用 </Option>
                                        <Option key={-1} value={-1}> 禁用 </Option>
                                    </Select>
                                </Form.Item>
                                {modal.operateType === "add" ? (
                                    <Form.Item label="温馨提示" {...formItemLayout}>
                                        <span style={{ color: "green" }}>新增菜单后请联系管理进行授权更新</span>
                                    </Form.Item>
                                ) : null}
                            </Form>
                        </Modal>
                    </div>
                </> : <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
        );
    })
)

