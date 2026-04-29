// src/component/LmModal1.tsx

// 组件: 对话框(仅有一个确认按钮)

import React from 'react';
import { Button, Modal } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { InfoCircleFilled, CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { ModalType } from '../config/enum';

interface LmModal1Props<> {
    modalType: ModalType,
    content: string,
    isModalOpen: boolean,
    handleOk: () => void,
}

class _LmModal1 extends React.Component<WithTranslation & LmModal1Props> {

    render() {
        const { t, modalType, content, isModalOpen, handleOk } = this.props
        return (
            <Modal
                title={this.renderModalTitle(modalType)}
                open={isModalOpen}
                destroyOnClose={true}
                closeIcon={false}
                footer={
                    [
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

    renderModalTitle(modalType: ModalType) {
        const { t } = this.props
        switch (modalType) {
            case ModalType.Info:
                return (<><InfoCircleFilled style={{ color: 'blue' }} /> {t('info')}</>);
            case ModalType.Success:
                return (<><CheckCircleFilled style={{ color: 'green' }} /> {t('success')}</>);
            case ModalType.Error:
                return (<><CloseCircleFilled style={{ color: 'red' }} /> {t('error')}</>);
            case ModalType.Warning:
                return (<><ExclamationCircleFilled style={{ color: 'orange' }} /> {t('warning')}</>)
            default:
                return (<></>);
        }
    }

}

export const LmModal1 = withTranslation()(_LmModal1)