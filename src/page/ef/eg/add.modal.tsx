// src/page/ef/eg/add.modal.tsx

import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col, Button, Tabs, message, Upload } from 'antd';
import { UserOutlined, PhoneOutlined, DollarOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { UploadFile } from 'antd/es/upload/interface';
import { withTranslation } from 'react-i18next';

const { Option } = Select;
const { TabPane } = Tabs;

// 部门列表
const departmentList = [
    { id: '1', name: '总经办' },
    { id: '2', name: '销售部' },
    { id: '3', name: '仓储部' },
    { id: '4', name: '采购部' },
    { id: '5', name: '生产部' },
    { id: '6', name: '技术部' },
    { id: '7', name: '财务部' },
    { id: '8', name: '人力资源部' },
];

// 岗位列表（根据部门可能不同，这里提供通用岗位）
const positionList = [
    { id: '1', name: '总经理' },
    { id: '2', name: '部门经理' },
    { id: '3', name: '主管' },
    { id: '4', name: '专员' },
    { id: '5', name: '工程师' },
    { id: '6', name: '技术员' },
    { id: '7', name: '助理' },
    { id: '8', name: '实习生' },
];

// 定义员工新增表单数据类型
export interface AddEmployeeFormData {
    // 顶部字段
    code: string;           // 工号
    name: string;           // 姓名
    department: string;     // 部门
    position: string;       // 岗位

    // 基本信息
    idCard: string;
    gender: string;
    birthDate: dayjs.Dayjs;
    birthplace: string;
    householdRegister: string;
    householdType: string;
    ethnicity: string;
    maritalStatus: string;
    politicalStatus: string;      // 政治面貌
    employeePhoto?: string;        // 员工照片
    emergencyContact: string;      // 紧急联系人
    emergencyPhone: string;        // 紧急联系电话

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
    formRef: React.RefObject<any>;
    constentHeiht: string;
}

interface AddEmployeeModalState {
    activeTab: string;
    photoFileList: UploadFile[];
}

class _AddEmployeeModal extends React.Component<AddEmployeeModalProps, AddEmployeeModalState> {
    private topFieldsRef = React.createRef<HTMLDivElement>();

    constructor(props: AddEmployeeModalProps) {
        super(props);
        this.state = {
            activeTab: 'basic',
            photoFileList: [],
        };
    }

    // 重置表单和选项卡
    resetForm = () => {
        const { formRef } = this.props;
        formRef.current?.resetFields();
        this.setState({ activeTab: 'basic', photoFileList: [] });
    };

    // 处理取消
    handleCancel = () => {
        this.resetForm();
        this.props.onCancel();
    };

    // 处理确认提交
    handleOk = async () => {
        const { onOk, formRef } = this.props;
        try {
            const values = await formRef.current?.validateFields();
            console.log('0---表单验证成功，提交数据:', values);
            if (values) {
                // 格式化日期字段
                const formattedValues = {
                    ...values,
                    code: values.code.trim(),
                    name: values.name.trim(),
                    birthDate: values.birthDate?.format('YYYY-MM-DD'),
                    workStartDate: values.workStartDate?.format('YYYY-MM-DD'),
                    entryDate: values.entryDate?.format('YYYY-MM-DD'),
                    regularDate: values.regularDate?.format('YYYY-MM-DD'),
                };
                console.log('1---表单验证成功，提交数据:', formattedValues);
                onOk(formattedValues as AddEmployeeFormData);
                this.resetForm();
            }
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    // 选项卡切换
    onTabChange = (activeKey: string) => {
        this.setState({ activeTab: activeKey });
    };

    // 处理照片上传
    handlePhotoChange = ({ fileList }: { fileList: UploadFile[] }) => {
        this.setState({ photoFileList: fileList });
    };

    // 渲染顶部公共字段
    renderTopFields = () => {
        return (
            <div
                ref={this.topFieldsRef}
                style={{
                    marginBottom: 16,
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '4px',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="code"
                            label="工号"
                            rules={[{ required: true, message: '请输入工号' }]}
                        >
                            <Input placeholder="请输入工号" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="姓名"
                            rules={[{ required: true, message: '请输入姓名' }]}
                        >
                            <Input placeholder="请输入姓名" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="department"
                            label="部门"
                            rules={[{ required: true, message: '请选择部门' }]}
                        >
                            <Select
                                placeholder="请选择部门"
                                showSearch
                                optionFilterProp="children"
                            // onChange={this.handleDepartmentChange}
                            >
                                {departmentList.map(dept => (
                                    <Option key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="position"
                            label="岗位"
                            rules={[{ required: true, message: '请选择岗位' }]}
                        >
                            <Select
                                placeholder="请选择岗位"
                                showSearch
                                optionFilterProp="children"
                            >
                                {positionList.map(pos => (
                                    <Option key={pos.id} value={pos.name}>
                                        {pos.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        );
    };

    // 渲染基本信息表单
    renderBasicInfo = () => {
        return (
            <>
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

                {/* 政治面貌 */}
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="politicalStatus"
                            label="政治面貌"
                        >
                            <Select placeholder="请选择政治面貌" allowClear>
                                <Option value="中共党员">中共党员</Option>
                                <Option value="中共预备党员">中共预备党员</Option>
                                <Option value="共青团员">共青团员</Option>
                                <Option value="民主党派">民主党派</Option>
                                <Option value="无党派人士">无党派人士</Option>
                                <Option value="群众">群众</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* 员工照片 */}
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="employeePhoto"
                            label="员工照片"
                        >
                            <Upload
                                listType="picture-card"
                                fileList={this.state.photoFileList}
                                onChange={this.handlePhotoChange}
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                {this.state.photoFileList.length >= 1 ? null : (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>上传照片</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                {/* 紧急联系人 */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="emergencyContact"
                            label="紧急联系人"
                        >
                            <Input placeholder="请输入紧急联系人姓名" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="emergencyPhone"
                            label="紧急联系电话"
                            rules={[
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                            ]}
                        >
                            <Input placeholder="请输入紧急联系电话" />
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

    // 渲染选项卡内容
    renderTabContent = () => {
        return (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <Tabs
                    activeKey={this.state.activeTab}
                    onChange={this.onTabChange}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    <TabPane
                        tab={<span><UserOutlined />基本信息</span>}
                        key="basic"
                    >
                        <div style={{
                            height: 'calc(80vh - 300px)',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            paddingRight: '8px'
                        }}>
                            {this.renderBasicInfo()}
                        </div>
                    </TabPane>
                    <TabPane
                        tab={<span><DollarOutlined />用工信息</span>}
                        key="employment"
                    >
                        <div style={{
                            height: 'calc(80vh - 300px)',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            paddingRight: '8px'
                        }}>
                            {this.renderEmploymentInfo()}
                        </div>
                    </TabPane>
                    <TabPane
                        tab={<span><PhoneOutlined />通讯信息</span>}
                        key="contact"
                    >
                        <div style={{
                            height: 'calc(80vh - 300px)',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            paddingRight: '8px'
                        }}>
                            {this.renderContactInfo()}
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    };

    // 渲染底部按钮
    renderFooter = () => {
        const { loading } = this.props;

        return [
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                提交
            </Button>,
            <Button key="cancel" onClick={this.handleCancel}>
                取消
            </Button>
        ];
    };

    render() {
        const { visible, loading, formRef } = this.props;

        return (
            <Modal
                title="新增员工"
                open={visible}
                onCancel={this.handleCancel}
                footer={this.renderFooter()}
                width={700}
                destroyOnClose
                confirmLoading={loading}
                style={{ top: '40px' }}
                bodyStyle={{
                    height: `calc(100% - 80px)`,
                    overflow: 'hidden'
                }}
            >
                <Form
                    ref={formRef}
                    layout="vertical"
                    initialValues={{
                        birthplace: '四川省/宜宾市',
                        householdRegister: '四川省/宜宾市',
                        permanentAddress: '四川省/宜宾市',
                        probationDays: 0,
                    }}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    {/* 禁止该 flex 项目在容器空间不足时被压缩。 */}
                    <div style={{ flexShrink: 0 }}>
                        {this.renderTopFields()}
                    </div>
                    {this.renderTabContent()}
                </Form>
            </Modal>
        );
    }
}

export const AddEmployeeModal = withTranslation()(_AddEmployeeModal);