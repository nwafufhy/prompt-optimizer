'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-15 18:35:32
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-15 18:51:21
FilePath: \MVP\backend\test\test_get_all_records.py
Description: 测试获取所有记录
'''
import sys
import os

# 获取项目的根目录
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from data_manager import DataManager

def test_get_all_records():
    data_manager = DataManager()
    records = data_manager.get_all_records()
    assert len(records) > 0
    print("Test passed")
    print(records)

if __name__ == "__main__":
    test_get_all_records()

