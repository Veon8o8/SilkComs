// src/page/main.sider.tsx

// 主应用构件: 侧边栏

import React, { RefObject } from 'react';
import {
    HomeOutlined,
    ProfileOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { MENU, MENU_KEY, SUBMENU } from '../config/sider';
import { SIDER } from '../config/layout';

const { Sider } = Layout;

interface MainSiderProps<> {
    menuMode: 'vertical' | 'inline',
    clickItems: (key: string) => void,
    bodyHeight: number,
    ref: RefObject<_MainSider | null>,
}

export class _MainSider extends React.Component<WithTranslation & MainSiderProps> {

    state = {
        selectedKeys: [MENU_KEY.Home]
    }

    doNothing() {

    }

    setSelectedKeys(key: string) {
        this.setState({ selectedKeys: [key] })
    }

    onMenuItemClick = (o: { item: any, key: string, keyPath: string[], domEvent: any }) => {
        const { clickItems } = this.props
        this.setSelectedKeys(o.key)
        clickItems(o.key)
    }

    render() {
        const { t, menuMode, bodyHeight } = this.props

        const siderStyle: React.CSSProperties = {
            overflow: 'auto',
            height: `${bodyHeight}vh`,
            position: 'sticky',
            insetInlineStart: 0,
            top: 100,
            bottom: 0,
            scrollbarWidth: 'thin',
            scrollbarGutter: 'stable',
        };

        const menuIcons = [
            HomeOutlined,        // 首页
            ProfileOutlined,     // 部门管理
            ProfileOutlined,     // 员工档案
        ];

        const menuItems: MenuProps['items'] = menuIcons.map(
            (icon, index) => {
                const menu = MENU[index]
                let menuitem = {
                    key: menu.key,
                    icon: React.createElement(icon),
                    label: t(menu.label),
                };
                // if (SUBMENU[index] && SUBMENU[index].length > 0) {
                //     // 动态添加子菜单项时注意：menuitem 需要先转化为 any 类型
                //     (menuitem as any).children = Array.from(SUBMENU[index]).map((_, subKey) => {
                //         const submenu = SUBMENU[index][subKey]
                //         return {
                //             key: submenu.key,
                //             label: t(submenu.label),
                //         };
                //     })
                // }
                return menuitem;
            },
        );

        return (
            <Sider width={SIDER.WIDTH} style={siderStyle}>
                <Menu
                    theme="dark"
                    mode={menuMode}
                    defaultSelectedKeys={[MENU_KEY.Home]}
                    defaultOpenKeys={[MENU_KEY.Home]}
                    selectedKeys={this.state.selectedKeys}
                    style={{ height: '100%', borderRight: 0 }}
                    items={menuItems}
                    onClick={this.onMenuItemClick}
                />
            </Sider>
        )
    }
}
export const MainSider = withTranslation()(_MainSider);