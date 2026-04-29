// src/component/LmModal2.tsx

// 组件: 对话框(有一个确认按钮和一个取消按钮)

import React from 'react';
import { Button, Modal } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';

interface LmModal2Props<> {
    title: string,
    content: string,
    isModalOpen: boolean,
    handleOk: () => void,
    handleCancel: () => void,
}

class _LmModal2 extends React.Component<WithTranslation & LmModal2Props> {

    render() {
        const { t, title, content, isModalOpen, handleOk, handleCancel } = this.props
        return (
            <Modal
                title={title}
                open={isModalOpen}
                destroyOnClose={true}
                closeIcon={false}
                footer={
                    [
                        <Button key="back" onClick={handleCancel} >
                            {t('cancel')}
                        </Button>,
                        <Button key="back" onClick={handleOk} >
                            {t('confirm')}
                        </Button>
                    ]
                }
            >
                <p>{content} </p>
            </Modal>
        )
    }

}

export const LmModal2 = withTranslation()(_LmModal2)