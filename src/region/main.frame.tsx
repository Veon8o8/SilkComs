// src/region/main.frame.tsx

// 主应用框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Layout } from 'antd';
import { MainHeader } from './main.header';
import { MainSider, _MainSider } from './main.sider';
import { CONTENT } from '../config/layout';
import { MENU_KEY } from '../config/sider';
import { strUtil } from '../utils/StrUtil';
import { FrameHome } from '../page/home/frame';
import { FrameEmployeeFile } from '../page/ef/frame';
import { FrameDepartmentPosition } from '../page/dp/frame';
import { httpUtil } from '../utils/HttpUtil';
import { DepartmentApi, PositionApi } from '../config/api';
import { LOCAL_STORAGE } from '../config/keys';
import { DepartmentType, ErrResponse, PositionType, SucResponse } from '../config/type';
import { timeUtil } from '../utils/TimeUtil';
const { Content } = Layout;

type MenuMode = 'vertical' | 'inline';

interface MainFrameProps<> {
    headerHeight: number,
    bodyHeight: number,
    dynamicHeight: number,
    addressListHeight: number,
    colorBgContainer: string,
    borderRadiusLG: string,
}

interface MainFrameState {
    itemKey: string,
    menuMode: MenuMode,
    taskId: number,
    accountId: number,
    departmentList: DepartmentType[],
    positionList: PositionType[],
}

class _MainFrame extends React.Component<WithTranslation & MainFrameProps, MainFrameState> {

    private childRef = React.createRef<_MainSider>()

    constructor(props: any) {
        super(props);

        const searchParams = new URLSearchParams(window.location.search);
        let page = searchParams.get('page') || MENU_KEY.Home;
        page = strUtil.capitalizeFirstLetter(page)
        console.log(`page:`, page)
        
        const token: string = searchParams.get('token') || '';
        localStorage.setItem('token', token);
        // const token = localStorage.getItem(LOCAL_STORAGE.TOKEN)
        console.log('用户Token:', token);
        if (!token) {
            // 如果没有Token，说明用户未登录，重定向到登录页
            httpUtil.gotoLogin();
        }
        // TODO: 校验 token 是否过期

        // 获取 URL 参数
        this.state = {
            itemKey: page,
            menuMode: 'inline',
            taskId: 0,
            accountId: 0,
            departmentList: [],
            positionList: [],
        };
    }

    

    componentDidMount() {
        // 请求服务器，获取部门和岗位数据，供员工档案页面使用
        this.fetchDepartment();
        this.fetchPosition();
    }

    private async fetchDepartment() {
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
        }
        let response = await httpUtil.post(DepartmentApi.LIST, params);
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`获取部门列表成功:\n`, r.data.list);
            // 设置 dataSource
            const list = r.data.list
            const dataSource: DepartmentType[] = []
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                dataSource.push({
                    depId: item.depId,
                    name: item.name,
                    count: item.count || 0,
                    parentId: item.parentId || 0,
                    parentName: item.parentName || '-',
                    createTime: timeUtil.formatTimestamp(item.createTime),
                })
            }
            this.setState({ departmentList: dataSource });
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`获取部门列表失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
        }
    }

    private async fetchPosition() {
        // 这里去请求服务器
        const params = {
            token: localStorage.getItem(LOCAL_STORAGE.TOKEN),
        }
        let response = await httpUtil.post(PositionApi.LIST, params)
        if (response?.code == 200) {
            const r = response as SucResponse
            console.log(`获取岗位列表成功:\n`, r.data.list);
            // 设置 dataSource
            const list = r.data.list
            const dataSource: PositionType[] = []
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                dataSource.push({
                    posId: item.posId,
                    name: item.name,
                    count: item.count || 0,
                    createTime: timeUtil.formatTimestamp(item.createTime),
                })
            }
            this.setState({ positionList: dataSource });
        }
        else if ((response?.code == 400)) {
            const r = response as ErrResponse
            console.error(`获取岗位列表失败: [${r.errCode}] ${r.errMsg}`);
            httpUtil.tryGotoLogin(r);
        }
    }

    render() {
        const { headerHeight, bodyHeight, colorBgContainer, borderRadiusLG } = this.props

        /** 除去头部剩余部分 */
        const bottomStyle: React.CSSProperties = {
            flexGrow: 1,
            height: `${bodyHeight}vh`,
        };

        const clickItems = (key: string) => {
            console.log(`item key:`, key)
            this.setState({ itemKey: key })
        };

        const selectItem = (key: string) => {
            this.setState({ itemKey: key })
            this.childRef.current?.setSelectedKeys(key);
        }

        const content = () => {
            switch (this.state.itemKey) {
                case MENU_KEY.Home:
                    return (
                        <FrameHome
                            headerHeight={headerHeight}
                            departmentList={this.state.departmentList}
                            positionList={this.state.positionList}
                        />
                    )
                case MENU_KEY.DepartmentPosition:
                    return (
                        <FrameDepartmentPosition />
                    )
                case MENU_KEY.EmployeeFile:
                    return (
                        <FrameEmployeeFile
                            headerHeight={headerHeight}
                            departmentList={this.state.departmentList}
                            positionList={this.state.positionList}
                        />
                    )
                default:
                    return (
                        <>
                            TODO: Content-{this.state.itemKey}
                        </>
                    )
            }
        };

        const changeMode = (value: boolean) => {
            this.setState({ menuMode: value ? 'vertical' : 'inline' });
        };

        return (
            <Layout style={{ display: 'flex' }}>
                <MainHeader
                    changeMode={changeMode}
                    headerHeight={headerHeight}
                />
                <Layout style={bottomStyle}>
                    <MainSider
                        menuMode={this.state.menuMode}
                        clickItems={clickItems}
                        bodyHeight={bodyHeight}
                        ref={this.childRef}
                    />
                    <Layout style={{ padding: `${CONTENT.PADDING}px` }}>
                        <Content
                            style={{
                                padding: `${CONTENT.PADDING}px`,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {content()}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
export const MainFrame = withTranslation()(_MainFrame);