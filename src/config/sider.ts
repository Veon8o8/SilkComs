// src/config/sider.ts

// 配置: 侧边栏菜单项配置

/** 菜单键 */
export const MENU_KEY = {
    // 首页
    Home: "Home",

    // 部门管理
    DepartmentMgmt: "DepartmentMgmt",

    // 员工档案
    EmployeeFile: "EmployeeFile",
};

/** 主菜单项 */
export const MENU = [
    { key: MENU_KEY.Home, label: 'front-page' },
    { key: MENU_KEY.DepartmentMgmt, label: 'department-mgmt' },
    { key: MENU_KEY.EmployeeFile, label: 'employee-file' },
];

/** 子菜单项 */
export const SUBMENU = [
    [],
    [],
    []
];