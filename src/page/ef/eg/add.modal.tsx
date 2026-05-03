// src/page/ef/eg/add.modal.tsx

import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col, Button, Tabs, message, Upload } from 'antd';
import { UserOutlined, PhoneOutlined, DollarOutlined, UploadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { UploadFile } from 'antd/es/upload/interface';
import { withTranslation } from 'react-i18next';
import { DepartmentType, PositionType } from '../../../config/type';

const { Option } = Select;
const { TabPane } = Tabs;

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
    emergencyRelationship: string; // 紧急联系人关系
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
    departmentList: DepartmentType[],
    positionList: PositionType[],
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

    // 随机生成身份证号
    generateIdCard = () => {
        const areaCode = '510101';
        const birthDate = this.generateRandomDate(new Date('1970-01-01'), new Date('2000-12-31'));
        const birthStr = dayjs(birthDate).format('YYYYMMDD');
        const sequence = Math.floor(Math.random() * 999).toString().padStart(3, '0');
        const idCard17 = areaCode + birthStr + sequence;
        // 简单的校验码计算（实际应该用标准算法，这里简化）
        const checkCode = Math.floor(Math.random() * 10).toString();
        return idCard17 + checkCode;
    };

    // 生成随机日期
    generateRandomDate = (start: Date, end: Date): Date => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // 随机填充表单
    autoFillForm = () => {
        const { formRef, departmentList, positionList } = this.props;
        const form = formRef.current;
        if (!form) return;

        // 随机生成工号
        const randomCode = `FR${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;

        // 随机姓名
        const surnames = ['张', '王', '李', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
        const givenNames = ['伟', '芳', '娜', '敏', '静', '涛', '军', '强', '鹏', '宇'];
        const randomName = surnames[Math.floor(Math.random() * surnames.length)] +
            givenNames[Math.floor(Math.random() * givenNames.length)];

        // 随机部门
        // const randomDept = departmentList[Math.floor(Math.random() * departmentList.length)].name;
        const randomDept = departmentList[Math.floor(Math.random() * departmentList.length)].depId; // 传出参数就是ID

        // 随机岗位
        // const randomPosition = positionList[Math.floor(Math.random() * positionList.length)].name;
        const randomPosition = positionList[Math.floor(Math.random() * positionList.length)].posId; // 传出参数就是ID

        // 随机性别
        const randomGender = Math.random() > 0.5 ? '男' : '女';

        // 随机出生日期 (1970-2000)
        const randomBirthDate = this.generateRandomDate(new Date('1970-01-01'), new Date('2000-12-31'));

        // 随机婚姻状态
        const maritalStatusList = ['未婚', '已婚', '离异', '丧偶'];
        const randomMaritalStatus = maritalStatusList[Math.floor(Math.random() * maritalStatusList.length)];

        // 随机政治面貌
        const politicalList = ['中共党员', '中共预备党员', '共青团员', '民主党派', '无党派人士', '群众'];
        const randomPolitical = politicalList[Math.floor(Math.random() * politicalList.length)];

        // 随机民族
        const ethnicList = ['汉族', '苗族', '彝族', '壮族', '回族', '满族', '藏族'];
        const randomEthnicity = ethnicList[Math.floor(Math.random() * ethnicList.length)];

        // 随机手机号
        const randomPhone = `1${Math.floor(Math.random() * 7) + 3}${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;

        // 随机聘用形式
        const employmentTypeList = ['全职', '兼职', '实习', '劳务派遣'];
        const randomEmploymentType = employmentTypeList[Math.floor(Math.random() * employmentTypeList.length)];

        // 随机员工状态
        const employeeStatusList = ['在职', '试用期', '待岗'];
        const randomEmployeeStatus = employeeStatusList[Math.floor(Math.random() * employeeStatusList.length)];

        // 随机日期
        const randomWorkStartDate = this.generateRandomDate(new Date('2010-01-01'), new Date('2020-12-31'));
        const randomEntryDate = this.generateRandomDate(new Date('2021-01-01'), new Date('2024-12-31'));
        const randomRegularDate = dayjs(randomEntryDate).add(90, 'day').toDate();

        // 随机薪资 (3000-30000)
        const randomProbationSalary = Math.floor(Math.random() * (10000 - 3000) + 3000);
        const randomFormalSalary = randomProbationSalary + Math.floor(Math.random() * 5000);

        // 随机试用期天数
        const randomProbationDays = [30, 60, 90, 180][Math.floor(Math.random() * 4)];

        // 随机地址
        const cities = ['成都市', '绵阳市', '宜宾市', '泸州市', '德阳市'];
        const districts = ['高新区', '武侯区', '青羊区', '锦江区', '金牛区'];
        const randomAddress = `${cities[Math.floor(Math.random() * cities.length)]}/${districts[Math.floor(Math.random() * districts.length)]}`;

        // 设置表单值
        const formValues = {
            // 顶部字段
            code: randomCode,
            name: randomName,
            department: randomDept,
            position: randomPosition,

            // 基本信息
            idCard: this.generateIdCard(),
            gender: randomGender,
            birthDate: dayjs(randomBirthDate),
            birthplace: randomAddress,
            householdRegister: randomAddress,
            householdType: ['农业户口', '非农业户口', '集体户口'][Math.floor(Math.random() * 3)],
            ethnicity: randomEthnicity,
            maritalStatus: randomMaritalStatus,
            politicalStatus: randomPolitical,
            emergencyContact: `张${Math.floor(Math.random() * 100)}`,
            emergencyRelationship: `朋友`,
            emergencyPhone: randomPhone,

            // 通讯信息
            phone: randomPhone,
            permanentAddress: `${randomAddress}某某街道${Math.floor(Math.random() * 200) + 1}号`,

            // 用工信息
            employmentType: randomEmploymentType,
            employeeStatus: randomEmployeeStatus,
            workStartDate: dayjs(randomWorkStartDate),
            entryDate: dayjs(randomEntryDate),
            probationDays: randomProbationDays,
            regularDate: dayjs(randomRegularDate),
            probationSalary: randomProbationSalary,
            formalSalary: randomFormalSalary,
        };

        form.setFieldsValue(formValues);
        message.success('已随机填充表单数据');
    };

    // 渲染顶部公共字段
    renderTopFields = () => {
        const { departmentList, positionList } = this.props;
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
                            >
                                {departmentList.map(dept => (
                                    <Option key={dept.depId} value={dept.depId}>  {/* 表单存储的是部门 ID，用户看到的是部门名 */}
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
                                    <Option key={pos.posId} value={pos.posId}> {/* 表单存储的是岗位 ID，用户看到的是岗位名 */}
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
                    <Col span={8}>
                        <Form.Item
                            name="emergencyContact"
                            label="紧急联系人"
                        >
                            <Input placeholder="请输入紧急联系人姓名" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="emergencyRelationship"
                            label="紧急联系人关系"
                        >
                            <Input placeholder="请输入紧急联系人关系" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
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

    // // 渲染选项卡内容
    // renderTabContent = () => {
    //     return (
    //         <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
    //             <Tabs
    //                 activeKey={this.state.activeTab}
    //                 onChange={this.onTabChange}
    //                 style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    //             >
    //                 <TabPane
    //                     tab={<span><UserOutlined />基本信息</span>}
    //                     key="basic"
    //                 >
    //                     <div style={{
    //                         height: 'calc(80vh - 300px)',
    //                         overflowY: 'auto',
    //                         overflowX: 'hidden',
    //                         paddingRight: '8px'
    //                     }}>
    //                         {this.renderBasicInfo()}
    //                     </div>
    //                 </TabPane>
    //                 <TabPane
    //                     tab={<span><DollarOutlined />用工信息</span>}
    //                     key="employment"
    //                 >
    //                     <div style={{
    //                         height: 'calc(80vh - 300px)',
    //                         overflowY: 'auto',
    //                         overflowX: 'hidden',
    //                         paddingRight: '8px'
    //                     }}>
    //                         {this.renderEmploymentInfo()}
    //                     </div>
    //                 </TabPane>
    //                 <TabPane
    //                     tab={<span><PhoneOutlined />通讯信息</span>}
    //                     key="contact"
    //                 >
    //                     <div style={{
    //                         height: 'calc(80vh - 300px)',
    //                         overflowY: 'auto',
    //                         overflowX: 'hidden',
    //                         paddingRight: '8px'
    //                     }}>
    //                         {this.renderContactInfo()}
    //                     </div>
    //                 </TabPane>
    //             </Tabs>
    //         </div>
    //     );
    // };

    renderTabContent = () => {
        const { activeTab } = this.state;

        return (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={this.onTabChange}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    <TabPane tab={<span><UserOutlined />基本信息</span>} key="basic" />
                    <TabPane tab={<span><DollarOutlined />用工信息</span>} key="employment" />
                    <TabPane tab={<span><PhoneOutlined />通讯信息</span>} key="contact" />
                </Tabs>

                {/* 使用 CSS 控制显示隐藏，确保所有表单字段都被渲染 */}
                <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                    <div style={{ display: activeTab === 'basic' ? 'block' : 'none', height: '100%' }}>
                        <div style={{ height: 'calc(80vh - 300px)', overflowY: 'auto', paddingRight: '8px' }}>
                            {this.renderBasicInfo()}
                        </div>
                    </div>
                    <div style={{ display: activeTab === 'employment' ? 'block' : 'none', height: '100%' }}>
                        <div style={{ height: 'calc(80vh - 300px)', overflowY: 'auto', paddingRight: '8px' }}>
                            {this.renderEmploymentInfo()}
                        </div>
                    </div>
                    <div style={{ display: activeTab === 'contact' ? 'block' : 'none', height: '100%' }}>
                        <div style={{ height: 'calc(80vh - 300px)', overflowY: 'auto', paddingRight: '8px' }}>
                            {this.renderContactInfo()}
                        </div>
                    </div>
                </div>
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
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>新增员工</span>
                        <Button
                            size="small"
                            icon={<ThunderboltOutlined />}
                            onClick={this.autoFillForm}
                            style={{ marginRight: 24 }}
                        >
                            随机填充
                        </Button>
                    </div>
                }
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