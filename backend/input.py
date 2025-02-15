'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-14 18:16:19
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-14 18:28:05
FilePath: \prompt-optimizer\MVP\input.py
Description: 输入模块
该模块会提示用户输入prompt，并进行相应的检查和输出。
'''
def get_user_input():
    while True:
        user_input = input("请输入prompt (或输入 '退出' 以结束): ").strip()
        if user_input.lower() == '退出':
            print("退出输入模块")
            break
        elif not user_input:
            print("不能不能为空，请重新输入")
        else:
            print(f"正在优化: {user_input}")
            return user_input

if __name__ == "__main__":
    get_user_input()