// src/page/ef/eg/detail.modal.tsx

import React, { JSX } from 'react';
import { Modal, Tag, Avatar, Space, Button, Divider, Row, Col, Card, Table, Badge, Tabs, Descriptions, Typography } from 'antd';
import { 
    UserOutlined, 
    PhoneOutlined, 
    CalendarOutlined,
    TeamOutlined,
    IdcardOutlined,
    FlagOutlined,
    ClockCircleOutlined,
    HomeOutlined,
    DollarOutlined,
    BookOutlined,
    HeartOutlined,
    EnvironmentOutlined,
    MailOutlined,
    FileTextOutlined,
    SolutionOutlined,
    BankOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { EmployeeType } from './frame';
import { withTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface EmployeeDetailModalProps {
    visible: boolean;
    employee: EmployeeType | null;
    onCancel: () => void;
}

// 紧急联系人类型（与添加面板一致）
interface EmergencyContactType {
    contact_name: string;
    contact_relationship: string;
    contact_phone: string;
}

// 扩展员工详情类型，包含添加面板的所有字段
interface EmployeeDetailType extends EmployeeType {
    // 基本信息
    idCard?: string;
    birthDate?: string;
    birthplace?: string;
    householdRegister?: string;
    householdType?: string;
    ethnicity?: string;
    maritalStatus?: string;
    politicalStatus?: string;
    employeePhoto?: string;
    emergencyContacts?: EmergencyContactType[];
    
    // 通讯信息
    phone?: string;
    email?: string;
    permanentAddress?: string;
    
    // 用工信息
    employmentType?: string;
    workStartDate?: string;
    entryDate?: string;
    probationDays?: number;
    regularDate?: string;
    probationSalary?: number;
    formalSalary?: number;
    
    // 汇报关系
    reportTo?: string;
    reportToName?: string;
    
    // 账户信息
    bankCard?: string;
    bankName?: string;
    
    // 教育信息
    education?: string;
    school?: string;
    major?: string;
    graduationDate?: string;
    
    // 提交信息
    submitter?: string;
    submitTime?: string;
}

interface EmployeeDetailModalState {
    loading: boolean;
    activeTab: string;
}

class _EmployeeDetailModal extends React.Component<EmployeeDetailModalProps, EmployeeDetailModalState> {
    constructor(props: EmployeeDetailModalProps) {
        super(props);
        this.state = {
            loading: false,
            activeTab: 'basic'
        };
    }

    // 渲染状态标签
    renderStatus = (status: string) => {
        const statusMap: { [key: string]: { color: string; text: string; status?: 'success' | 'error' | 'warning' | 'processing' | 'default' } } = {
            '在职': { color: 'green', text: '在职', status: 'success' },
            '离职': { color: 'red', text: '离职', status: 'error' },
            '休假': { color: 'orange', text: '休假', status: 'warning' },
            '试用期': { color: 'blue', text: '试用期', status: 'processing' },
            '待岗': { color: 'gray', text: '待岗', status: 'warning' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Badge status={config.status} text={config.text} />;
    };

    // 渲染性别
    renderGender = (gender: string) => {
        return gender === '男' ? 
            <Tag color="blue">男</Tag> : 
            <Tag color="pink">女</Tag>;
    };

    // 获取头像首字母
    getAvatarContent = () => {
        const { employee } = this.props;
        if (employee?.name) {
            return employee.name.charAt(0).toUpperCase();
        }
        return <UserOutlined />;
    };

    // 获取随机渐变色背景
    getAvatarColor = () => {
        const { employee } = this.props;
        if (!employee?.name) return '#1890ff';
        const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];
        const index = employee.name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // 渲染顶部标题区域
    renderHeader = (employee: EmployeeDetailType) => {
        return (
            <div style={{ 
                padding: '20px 24px', 
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#fafafa'
            }}>
                <Space size="middle" align="center">
                    <Avatar
                        size={64}
                        icon={!employee.name && <UserOutlined />}
                        style={{ 
                            backgroundColor: this.getAvatarColor(),
                            fontSize: '28px',
                        }}
                    >
                        {employee.name && this.getAvatarContent()}
                    </Avatar>
                    <div>
                        <Title level={4} style={{ marginBottom: 4, marginTop: 0 }}>
                            {employee.code} - {employee.name}
                        </Title>
                        <Space size="middle">
                            <Text type="secondary">
                                <TeamOutlined /> {employee.department}
                            </Text>
                            <Text type="secondary">
                                <FlagOutlined /> {employee.position}
                            </Text>
                            {this.renderStatus(employee.status)}
                        </Space>
                    </div>
                </Space>
            </div>
        );
    };

    // 渲染基本信息
    renderBasicInfo = (employee: EmployeeDetailType) => {
        const basicItems = [
            { label: '身份证号', value: employee.idCard || '--', span: 2 },
            { label: '性别', value: employee.gender ? this.renderGender(employee.gender) : '--' },
            { label: '出生日期', value: employee.birthDate || '--' },
            { label: '籍贯', value: employee.birthplace || '--', span: 2 },
            { label: '户籍所在地', value: employee.householdRegister || '--', span: 2 },
            { label: '户籍类型', value: employee.householdType || '--' },
            { label: '民族', value: employee.ethnicity || '--' },
            { label: '婚姻状态', value: employee.maritalStatus || '--' },
            { label: '政治面貌', value: employee.politicalStatus || '--' },
        ];

        return (
            <div style={{ padding: '16px 24px' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <UserOutlined /> 基本信息
                </Title>
                <Descriptions bordered column={2} size="small">
                    {basicItems.map((item, index) => (
                        <Descriptions.Item key={index} label={item.label} span={item.span || 1}>
                            {item.value}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </div>
        );
    };

    // 渲染用工信息
    renderEmploymentInfo = (employee: EmployeeDetailType) => {
        const formatSalary = (salary?: number) => {
            if (!salary) return '--';
            return `¥ ${salary.toLocaleString()}`;
        };

        const employmentItems = [
            { label: '聘用形式', value: employee.employmentType || '--' },
            { label: '员工状态', value: employee.status ? this.renderStatus(employee.status) : '--' },
            { label: '参加工作日期', value: employee.workStartDate || '--' },
            { label: '入职日期', value: employee.entryDate || '--' },
            { label: '试用期天数', value: employee.probationDays ? `${employee.probationDays} 天` : '--' },
            { label: '转正日期', value: employee.regularDate || '--' },
            { label: '试用期薪资', value: formatSalary(employee.probationSalary) },
            { label: '正式薪资', value: formatSalary(employee.formalSalary) },
        ];

        return (
            <div style={{ padding: '16px 24px' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <DollarOutlined /> 用工信息
                </Title>
                <Descriptions bordered column={2} size="small">
                    {employmentItems.map((item, index) => (
                        <Descriptions.Item key={index} label={item.label}>
                            {item.value}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </div>
        );
    };

    // 渲染汇报关系
    renderReportInfo = (employee: EmployeeDetailType) => {
        const reportItems = [
            { label: '汇报对象', value: employee.reportToName || '--' },
            { label: '汇报对象工号', value: employee.reportTo || '--' },
        ];

        return (
            <div style={{ padding: '16px 24px' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <SolutionOutlined /> 汇报关系
                </Title>
                <Descriptions bordered column={2} size="small">
                    {reportItems.map((item, index) => (
                        <Descriptions.Item key={index} label={item.label}>
                            {item.value}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </div>
        );
    };

    // 渲染账户信息
    renderAccountInfo = (employee: EmployeeDetailType) => {
        const accountItems = [
            { label: '银行卡号', value: employee.bankCard || '--' },
            { label: '开户银行', value: employee.bankName || '--' },
        ];

        return (
            <div style={{ padding: '16px 24px' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <BankOutlined /> 账户信息
                </Title>
                <Descriptions bordered column={2} size="small">
                    {accountItems.map((item, index) => (
                        <Descriptions.Item key={index} label={item.label}>
                            {item.value}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </div>
        );
    };

    // 渲染通讯信息
    renderContactInfo = (employee: EmployeeDetailType) => {
        const contactItems = [
            { label: '手机号', value: employee.phone || '--' },
            { label: '电子邮箱', value: employee.email || '--' },
            { label: '常住地址', value: employee.permanentAddress || '--', span: 2 },
        ];

        return (
            <div style={{ padding: '16px 24px' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <PhoneOutlined /> 通讯信息
                </Title>
                <Descriptions bordered column={2} size="small">
                    {contactItems.map((item, index) => (
                        <Descriptions.Item key={index} label={item.label} span={item.span || 1}>
                            {item.value}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </div>
        );
    };

    // 渲染教育信息
    renderEducationInfo = (employee: EmployeeDetailType) => {
        const educationItems = [
            { label: '最高学历', value: employee.education || '--' },
            { label: '毕业院校', value: employee.school || '--', span: 2 },
            { label: '专业', value: employee.major || '--' },
            { label: '毕业日期', value: employee.graduationDate || '--' },
        ];

        return (
            <div style={{ padding: '16px 24px' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <BookOutlined /> 教育信息
                </Title>
                <Descriptions bordered column={2} size="small">
                    {educationItems.map((item, index) => (
                        <Descriptions.Item key={index} label={item.label} span={item.span || 1}>
                            {item.value}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            </div>
        );
    };

    // 渲染紧急联系人
    renderEmergencyContacts = (employee: EmployeeDetailType) => {
        const columns: ColumnsType<EmergencyContactType> = [
            {
                title: '联系人姓名',
                dataIndex: 'contact_name',
                key: 'contact_name',
            },
            {
                title: '关系',
                dataIndex: 'contact_relationship',
                key: 'contact_relationship',
            },
            {
                title: '联系电话',
                dataIndex: 'contact_phone',
                key: 'contact_phone',
            },
        ];

        const emergencyContacts = employee.emergencyContacts || [];

        return (
            <div style={{ padding: '16px 24px' }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <HeartOutlined /> 紧急联系人
                </Title>
                {emergencyContacts.length > 0 ? (
                    <Table
                        dataSource={emergencyContacts.map((item, index) => ({ ...item, key: index }))}
                        columns={columns}
                        pagination={false}
                        size="small"
                        bordered
                    />
                ) : (
                    <div style={{ textAlign: 'center', color: '#999', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                        暂无紧急联系人信息
                    </div>
                )}
            </div>
        );
    };

    // 渲染底部提交信息
    renderFooterInfo = (employee: EmployeeDetailType) => {
        return (
            <div style={{ 
                padding: '12px 24px', 
                borderTop: '1px solid #f0f0f0',
                backgroundColor: '#fafafa',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#666'
            }}>
                <Space>
                    <HistoryOutlined />
                    <span>提交人：{employee.submitter || '--'}</span>
                </Space>
                <Space>
                    <ClockCircleOutlined />
                    <span>提交时间：{employee.submitTime || '--'}</span>
                </Space>
            </div>
        );
    };

    // 渲染左侧菜单
    renderSideMenu = () => {
        const { activeTab } = this.state;
        
        const menuItems = [
            { key: 'basic', icon: <UserOutlined />, label: '基本信息' },
            { key: 'employment', icon: <DollarOutlined />, label: '用工信息' },
            { key: 'report', icon: <SolutionOutlined />, label: '汇报关系' },
            { key: 'account', icon: <BankOutlined />, label: '账户信息' },
            { key: 'contact', icon: <PhoneOutlined />, label: '通讯信息' },
            { key: 'education', icon: <BookOutlined />, label: '教育信息' },
            { key: 'emergency', icon: <HeartOutlined />, label: '紧急联系人' },
        ];

        return (
            <div style={{ 
                width: 160, 
                borderRight: '1px solid #f0f0f0',
                backgroundColor: '#fafafa',
                padding: '16px 0'
            }}>
                {menuItems.map(item => (
                    <div
                        key={item.key}
                        onClick={() => this.setState({ activeTab: item.key })}
                        style={{
                            padding: '12px 16px',
                            margin: '0 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: activeTab === item.key ? '#e6f7ff' : 'transparent',
                            color: activeTab === item.key ? '#1890ff' : '#666',
                            borderLeft: activeTab === item.key ? '3px solid #1890ff' : '3px solid transparent',
                            transition: 'all 0.3s'
                        }}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    // 渲染右侧内容
    renderContent = (employee: EmployeeDetailType) => {
        const { activeTab } = this.state;
        
        const tabContent: { [key: string]: JSX.Element } = {
            basic: this.renderBasicInfo(employee),
            employment: this.renderEmploymentInfo(employee),
            report: this.renderReportInfo(employee),
            account: this.renderAccountInfo(employee),
            contact: this.renderContactInfo(employee),
            education: this.renderEducationInfo(employee),
            emergency: this.renderEmergencyContacts(employee),
        };

        return (
            <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#fff' }}>
                {tabContent[activeTab] || tabContent.basic}
            </div>
        );
    };

    // 渲染主体区域（左右结构）
    renderBody = (employee: EmployeeDetailType) => {
        return (
            <div style={{ display: 'flex', height: 'calc(70vh - 120px)' }}>
                {this.renderSideMenu()}
                {this.renderContent(employee)}
            </div>
        );
    };

    render() {
        const { visible, employee, onCancel } = this.props;
        const { loading } = this.state;

        if (!employee) return null;

        const detailEmployee = employee as EmployeeDetailType;

        return (
            <Modal
                title={null}
                open={visible}
                onCancel={onCancel}
                footer={null}
                width={1000}
                centered
                maskClosable={false}
                confirmLoading={loading}
                bodyStyle={{ padding: 0 }}
            >
                {this.renderHeader(detailEmployee)}
                {this.renderBody(detailEmployee)}
                {this.renderFooterInfo(detailEmployee)}
                <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
                    <Button onClick={onCancel}>关闭</Button>
                </div>
            </Modal>
        );
    }
}

export const EmployeeDetailModal = withTranslation()(_EmployeeDetailModal);