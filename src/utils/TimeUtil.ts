// src/utils/TimeUtil.ts

import moment from "moment";

class TimeUtil {

    static ONE_DAY_TIMESTAMP = 24 * 60 * 60 * 1000

    /**
     * 从生日字符串计算年龄
     * @param birthday YYYY-MM-DD
     */
    getAgeFromBirth(birthday: string): number {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    /**
     * 获取给定日期的年份
     * @param date 
     * @returns 
     */
    getYeaerFromDate(date: Date) {
        return date.getFullYear()
    }

    /**
     * 获取给定日期的月份
     * @param date 
     * @returns 
     */
    getMonthFromDate(date: Date) {
        return date.getMonth() + 1
    }

    /**
     * 获取给定日期在当月的天数
     * @param date 
     * @returns 
     */
    getDayFromDate(date: Date) {
        return date.getDate()
    }

    /**
     * 
     * @param timestamp 
     */
    getMonthDayFromTimestamp(timestamp: number) {
        // 使用 moment 解析时间戳
        const time = moment(timestamp);

        // 格式化时间为字符串（例如 "HH:mm:ss"）
        return time.format('HH:mm');
    }

    async sleep(miliseconds: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(null)
            }, miliseconds)
        })
    }

    /**
     * 格式化时间
     * @param seconds 
     * @param f 
     */
    formatTime(seconds: number, f: string = 'YYYY-MM-DD HH:mm:ss') {
        const millisecond = seconds * 1000
        return moment(millisecond).format(f)
    }

    /**
     * 格式化日期
     * @param date 
     * @param f 
     */
    formatDate(date: Date, f: string = 'YYYY-MM-DD HH:mm:ss') {
        return moment(date).format(f)
    }

    getYesterday(date: Date) {
        let nowTimestamp = date.getTime();
        let yesterday = new Date(nowTimestamp - TimeUtil.ONE_DAY_TIMESTAMP);
        return yesterday
    }

    getFirstDayOfWeek(date: Date) {
        const dayOfWeek = (date.getDay() + 6) % 7; // 获取当前日期是星期几，转换为以星期一为起始，0为星期一，1为星期二，以此类推
        const firstDay = new Date(date.setDate(date.getDate() - dayOfWeek)); // 通过减去当天是星期几，获取本周第一天的日期对象
        return firstDay;
    }

    getLastDayOfWeek(date: Date) {
        const firstDayOfWeek = this.getFirstDayOfWeek(date);
        // console.log(`firstDayOfWeek:`, moment(firstDayOfWeek).format('YYYY-MM-DD'))
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // 从周一加6天得到周日
        // console.log(`lastDayOfWeek:`, moment(lastDayOfWeek).format('YYYY-MM-DD'))
        return lastDayOfWeek;
    }

    getFirstDayOfMonth(date: Date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDayOfMonth;
    }

    getLastDayOfMonth(date: Date) {
     
        // 设置日期为下个月的第一天，这样可以自动跳转到当前月份的最后一天
        date.setDate(1);
        date.setMonth(date.getMonth() + 1);
        date.setDate(0); // 这会将日期设置为上一个月的最后一天
     
        // 返回结果
        return date;
    }

    getLastMonthSameDay(date: Date) {
        date.setDate(0); // 这会将日期设置为上一个月的最后一天
     
        // 返回结果
        return date;
    }

}

export let timeUtil = new TimeUtil()