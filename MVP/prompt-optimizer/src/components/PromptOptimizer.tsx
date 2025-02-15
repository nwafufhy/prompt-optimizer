/*
 * @Author: nwafufhy hyf7753@gmail.com
 * @Date: 2025-02-15 00:30:24
 * @LastEditors: nwafufhy hyf7753@gmail.com
 * @LastEditTime: 2025-02-15 00:30:33
 * @FilePath: \MVP\src\components\PromptOptimizer.tsx
 * @Description: 
 */
import { useState } from 'react';
import { Input, Button, Card, message } from 'antd';
import { optimizePrompt } from '../api/promptService';

const PromptOptimizer = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [optimizedResult, setOptimizedResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async () => {
    if (!inputPrompt.trim()) {
      message.warning('请输入需要优化的prompt');
      return;
    }

    setIsLoading(true);
    try {
      const result = await optimizePrompt(inputPrompt);
      setOptimizedResult(result);
    } catch (error) {
      message.error('优化失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Prompt优化工具">
      <Input.TextArea 
        rows={4}
        value={inputPrompt}
        onChange={e => setInputPrompt(e.target.value)}
        placeholder="请输入prompt (或输入 '退出' 以结束)"
      />
      <Button 
        type="primary"
        loading={isLoading}
        onClick={handleOptimize}
        style={{ marginTop: 16 }}
      >
        优化
      </Button>
      
      {optimizedResult && (
        <Card title="优化结果" style={{ marginTop: 16 }}>
          <pre>{optimizedResult}</pre>
        </Card>
      )}
    </Card>
  );
};

export default PromptOptimizer; 