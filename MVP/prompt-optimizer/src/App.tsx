import { useState } from 'react'
import { Input, Button, Card, Layout, Typography, Radio, Rate, message, Space } from 'antd'
import './App.css'

const { Header, Content, Footer } = Layout
const { Title, Paragraph } = Typography
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
      
      <Content className="content">
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
      </Content>

      <Footer className="footer">
        Prompt Optimizer ©2025
      </Footer>
    </Layout>
  )
}

export default App
