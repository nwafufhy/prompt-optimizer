'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-15 00:26:31
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-15 00:26:42
FilePath: \MVP\test_data_manager.py
Description: 
'''
import unittest
import sqlite3
from data_manager import DataManager
import os
import tempfile
import gc

class TestDataManager(unittest.TestCase):
    def setUp(self):
        # 使用临时文件作为数据库文件
        self.db_fd, self.db_name = tempfile.mkstemp(suffix='.db')
        self.data_manager = DataManager(db_name=self.db_name)

    def tearDown(self):
        # 确保所有数据库连接已关闭
        if hasattr(self, 'data_manager'):
            del self.data_manager
        gc.collect()  # 强制垃圾回收以确保所有连接已关闭
        os.close(self.db_fd)
        if os.path.exists(self.db_name):
            os.remove(self.db_name)

    def test_init_db(self):
        """测试数据库初始化"""
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='prompts';")
            result = cursor.fetchone()
            self.assertIsNotNone(result, "表 'prompts' 未创建")

    def test_save_record(self):
        """测试保存记录"""
        metadata = {
            'id': 'test_id',
            'name': 'test_name',
            'version': '1.0',
            'content': 'test_content'
        }

        # 测试保存 raw_prompt
        self.data_manager.save_record(metadata, 'raw_prompt')
        
        # 验证记录是否已保存
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, version, raw_prompt FROM prompts WHERE id=?", (metadata['id'],))
            result = cursor.fetchone()
            self.assertIsNotNone(result, "记录未保存成功")
            self.assertEqual(result[0], metadata['id'])
            self.assertEqual(result[1], metadata['name'])
            self.assertEqual(result[2], metadata['version'])
            self.assertEqual(result[3], metadata['content'])

        # 测试保存 optimized_prompt
        metadata['content'] = 'optimized_test_content'
        self.data_manager.save_record(metadata, 'optimized_prompt')

        # 验证记录是否已保存
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, version, optimized_prompt FROM prompts WHERE id=?", (metadata['id'],))
            result = cursor.fetchone()
            self.assertIsNotNone(result, "记录未保存成功")
            self.assertEqual(result[0], metadata['id'])
            self.assertEqual(result[1], metadata['name'])
            self.assertEqual(result[2], metadata['version'])
            self.assertEqual(result[3], metadata['content'])

if __name__ == '__main__':
    unittest.main()