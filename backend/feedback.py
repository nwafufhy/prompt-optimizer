'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-14 21:14:40
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-15 00:11:45
FilePath: \prompt-optimizer\MVP\feedback.py
Description: 
'''

from data_manager import DataManager

class FeedbackHandler:
    def __init__(self):
        self.feedback_types = {
            1: "rating",
            2: "text_comment",
            3: "binary_approval"
        }
        self.data_mgr = DataManager()
    def collect_feedback(self, metadata: str):
        """命令行反馈收集接口"""
        print(f"\n为{metadata}提供反馈：")
        [print(f"{k}. {v}") for k, v in self.feedback_types.items()]
        
        choice = input("选择反馈类型（输入数字）：")
        feedback_data = self._handle_feedback(int(choice))
        return feedback_data

    def _handle_feedback(self, choice: int):
        """多类型反馈处理"""
        handlers = {
            1: lambda: {"评分": int(input("评分（1-5）："))},
            2: lambda: {"文字反馈": input("输入文字反馈：")},
            3: lambda: {"是否通过": input("是否通过（Y/N）：").upper() == "Y"}
        }
        return handlers.get(choice, lambda: None)()
    
    # 原装饰器定义应作为FeedbackHandler的静态方法
    @classmethod
    def with_feedback(cls, output_func):
        def wrapper(*args, **kwargs):
            metadata = output_func(*args, **kwargs)
            print(f"metadata: {metadata}")
            handler_instance = cls()
            save_result = input("是否要保存交互结果到 result 列？(N不保存): ").strip().upper()
            if save_result != "N":
                handler_instance.data_mgr.save_record({
                    **metadata,
                    "content": str(save_result)
                }, "result")
                print(f"已保存交互结果: {save_result}")
            else:
                print("不保存交互结果")
            feedback_data = handler_instance.collect_feedback(metadata)
            handler_instance.data_mgr.save_record({
                **metadata,
                "content": str(feedback_data)
            }, "feedback")
        return wrapper
    
