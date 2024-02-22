import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Checkbox, Modal, Spin, Table} from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import {Power, PowerTree, PowerTreeDefault} from "@/models/power.type";
import { useForceUpdate } from 'nchooks';
import utils from "@/utils/utils";
import "./styles.css"

type TiledData = {
    key: string;
    parent_key: string;
};

type PowerLevel = PowerTree & {
    parent?: PowerLevel;
    children?: PowerLevel[];
    key?: string;
};

interface TTreeProps {
    title: string; // 指定模态框标题
    hiddenKey?: string; //需要隐藏的key 行
    data: PowerTree[]; // 所有的菜单&权限原始数据
    defaultChecked: PowerTreeDefault; // 需要默认选中的项
    modalShow: boolean; // 是否显示
    initLoading?: boolean; // 初始化时，树是否处于加载中状态
    loading: boolean; // 提交表单时，树的确定按钮是否处于等待状态
    onClose?: () => void; // 关闭模态框
    onOk?: (res: PowerTreeDefault) => void; // 确定选择，将所选项信息返回上级
}


export const TTree: React.FC<TTreeProps> = (props: TTreeProps) => {
    const [btnChecked, setBtnChecked] = useState<number[]>([]); // 受控，所有被选中的权限数据
    const [treeChecked, setTreeChecked] = useState<string[]>([]); // 受控，所有被选中的表格行
    const [selectedRow, setSelectedRow] = useState([])

    // 副作用 哪些需要被默认选中
    useEffect(() => {
        if (props.hiddenKey == undefined){
            props.hiddenKey = "key"
        }
        setTreeChecked(props.defaultChecked.menus ? [...props.defaultChecked.menus] : []);
        setBtnChecked(props.defaultChecked.powers ? [...props.defaultChecked.powers] : []);
        /** 单独控制每次的tree渲染，不做其他操作 **/
        setSelectedRow(props.defaultChecked.menus)
    }, [props.defaultChecked]);

    const defaultSelectData = props.defaultChecked
    // rowSelection objects indicates the need for row selection
    const rowSelection: TableRowSelection<PowerTree> = useMemo(() => {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log("selectedRowKeys",selectedRowKeys)
            // console.log("tree",treeChecked)
            // console.log("selectedRows",selectedRows)
            setSelectedRow(selectedRowKeys);
        },
        onSelect: (record, selected, selectedRows) => {
            const result = fTreeDataByKey(props.data[0]?.children, record.key)
            let t = result[0]
            if (selected && t) {  // 选中，连带其权限全部勾选
                let btnCheckedTemp = [...btnChecked];
                const temp = getPowers(result)
                // if(treeChecked.length === 0){
                //     treeChecked.push(rootMenu) // root = 1
                // }
                temp.powers.map((value)=>{
                    if (!btnCheckedTemp.find((item)=>(item === value))) {
                        btnCheckedTemp.push(value)
                    }
                })
                const treeCheckedTmp = utils.unionStrSet(temp.menus, utils.unionStrSet(fParentKeys(treeToData(props.data[0]?.children),record.key),treeChecked))
                setBtnChecked(btnCheckedTemp);
                setTreeChecked(treeCheckedTmp);
            } else {
                // 取消选中，取消选择，则仅仅关注下级节点
                if (t) {
                    const treeTemp = getPowers(result)
                    const powers = btnChecked.filter(
                        (item) => treeTemp.powers.map((item) => item).indexOf(item) < 0
                    );
                    const menus = treeChecked.filter(
                        (item) => treeTemp.menus.map((item) => item).indexOf(item) < 0
                    );
                    setBtnChecked(powers);
                    setTreeChecked(menus)
                }
            }
        },
      };
    }, [props.data, treeChecked, btnChecked]);

    const reRender = useForceUpdate()
    // 提交
    const onOk = useCallback(() => {
        props.onOk?.({
            menus: treeChecked,
            powers: btnChecked,
        });
        reRender()
    }, [props, btnChecked, treeChecked]);

    // 关闭模态框
    const onClose = useCallback(() => {
        props.onClose();
    }, [props]);

    const getPowers = (tree:PowerTree[]) => {
        const res:PowerTreeDefault= { menus: [], powers: [] }
        for (let i = 0; i < tree.length; i++) {
            if(tree[i] === undefined){
                continue
            }
            res.menus.push(tree[i].key)
            if(tree[i].powers){
                tree[i].powers?.forEach((value, index, array)=>{
                    res.powers.push(value.id)
                })
            }
            if(tree[i].children){ // 找到目录
                let tmp = getPowers(tree[i].children)
                tmp.menus.forEach(
                    (value, index, array)=>{
                        res.menus.push(value)
                    }
                )
                tmp.powers.forEach((value, index, array)=>{
                    res.powers.push(value)
                })
            }
        }
        return res
    }

    const treeToData = (trees: PowerTree[]) => {
        const datas: TiledData[] = []
        trees.forEach((value)=>{
            value && datas.push({key: value.key, parent_key: value.parent_key})
            if(Array.isArray(value.children)){
                let tmp = treeToData(value.children)
                tmp.forEach((item)=>{
                    item && datas.push(item)
                })
            }
        })
        return datas
    }

    const fTreeDataByKey = (tree:PowerTree[], key:string) => {
        const res:PowerTree[] = []
        for (let i = 0; i < tree.length; i++) {
            if(tree[i].key !== key){
                if(tree[i].children){
                    let tmp = fTreeDataByKey(tree[i].children, key)
                    tmp[0] && res.push(tmp[0])
                }
            }else {
                tree[i] && res.push(tree[i])
                break
            }
        }
        return res
    }

    const fParentKeys = (datas: TiledData[],key: string) => {
        let keys: string[] = []
        datas.forEach((value)=>{
            if(value.key === key){
                keys.push(value.parent_key)
                let tmp = fParentKeys(datas, value.parent_key)
               tmp && keys.push(...tmp)
            }
        })
        return keys
    }

    // 被选中的权限 受控
    const isBtnChecked = useCallback(
        (id: number): boolean => {
            return !!btnChecked.find((item) => item === id);
        },
        [btnChecked]
    );

    // 权限 btn权限选中和取消选中，需要记录哪些被选中 id/title/powers
    const isBtnChange = useCallback( (e: any, id: number, record: PowerLevel) => {
            const powers = [...btnChecked];
            let menus = [...treeChecked];
            if (e.target.checked) {
                // 选中
                powers.push(id);
            } else {
                // 取消选中
                powers.splice(powers.indexOf(id), 1);
                // 判断当前这一行的权限中是否还有被选中的，如果全都没有选中，那当前菜单也要取消选中
                const tempMap = record.powers.map((item: Power) => item.id);
                if (!btnChecked.some((item) => item !== id && tempMap.indexOf(item) >= 0)) {

                }
            }

            setBtnChecked(powers);
            setTreeChecked(menus);
        },
        [btnChecked, treeChecked]
    );

    const tableSource= () =>{
        let data:PowerTree[] = []
        // 补全缺失的key
        if (props.data[0]){
            data = [...props.data[0].children]
            data.push({id: 1, key: props.hiddenKey, powers: []})
        }
        return props.data[0] ? data: []
    }

    const columns = useMemo(() => {
        return [
            {
                title: "菜单列表",
                dataIndex: "title",
                key: "title",
                width: "30%",
            },
            {
                title: "权限详情",
                dataIndex: "powers",
                key: "powers",
                width: "70%",
                render: (value: Power[], record:any): JSX.Element[] | null => {
                    if (value) {
                        return value.map((item: Power, index: number) => {
                            return (
                                <Checkbox
                                    disabled={!treeChecked.find((item) => item.startsWith(record.key))}
                                    key={index}
                                    checked={isBtnChecked(item.id)}
                                    onChange={(e): void => isBtnChange(e, item.id, record)}
                                >
                                    {item.title}
                                </Checkbox>
                            );
                        });
                    }
                    return null;
                },
            },
        ];
    }, [isBtnChecked, isBtnChange]);

    return (
        <Modal
            zIndex={101}
            width={630}
            title={props.title || "请选择"}
            open={props.modalShow}
            onOk={onOk}
            onCancel={onClose}
            confirmLoading={props.loading}
        >
            {props.initLoading ? (
                <div style={{ textAlign: "center" }}>
                    <Spin tip="加载中…" />
                </div>
            ) : (defaultSelectData.menus && <Table
                columns={columns}
                rowSelection={{
                    hideSelectAll: true,
                    checkStrictly:false,
                    selectedRowKeys: selectedRow,
                    ...rowSelection
                }}
                dataSource={tableSource()}
                rowClassName={(record)=>record.key === props.hiddenKey ? "hidden":''}
                rowKey={(record:any)=>record.key}
                pagination={false}
            />
            )}
        </Modal>
    );
};


