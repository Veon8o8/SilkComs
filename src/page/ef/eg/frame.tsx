// src/page/ef/eg/frame.tsx

// 员工画廊

import { Button, Space, message, Modal, Form, Input, Select, Tag, Row, Col, Card as AntCard, Avatar, FormInstance } from 'antd';
import Card from 'antd/lib/card/Card';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import React, { createRef } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlusOutlined, ExportOutlined, DeleteOutlined, HistoryOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons/lib/icons';
import { LOCAL_STORAGE } from '../../../config/keys';
import { EmployeeApi } from '../../../config/api';
import { httpUtil } from '../../../utils/HttpUtil';
import { DepartmentType, ErrResponse, PositionType, SucResponse } from '../../../config/type';
import { timeUtil } from '../../../utils/TimeUtil';
import { CONTENT } from '../../../config/layout';
import { AddEmployeeModal } from './add.modal';

interface FrameEmployeeGalleryProps {
    headerHeight: number;
    departmentList: DepartmentType[],
    positionList: PositionType[],
}

// 定义员工数据类型
interface EmployeeType {
    id: string;
    code: string;        // 工号
    name: string;        // 姓名
    gender: string;      // 性别
    department: string;  // 部门
    status: string;      // 员工状态
    position: string;    // 岗位
    createTime: string;
    depId: number;
    posId: number;
}

// 模拟初始数据
const initData: EmployeeType[] = [];

interface _FrameEmployeeGalleryState {
    dataSource: EmployeeType[];
    departments: DepartmentType[];
    modalVisible: boolean;
    editingEmployee: EmployeeType | null;
    searchName: string;
    activeDepartment: string;
}

const CLS_NAME = `FrameEmployeeGallery`;

class _FrameEmployeeGallery extends React.Component<WithTranslation & FrameEmployeeGalleryProps, _FrameEmployeeGalleryState> {
    actionRef = createRef<ActionType>();
    formRef = React.createRef<any>();

    constructor(props: any) {
        super(props);
        const { departmentList } = this.props
        this.state = {
            dataSource: initData,
            departments: departmentList,
            // departments: initDepartments,
            modalVisible: false,
            editingEmployee: null,
            searchName: '',
            activeDepartment: '',
        };
    }

    componentDidMount(): void {
        this.listEmployees();
    }

    listEmployees = async () => {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
        }
        let response = await httpUtil.post(EmployeeApi.LIST, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`获取员工列表成功:\n`, r.data.list);
            const list = r.data.list
            const dataSource: EmployeeType[] = []
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                dataSource.push({
                    id: item.id,
                    code: item.code,
                    name: item.name,
                    gender: item.gender,
                    department: item.departmentName,
                    depId: item.departmentId,
                    position: item.departmentName + item.positionName,
                    posId: item.positionId,
                    status: item.status,
                    createTime: timeUtil.formatTimestamp(item.createTime),
                })
            }
            this.setState({ dataSource: dataSource });
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`获取员工列表失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
        }
    };

    // 保存员工（新增或编辑）- 服务器交互版本
    handleSave = async (values: any) => {
        const { editingEmployee, dataSource } = this.state;
        const form = this.formRef.current;

        if (editingEmployee) {
            // 编辑员工
            await this.editEmployee(editingEmployee.id, values);
            const updatedData = dataSource.map(item =>
                item.id === editingEmployee.id
                    ? { ...item, ...values }
                    : item
            );
            this.setState({ dataSource: updatedData }, () => {
                message.success('编辑成功');
                this.actionRef.current?.reload();
            });
        } else {
            // 新增员工 - 上传服务器
            let result = await this.addEmployee(values);
            if (!result) {
                message.error('添加失败');
                return;
            }
            // const newEmployee: EmployeeType = {
            //     id: result.id,
            //     code: values.code,
            //     name: values.name,
            //     department: values.department,
            //     status: values.status,
            //     position: values.position,
            //     createTime: timeUtil.formatDate(new Date()),
            // };
            // this.setState({ dataSource: [...dataSource, newEmployee] }, () => {
            //     message.success('添加成功');
            //     this.actionRef.current?.reload();
            // });
        }
        this.setState({ modalVisible: false, editingEmployee: null });
        form.resetFields();
    };

    // // 保存员工（新增或编辑）- 本地版本
    // handleSave = (values: any) => {

    //     const { editingEmployee, dataSource } = this.state;
    //     const form = this.formRef.current;

    //     // form.validateFields().then((values: any) => {
    //     console.log('=============表单验证成功，提交数据:', values);
    //     if (editingEmployee) {
    //         // 编辑员工 - 本地编辑
    //         const updatedData = dataSource.map(item =>
    //             item.id === editingEmployee.id
    //                 ? { ...item, ...values }
    //                 : item
    //         );
    //         this.setState({ dataSource: updatedData }, () => {
    //             message.success('编辑成功');
    //             this.actionRef.current?.reload();
    //         });
    //     } else {
    //         // 新增员工 - 本地新增
    //         // 生成模拟 ID（使用时间戳 + 随机数）
    //         const newId = Date.now().toString() + Math.random().toString(36).substr(2, 6);

    //         const newEmployee: EmployeeType = {
    //             id: newId,
    //             code: values.code || `FR${String(dataSource.length + 1).padStart(5, '0')}`, // 自动生成工号
    //             name: values.name,
    //             department: values.department,
    //             status: values.status,
    //             position: values.position,
    //             createTime: timeUtil.formatDate(new Date()),
    //         };

    //         this.setState({
    //             dataSource: [...dataSource, newEmployee]
    //         }, () => {
    //             message.success('添加成功');
    //             this.actionRef.current?.reload();
    //         });
    //     }

    //     // 关闭弹框并重置表单
    //     this.setState({ modalVisible: false, editingEmployee: null });
    //     form.resetFields();
    // };

    editEmployee = async (id: string, values: any) => {
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            id: id,
            ...values,
        }
        let response = await httpUtil.post(EmployeeApi.EDIT, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`编辑员工成功: ${r.data}`);
            return true
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`编辑员工失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
            return false
        }
        return false
    };

    addEmployee = async (values: any): Promise<{ id: string } | false> => {
        const TAG = `${CLS_NAME}.addEmployee() - `
        console.log(TAG, '提交数据:', values);
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            ...values,
            depId: values.department,
            posId: values.position,
        }
        let response = await httpUtil.post(EmployeeApi.ADD, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`添加员工成功: ${r.data}`);
            return { id: r.data.id }
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`添加员工失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
            return false
        }
        return false
    };

    // 删除员工
    handleDelete = async (id: string) => {
        const result = await this.delEmployee(id);
        if (!result) return;

        const { dataSource } = this.state;
        const updatedData = dataSource.filter(item => item.id !== id);
        this.setState({ dataSource: updatedData }, () => {
            message.success('删除成功');
            this.actionRef.current?.reload();
        });
    };

    delEmployee = async (id: string) => {
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
            id: id,
        }
        let response = await httpUtil.post(EmployeeApi.DEL, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`删除员工成功: ${r.data}`);
            return true
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`删除员工失败: [${r.errCode}] ${r.errMsg}`);
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
            editingEmployee: null,
            modalVisible: true,
        });
    };

    // 打开编辑模态框
    showEditModal = (record: EmployeeType) => {
        const TAG = `EmployeeGallery.showEditModal()`;

        this.setState({
            editingEmployee: record,
            modalVisible: true,
        }, () => {
            const form = this.formRef.current;
            if (form) {
                console.log(TAG, '编辑员工，设置表单初始值:', record);
                form.setFieldsValue({
                    code: record.code,
                    name: record.name,
                    department: record.department,
                    status: record.status,
                    position: record.position,
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
            editingEmployee: null,
        });
    };

    // 部门筛选
    handleDepartmentFilter = (department: string) => {
        const { activeDepartment } = this.state;
        this.setState({
            activeDepartment: activeDepartment === department ? '' : department,
        }, () => {
            this.actionRef.current?.reload();
        });
    };

    // 搜索处理
    handleSearch = (value: string) => {
        this.setState({ searchName: value }, () => {
            this.actionRef.current?.reload();
        });
    };

    // 导出
    handleExport = () => {
        message.info('导出数据');
    };

    // 操作记录
    handleHistory = () => {
        message.info('查看操作记录');
    };

    // 渲染状态标签
    renderStatus = (status: string) => {
        return status === '在职' ?
            <Tag color="green">在职</Tag> :
            <Tag color="default">{status}</Tag>;
    };

    // 表格列配置
    getColumns = (): ProColumns<EmployeeType>[] => {
        const { t } = this.props;

        return [
            {
                title: '工号',
                dataIndex: 'code',
                valueType: 'text',
                search: false,
                width: 120,
            },
            {
                title: '姓名',
                dataIndex: 'name',
                valueType: 'text',
                search: false,
                width: 100,
            },
            {
                title: '部门',
                dataIndex: 'department',
                valueType: 'text',
                search: false,
                width: 100,
            },
            {
                title: '员工状态',
                dataIndex: 'status',
                valueType: 'text',
                search: false,
                width: 80,
                render: (_, record) => this.renderStatus(record.status),
            },
            {
                title: '岗位',
                dataIndex: 'position',
                valueType: 'text',
                search: false,
                ellipsis: true,
            },
            {
                title: t('create.time'),
                dataIndex: 'createTime',
                valueType: 'text',
                search: false,
                width: 150,
            },
            {
                title: t('department.operation'),
                valueType: 'option',
                width: 150,
                render: (_, record) => (
                    <Space>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => this.showEditModal(record)}
                        >
                            编辑
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            danger
                            onClick={() => {
                                Modal.confirm({
                                    title: '确定要删除这个员工吗？',
                                    onOk: () => this.handleDelete(record.id),
                                });
                            }}
                        >
                            删除
                        </Button>
                    </Space>
                ),
            },
        ];
    };

    // 搜索筛选逻辑
    request = async (params: any) => {
        const { searchName, activeDepartment, dataSource } = this.state;
        let filteredData = [...dataSource];

        // 按名字模糊搜索
        if (searchName) {
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(searchName.toLowerCase()) ||
                item.code.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        // 部门筛选
        if (activeDepartment) {
            filteredData = filteredData.filter(item =>
                item.department === activeDepartment
            );
        }

        return {
            data: filteredData,
            success: true,
            total: filteredData.length,
        };
    };

    // 渲染部门筛选栏
    renderDepartmentBar = () => {
        const { departments, activeDepartment } = this.state;

        return (
            <Card style={{ marginBottom: 16, flexShrink: 0 }}>
                <Space size="middle" wrap>
                    {departments.map(dept => (
                        <Button
                            key={dept.name}
                            type={activeDepartment === dept.name ? 'primary' : 'default'}
                            onClick={() => this.handleDepartmentFilter(dept.name)}
                        >
                            {dept.name} {dept.count}
                        </Button>
                    ))}
                </Space>
            </Card>
        );
    };

    // 渲染员工卡片视图（画廊模式）
    renderGalleryView = () => {
        const { searchName, activeDepartment, dataSource } = this.state;
        let filteredData = [...dataSource];

        if (searchName) {
            filteredData = filteredData.filter(item =>
                item.name.toLowerCase().includes(searchName.toLowerCase()) ||
                item.code.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        if (activeDepartment) {
            filteredData = filteredData.filter(item =>
                item.department === activeDepartment
            );
        }

        // 按部门分组
        const grouped: { [key: string]: EmployeeType[] } = {};
        filteredData.forEach(emp => {
            if (!grouped[emp.department]) {
                grouped[emp.department] = [];
            }
            grouped[emp.department].push(emp);
        });

        return (
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
                {Object.entries(grouped).map(([department, empList]) => (
                    <Card
                        key={department}
                        title={department}
                        extra={
                            <Button
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={() => this.showAddModal()}
                            >
                                添加数据
                            </Button>
                        }
                        style={{ marginBottom: 16 }}
                    >
                        <Row gutter={[16, 16]}>
                            {empList.map(employee => (
                                <Col key={employee.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                                    <AntCard
                                        hoverable
                                        size="small"
                                        style={{ textAlign: 'center' }}
                                        bodyStyle={{ padding: '20px 16px' }}
                                    >
                                        {/* 头像区域 - 保留 */}
                                        {/* <Avatar
                                            size={64}
                                            icon={<UserOutlined />}
                                            style={{ backgroundColor: '#1890ff', marginBottom: '12px' }}
                                        /> */}

                                        {/* 员工姓名 - 加粗大字号 */}
                                        <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                                            {employee.name}
                                        </div>

                                        {/* 岗位 - 放在姓名下方，参考图的总经办/总经理 */}
                                        <div style={{ fontSize: '13px', color: '#1890ff', marginBottom: '12px' }}>
                                            {employee.position}
                                        </div>

                                        {/* 分割线 - 增加信息层次 */}
                                        <div style={{ height: '1px', background: '#f0f0f0', margin: '12px 0' }} />

                                        {/* 详细信息区域 - 采用左右两列布局，更紧凑 */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '8px 12px',
                                            textAlign: 'left',
                                            marginTop: '4px'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#bbb' }}>工号</div>
                                                <div style={{ fontSize: '13px', fontWeight: 500 }}>{employee.code}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#bbb' }}>部门</div>
                                                <div style={{ fontSize: '13px', fontWeight: 500 }}>{employee.department}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#bbb' }}>员工状态</div>
                                                <div style={{ fontSize: '13px', fontWeight: 500 }}>
                                                    {this.renderStatus(employee.status)}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#bbb' }}>性别</div>
                                                <div style={{ fontSize: '13px', fontWeight: 500 }}>{employee.gender}</div>
                                            </div>
                                        </div>
                                    </AntCard>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                ))}
            </div>
        );
    };

    // 自定义搜索栏渲染
    renderSearchBar = () => {
        const { t } = this.props;

        return (
            <Row justify="space-between" align="middle" style={{ marginBottom: 16, flexShrink: 0 }}>
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={this.showAddModal}
                        >
                            添加
                        </Button>
                        {/* <Button
                            icon={<ExportOutlined />}
                            onClick={this.handleExport}
                        >
                            导出
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            onClick={() => message.info('删除')}
                        >
                            删除
                        </Button>
                        <Button
                            icon={<HistoryOutlined />}
                            onClick={this.handleHistory}
                        >
                            操作记录
                        </Button> */}
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <Input.Search
                            placeholder="Q搜索数据"
                            allowClear
                            onSearch={this.handleSearch}
                            onChange={(e) => {
                                if (!e.target.value) {
                                    this.handleSearch('');
                                }
                            }}
                            style={{ width: 200 }}
                        />
                        {/* <Button icon={<SearchOutlined />}>筛选</Button> */}
                    </Space>
                </Col>
            </Row>
        );
    };

    // 渲染模态框
    renderModal = () => {
        const { departmentList, positionList } = this.props;
        return (
            <AddEmployeeModal
                visible={this.state.modalVisible}
                onCancel={this.handleModalCancel}
                onOk={this.handleSave}
                loading={false}
                formRef={this.formRef}
                constentHeiht={this.contentHeight}
                departmentList={departmentList}
                positionList={positionList}
            />
        );
    };

    render() {
        const { headerHeight } = this.props;
        console.log(`FrameEmployeeGallery render - headerHeight:`, headerHeight);
        return (
            <Card
                title="员工画廊"
                variant="borderless"
                style={{
                    width: "100%",
                    height: this.contentHeight,
                    display: "flex",
                    flexDirection: "column"
                }}
                bodyStyle={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                }}
            >
                {this.renderSearchBar()}
                {this.renderDepartmentBar()}
                {this.renderGalleryView()}
                {this.renderModal()}
            </Card>
        );
    }

    get contentHeight() {
        const { headerHeight } = this.props;
        // 为什么减去4个CONTENT.PADDING？因为外层Layout还有一个CONTENT.PADDING的padding，
        // 而Content组件又有一个CONTENT.PADDING的padding，所以总共要减去4个CONTENT.PADDING
        return `calc(100vh - ${headerHeight}vh - ${CONTENT.PADDING * 4}px)`;
    }
}

export const FrameEmployeeGallery = withTranslation()(_FrameEmployeeGallery);