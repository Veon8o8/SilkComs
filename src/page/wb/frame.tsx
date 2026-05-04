// src/page/wb/frame.tsx
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DepartmentType, PositionType, SucResponse, ErrResponse } from '../../config/type';
import { LOCAL_STORAGE } from '../../config/keys';
import { httpUtil } from '../../utils/HttpUtil';
import { timeUtil } from '../../utils/TimeUtil';
import { EmployeeApi } from '../../config/api';

// 员工数据类型
interface EmployeeType {
    id: number;
    code: string;
    name: string;
    gender: '男' | '女';
    department: string;
    depId: number; // 部门ID
    position: string;
    posId: number; // 岗位ID
    mobile: string;
}

interface FrameEmployeeWorkbenchProps {
    headerHeight: number;
    departmentList: DepartmentType[];
    positionList: PositionType[];
    employeeList?: EmployeeType[]; // 可选，外部传入员工数据
}

interface FrameEmployeeWorkbenchState {
    filters: {
        depId: string; // 改为 depId
        posId: string; // 改为 posId
        name: string;
        employeeId: string;
    };
    currentPage: number;
    pageSize: number;
    dataSource: EmployeeType[]; // 添加 dataSource 到 state
}

class _FrameEmployeeWorkbench extends React.Component<
    WithTranslation & FrameEmployeeWorkbenchProps,
    FrameEmployeeWorkbenchState
> {
    constructor(props: WithTranslation & FrameEmployeeWorkbenchProps) {
        super(props);
        this.state = {
            filters: {
                depId: '',
                posId: '',
                name: '',
                employeeId: '',
            },
            currentPage: 1,
            pageSize: 20,
            dataSource: [], // 初始化 dataSource
        };
    }

    componentDidMount(): void {
        this.getEmployeeContactList();
    }

    getEmployeeContactList = async () => {
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
                    mobile: item.phone,
                })
            }
            this.setState({ dataSource: dataSource });
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`获取员工列表失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
        }
    }

    // 筛选条件变更处理
    handleFilterChange = (key: string, value: string) => {
        this.setState(
            (prevState) => ({
                filters: { ...prevState.filters, [key]: value },
                currentPage: 1, // 重置到第一页
            })
        );
    };

    // 重置筛选
    handleReset = () => {
        this.setState({
            filters: {
                depId: '',
                posId: '',
                name: '',
                employeeId: '',
            },
            currentPage: 1,
        });
    };

    // 获取筛选后的员工列表
    getFilteredEmployees = (): EmployeeType[] => {
        const { dataSource } = this.state;
        const { filters } = this.state;

        if (!dataSource) return [];

        return dataSource.filter((employee) => {
            // 部门筛选（使用 depId 精确匹配）
            if (filters.depId && employee.depId !== Number(filters.depId)) {
                return false;
            }
            // 岗位筛选（使用 posId 精确匹配）
            if (filters.posId && employee.posId !== Number(filters.posId)) {
                return false;
            }
            // 姓名筛选（模糊匹配）
            if (filters.name && !employee.name.includes(filters.name)) {
                return false;
            }
            // 工号筛选（模糊匹配）
            if (filters.employeeId && !employee.code.includes(filters.employeeId)) {
                return false;
            }
            return true;
        });
    };

    // 获取当前页数据
    getCurrentPageData = (filteredList: EmployeeType[]): EmployeeType[] => {
        const { currentPage, pageSize } = this.state;
        const start = (currentPage - 1) * pageSize;
        return filteredList.slice(start, start + pageSize);
    };

    // 渲染分页组件
    renderPagination = (total: number) => {
        const { currentPage, pageSize } = this.state;
        const totalPages = Math.ceil(total / pageSize);

        if (totalPages <= 1) return null;

        return (
            <div style={styles.pagination}>
                <button
                    style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                    disabled={currentPage === 1}
                    onClick={() => this.setState({ currentPage: currentPage - 1 })}
                >
                    上一页
                </button>
                <span style={styles.pageInfo}>
                    第 {currentPage} / {totalPages} 页
                </span>
                <button
                    style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1 }}
                    disabled={currentPage === totalPages}
                    onClick={() => this.setState({ currentPage: currentPage + 1 })}
                >
                    下一页
                </button>
                <select
                    value={pageSize}
                    onChange={(e) => this.setState({ pageSize: Number(e.target.value), currentPage: 1 })}
                    style={styles.pageSizeSelect}
                >
                    <option value={10}>10条/页</option>
                    <option value={20}>20条/页</option>
                    <option value={50}>50条/页</option>
                </select>
            </div>
        );
    };

    render() {
        const { headerHeight, departmentList, positionList } = this.props;
        const { filters } = this.state;

        const filteredEmployees = this.getFilteredEmployees();
        const currentPageData = this.getCurrentPageData(filteredEmployees);
        const totalCount = filteredEmployees.length;

        // 处理部门选项（用于下拉框）- 包含 depId 和 name
        const departmentOptions = departmentList || [
            { depId: 1, name: '综合办' },
        ];

        // 处理岗位选项（用于下拉框）- 包含 posId 和 name
        const positionOptions = positionList || [
            { posId: 1, name: '综合部工作人员' },
        ].filter((item, index, self) =>
            // 去重：同一个 posId 只保留第一个
            index === self.findIndex((t) => t.posId === item.posId)
        );

        return (
            <div style={{ ...styles.container, paddingTop: headerHeight }}>
                {/* 过滤器区域 */}
                <div style={styles.filterSection}>
                    <div style={styles.filterRow}>
                        <div style={styles.filterItem}>
                            <label style={styles.filterLabel}>部门</label>
                            <select
                                style={styles.filterSelect}
                                value={filters.depId}
                                onChange={(e) => this.handleFilterChange('depId', e.target.value)}
                            >
                                <option value="">所有</option>
                                {departmentOptions.map((dept) => (
                                    <option key={dept.depId} value={dept.depId}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.filterItem}>
                            <label style={styles.filterLabel}>岗位</label>
                            <select
                                style={styles.filterSelect}
                                value={filters.posId}
                                onChange={(e) => this.handleFilterChange('posId', e.target.value)}
                            >
                                <option value="">所有</option>
                                {positionOptions.map((pos) => (
                                    <option key={pos.posId} value={pos.posId}>{pos.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* <div style={styles.filterItem}>
                            <label style={styles.filterLabel}>姓名</label>
                            <input
                                type="text"
                                style={styles.filterInput}
                                placeholder="请输入姓名"
                                value={filters.name}
                                onChange={(e) => this.handleFilterChange('name', e.target.value)}
                            />
                        </div>
                        <div style={styles.filterItem}>
                            <label style={styles.filterLabel}>工号</label>
                            <input
                                type="text"
                                style={styles.filterInput}
                                placeholder="请输入工号"
                                value={filters.employeeId}
                                onChange={(e) => this.handleFilterChange('employeeId', e.target.value)}
                            />
                        </div> */}
                        <button style={styles.resetBtn} onClick={this.handleReset}>
                            重置
                        </button>
                    </div>
                </div>

                {/* 员工通讯录表格 */}
                <div style={styles.tableSection}>
                    <div style={styles.tableHeader}>
                        <span style={styles.headerTitle}>员工通讯录</span>
                    </div>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th style={styles.th}>工号</th>
                                    <th style={styles.th}>姓名</th>
                                    <th style={styles.th}>性别</th>
                                    <th style={styles.th}>部门</th>
                                    <th style={styles.th}>岗位</th>
                                    <th style={styles.th}>手机号</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData.map((employee, idx) => (
                                    <tr key={employee.id} style={{ ...styles.tableRow, backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                        <td style={styles.td}>{employee.code}</td>
                                        <td style={styles.td}>{employee.name}</td>
                                        <td style={styles.td}>{employee.gender}</td>
                                        <td style={styles.td}>{employee.department}</td>
                                        <td style={styles.td}>{employee.position}</td>
                                        <td style={styles.td}>{employee.mobile}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={styles.tableFooter}>
                        <span style={styles.totalInfo}>共 {totalCount} 条</span>
                        {this.renderPagination(totalCount)}
                    </div>
                </div>
            </div>
        );
    }
}

// 样式定义
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#f5f7fa',
        padding: '20px 24px',
        boxSizing: 'border-box',
    },
    filterSection: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px 24px',
        marginBottom: '16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02)',
        border: '1px solid #eef2f6',
    },
    filterRow: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: '16px',
    },
    filterItem: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '160px',
    },
    filterLabel: {
        fontSize: '13px',
        fontWeight: 500,
        color: '#1f2d3d',
        marginBottom: '6px',
    },
    filterSelect: {
        height: '36px',
        padding: '0 12px',
        border: '1px solid #dcdfe6',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#1f2d3d',
        backgroundColor: '#fff',
        cursor: 'pointer',
        outline: 'none',
    },
    filterInput: {
        height: '36px',
        padding: '0 12px',
        border: '1px solid #dcdfe6',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#1f2d3d',
        outline: 'none',
    },
    resetBtn: {
        height: '36px',
        padding: '0 20px',
        backgroundColor: '#fff',
        border: '1px solid #dcdfe6',
        borderRadius: '4px',
        fontSize: '13px',
        color: '#606266',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    tableSection: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02)',
        border: '1px solid #eef2f6',
    },
    tableHeader: {
        padding: '16px 24px',
        borderBottom: '1px solid #eef2f6',
    },
    headerTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#1f2d3d',
    },
    tableWrapper: {
        flex: 1,
        overflow: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
    },
    tableHeadRow: {
        backgroundColor: '#fafbfc',
        borderBottom: '1px solid #eef2f6',
    },
    th: {
        padding: '12px 16px',
        textAlign: 'left',
        fontWeight: 500,
        color: '#4a5a6e',
        borderRight: '1px solid #eef2f6',
        fontSize: '13px',
    },
    td: {
        padding: '12px 16px',
        borderBottom: '1px solid #f0f2f5',
        color: '#1f2d3d',
    },
    tableFooter: {
        padding: '12px 24px',
        borderTop: '1px solid #eef2f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fafbfc',
    },
    totalInfo: {
        fontSize: '13px',
        color: '#606266',
    },
    pagination: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    pageBtn: {
        padding: '6px 12px',
        backgroundColor: '#fff',
        border: '1px solid #dcdfe6',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#606266',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    pageInfo: {
        fontSize: '13px',
        color: '#1f2d3d',
    },
    pageSizeSelect: {
        padding: '6px 8px',
        border: '1px solid #dcdfe6',
        borderRadius: '4px',
        fontSize: '12px',
        backgroundColor: '#fff',
        cursor: 'pointer',
    },
};

// 添加 hover 效果
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    button:hover {
        background-color: #f5f7fa;
        border-color: #c0c4cc;
    }
    select:hover, input:hover {
        border-color: #c0c4cc;
    }
    select:focus, input:focus {
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64,158,255,0.1);
    }
    tr:hover td {
        background-color: #f5f9ff !important;
    }
`;
document.head.appendChild(styleSheet);

export const FrameEmployeeWorkbench = withTranslation()(_FrameEmployeeWorkbench);