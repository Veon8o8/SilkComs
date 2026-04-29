// src/config/api.ts

// 配置: 服务器接口

/** 服务器地址 */
export const HOST = 'http://140.143.97.54'
/** 服务器端口 */
// export const PORT = ':51801'
export const PORT = ''

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


/** 任务管理接口(task). */
export const TaskApi = {
    /** 获取任务列表 */
    LIST: `${URL}/admin/task/list`,
    /** 下架任务 */
    OFF_SHELF: `${URL}/admin/task/offShelf`,
    /** 上架任务 */
    ON_SHELF: `${URL}/admin/task/onShelf`,
    /** 获取任务详情 */
    DETAIL: `${URL}/admin/task/detail`,
}

/** 动态管理接口(dynamic). */
export const DynamicApi = {
    /** 获取管理员动态 */
    LIST_ADMIN: `${URL}/admin/dynamic/listAdmin`,
    /** 获取用户动态 */
    LIST_USER: `${URL}/admin/dynamic/listUser`,
}