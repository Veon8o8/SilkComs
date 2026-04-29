// src/component/LmModalAddDateTab.tsx

// 组件: 对话框(新增日期选项卡面板)

import React from 'react';
import localeZh from 'antd/locale/zh_CN';
import localeEn from 'antd/locale/en_US';
import { Button, ConfigProvider, DatePicker, FormProps, Space } from 'antd';
import { Modal, Form } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateTab } from '../page/dynamic/admin/cst';
import { timeUtil } from '../utils/TimeUtil';

interface LmModalAddDateTabProps<> {
    isModalOpen: boolean,
    handleOk: (values: DateTab) => void,
    handleCancel: () => void,
}

type FieldType = {
    date?: string;
};

class _LmModalAddDateTab extends React.Component<WithTranslation & LmModalAddDateTabProps> {

    render() {
        const { t, i18n, isModalOpen, handleOk, handleCancel } = this.props

        const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
            if (values.date) {
                const date = timeUtil.formatDate(new Date(values.date), 'YYYY-MM-DD')
                const dateTab: DateTab = {
                    date: date
                }
                handleOk(dateTab)
            }
        };

        const locale = i18n.language == 'zh_CN' ? localeZh : localeEn

        return (
            <Modal
                title={t('title-add-date')}
                open={isModalOpen}
                destroyOnClose={true}
                closeIcon={false}
                footer={null}
            >
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {/* 动态日期 */}
                    <ConfigProvider locale={locale}>
                        <Form.Item<FieldType>
                            label={t('date')}
                            name="date"
                            rules={[{ required: true, message: t('hint-add-date') }]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </ConfigProvider>


                    {/* 操作按钮 */}
                    <Form.Item label={null}>
                        <Space style={{ marginBottom: 16 }}>
                            <Button type="primary" htmlType="submit">
                                {t('add')}
                            </Button>
                            <Button onClick={handleCancel}>
                                {t('cancel')}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

}

export const LmModalAddDateTab = withTranslation()(_LmModalAddDateTab)