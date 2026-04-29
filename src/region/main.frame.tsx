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

class _MainFrame extends React.Component<WithTranslation & MainFrameProps, { itemKey: string, menuMode: MenuMode, taskId: number, accountId: number }> {

    private childRef = React.createRef<_MainSider>()

    constructor(props: any) {
        super(props);

        const searchParams = new URLSearchParams(window.location.search);
        let page = searchParams.get('page') || MENU_KEY.Home;
        page = strUtil.capitalizeFirstLetter(page)
        console.log(`page:`, page)

        // 获取 URL 参数
        this.state = {
            itemKey: page,
            menuMode: 'inline',
            taskId: 0,
            accountId: 0,
        };
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
                        <FrameHome />
                    )
                case MENU_KEY.EmployeeFile:
                    return (
                        <FrameEmployeeFile />
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
                                padding: CONTENT.PADDING,
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