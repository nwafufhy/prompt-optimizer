/*
 * @Author: nwafufhy hyf7753@gmail.com
 * @Date: 2025-02-15 00:32:04
 * @LastEditors: nwafufhy hyf7753@gmail.com
 * @LastEditTime: 2025-02-15 00:32:12
 * @FilePath: \MVP\src\store\promptStore.ts
 * @Description: 
 */
import create from 'zustand';
npm install zustand @types/zustand --save-dev
interface PromptState {
  history: Array<{
    id: string;
    original: string;
    optimized: string;
    timestamp: string;
  }>;
  addToHistory: (item: any) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  history: [],
  addToHistory: (item) => set((state) => ({
    history: [...state.history, item]
  }))
})); 