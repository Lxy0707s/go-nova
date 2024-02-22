/** 权限管理页 **/
import React, {useState, useCallback, useMemo, useEffect, useRef} from "react";
import { useSetState, useMount } from "react-use";
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
    Checkbox, Tag, Result, Spin,
} from "antd";
import {
    EyeOutlined,
    ToolOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { cloneDeep } from "lodash";
import {
    TableRecordData,
    ModalType,
    operateType,
} from "./index.type";
import type { EventDataNode, DataNode } from "rc-tree/lib/interface";
import {CoreProps} from "@/pages/manager/info-core/index.props";
import {inject, observer} from "mobx-react";
import "./index.css";
import {Power, PowerParam} from "@/models/power.type";
import {Res} from "@/models/response.type";
import {rootMenu} from "@/models/menu.type";
import {useNavigate} from "react-router-dom";


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
// export const ElementPage:React.FC<CoreProps> = inject("coreStore")(
//     observer((props:CoreProps)=>{
//         const {coreStore} = props;
//         const clicks = () => {
//             console.log("cccccc")
//         }
//         useEffect(()=>{
//             coreStore.initAppData()
//         })
//         return <>
//             <Button onClick={clicks}>
//                 dsdv
//             </Button>
//         </>
//     })
// )


// ==================
// 本组件
// ==================
export const ElementPage:React.FC<CoreProps> = inject("coreStore")(
    observer((props:CoreProps)=> {
        const {coreStore} = props;
        const [form] = Form.useForm();
        const [data, setData] = useState<Power[]>([]); // 当前所选菜单下的权限数据
        const [loading, setLoading] = useState<boolean>(false); // 数据是否正在加载中
        const [spinLoading, setSpinLoading] = useState<boolean>(false)
        const [selectTree, setSelectTree] = useState([])
        // 左侧菜单树相关参数 当前Menu树被选中的节点数据
        const [treeSelect, setTreeSelect] = useState<{ title?: string; key?: string }>({});

        const navigate = useNavigate();
        const [messageApi, contextHolder] = message.useMessage();

        // 模态框相关参数控制
        const [modal, setModal] = useSetState<ModalType>({
            operateType: "add",
            nowData: null,
            modalShow: false,
            modalLoading: false,
        });

        // 生命周期 - 首次加载组件时触发
        useMount(() => {
            coreStore.getTreeData();
            getData(rootMenu)
        });

        useEffect(() => {
            updateSelectTree()
        }, []);

        // 根据所选菜单id获取其下权限数据 没权限则看不到具体权限列表
        const getData =  (menuId: string | null = null) => {
            if (!coreStore.checkPower({authCode: "power:powerList-query"})){
                return;
            }

            setLoading(true);
            const params = {
                menuId: menuId || null,
            };
            const res: Res =  coreStore.getPowerDataByMenuId(params);

            if (res && res.status === 200) {
                setData(res.data);
            }
            setLoading(false);
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
                    getData(info.node.key)
                    // 选中
                    treeSelect = { title: info.node.title, key: info.node.key };
                    setTreeSelect(treeSelect);
                }
            },
            []
        );

        // 新增&修改 模态框出现
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
                        formCode: data?.auth_code,
                        formSorts: data?.sorts,
                        formTitle: data?.title,
                        formKey: data?.key,
                    });
                }
            });
        };

        // 新增&修改 模态框关闭
        const onClose = () => {
            setModal({
                modalShow: false,
            });
        };

        // 新增&修改 提交
        const onOk = () => {
            if (modal.operateType === "see") {
                onClose();
                return "success";
            }
            const values =  form.getFieldsValue(); //validateFields();
            const params: PowerParam = {
                title: values.formTitle,
                auth_code: values.formCode,
                menu_key: treeSelect.key || "",
                sorts: values.formSorts,
                desc: values.formDesc,
                conditions: values.formConditions,
            };
            setModal({
                modalLoading: true,
            });
            if (modal.operateType === "add") {
                // 新增
                const res: Res =  coreStore.addPower(params);
                if (res && res.status === 200) {
                    messageApi.success("添加成功");
                    getData(treeSelect.key);
                    onClose();
                } else {
                    messageApi.error("添加失败");
                }
                setModal({
                    modalLoading: false,
                });
            } else {
                // 修改
                if (!modal?.nowData?.id) {
                    messageApi.error("该数据没有ID");
                    return;
                }
                params.uid = modal.nowData.id;
                params.id = modal.nowData.id;
                const res: Res =  coreStore.upPower(params);
                if (res && res.status === 200) {
                    getData(treeSelect.key);
                    onClose();
                    message.success("更新成功,即将跳转重新登录....");
                    setSpinLoading(true)
                    setTimeout(()=>{
                        setSpinLoading(false)
                        navigate("/login")
                    }, 3000)
                } else {
                    messageApi.error(res.message ?? "failed");
                }
                setModal({
                    modalLoading: false,
                });
            }
        };

        // 删除一条数据
        const onDel = (record: TableRecordData) => {
            const params = { id: record.id };
            setLoading(true);
            const res = coreStore.delPower(params);
            if (res && res.status === 200) {
                getData(treeSelect.key);
                messageApi.success("删除成功,即将跳转重新登录....").then(null);
                setSpinLoading(true)
                setTimeout(()=>{
                    setSpinLoading(false)
                    navigate("/login")
                }, 3000)
            } else {
                messageApi.error(res?.message ?? "操作失败").then(null);
            }
        };

        /** 权限分配按钮权限检测 **/
        const isNeedDivide = (key: string) =>{
            if (key === rootMenu || !key) { return true }
            const isParentMenu = coreStore.findChildMenu(key)
            // 根据power uid、 auth_code检测是否具有操作权限
            return isParentMenu || !coreStore.checkPower({authCode: "power:add"})
        }

        /**
         * updateSelectTree
         * **/
        const updateSelectTree = ()=>{
            if (!coreStore.checkPower({authCode: "power:query"})){
                return setSelectTree([]);
            }
            return setSelectTree(coreStore.powerTreeData)
        }


        // 构建表格数据
        const tableData = useMemo(() => {
            return data.map((item, index) => {
                return {
                    key: index,
                    id: item.id,
                    menu_key: item.menu_key,
                    title: item.title,
                    auth_code: item.auth_code,
                    desc: item.desc,
                    sorts: item.sorts,
                    switch: item.conditions,
                    serial: index + 1,
                    control: item.id,
                };
            });
        }, [data]);

        // ==================
        // 属性 和 memo
        // ==================

        // 构建表格字段
        const tableColumns = [
            {
                title: "序号",
                dataIndex: "serial",
                key: "serial",
            },
            {
                title: "权限名称",
                dataIndex: "title",
                key: "title",
            },
            {
                title: "权限编码",
                dataIndex: "auth_code",
                key: "auth_code",
            },
            {
                title: "描述",
                dataIndex: "desc",
                key: "desc",
            },
            {
                title: "状态",
                dataIndex: "switch",
                key: "switch",
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
                width: 120,
                render: (v: number, record: TableRecordData) => {
                    const controls = [];
                    controls.push(
                        <span
                            key="0"
                            className="control-btn green"
                            onClick={() => onModalShow(record, "see")}
                        >
                          <Tooltip placement="top" title="查看">
                            <EyeOutlined />
                          </Tooltip>
                        </span>
                    );
                    coreStore.checkPower({authCode: "power:up"}) &&
                    controls.push(
                        <span
                            key="1"
                            className="control-btn blue"
                            onClick={() => onModalShow(record, "up")}
                        >
                          <Tooltip placement="top" title="修改">
                            <ToolOutlined />
                          </Tooltip>
                        </span>
                    );
                    coreStore.checkPower({authCode: "power:del"}) &&
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
            coreStore.checkPower({authCode: "power:query"}) ?
                <>
                    {contextHolder}
                    {spinLoading && <Spin className={"example"} size="large" />}
                    <>
                        <div className="page-power-admin">
                        <div className="l">
                            <div className="title">目录结构</div>
                            <div className="tree">
                                <Tree onSelect={onTreeSelect} treeData={selectTree}></Tree>
                            </div>
                        </div>
                        <div className="r">
                            {coreStore.checkPower({authCode: "power:powerList-query"})?
                                <>
                                    <div className="searchBox">
                                        <ul>
                                            {treeSelect.key && <Button
                                                    type="primary"
                                                    icon={<PlusCircleOutlined />}
                                                    onClick={() => onModalShow(null, "add")}
                                                    disabled={isNeedDivide(treeSelect.key)}
                                                >
                                                    {`添加${treeSelect.title || ""}权限`}
                                                </Button>
                                            }
                                        </ul>
                                    </div>
                                    <Table
                                        className="diy-table"
                                        columns={tableColumns}
                                        loading={loading}
                                        dataSource={tableData}
                                        pagination={{
                                            showQuickJumper: true,
                                            showTotal: (total) => `共 ${total} 条数据`,
                                        }}
                                    />
                                </>
                                : <Result
                                    status="403"
                                    title="403"
                                    subTitle="Sorry, you are not authorized to access this page."
                                />
                            }
                        </div>
                        {/** 查看&新增&修改用户模态框 **/}
                        <Modal
                            title={`${
                                { add: "新增", up: "修改", see: "查看" }[modal.operateType]
                            }权限: ${treeSelect.title}->${modal.nowData?.title ?? ""}`}
                            open={modal.modalShow}
                            onOk={onOk}
                            onCancel={onClose}
                            confirmLoading={modal.modalLoading}
                        >
                            <Form form={form} initialValues={{ formConditions: 1 }}>
                                <Form.Item
                                    label="权限名"
                                    name="formTitle"
                                    {...formItemLayout}
                                    rules={[
                                        { required: true, whitespace: true, message: "必填" },
                                        { max: 12, message: "最多输入12位字符" },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入权限名"
                                        disabled={modal.operateType === "see"}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Code"
                                    name="formCode"
                                    {...formItemLayout}
                                    rules={[
                                        { required: true, whitespace: true, message: "必填" },
                                        { max: 12, message: "最多输入12位字符" },
                                    ]}
                                >
                                    <Input
                                        placeholder="请输入权限Code"
                                        disabled={modal.operateType === "see"}
                                    />
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
                            </Form>
                        </Modal>
                    </div>
                    </>
                </>:<Result
                   status="403"
                   title="403"
                   subTitle="Sorry, you are not authorized to access this page."
                />
        );
    })
)


