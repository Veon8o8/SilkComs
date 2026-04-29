// src/page/home/frame.tsx

// 主页框架

import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface FrameHomeProps<> {
}

class _FrameHome extends React.Component<WithTranslation & FrameHomeProps> {
    render() {
        return (<>首页</>)
    }
}
export const FrameHome = withTranslation()(_FrameHome);