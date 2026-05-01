// src/page/dm/frame.tsx

// 岗位管理框架

import { Button, Popconfirm, Space, message, Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import Card from 'antd/lib/card/Card';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { createRef } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { timeUtil } from '../../../utils/TimeUtil';

interface FramePositionMgmtProps {
}

// 定义岗位数据类型
interface PositionType {
    id: number;
    name: string;
    count: number;
    createTime: string;
}

// 模拟初始数据
const initData: PositionType[] = [
    { id: 1, name: '负责人', count: 1, createTime: timeUtil.formatDate(new Date()) },
    { id: 2, name: '工作人员', count: 5, createTime: timeUtil.formatDate(new Date()) },
];

interface _FramePositionMgmtState {
    dataSource: PositionType[];
    modalVisible: boolean;
    editingDepartment: PositionType | null;
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
            editingDepartment: null,
            searchName: '',
        };
    }

    // 获取下一个可用ID
    getNextId = (): number => {
        const { dataSource } = this.state;
        const maxId = Math.max(...dataSource.map(item => item.id), 0);
        return maxId + 1;
    };

    // 保存岗位（新增或编辑）
    handleSave = () => {
        const { editingDepartment, dataSource } = this.state;
        const form = this.formRef.current;

        form.validateFields().then((values: any) => {
            if (editingDepartment) {
                // 编辑岗位
                const updatedData = dataSource.map(item =>
                    item.id === editingDepartment.id
                        ? { ...item, ...values }
                        : item
                );
                this.setState({ dataSource: updatedData }, () => {
                    message.success('编辑成功');
                    this.actionRef.current?.reload();
                });
            } else {
                // 新增岗位
                const newDepartment: PositionType = {
                    id: this.getNextId(),
                    name: values.name,
                    count: values.count || 0,
                    createTime: timeUtil.formatDate(new Date()),
                };
                this.setState({ dataSource: [...dataSource, newDepartment] }, () => {
                    message.success('添加成功');
                    this.actionRef.current?.reload();
                });
            }
            this.setState({ modalVisible: false, editingDepartment: null });
            form.resetFields();
        }).catch((error: any) => {
            console.error('表单验证失败:', error);
        });
    };

    // 删除岗位
    handleDelete = (id: number) => {
        const { dataSource } = this.state;
        const updatedData = dataSource.filter(item => item.id !== id);
        this.setState({ dataSource: updatedData }, () => {
            message.success('删除成功');
            this.actionRef.current?.reload();
        });
    };

    // 打开新增模态框
    showAddModal = () => {
        const form = this.formRef.current;
        if (form) {
            form.resetFields();
        }
        this.setState({
            editingDepartment: null,
            modalVisible: true,
        });
    };

    // 打开编辑模态框
    showEditModal = (record: PositionType) => {
        const form = this.formRef.current;
        if (form) {
            form.setFieldsValue({
                name: record.name,
                count: record.count,
            });
        }
        this.setState({
            editingDepartment: record,
            modalVisible: true,
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
            editingDepartment: null,
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
                    onConfirm={() => this.handleDelete(record.id)}
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
                dataIndex: 'id',
                valueType: 'text',
                search: false,
                width: 40,
            },
            {
                title: t('position.name'),
                dataIndex: 'name',
                valueType: 'text',
                search: false, // 禁用默认搜索，使用自定义搜索框
            },
            {
                title: t('create.time'),
                dataIndex: 'createTime',
                valueType: 'text',
                search: false, // 禁用默认搜索，使用自定义搜索框
            },
            {
                title: t('operation'),
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
        const { modalVisible, editingDepartment } = this.state;

        return (
            <Modal
                title={editingDepartment ? '编辑岗位' : '新增岗位'}
                open={modalVisible}
                onOk={this.handleSave}
                onCancel={this.handleModalCancel}
                okText="保存"
                cancelText="取消"
            >
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    initialValues={{
                        name: '',
                        count: 0,
                    }}
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
                    rowKey="id"
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