export type ErrResponse = {
    code: number;
    errMsg: string;
    errCode: number;
}

export type SucResponse = {
    code: number;
    data: any;
}

// 定义部门数据类型
export interface DepartmentType {
    depId: number;
    name: string;
    count: number;
    parentId: number;
    parentName: string;
    createTime: string;
}

// 定义岗位数据类型
export interface PositionType {
    posId: number;
    name: string;
    count: number;
    createTime: string;
}

// 定义员工卡片数据类型
export interface EmployeeType {  // 导出供其他组件使用
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

// 紧急联系人类型（与添加面板一致）
export interface EmergencyContactType {
    contact_name: string;
    contact_relationship: string;
    contact_phone: string;
}


// 扩展员工详情类型，包含添加面板的所有字段
export interface EmployeeDetailType extends EmployeeType {
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