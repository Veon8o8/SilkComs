// src/component/LmModalAddAdmin.tsx

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

interface LmModalAddAdminProps<> {
    isModalOpen: boolean,
    handleOk: (response: ErrResponse | SucResponse | undefined) => void,
    handleCancel: () => void,
}

type FieldType = {
    username?: string;
    nickname?: string;
    password?: string;
    role?: number;
};

class _LmModalAddAdmin extends React.Component<WithTranslation & LmModalAddAdminProps> {

    render() {
        const { t, isModalOpen, handleOk, handleCancel } = this.props

        const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
            console.log('Success:', values);
            // 这里去请求服务器
            const params = {
                username: values.username,
                password: values.password,
                nickname: values.nickname,
                role: parseInt(`${values.role}`),
            }
            let response = await httpUtil.post(AuthApi.CREATE, params)

            // 一切正常则调用 handleOk
            handleOk(response)
        };

        return (
            <Modal
                title={t('title-add-admin')}
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
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {/* 管理员账号 */}
                    <Form.Item<FieldType>
                        label={t('account')}
                        name="username"
                        rules={[{ required: true, message: t('hint-add-admin-account') }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* 管理员昵称 */}
                    <Form.Item<FieldType>
                        label={t('nickname')}
                        name="nickname"
                        rules={[{ required: true, message: t('hint-add-admin-nickname') }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* 登录密码 */}
                    <Form.Item<FieldType>
                        label={t('password')}
                        name="password"
                        rules={[{ required: true, message: t('hint-add-admin-password') }]}
                    >
                        <Input />
                    </Form.Item>
                    {/* 管理员身份 */}
                    <Form.Item<FieldType>
                        label={t('role')}
                        name="role"
                        rules={[{ required: true, message: t('hint-add-admin-role') }]}
                    >
                        <Radio.Group>
                            <Radio value={ADMIN_ROLE.NORMAL}> {t('admin-role-normal')} </Radio>
                            <Radio value={ADMIN_ROLE.AREA}> {t('admin-role-area')} </Radio>
                        </Radio.Group>
                    </Form.Item>

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

export const LmModalAddAdmin = withTranslation()(_LmModalAddAdmin)