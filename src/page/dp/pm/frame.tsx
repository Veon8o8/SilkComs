// src/page/dm/frame.tsx

// 岗位管理框架

import { Button, Popconfirm, Space, message, Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import Card from 'antd/lib/card/Card';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { createRef } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { LOCAL_STORAGE } from '../../../config/keys';
import { PositionApi } from '../../../config/api';
import { httpUtil } from '../../../utils/HttpUtil';
import { ErrResponse, PositionType, SucResponse } from '../../../config/type';
import { timeUtil } from '../../../utils/TimeUtil';

interface FramePositionMgmtProps {
}



// 模拟初始数据
const initData: PositionType[] = [
    { positionId: 1, name: '产品经理', count: 3, createTime: timeUtil.formatDate(new Date()) },
    { positionId: 2, name: '前端工程师', count: 5, createTime: timeUtil.formatDate(new Date()) },
    { positionId: 3, name: '后端工程师', count: 4, createTime: timeUtil.formatDate(new Date()) },
];

interface _FramePositionMgmtState {
    dataSource: PositionType[];
    modalVisible: boolean;
    editingPosition: PositionType | null;
    searchName: string;
}

class _FramePositionMgmt extends React.Component<WithTranslation & FramePositionMgmtProps, _FramePositionMgmtState> {
    actionRef = createRef<ActionType>();
    formRef = React.createRef<any>();

    constructor(props: any) {
        super(props);
        this.state = {
            dataSource: initData,
            modalVisible: false,
            editingPosition: null,
            searchName: '',
        };
    }

    componentDidMount(): void {
        this.listPositions();
    }

    listPositions = async () => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
        }
        let response = await httpUtil.post(PositionApi.LIST, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`获取岗位列表成功:\n`, r.data.list);
            // 设置 dataSource
            const list = r.data.list
            const dataSource: PositionType[] = []
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                dataSource.push({
                    positionId: item.positionId,
                    name: item.name,
                    count: item.count || 0,
                    createTime: timeUtil.formatTimestamp(item.createTime),
                })
            }
            this.setState({ dataSource: dataSource });
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`获取岗位列表失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
        }
    };

    // 保存岗位（新增或编辑）
    handleSave = () => {
        const { editingPosition, dataSource } = this.state;
        const form = this.formRef.current;

        form.validateFields().then(async (values: any) => {
            if (editingPosition) {
                // 编辑岗位
                await this.editPosition(editingPosition.positionId, values.name);
                const updatedData = dataSource.map(item =>
                    item.positionId === editingPosition.positionId
                        ? { ...item, name: values.name }
                        : item
                );
                this.setState({ dataSource: updatedData }, () => {
                    message.success('编辑成功');
                    this.actionRef.current?.reload();
                });
            } else {
                // 新增岗位
                let result = await this.addPosition(values.name);
                if (!result) {
                    message.error('添加失败');
                    return;
                }
                const newPosition: PositionType = {
                    positionId: result.id,
                    name: values.name,
                    count: 0,
                    createTime: timeUtil.formatDate(new Date()),
                };
                this.setState({ dataSource: [...dataSource, newPosition] }, () => {
                    message.success('添加成功');
                    this.actionRef.current?.reload();
                });
            }
            this.setState({ modalVisible: false, editingPosition: null });
            form.resetFields();
        }).catch((error: any) => {
            console.error('表单验证失败:', error);
        });
    };

    editPosition = async (id: number, name: string) => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            id: id,
            name: name,
        }
        let response = await httpUtil.post(PositionApi.EDIT, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`编辑岗位成功: ${r.data}`);
            return true
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`编辑岗位失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
            return false
        }
        return false
    };

    addPosition = async (name: string): Promise<{ id: number } | false> => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            name: name,
        }
        let response = await httpUtil.post(PositionApi.ADD, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`添加岗位成功: ${r.data}`);
            return { id: r.data.id }
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`添加岗位失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
            return false
        }
        return false
    };

    // 删除岗位
    handleDelete = async (id: number) => {
        const result = await this.delPosition(id);
        if (!result) return;

        // 删除成功后更新前端数据源
        const { dataSource } = this.state;
        const updatedData = dataSource.filter(item => item.positionId !== id);
        this.setState({ dataSource: updatedData }, () => {
            message.success('删除成功');
            this.actionRef.current?.reload();
        });
    };

    delPosition = async (id: number) => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            id: id,
        }
        let response = await httpUtil.post(PositionApi.DEL, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`删除岗位成功: ${r.data}`);
            return true
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`删除岗位失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
            return false
        }
    };

    // 打开新增模态框
    showAddModal = () => {
        const form = this.formRef.current;
        if (form) {
            form.resetFields();
        }
        this.setState({
            editingPosition: null,
            modalVisible: true,
        });
    };

    // 打开编辑模态框
    showEditModal = (record: PositionType) => {
        const TAG = `PositionMgmt.showEditModal()`;

        this.setState({
            editingPosition: record,
            modalVisible: true,
        }, () => {
            // Modal 渲染完成后再设置表单值
            const form = this.formRef.current;
            if (form) {
                console.log(TAG, '编辑岗位，设置表单初始值:', record);
                form.setFieldsValue({
                    name: record.name,
                });
            } else {
                console.warn(TAG, '表单实例未找到，无法设置初始值');
            }
        });
    };

    // 关闭模态框
    handleModalCancel = () => {
        const form = this.formRef.current;
        if (form) {
            form.resetFields();
        }
        this.setState({
            modalVisible: false,
            editingPosition: null,
        });
    };

    // 搜索处理
    handleSearch = (value: string) => {
        this.setState({ searchName: value }, () => {
            this.actionRef.current?.reload();
        });
    };

    // 渲染操作列
    renderActions = (_: any, record: PositionType) => {
        return (
            <Space>
                <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => this.showEditModal(record)}
                >
                    编辑
                </Button>
                <Popconfirm
                    title="确定要删除这个岗位吗？"
                    onConfirm={() => this.handleDelete(record.positionId)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                        删除
                    </Button>
                </Popconfirm>
            </Space>
        );
    };

    // 表格列配置
    getColumns = (): ProColumns<PositionType>[] => {
        const { t } = this.props;

        return [
            {
                title: 'ID',
                dataIndex: 'positionId',
                valueType: 'text',
                search: false,
                width: 40,
            },
            {
                title: t('position.name') || '岗位名称',
                dataIndex: 'name',
                valueType: 'text',
                search: false,
            },
            {
                title: t('create.time'),
                dataIndex: 'createTime',
                valueType: 'text',
                search: false,
            },
            {
                title: t('department.operation'),
                valueType: 'option',
                width: 150,
                render: this.renderActions,
            },
        ];
    };

    // 搜索筛选逻辑（前端过滤）
    request = async (params: any) => {
        const { searchName } = this.state;
        let filteredData = [...this.state.dataSource];

        // 按名字模糊搜索
        if (searchName) {
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        return {
            data: filteredData,
            success: true,
            total: filteredData.length,
        };
    };

    // 自定义搜索栏渲染
    renderSearchBar = () => {
        const { t } = this.props;
        return (
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={this.showAddModal}
                    >
                        {t('add')}
                    </Button>
                </Col>
                <Col>
                    <Space>
                        <Input.Search
                            placeholder="请输入岗位名称"
                            allowClear
                            onSearch={this.handleSearch}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    this.handleSearch('');
                                }
                            }}
                            style={{ width: 200 }}
                        />
                    </Space>
                </Col>
            </Row>
        );
    };

    // 渲染模态框
    renderModal = () => {
        const { modalVisible, editingPosition } = this.state;

        return (
            <Modal
                title={editingPosition ? '编辑岗位' : '新增岗位'}
                open={modalVisible}
                onOk={this.handleSave}
                onCancel={this.handleModalCancel}
                okText="保存"
                cancelText="取消"
            >
                <Form
                    ref={this.formRef}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="岗位名称"
                        rules={[
                            { required: true, message: '请输入岗位名称' },
                            { max: 50, message: '岗位名称不能超过50个字符' },
                        ]}
                    >
                        <Input placeholder="请输入岗位名称" />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    render() {
        const columns = this.getColumns();

        return (
            <Card title="岗位管理" variant="borderless" style={{ width: "100%", height: "100%" }}>
                {this.renderSearchBar()}
                <ProTable<PositionType>
                    actionRef={this.actionRef}
                    rowKey="positionId"
                    columns={columns}
                    request={this.request}
                    search={false}
                    pagination={false}
                    bordered
                    options={false}
                    toolBarRender={false}
                />
                {this.renderModal()}
            </Card>
        );
    }
}

export const FramePositionMgmt = withTranslation()(_FramePositionMgmt);