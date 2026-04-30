// src/page/dp/frame.tsx

// 部门与岗位框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FrameDepartmentMgmt } from './dm/frame';
import { FramePositionMgmt } from './pm/frame';

interface FrameDepartmentPositionProps {
}

class _FrameDepartmentPosition extends React.Component<WithTranslation & FrameDepartmentPositionProps> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div style={{ display: "flex", gap: "16px", height: "100%" }}>
                <FrameDepartmentMgmt />
                <FramePositionMgmt />
            </div>
        );
    }
}

export const FrameDepartmentPosition = withTranslation()(_FrameDepartmentPosition);