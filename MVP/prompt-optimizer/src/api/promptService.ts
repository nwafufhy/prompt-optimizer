/*
 * @Author: nwafufhy hyf7753@gmail.com
 * @Date: 2025-02-15 00:31:44
 * @LastEditors: nwafufhy hyf7753@gmail.com
 * @LastEditTime: 2025-02-15 00:31:53
 * @FilePath: \MVP\src\api\promptService.ts
 * @Description: 
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const optimizePrompt = async (prompt: string) => {
  const { data } = await api.post('/optimize', { prompt });
  return data.optimizedPrompt;
};

export const submitFeedback = async (feedback: any) => {
  const { data } = await api.post('/feedback', feedback);
  return data;
}; 