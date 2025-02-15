'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-14 18:17:18
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-14 23:05:59
FilePath: \prompt-optimizer\MVP\optimizer.py
Description: 优化模块
'''
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser

from utils import get_model_config as load_config
from input import get_user_input as get_user_input

system_template = """你是一个专业的Prompt优化助手，能够将模糊的用户指令转化为清晰有效的Prompt。
    
    优化目标：
    1. 明确任务目标和上下文
    2. 结构化输出要求
    3. 补充必要细节
    4. 保持原始意图
    
    优化后的Prompt应包含：
    - 具体任务描述
    - 期望的输出格式
    - 相关背景信息
    - 必要的约束条件"""
def init_langchain(system_template=system_template):
    """
    初始化langchain
    """
    api_key,base_url,model_name = load_config()
    # 创建 LLM 实例
    try:
        llm = ChatOpenAI(
            model=model_name,
            temperature=0.7,
            openai_api_key=api_key,
            base_url=base_url,
            max_tokens=500  # 限制最大 token 数量为 500，
        )
    except Exception as e:
        print(f"初始化LLM失败: {e}")

    # 创建 Prompt 模板  
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_template),
        ("user", "原始指令：{prompt_from_input}")
    ])

    # 创建解析器
    output_parser = StrOutputParser()

    # 构建链
    chain = prompt | llm | output_parser
    return chain

def optimize_prompt(chain,prompt_from_input):
    """
    优化prompt
    """
    # 调用链并传递参数
    input_data = {
        "prompt_from_input": prompt_from_input
    }
    response = chain.invoke(input_data)
    return response

if __name__ == "__main__":
    # 获取用户输入
    prompt_from_input = get_user_input()
    # 初始化langchain
    chain = init_langchain(system_template)
    # 优化prompt
    optimized_prompt = optimize_prompt(chain,prompt_from_input)
    print(optimized_prompt)