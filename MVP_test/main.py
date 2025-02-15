'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-14 18:16:46
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-15 00:02:35
FilePath: \prompt-optimizer\MVP\main.py
Description: 
'''

from input import get_user_input as get_user_input
from optimizer import init_langchain as init_langchain
from optimizer import optimize_prompt as optimize_prompt
from output import output_prompt as output_prompt
from data_manager import DataManager, MetadataGenerator
from feedback import FeedbackHandler
import sqlite3

class CLICore:
    def __init__(self):
        try:
            self.data_mgr = DataManager()
            self.meta_gen = MetadataGenerator()
        except sqlite3.Error as e:
            print(f"数据库初始化失败: {e}")
            raise e

    @FeedbackHandler.with_feedback  # 应用装饰器
    def process_prompt(self, user_input: str):
        try:
            # 元数据生成
            metadata = self.meta_gen.generate("user_prompt")
            
            # 保存原始prompt
            self.data_mgr.save_record({
                **metadata,
                "content": user_input
            }, "raw_prompt")
            
            # 优化处理（已有逻辑）
            chain = init_langchain()
            optimized = optimize_prompt(chain, user_input)
            
            # 保存优化结果
            self.data_mgr.save_record({
                **metadata,
                "content": optimized
            }, "optimized_prompt")
            
            # 获取输出
            output_prompt(optimized)

            print(f"metadata: {metadata}")

            return metadata
        except Exception as e:
            print(f"处理prompt失败: {e}")
            raise e


def main():
    # 获取用户输入
    prompt_from_input = get_user_input()
    
    # 创建 CLICore 实例并处理 prompt
    cli_core = CLICore()
    cli_core.process_prompt(prompt_from_input)

if __name__ == "__main__":
    # 使用前请设置环境变量 OPENAI_API_KEY
    main()

