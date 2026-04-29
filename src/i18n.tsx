// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入资源文件
import enTranslations from './locales/en_US/translation.json';
import zhTranslations from './locales/zh_CN/translation.json';

const resources = {
    en_US: {
        translation: enTranslations
    },
    zh_CN: {
        translation: zhTranslations
    }
};

i18n
    .use(initReactI18next) // 使用react-i18next
    .init({
        resources,
        lng: 'zh_CN', // 默认语言
        keySeparator: false, // 默认为'.', 如果你的键中包含点，你可以指定一个不同的分隔符
        interpolation: {
            escapeValue: false // 不要自动转义值
        }
    });

export default i18n;