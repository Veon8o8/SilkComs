// 第三方库
import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { theme } from 'antd';
import i18n from './i18n' // i18n配置
import './App.css'

// 自定义组件
import { AuthLogin } from './page/auth.login';
import { MainFrame } from './region/main.frame';
// 自定义常量
import { DYNAMIC, HEADER, USER } from './config/layout';
import { ROOT } from './config/api';


function App() {
  let [headerHeight, setHeaderHeight] = useState(Math.round((HEADER.HEIGHT_PIXEL / window.innerHeight) * 100));
  let [bodyHeight, setBodyHeight] = useState(100 - headerHeight);
  let [dynamicHeight, setDynamicHeight] =
    useState(100 - Math.round(((HEADER.HEIGHT_PIXEL + DYNAMIC.TOP_HEIGHT_PIXEL) / window.innerHeight) * 100));
  let [addressListHeight, setAddressListHeight] =
    useState(100 - Math.round(((HEADER.HEIGHT_PIXEL + USER.TOP_HEIGHT_PIXEL) / window.innerHeight) * 100));
  console.log(`init - headerHeight:`, headerHeight)

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // 定义处理窗口大小变化的函数
    const handleResize = () => {
      setHeaderHeight(headerHeight = Math.round((HEADER.HEIGHT_PIXEL / window.innerHeight) * 100))
      setBodyHeight(bodyHeight = 100 - headerHeight)
      setDynamicHeight(100 - Math.round(((HEADER.HEIGHT_PIXEL + DYNAMIC.TOP_HEIGHT_PIXEL) / window.innerHeight) * 100))
      setAddressListHeight(100 - Math.round(((HEADER.HEIGHT_PIXEL + USER.TOP_HEIGHT_PIXEL) / window.innerHeight) * 100))
    };

    // 添加 resize 事件监听器
    console.log(`添加 resize 事件监听器`)
    window.addEventListener('resize', handleResize);

    // 清理函数：组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空数组作为依赖，意味着只在组件挂载和卸载时执行

  // 多语言预设值
  i18n.changeLanguage('zh_CN')
  // i18n.changeLanguage('en_US')

  let viewSize = {
    headerHeight: headerHeight,
    bodyHeight: bodyHeight,
    dynamicHeight: dynamicHeight,
    addressListHeight: addressListHeight,
    colorBgContainer: colorBgContainer,
    borderRadiusLG: borderRadiusLG
  }

  return (

    <Routes>
      {/* <Route path={`${ROOT}`} element={<AuthLogin />} /> */}
      {/* <Route path={`${ROOT}/login`} element={<AuthLogin />} /> */}
      <Route path={`${ROOT}/coms`} element={<MainFrame {...viewSize} />} />
    </Routes>
  )
}


export default App