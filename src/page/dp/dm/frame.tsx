// src/page/dm/frame.tsx

// 部门管理框架

import { Button, Popconfirm, Space, message, Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import Card from 'antd/lib/card/Card';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { createRef } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { LOCAL_STORAGE } from '../../../config/keys';
import { DepartmentApi } from '../../../config/api';
import { httpUtil } from '../../../utils/HttpUtil';
import { ErrResponse, SucResponse } from '../../../config/type';
import { timeUtil } from '../../../utils/TimeUtil';

interface FrameDepartmentMgmtProps {
}

// 定义部门数据类型
interface DepartmentType {
    depId: number;
    name: string;
    count: number;
    parentId: number;
    parentName: string;
    createTime: string;
}

// 模拟初始数据
const initData: DepartmentType[] = [
    { depId: 1, name: '公司', count: 0, parentId: 0, parentName: '', createTime: timeUtil.formatDate(new Date()) },
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

    componentDidMount(): void {
        this.listDepartments();
    }

    listDepartments = async () => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
        }
        let response = await httpUtil.post(DepartmentApi.LIST, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`获取部门列表成功:\n`, r.data.list);
            // 设置 dataSource
            const list = r.data.list
            const dataSource: DepartmentType[] = []
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                dataSource.push({
                    depId: item.depId,
                    name: item.name,
                    count: item.count || 0,
                    parentId: item.parentId || 0,
                    parentName: item.parentName || '-',
                    createTime: timeUtil.formatTimestamp(item.createTime),
                })
            }
            this.setState({ dataSource: dataSource });
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`获取部门列表失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
        }
    };

    // 保存部门（新增或编辑）
    handleSave = () => {
        const { editingDepartment, dataSource } = this.state;
        const form = this.formRef.current;

        form.validateFields().then(async (values: any) => {
            if (editingDepartment) {
                // 编辑部门
                this.editDepartment(editingDepartment.depId, values.name);
                const updatedData = dataSource.map(item =>
                    item.depId === editingDepartment.depId
                        ? { ...item, ...values }
                        : item
                );
                this.setState({ dataSource: updatedData }, () => {
                    message.success('编辑成功');
                    this.actionRef.current?.reload();
                });
            } else {
                // 新增部门
                let result = await this.addDepartment(values.name);
                if (!result) {
                    message.error('添加失败');
                    return;
                }
                const newDepartment: DepartmentType = {
                    depId: result.depId,
                    name: values.name,
                    count: 0,
                    parentId: 0,
                    parentName: '',
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

    editDepartment = async (id: number, name: string) => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            id: id,
            name: name,
        }
        let response = await httpUtil.post(DepartmentApi.EDIT, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`编辑部门成功: ${r.data}`);
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`编辑部门失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
        }
    };

    addDepartment = async (name: string): Promise<{ depId: number } | false> => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            name: name,
        }
        let response = await httpUtil.post(DepartmentApi.ADD, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`添加部门成功: ${r.data}`);
            return { depId: r.data.depId }
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`添加部门失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
            // const msgOnModal = `[${r.errCode}]: ${r.errMsg}`
            // 弹框警示错误
            // showInfo()
            // showSuccess()
            // showError()
            // showWarning()
            // this.setState({ errMsg: msgOnModal })
            return false
        }
        return false
    };

    // 删除部门
    handleDelete = async (id: number) => {
        const result = await this.delDepartment(id);
        if (!result) return;

        // 删除成功后更新前端数据源
        const { dataSource } = this.state;
        const updatedData = dataSource.filter(item => item.depId !== id);
        this.setState({ dataSource: updatedData }, () => {
            message.success('删除成功');
            this.actionRef.current?.reload();
        });
    };

    delDepartment = async (id: number) => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            id: id,
        }
        let response = await httpUtil.post(DepartmentApi.DEL, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`删除部门成功: ${r.data}`);
            return true
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`删除部门失败: [${r.errCode}] ${r.errMsg}`);
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
            editingDepartment: null,
            modalVisible: true,
        });
    };

    // 打开编辑模态框
    showEditModal = (record: DepartmentType) => {
        this.setState({
            editingDepartment: record,
            modalVisible: true,
        }, () => {
            const form = this.formRef.current;
            if (form) {
                form.setFieldsValue({
                    name: record.name,
                    count: record.count,
                    parentId: record.parentId,
                    parentName: record.parentName,
                });
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
                    onConfirm={() => this.handleDelete(record.depId)}
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
                dataIndex: 'depId',
                valueType: 'text',
                search: false,
                width: 40,
            },
            {
                title: t('department.name'),
                dataIndex: 'name',
                valueType: 'text',
                search: false, // 禁用默认搜索，使用自定义搜索框
            },
            {
                title: t('department.parent'),
                dataIndex: 'parentName',
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
                    rowKey="depId"
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