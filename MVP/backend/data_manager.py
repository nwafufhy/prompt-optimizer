'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-14 21:19:02
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-14 23:54:07
FilePath: \prompt-optimizer\MVP\data_manager.py
Description: 数据管理层
与 SQLite 数据库交互
DataManager 类，负责初始化数据库、保存记录等操作
'''

import sqlite3
from contextlib import contextmanager
import time

class DataManager:
    def __init__(self, db_name="prompts.db"):
        self.db_name = db_name
        self._init_db()

    @contextmanager
    def _get_connection(self):
        conn = sqlite3.connect(self.db_name)
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS prompts (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    version TEXT,
                    raw_prompt TEXT,
                    optimized_prompt TEXT,
                    result TEXT,
                    feedback TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)

    def save_record(self, metadata: dict, content_type: str):
        """通用保存方法"""
        allowed_content_types = {'raw_prompt', 'optimized_prompt', 'result', 'feedback'}
        
        if content_type not in allowed_content_types:
            raise ValueError(f"Invalid content_type: {content_type}. Allowed types are: {allowed_content_types}")
        
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # 检查 id 是否已经存在
            cursor.execute("SELECT 1 FROM prompts WHERE id = ?", (metadata['id'],))
            if cursor.fetchone():
                # 更新现有记录
                cursor.execute(f"""
                    UPDATE prompts 
                    SET {content_type} = ?, timestamp = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (metadata['content'], metadata['id']))
            else:
                # 插入新记录
                cursor.execute(f"""
                    INSERT INTO prompts 
                    (id, name, version, {content_type}, timestamp)
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, (
                    metadata['id'],
                    metadata['name'],
                    metadata['version'],
                    metadata['content']
                ))
            conn.commit()  # 提交事务

class MetadataGenerator:
    """
    元数据管理
    """
    def __init__(self):
        self.version_scheme = "1.0.{build_num}"
        self.counter = 0

    def generate(self, prompt_name: str):
        self.counter += 1
        return {
            "id": f"prompt_{int(time.time())}",
            "name": prompt_name,
            "version": self.version_scheme.format(build_num=self.counter)
        }