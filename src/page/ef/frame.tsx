// src/page/ef/frame.tsx

// 员工档案框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FrameEmployeeGallery } from './eg/frame';
import { DepartmentType, PositionType } from '../../config/type';

interface FrameEmployeeFileProps<> {
    headerHeight: number;
    departmentList: DepartmentType[],
    positionList: PositionType[],
}

class _FrameEmployeeFile extends React.Component<WithTranslation & FrameEmployeeFileProps> {
    render() {
        const { headerHeight, departmentList, positionList } = this.props;
        return (
            <div style={{ display: "flex", gap: "16px", height: "100%", overflow: "hidden" }}>
                <div style={{ flex: 1, overflow: "auto", height: "100%" }}>
                    <FrameEmployeeGallery
                        headerHeight={headerHeight}
                        departmentList={departmentList}
                        positionList={positionList}
                    />
                </div>
            </div>
        )
    }
}
export const FrameEmployeeFile = withTranslation()(_FrameEmployeeFile);