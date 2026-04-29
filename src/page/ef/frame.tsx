// src/page/ef/frame.tsx

// 员工档案框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface FrameEmployeeFileProps<> {
}

class _FrameEmployeeFile extends React.Component<WithTranslation & FrameEmployeeFileProps> {
    render() {
        return (<>员工档案</>)
    }
}
export const FrameEmployeeFile = withTranslation()(_FrameEmployeeFile);