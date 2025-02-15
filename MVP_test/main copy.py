'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-14 18:16:46
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-14 21:42:34
FilePath: \prompt-optimizer\MVP\main.py
Description: 
'''

from input import get_user_input as get_user_input
from optimizer import init_langchain as init_langchain
from optimizer import optimize_prompt as optimize_prompt
from output import output_prompt as output_prompt

def main():
     # 获取用户输入
    prompt_from_input = get_user_input()
    # 优化prompt
    chain = init_langchain()
    optimized_prompt = optimize_prompt(chain,prompt_from_input)
    # 输出prompt
    output_prompt(optimized_prompt)

if __name__ == "__main__":
    # 使用前请设置环境变量 OPENAI_API_KEY
    main()

