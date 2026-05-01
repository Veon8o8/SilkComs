// src/config/api.ts

// 配置: 服务器接口

/** 服务器地址 */
// export const HOST = 'http://140.143.97.54'
export const HOST = 'http://localhost'
/** 服务器端口 */
// export const PORT = ':51801'
// export const PORT = ''
export const PORT = ':3002'

/** 页面路由根路径 */
export const ROOT = `/mgmt`

/** API根路径 */
export const URL = `${HOST}${PORT}`

/** 权限管理接口(auth). */
export const AuthApi = {
    /** 管理员登录 */
    LOGIN: `${URL}/admin/auth/login`,
    /** 获取管理员列表 */
    LIST: `${URL}/admin/auth/list`,
    /** 创建新的管理员(权限高的能创建低的) */
    CREATE: `${URL}/admin/auth/create`,
    /** 封号管理员 */
    BLOCK: `${URL}/admin/auth/block`,
    /** 解封管理员 */
    UNBLOCK: `${URL}/admin/auth/unblock`,
    /** 编辑管理员(名字，身份) */
    EDIT: `${URL}/admin/auth/edit`,
}

/** 用户管理接口(user). */
export const UserApi = {
    /** 获取用户列表 */
    LIST: `${URL}/admin/user/list`,
    /** 获取用户详情 */
    DETAIL: `${URL}/admin/user/detail`,
    /** 冻结用户 */
    FREEZE: `${URL}/admin/user/freeze`,
    /** 解冻 */
    UNFREEZE: `${URL}/admin/user/unfreeze`,
    /** 封号 */
    BLOCK: `${URL}/admin/user/block`,
    /** 解封 */
    UNBLOCK: `${URL}/admin/user/unblock`,
}


// /** 任务管理接口(task). */
// export const TaskApi = {
//     /** 获取任务列表 */
//     LIST: `${URL}/admin/task/list`,
//     /** 下架任务 */
//     OFF_SHELF: `${URL}/admin/task/offShelf`,
//     /** 上架任务 */
//     ON_SHELF: `${URL}/admin/task/onShelf`,
//     /** 获取任务详情 */
//     DETAIL: `${URL}/admin/task/detail`,
// }

/** 动态管理接口(dynamic). */
export const DynamicApi = {
    /** 获取管理员动态 */
    LIST_ADMIN: `${URL}/admin/dynamic/listAdmin`,
    /** 获取用户动态 */
    LIST_USER: `${URL}/admin/dynamic/listUser`,
}

/** 部门管理接口(department). */
export const DepartmentApi = {
    /** 获取部门列表 */
    LIST: `${URL}/coms/department/list`,
    /** 创建新部门 */
    ADD: `${URL}/coms/department/add`,
    /** 编辑部门 */
    EDIT: `${URL}/coms/department/edit`,
    /** 删除部门 */
    DEL: `${URL}/coms/department/del`,
}

/** 岗位管理接口(position). */
export const PositionApi = {
    /** 获取岗位列表 */
    LIST: `${URL}/coms/position/list`,
    /** 创建新岗位 */
    ADD: `${URL}/coms/position/add`,
    /** 编辑岗位 */
    EDIT: `${URL}/coms/position/edit`,
    /** 删除岗位 */
    DEL: `${URL}/coms/position/del`,
}