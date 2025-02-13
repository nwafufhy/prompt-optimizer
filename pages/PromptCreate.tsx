import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import Editor from '@monaco-editor/react';
import axios from 'axios';

export default function PromptCreator() {
  const [promptContent, setPromptContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!promptContent.trim()) {
      message.error('Prompt内容不能为空');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/prompts', {
        content: promptContent,
        version: '1.0.0'
      });
      
      message.success(`Prompt已保存，ID: ${response.data.id}`);
      setPromptContent('');
    } catch (err) {
      message.error('提交失败: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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