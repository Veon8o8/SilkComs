// src/utils/EnumHelper.ts

import { TFunction } from "i18next";
import { UserApi } from "../config/api";
import { ADMIN_ROLE, ADMIN_STATUS, TASK_STATUS, TASK_TYPE, USER_ROLE, USER_STATUS } from "../config/enum";

// 枚举辅助类，返回枚举数值的字符串含义

class EnumHelper {


    // =========================================================================
    // 权限相关
    // =========================================================================

    /** 返回管理员角色的字符串含义
     * @param role 管理员角色
     */
    public adminRole(role: ADMIN_ROLE) {
        switch (role) {
            case ADMIN_ROLE.SUPER:
                return '超级管理员'
            case ADMIN_ROLE.NORMAL:
                return '普通管理员'
            case ADMIN_ROLE.AREA:
                return '大区管理员'
        }
    }

    /** 返回管理员状态的字符串含义
     * @param status 管理员状态
     */
    public adminStatus(status: ADMIN_STATUS) {
        switch (status) {
            case ADMIN_STATUS.ALL:
                return '所有'
            case ADMIN_STATUS.NORMAL:
                return '正常'
            case ADMIN_STATUS.BLOCKED:
                return '封号'
        }
    }


    // =========================================================================
    // 任务相关
    // =========================================================================

    /** 返回任务类型的字符串含义
     * @param type 任务状态
     */
    public taskType(type: TASK_TYPE) {
        switch (type) {
            case TASK_TYPE.BUY_FOR_ME:
                return '代购任务'
            case TASK_TYPE.EXPRESS:
                return '取快递任务'
        }
    }

    /** 返回任务状态的字符串含义
     * @param status 任务状态
     * @param t 多语言选择
     */
    // public taskStatus(status: TASK_STATUS, t = null) {
    public taskStatus(status: TASK_STATUS) {
        switch (status) {
            case TASK_STATUS.ALL:
                return '所有'
            case TASK_STATUS.NEW:
                return '新建'
            case TASK_STATUS.CLAIM:
                return '领取'
            case TASK_STATUS.COMPLETE:
                return '完成'
            case TASK_STATUS.SETTLE:
                return '结算'
            case TASK_STATUS.ABORT:
                return '发布者撤销'
            case TASK_STATUS.EXPIRED:
                return '超时下架'
            case TASK_STATUS.OFF_SHELF:
                return '管理员下架'
        }
    }

    // -----------------------------------------------------
    // 上架/下架相关
    // -----------------------------------------------------

    public showOpShelf(status: TASK_STATUS) {
        return [TASK_STATUS.NEW, TASK_STATUS.OFF_SHELF].includes(status)
    }

    public getShelfBtnText(status: TASK_STATUS, t: TFunction) {
        switch (status) {
            case TASK_STATUS.NEW:
                return t('off-shelf')
            case TASK_STATUS.OFF_SHELF:
                return t('on-shelf')
            default:
                return ''
        }
    }


    // =========================================================================
    // 用户相关
    // =========================================================================

    /** 返回用户角色的字符串含义
     * @param role 用户角色
     */
    public userRole(role: USER_ROLE) {
        switch (role) {
            case USER_ROLE.GUEST:
                return '游客'
            case USER_ROLE.USER:
                return '普通用户'
        }
    }

    /** 返回用户状态的字符串含义
     * @param status 用户状态
     */
    public userStatus(status: USER_STATUS) {
        switch (status) {
            case USER_STATUS.ALL:
                return '所有'
            case USER_STATUS.NORMAL:
                return '正常'
            case USER_STATUS.BLOCKED:
                return '封号'
            case USER_STATUS.FROZEN:
                return '冻结'
            case USER_STATUS.PENDING:
                return '未激活'
            case USER_STATUS.DELETED:
                return '删除/注销'
        }
    }


    // -----------------------------------------------------
    // 冻结/解冻相关
    // -----------------------------------------------------

    public showOpFreeze(status: USER_STATUS) {
        // return [USER_STATUS.NORMAL, USER_STATUS.FROZEN].includes(status) ? "" : "none"
        return [USER_STATUS.NORMAL, USER_STATUS.FROZEN].includes(status)
    }

    public getFreezeBtnText(status: USER_STATUS, t: TFunction) {
        switch (status) {
            case USER_STATUS.NORMAL:
                return t('freeze')
            case USER_STATUS.FROZEN:
                return t('unfreeze')
            default:
                return ''
        }
    }

    public getFreezeBtnApi(status: USER_STATUS) {
        switch (status) {
            case USER_STATUS.NORMAL:
                return UserApi.FREEZE
            case USER_STATUS.FROZEN:
                return UserApi.UNFREEZE
            default:
                return null
        }
    }

    // -----------------------------------------------------
    // 封号/解封相关
    // -----------------------------------------------------

    public showOpBlock(status: USER_STATUS) {
        // return [USER_STATUS.NORMAL, USER_STATUS.BLOCKED].includes(status) ? "" : "none"
        return [USER_STATUS.NORMAL, USER_STATUS.BLOCKED].includes(status)
    }

    public getBlockBtnText(status: USER_STATUS, t: TFunction) {
        switch (status) {
            case USER_STATUS.NORMAL:
                return t('block')
            case USER_STATUS.BLOCKED:
                return t('unblock')
            default:
                return ''
        }
    }

    public getBlockBtnApi(status: USER_STATUS) {
        switch (status) {
            case USER_STATUS.NORMAL:
                return UserApi.BLOCK
            case USER_STATUS.FROZEN:
                return UserApi.UNBLOCK
            default:
                return null
        }
    }

}

export const enumHelper = new EnumHelper