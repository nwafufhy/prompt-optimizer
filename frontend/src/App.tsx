import React, { useState, useEffect } from 'react'
import { Input, Button, Card, Layout, Typography, Radio, Rate, message, Space } from 'antd'
import './App.css'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

type FeedbackType = 'rating' | 'text_comment' | 'binary_approval'

// 定义 metadata 接口
interface Metadata {
  id: string;
  name: string;
  version: string;
  // timestamp?: string; // 可选字段，因为数据库默认提供了当前时间戳
  // [key: string]: any; // 如果有其他动态字段
}

interface Record {
  id: string;
  name: string;
  version: string;
  raw_prompt: string;
  optimized_prompt: string;
  timestamp: string;
  feedback: string; // 添加 feedback 属性，并标记为可选
  result: string; // 同时添加 interactionResult 属性，并标记为可选
}

function App() {
  const [prompt, setPrompt] = useState('')
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  // const [metadata, setMetadata] = useState<any>(null)
  const [metadata, setMetadata] = useState<Metadata | null>(null); // 使用具体类型
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('rating')
  const [rating, setRating] = useState(0)
  const [textComment, setTextComment] = useState('')
  const [binaryApproval, setBinaryApproval] = useState<boolean | null>(null)
  const [interactionResult, setInteractionResult] = useState('')
  const [records, setRecords] = useState<Record[]>([])
  const [searchQuery, setSearchQuery] = useState(''); // 新增搜索状态
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null); // 新增展开状态

  // 过滤记录
  const filteredRecords = React.useMemo(() => {
    if (!searchQuery) return records; // 如果搜索框为空，返回所有记录
    return records.filter(record => {
      return (
        (record.raw_prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         record.optimized_prompt?.toLowerCase().includes(searchQuery.toLowerCase())) ||
         record.feedback?.toLowerCase().includes(searchQuery.toLowerCase()) || // 新增：搜索用户反馈
        record.result?.toLowerCase().includes(searchQuery.toLowerCase()) // 新增：搜索交互结果
      );
    });
  }, [records, searchQuery]); // 依赖 records 和 searchQuery

  // 处理记录点击事件
  const handleRecordClick = (recordId: string) => {
    setExpandedRecordId(expandedRecordId === recordId ? null : recordId);
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      
      if (!response.ok) {
        throw new Error('优化请求失败')
      }
      
      const data = await response.json()
      setOptimizedPrompt(data.optimizedPrompt)
      setMetadata(data.metadata)
      
    } catch (error) {
      console.error('优化失败:', error)
      message.error('优化失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveResult = async () => {
    if (!interactionResult.trim() || !metadata) {
      message.warning('请先输入交互结果')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata,
          result: interactionResult
        }),
      })

      if (!response.ok) throw new Error('保存失败')
      message.success('交互结果已保存')
    } catch (error) {
      console.error('保存失败:', error)
      message.error('保存失败，请重试')
    }
  }

  // 新增：获取记录的函数
  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/records');
      if (!response.ok) {
        throw new Error('获取记录失败');
      }
      const data = await response.json();
      setRecords(data.records);
    } catch (error) {
      console.error('获取记录失败:', error);
      message.error('获取记录失败，请重试');
    }
  };

  // 在组件加载时获取记录
  useEffect(() => {
    fetchRecords();
  }, []);

    
  const handleSubmitFeedback = async () => {
    if (!metadata) {
      message.warning('请先优化 Prompt')
      return
    }

    let feedbackData = {}
    switch (feedbackType) {
      case 'rating':
        if (!rating) {
          message.warning('请选择评分')
          return
        }
        feedbackData = { rating }
        break
      case 'text_comment':
        if (!textComment.trim()) {
          message.warning('请输入反馈内容')
          return
        }
        feedbackData = { textComment }
        break
      case 'binary_approval':
        if (binaryApproval === null) {
          message.warning('请选择是否通过')
          return
        }
        feedbackData = { binaryApproval }
        break
    }

    try {
      const response = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata,
          feedbackType,
          feedbackData
        }),
      })

      if (!response.ok) throw new Error('提交反馈失败')
      message.success('反馈已提交')
      
      // 重置反馈表单
      setRating(0)
      setTextComment('')
      setBinaryApproval(null)
    } catch (error) {
      console.error('提交反馈失败:', error)
      message.error('提交反馈失败，请重试')
    }
  }

  return (
    <Layout className="layout">
      <Header className="header">
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          Prompt 优化器
        </Title>
      </Header>

      <Content className="main-layout">
        {/* 左侧面板 - 管理 prompt */}
        <div className="left-panel">
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>优化记录</span>
                <Input.Search
                  placeholder="搜索 Prompt"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: 200 }}
                  allowClear
                />
              </div>
            }
            className="records-card"
          >
            {filteredRecords.length > 0 ? (
              filteredRecords.map(record => (
                <div 
                  key={record.id} 
                  className={`record-item ${expandedRecordId === record.id ? 'expanded' : ''}`}
                  onClick={() => handleRecordClick(record.id)}
                >
                  <div className="record-header">
                    <div className="record-title">{record.name}</div>
                    <div className="record-meta">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="record-content">
                    <div className="record-prompt">
                      <div className="record-prompt-label">原始 Prompt</div>
                      <Paragraph copyable>{record.raw_prompt}</Paragraph>
                    </div>
                    {expandedRecordId === record.id && (
                      <>
                        <div className="record-prompt">
                          <div className="record-prompt-label">优化后的 Prompt</div>
                          <Paragraph copyable>{record.optimized_prompt}</Paragraph>
                        </div>
                        <div className="record-feedback">
                          <div className="record-feedback-label">用户反馈</div>
                          <div className="feedback-content">
                            {record.feedback || <Text type="secondary">暂无反馈</Text>}
                          </div>
                        </div>
                        <div className="record-interaction">
                          <div className="record-interaction-label">交互结果</div>
                          <div className="interaction-content">
                            {record.result || <Text type="secondary">暂无交互结果</Text>}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '16px', color: '#666' }}>
                {records.length === 0 ? '暂无记录' : '未找到匹配的记录'}
              </div>
            )}
          </Card>
        </div>

        {/* 右侧面板 - 优化 prompt */}
        <div className="right-panel">
          <div className="optimize-section">
            <Card title="输入原始 Prompt" className="input-card">
              <TextArea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请输入需要优化的 Prompt..."
              />
              <Button 
                type="primary" 
                onClick={handleOptimize}
                loading={loading}
                className="optimize-button"
              >
                优化
              </Button>
            </Card>

            {optimizedPrompt && (
              <>
                <Card title="优化后的 Prompt" className="output-card">
                  <Paragraph copyable>{optimizedPrompt}</Paragraph>
                </Card>

                <Card title="交互结果" className="interaction-card">
                  <TextArea
                    rows={3}
                    value={interactionResult}
                    onChange={(e) => setInteractionResult(e.target.value)}
                    placeholder="请输入与 AI 的交互结果..."
                  />
                  <Button 
                    type="primary"
                    onClick={handleSaveResult}
                    className="save-button"
                  >
                    保存交互结果
                  </Button>
                </Card>

                <Card title="提供反馈" className="feedback-card">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio.Group 
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value)}
                    >
                      <Radio value="rating">评分</Radio>
                      <Radio value="text_comment">文字评价</Radio>
                      <Radio value="binary_approval">是否通过</Radio>
                    </Radio.Group>

                    {feedbackType === 'rating' && (
                      <Rate 
                        value={rating}
                        onChange={setRating}
                      />
                    )}

                    {feedbackType === 'text_comment' && (
                      <TextArea
                        rows={3}
                        value={textComment}
                        onChange={(e) => setTextComment(e.target.value)}
                        placeholder="请输入您的反馈..."
                      />
                    )}

                    {feedbackType === 'binary_approval' && (
                      <Radio.Group
                        value={binaryApproval}
                        onChange={(e) => setBinaryApproval(e.target.value)}
                      >
                        <Radio value={true}>通过</Radio>
                        <Radio value={false}>不通过</Radio>
                      </Radio.Group>
                    )}

                    <Button 
                      type="primary"
                      onClick={handleSubmitFeedback}
                      className="feedback-button"
                    >
                      提交反馈
                    </Button>
                  </Space>
                </Card>
              </>
            )}
          </div>
        </div>
      </Content>

      <Footer className="footer">
        Prompt Optimizer ©2025
      </Footer>
    </Layout>
  );
}

export default App
