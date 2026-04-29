// src/component/LmModalEditAdmin.tsx

// 组件: 对话框(新增管理员信息面板)

import React from 'react';
import type { FormProps } from 'antd';
import { Button, Modal, Form, Input, Space, Radio } from 'antd';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ADMIN_ROLE } from '../config/enum';
import { httpUtil } from '../utils/HttpUtil';
import { AuthApi } from '../config/api';
import { ErrResponse, SucResponse } from '../config/type';
// import { LOCAL_STORAGE } from '../config/keys';

interface LmModalEditAdminProps<> {
    isModalOpen: boolean,
    oldAdmin: { id: number, nickname: string, role: ADMIN_ROLE }
    handleOk: (response: ErrResponse | SucResponse | undefined) => void,
    handleCancel: () => void,
}

type FieldType = {
    username?: string;
    nickname?: string;
    password?: string;
    role?: number;
};

class _LmModalEditAdmin extends React.Component<WithTranslation & LmModalEditAdminProps> {

    render() {
        const { t, isModalOpen, oldAdmin, handleOk, handleCancel } = this.props

        console.log('oldAdmin:', oldAdmin);

        const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
            console.log('Success:', values);
            // 这里去请求服务器
            const params = {
                id: oldAdmin.id,
                nickname: values.nickname,
                role: parseInt(`${values.role}`),
            }
            let response = await httpUtil.post(AuthApi.EDIT, params)

            // 一切正常则调用 handleOk
            handleOk(response)
        };

        return (
            <Modal
                title={t('title-edit-admin')}
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
                    initialValues={{ nickname: oldAdmin.nickname, role: oldAdmin.role }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {/* 管理员昵称 */}
                    <Form.Item<FieldType>
                        label={t('nickname')}
                        name="nickname"
                        rules={[{ required: true, message: t('hint-edit-admin-nickname') }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* 管理员身份 */}
                    <Form.Item<FieldType>
                        label={t('role')}
                        name="role"
                        rules={[{ required: true, message: t('hint-edit-admin-role') }]}
                    >
                        <Radio.Group
                            options={[
                                { value: ADMIN_ROLE.NORMAL, label: t('admin-role-normal') },
                                { value: ADMIN_ROLE.AREA, label: t('admin-role-area') },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Space style={{ marginBottom: 16 }}>
                            <Button type="primary" htmlType="submit">
                                {t('confirm')}
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

export const LmModalEditAdmin = withTranslation()(_LmModalEditAdmin)