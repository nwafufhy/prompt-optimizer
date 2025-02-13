/*
 * @Author: nwafufhy hyf7753@gmail.com
 * @Date: 2025-02-13 02:12:10
 * @LastEditors: nwafufhy hyf7753@gmail.com
 * @LastEditTime: 2025-02-13 15:41:06
 * @FilePath: \prompt-optimizer\client\src\pages\PromptCreate.tsx
 * @Description: 
 * 这段代码是一个 React 组件
 * 用于创建和提交 Prompt（提示信息）
 * 它使用了 Ant Design 的组件库来构建用户界面
 * 并通过 Axios 发送 HTTP 请求与后端 API 进行交互
 */
import { useState } from 'react';
// React 的 Hook，用于在函数组件中添加状态。
import { Button, message } from 'antd';
// 来自 Ant Design 的按钮和消息提示组件
import { PageHeader } from '@ant-design/pro-layout';
// 来自 Ant Design Pro Layout 的页面头部组件
import Editor from '@monaco-editor/react';
// 来自 @monaco-editor/react 的代码编辑器组件
import axios from 'axios';
// 用于发送 HTTP 请求的库


export default function PromptCreator() {
  // 定义 PromptCreator 组件
  // promptContent：存储用户输入的 Prompt 内容的状态变量。submitting：表示提交按钮是否正在加载的状态变量。
  const [promptContent, setPromptContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // 提交处理函数 handleSubmit
    if (!promptContent.trim()) {
      // 检查用户输入的内容是否为空，如果为空则显示错误提示并返回。
      message.error('Prompt内容不能为空');
      return;
    }

    setSubmitting(true);
    // 设置提交按钮为加载状态。
    try {
      // 尝试发送 POST 请求到后端 API 
      const response = await axios.post('http://127.0.0.1:8000/api/prompts', {
        content: promptContent,
        version: '1.0.0'
      });
      
      message.success(`Prompt已保存，ID: ${response.data.id}`);
      setPromptContent('');
      // 成功时显示成功消息，清空输入框
    } catch (err) {
      // 使用类型断言明确 err 为 Error 类型
      if (err instanceof Error) {
        message.error('提交失败: ' + err.message);
      } else {
        message.error('提交失败: 未知错误');
      }
    } finally {
      setSubmitting(false);
    }
    // 无论请求成功与否，最终将提交按钮状态重置为非加载状态
  };

  return (
    // 渲染 UI
    <div style={{ padding: 24 }}>
      <PageHeader title="创建新Prompt" />
      <div style={{ height: 'calc(100vh - 180px)', marginTop: 16 }}>
        <Editor
          height="100%"
          defaultLanguage="markdown"
          theme="vs-dark"
          value={promptContent}
          onChange={(value) => setPromptContent(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'off',
            automaticLayout: true
          }}
        />
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Button 
          type="primary" 
          onClick={handleSubmit}
          loading={submitting}
          size="large"
        >
          提交到优化流程
        </Button>
      </div>
    </div>
  );
}