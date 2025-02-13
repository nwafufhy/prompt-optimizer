'''
Author: nwafufhy hyf7753@gmail.com
Date: 2025-02-13 02:44:01
LastEditors: nwafufhy hyf7753@gmail.com
LastEditTime: 2025-02-13 02:56:37
FilePath: \prompt-optimizer\server\main.py
Description: 
FastAPI 应用程序的主入口文件
'''
from fastapi import FastAPI
# 现代的、快速的 Web 框架
from fastapi.middleware.cors import CORSMiddleware
# 用于处理跨域资源共享（CORS）的中间件
from dotenv import load_dotenv
# 用于加载 .env 文件中的环境变量。
import os

# 加载环境变量
load_dotenv('.env')

# 初始化FastAPI应用
app = FastAPI(
    title="Prompt Optimizer API",
    description="API for managing prompt optimization workflows",
    version="0.1.0"
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制为具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 添加 CORS 中间件，允许所有来源（"*"）访问 API。在生产环境中，建议将 allow_origins 设置为具体的域名列表，以提高安全性。
# 允许凭证（如 Cookies）、所有 HTTP 方法（GET, POST, PUT, DELETE 等）和所有请求头。

# 导入路由
from api.prompts import router as prompts_router
app.include_router(prompts_router, prefix="/api")
# 从 api.prompts 模块中导入定义的 API 路由，并将其添加到主应用中，路径前缀为 /api。这意味着所有来自 prompts_router 的路由都将带有 /api 前缀

# 健康检查端点
@app.get("/")
async def root():
    return {"status": "ok", "version": app.version}

# 定义了一个简单的 GET 请求处理函数，当用户访问根路径 / 时，
# 返回一个 JSON 响应，包含应用的状态和版本号。这通常用于健康检查或确认服务是否正常运行。
