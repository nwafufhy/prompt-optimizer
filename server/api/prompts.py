# prompts.py
# 使用 FastAPI 框架编写的 API 路由模块，
# 主要功能是处理与 Prompt（提示信息）相关的 HTTP 请求，并与 MongoDB 数据库进行交互。
from fastapi import APIRouter, HTTPException
# 现代的、快速的 Web 框架
# 用于定义一组路由
# 用于抛出 HTTP 错误响应
from pydantic import BaseModel
# 来自 Pydantic 的类，用于数据验证和序列化
from motor.motor_asyncio import AsyncIOMotorClient
# 异步 MongoDB 客户端
import os
import logging

# 配置日志
# 设置日志级别为 DEBUG，并创建一个日志记录器，用于记录调试信息和错误信息。
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()
# 这里不设置，否则会和main文件叠加
# 创建一个带有 /api 前缀的 API 路由实例，所有定义的路由都将在这个前缀下。

class PromptCreate(BaseModel):
    content: str
    version: str
# 用于验证 POST 请求中的数据结构。确保请求体包含 content 和 version 字段，并且它们都是字符串类型

# MongoDB配置
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set")

client = AsyncIOMotorClient(MONGO_URI)
# 创建一个异步 MongoDB 客户端连接，并选择数据库
db = client.prompt_optimizer
collection = db.prompts

@router.post("/prompts")
async def create_prompt(prompt: PromptCreate):
    # 定义一个处理 POST 请求的异步函数 create_prompt，路径为 /api/prompts
    try:
        logger.debug(f"Inserting prompt: {prompt.dict()}")
        result = await collection.insert_one({
            "content": prompt.content,
            "version": prompt.version,
            "status": "pending"
        })
        logger.debug(f"Inserted document with id: {result.inserted_id}")
        return {"id": str(result.inserted_id)}
    except Exception as e:
        logger.error(f"Error inserting prompt: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/prompts")
async def get_prompts():
    return {"message": "请使用POST方法提交Prompt"}