// src/page/dm/frame.tsx

// 部门管理框架

import { Button, Popconfirm, Space, message, Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import Card from 'antd/lib/card/Card';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { createRef } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';

interface FrameDepartmentMgmtProps {
}

// 定义部门数据类型
interface DepartmentType {
    id: number;
    name: string;
    count: number;
}

// 模拟初始数据
const initData: DepartmentType[] = [
    { id: 1, name: '技术部', count: 25 },
    { id: 2, name: '市场部', count: 12 },
    { id: 3, name: '销售部', count: 30 },
    { id: 4, name: '人力资源部', count: 8 },
    { id: 5, name: '财务部', count: 10 },
    { id: 6, name: '产品部', count: 15 },
    { id: 7, name: '运营部', count: 18 },
];

interface _FrameDepartmentMgmtState {
    dataSource: DepartmentType[];
    modalVisible: boolean;
    editingDepartment: DepartmentType | null;
    searchName: string;
}

class _FrameDepartmentMgmt extends React.Component<WithTranslation & FrameDepartmentMgmtProps, _FrameDepartmentMgmtState> {
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

    // 保存部门（新增或编辑）
    handleSave = () => {
        const { editingDepartment, dataSource } = this.state;
        const form = this.formRef.current;

        form.validateFields().then((values: any) => {
            if (editingDepartment) {
                // 编辑部门
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
                // 新增部门
                const newDepartment: DepartmentType = {
                    id: this.getNextId(),
                    name: values.name,
                    count: values.count,
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

    // 删除部门
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
    showEditModal = (record: DepartmentType) => {
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
    renderActions = (_: any, record: DepartmentType) => {
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
                    title="确定要删除这个部门吗？"
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
    getColumns = (): ProColumns<DepartmentType>[] => {
        const { t } = this.props;

        return [
            {
                title: 'ID',
                dataIndex: 'id',
                valueType: 'index',
                search: false,
                width: 80,
            },
            {
                title: t('department.name'),
                dataIndex: 'name',
                valueType: 'text',
                search: false, // 禁用默认搜索，使用自定义搜索框
            },
            {
                title: t('department.count'),
                dataIndex: 'count',
                valueType: 'digit',
                search: false,
                width: 100,
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
        return (
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={this.showAddModal}
                    >
                        添加部门
                    </Button>
                </Col>
                <Col>
                    <Space>
                        <Input.Search
                            placeholder="请输入部门名称"
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
                title={editingDepartment ? '编辑部门' : '新增部门'}
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
                        label="部门名称"
                        rules={[
                            { required: true, message: '请输入部门名称' },
                            { max: 50, message: '部门名称不能超过50个字符' },
                        ]}
                    >
                        <Input placeholder="请输入部门名称" />
                    </Form.Item>
                    <Form.Item
                        name="count"
                        label="人数"
                        rules={[
                            { required: true, message: '请输入人数' },
                            { type: 'number', min: 0, message: '人数不能小于0' },
                        ]}
                    >
                        <InputNumber
                            placeholder="请输入人数"
                            style={{ width: '100%' }}
                            min={0}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    render() {
        const columns = this.getColumns();

        return (
            <Card title="部门管理" variant="borderless" style={{ width: "100%", height: "100%" }}>
                {this.renderSearchBar()}
                <ProTable<DepartmentType>
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

export const FrameDepartmentMgmt = withTranslation()(_FrameDepartmentMgmt);