// src/page/main.header.tsx

// 主应用构件: 页头

import React from 'react';
import { Layout, Switch } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
const { Header } = Layout;

interface MainHeaderProps<> {
    changeMode: (value: boolean) => void,
    headerHeight: number,
}

class _MainHeader extends React.Component<WithTranslation & MainHeaderProps> {

    render() {
        const { t, changeMode, headerHeight } = this.props

        const headerStyle: React.CSSProperties = {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            height: `${headerHeight}vh`,
            display: 'flex',
        }

        return (
            <Header style={headerStyle}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <span style={{
                        color: '#ffffff',      // 白色文字
                        fontWeight: 'bold',    // 加粗
                        fontSize: '18px',      // 适当放大
                        letterSpacing: '1px'   // 字间距，更美观
                    }}>
                        协同办公管理系统
                    </span>
                    <Switch
                        checkedChildren={t('menu.vertical')}
                        unCheckedChildren={t('menu.inline')}
                        onChange={changeMode}
                    />
                </div>
            </Header>
        )
    }
}
export const MainHeader = withTranslation()(_MainHeader);