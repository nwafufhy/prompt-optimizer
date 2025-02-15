/*
 * @Author: nwafufhy hyf7753@gmail.com
 * @Date: 2025-02-15 00:31:25
 * @LastEditors: nwafufhy hyf7753@gmail.com
 * @LastEditTime: 2025-02-15 00:31:35
 * @FilePath: \MVP\src\components\FeedbackForm.tsx
 * @Description: 
 */
import { Rate, Input, Radio, Button, Form } from 'antd';

const FeedbackForm = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="feedbackType" label="反馈类型">
        <Radio.Group>
          <Radio value={1}>评分</Radio>
          <Radio value={2}>文字评价</Radio>
          <Radio value={3}>是否通过</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item 
        noStyle 
        shouldUpdate={(prev, curr) => prev.feedbackType !== curr.feedbackType}
      >
        {({ getFieldValue }) => {
          const type = getFieldValue('feedbackType');
          switch (type) {
            case 1:
              return (
                <Form.Item name="rating" label="评分">
                  <Rate />
                </Form.Item>
              );
            case 2:
              return (
                <Form.Item name="comment" label="评价">
                  <Input.TextArea />
                </Form.Item>
              );
            case 3:
              return (
                <Form.Item name="approved" label="是否通过">
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              );
            default:
              return null;
          }
        }}
      </Form.Item>

      <Button type="primary" htmlType="submit">
        提交反馈
      </Button>
    </Form>
  );
}; 