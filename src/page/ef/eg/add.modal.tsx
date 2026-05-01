// src/page/ef/eg/add.modal.tsx

import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col, Button, Steps, message } from 'antd';
import { UserOutlined, TeamOutlined, PhoneOutlined, HomeOutlined, InfoCircleOutlined, DollarOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';

const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;

// 定义员工新增表单数据类型
export interface AddEmployeeFormData {
    // 基本信息
    internalMember: string;
    internalDepartment: string;
    name: string;
    department: string;
    idCard: string;
    gender: string;
    birthDate: dayjs.Dayjs;
    birthplace: string;
    householdRegister: string;
    householdType: string;
    ethnicity: string;
    maritalStatus: string;

    // 通讯信息
    phone: string;
    permanentAddress: string;

    // 用工信息
    employmentType: string;
    employeeStatus: string;
    workStartDate: dayjs.Dayjs;
    entryDate: dayjs.Dayjs;
    probationDays: number;
    regularDate: dayjs.Dayjs;
    probationSalary: number;
    formalSalary: number;
}

interface AddEmployeeModalProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (values: AddEmployeeFormData) => void;
    loading?: boolean;
}

interface AddEmployeeModalState {
    currentStep: number;
}

class AddEmployeeModal extends React.Component<AddEmployeeModalProps, AddEmployeeModalState> {
    formRef = React.createRef<FormInstance>();

    constructor(props: AddEmployeeModalProps) {
        super(props);
        this.state = {
            currentStep: 0,
        };
    }

    // 重置表单和步骤
    resetForm = () => {
        this.formRef.current?.resetFields();
        this.setState({ currentStep: 0 });
    };

    // 处理取消
    handleCancel = () => {
        this.resetForm();
        this.props.onCancel();
    };

    // 处理确认提交
    handleOk = async () => {
        try {
            const values = await this.formRef.current?.validateFields();
            if (values) {
                // 格式化日期字段
                const formattedValues = {
                    ...values,
                    birthDate: values.birthDate?.format('YYYY-MM-DD'),
                    workStartDate: values.workStartDate?.format('YYYY-MM-DD'),
                    entryDate: values.entryDate?.format('YYYY-MM-DD'),
                    regularDate: values.regularDate?.format('YYYY-MM-DD'),
                };
                this.props.onOk(formattedValues as AddEmployeeFormData);
                this.resetForm();
            }
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    // 下一步
    nextStep = () => {
        const { currentStep } = this.state;
        // 验证当前步骤的表单项
        let fieldsToValidate: string[] = [];
        if (currentStep === 0) {
            fieldsToValidate = ['internalMember', 'internalDepartment', 'name', 'department', 'idCard', 'gender', 'birthDate', 'birthplace', 'householdRegister', 'householdType', 'ethnicity', 'maritalStatus'];
        } else if (currentStep === 1) {
            fieldsToValidate = ['phone', 'permanentAddress'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['employmentType', 'employeeStatus', 'workStartDate', 'entryDate', 'probationDays', 'regularDate', 'probationSalary', 'formalSalary'];
        }

        this.formRef.current?.validateFields(fieldsToValidate)
            .then(() => {
                this.setState({ currentStep: currentStep + 1 });
            })
            .catch((error) => {
                console.error('验证失败:', error);
            });
    };

    // 上一步
    prevStep = () => {
        const { currentStep } = this.state;
        this.setState({ currentStep: currentStep - 1 });
    };

    // 渲染基本信息表单
    renderBasicInfo = () => {
        return (
            <>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="internalMember"
                            label="内部成员"
                            rules={[{ required: true, message: '请选择内部成员' }]}
                        >
                            <Select placeholder="+ 选择成员" allowClear>
                                <Option value="张三">张三</Option>
                                <Option value="李四">李四</Option>
                                <Option value="王五">王五</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="internalDepartment"
                            label="内部部门"
                            rules={[{ required: true, message: '请选择内部部门' }]}
                        >
                            <Select placeholder="+ 选择部门" allowClear>
                                <Option value="总经办">总经办</Option>
                                <Option value="销售部">销售部</Option>
                                <Option value="仓储部">仓储部</Option>
                                <Option value="采购部">采购部</Option>
                                <Option value="生产部">生产部</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="姓名"
                            rules={[{ required: true, message: '请输入姓名' }]}
                        >
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="department"
                            label="部门"
                            rules={[{ required: true, message: '请输入部门' }]}
                        >
                            <Input placeholder="请输入部门" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="idCard"
                            label="身份证号"
                            rules={[
                                { required: true, message: '请输入身份证号' },
                                { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入有效的身份证号' }
                            ]}
                        >
                            <Input placeholder="请输入身份证号" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="gender"
                            label="性别"
                            rules={[{ required: true, message: '请选择性别' }]}
                        >
                            <Select placeholder="请选择性别">
                                <Option value="男">男</Option>
                                <Option value="女">女</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="birthDate"
                            label="出生日期"
                            rules={[{ required: true, message: '请选择出生日期' }]}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="请选择出生日期" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="birthplace"
                            label="籍贯"
                            initialValue="四川省/宜宾市"
                        >
                            <Input placeholder="四川省/宜宾市" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="householdRegister"
                            label="户籍所在地"
                            initialValue="四川省/宜宾市"
                        >
                            <Input placeholder="四川省/宜宾市" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="householdType"
                            label="户籍类型"
                        >
                            <Input placeholder="请填写详细地址" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="ethnicity"
                            label="民族"
                        >
                            <Input placeholder="请输入民族" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="maritalStatus"
                            label="婚姻状态"
                        >
                            <Select placeholder="请选择婚姻状态" allowClear>
                                <Option value="未婚">未婚</Option>
                                <Option value="已婚">已婚</Option>
                                <Option value="离异">离异</Option>
                                <Option value="丧偶">丧偶</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </>
        );
    };

    // 渲染通讯信息表单
    renderContactInfo = () => {
        return (
            <>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="phone"
                            label="手机号"
                            rules={[
                                { required: true, message: '请输入手机号' },
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                            ]}
                        >
                            <Input placeholder="请输入手机号" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="permanentAddress"
                            label="常住地址"
                            initialValue="四川省/宜宾市"
                            rules={[{ required: true, message: '请输入常住地址' }]}
                        >
                            <Input.TextArea
                                placeholder="四川省/宜宾市 请填写详细地址"
                                rows={3}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </>
        );
    };

    // 渲染用工信息表单
    renderEmploymentInfo = () => {
        return (
            <>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="employmentType"
                            label="聘用形式"
                            rules={[{ required: true, message: '请选择聘用形式' }]}
                        >
                            <Select placeholder="请选择聘用形式">
                                <Option value="全职">全职</Option>
                                <Option value="兼职">兼职</Option>
                                <Option value="实习">实习</Option>
                                <Option value="劳务派遣">劳务派遣</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="employeeStatus"
                            label="员工状态"
                            rules={[{ required: true, message: '请选择员工状态' }]}
                        >
                            <Select placeholder="请选择员工状态">
                                <Option value="在职">在职</Option>
                                <Option value="试用期">试用期</Option>
                                <Option value="待岗">待岗</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="workStartDate"
                            label="参加工作日期"
                            rules={[{ required: true, message: '请选择参加工作日期' }]}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="请选择参加工作日期" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="entryDate"
                            label="入职日期"
                            rules={[{ required: true, message: '请选择入职日期' }]}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="请选择入职日期" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="probationDays"
                            label="试用期天数（天）"
                            rules={[{ required: true, message: '请输入试用期天数' }]}
                        >
                            <Input type="number" placeholder="请输入试用期天数" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="regularDate"
                            label="转正日期"
                            rules={[{ required: true, message: '请选择转正日期' }]}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="请选择转正日期" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="probationSalary"
                            label="试用期薪资"
                            rules={[{ required: true, message: '请输入试用期薪资' }]}
                        >
                            <Input type="number" prefix="¥" placeholder="请输入试用期薪资" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="formalSalary"
                            label="正式薪资"
                            rules={[{ required: true, message: '请输入正式薪资' }]}
                        >
                            <Input type="number" prefix="¥" placeholder="请输入正式薪资" />
                        </Form.Item>
                    </Col>
                </Row>
            </>
        );
    };

    // 渲染步骤内容
    renderStepContent = () => {
        const { currentStep } = this.state;

        switch (currentStep) {
            case 0:
                return this.renderBasicInfo();
            case 1:
                return this.renderContactInfo();
            case 2:
                return this.renderEmploymentInfo();
            default:
                return null;
        }
    };

    // 渲染步骤栏
    renderSteps = () => {
        const { currentStep } = this.state;

        return (
            <Steps current={currentStep} style={{ marginBottom: 24 }}>
                <Step title="基本信息" icon={<UserOutlined />} />
                <Step title="通讯信息" icon={<PhoneOutlined />} />
                <Step title="用工信息" icon={<DollarOutlined />} />
            </Steps>
        );
    };

    // 渲染底部按钮
    renderFooter = () => {
        const { currentStep } = this.state;
        const { loading } = this.props;

        const footerButtons = [];

        if (currentStep > 0) {
            footerButtons.push(
                <Button key="prev" onClick={this.prevStep}>
                    上一步
                </Button>
            );
        }

        if (currentStep < 2) {
            footerButtons.push(
                <Button key="next" type="primary" onClick={this.nextStep}>
                    下一步
                </Button>
            );
        } else {
            footerButtons.push(
                <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                    提交
                </Button>
            );
        }

        footerButtons.push(
            <Button key="cancel" onClick={this.handleCancel}>
                取消
            </Button>
        );

        return footerButtons;
    };

    render() {
        const { visible, loading } = this.props;

        return (
            <Modal
                title="新增员工"
                open={visible}
                onCancel={this.handleCancel}
                footer={this.renderFooter()}
                width={700}
                destroyOnClose
                confirmLoading={loading}
            >
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    initialValues={{
                        birthplace: '四川省/宜宾市',
                        householdRegister: '四川省/宜宾市',
                        permanentAddress: '四川省/宜宾市',
                        probationDays: 0,
                    }}
                >
                    {this.renderSteps()}
                    <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                        {this.renderStepContent()}
                    </div>
                </Form>
            </Modal>
        );
    }
}

export default AddEmployeeModal;