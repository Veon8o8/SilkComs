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