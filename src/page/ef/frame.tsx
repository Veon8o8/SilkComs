// src/page/ef/frame.tsx

// 员工档案框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FrameEmployeeGallery } from './eg/frame';

interface FrameEmployeeFileProps<> {
    headerHeight: number;
}

class _FrameEmployeeFile extends React.Component<WithTranslation & FrameEmployeeFileProps> {
    render() {
        const { headerHeight } = this.props;
        return (
            <div style={{ display: "flex", gap: "16px", height: "100%", overflow: "hidden" }}>
                <div style={{ flex: 1, overflow: "auto", height: "100%" }}>
                    <FrameEmployeeGallery
                        headerHeight={headerHeight}
                    />
                </div>
            </div>
        )
    }
}
export const FrameEmployeeFile = withTranslation()(_FrameEmployeeFile);