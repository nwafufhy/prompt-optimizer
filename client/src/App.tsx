/*
 * @Author: nwafufhy hyf7753@gmail.com
 * @Date: 2025-02-13 01:52:38
 * @LastEditors: nwafufhy hyf7753@gmail.com
 * @LastEditTime: 2025-02-13 02:11:51
 * @FilePath: \prompt-optimizer\client\src\App.tsx
 * @Description: 
 * React 应用程序的主入口文件
 * 定义了应用程序的路由配置
 */

import React from 'react';
// React 核心库
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// 来自 react-router-dom 的路由组件，用于管理应用中的导航和页面切换。
import PromptCreator from './pages/PromptCreate';
// 从 ./pages/PromptCreate 导入的组件，表示创建 Prompt 的页面。

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PromptCreator />} />
        <Route path="/create" element={<PromptCreator />} />
      </Routes>
    </BrowserRouter>
  );
}
// <BrowserRouter>包裹整个应用，使应用支持基于浏览器 URL 的路由功能
// 使用 Routes 和 Route 定义路由规则：
// 当访问路径为 / 时，渲染 PromptCreator 组件。
// 当访问路径为 /create 时，也渲染 PromptCreator 组件。

export default App;
// 导出 App 组件